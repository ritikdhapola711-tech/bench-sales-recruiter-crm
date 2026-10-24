import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { leadsStore } from './server/leadsStore.ts';
import { automationEngine, DEFAULT_EMAIL_TEMPLATES } from './server/automationEngine.ts';
import type { LeadStatus } from './src/types/lead.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// REST API Endpoints

// 1. Stats endpoint
app.get('/api/stats', (_req, res) => {
  try {
    const stats = leadsStore.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// 2. Export leads to CSV (MUST be defined before /api/leads/:id)
app.get('/api/leads/export', (req, res) => {
  try {
    const { search, status, connectionDegree } = req.query;
    const leads = leadsStore.getAll({
      search: typeof search === 'string' ? search : undefined,
      status: typeof status === 'string' ? status : undefined,
      connectionDegree: typeof connectionDegree === 'string' ? connectionDegree : undefined
    });

    const headers = [
      'ID',
      'Full Name',
      'Job Title',
      'Company',
      'LinkedIn URL',
      'Email',
      'Phone',
      'Location',
      'Industry',
      'Status',
      'Connection Degree',
      'Lead Score',
      'Tags',
      'Notes Summary',
      'Created At',
      'Last Contacted At'
    ];

    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [headers.join(',')];

    for (const lead of leads) {
      const row = [
        escapeCsv(lead.id),
        escapeCsv(lead.fullName),
        escapeCsv(lead.jobTitle),
        escapeCsv(lead.company),
        escapeCsv(lead.linkedinUrl),
        escapeCsv(lead.email || ''),
        escapeCsv(lead.phone || ''),
        escapeCsv(lead.location || ''),
        escapeCsv(lead.industry || ''),
        escapeCsv(lead.status),
        escapeCsv(lead.connectionDegree),
        escapeCsv(lead.leadScore ?? 50),
        escapeCsv((lead.tags || []).join('; ')),
        escapeCsv(lead.notesSummary || ''),
        escapeCsv(lead.createdAt),
        escapeCsv(lead.lastContactedAt || '')
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="linkedin_leads_${timestamp}.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting leads CSV:', error);
    res.status(500).json({ error: 'Failed to export leads' });
  }
});

// 3. Leads listing with search & filters
app.get('/api/leads', (req, res) => {
  try {
    const { search, status, connectionDegree, sortBy, sortOrder } = req.query;
    const leads = leadsStore.getAll({
      search: typeof search === 'string' ? search : undefined,
      status: typeof status === 'string' ? status : undefined,
      connectionDegree: typeof connectionDegree === 'string' ? connectionDegree : undefined,
      sortBy: typeof sortBy === 'string' ? sortBy : undefined,
      sortOrder: sortOrder === 'asc' ? 'asc' : 'desc'
    });
    res.json(leads);
  } catch (error) {
    console.error('Error listing leads:', error);
    res.status(500).json({ error: 'Failed to list leads' });
  }
});

// 4. Create new lead
app.post('/api/leads', (req, res) => {
  try {
    const { fullName, jobTitle, company, linkedinUrl, email, phone, location, industry, status, connectionDegree, tags, notesSummary } = req.body;
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: 'Full Name is required' });
    }
    const created = leadsStore.create({
      fullName,
      jobTitle,
      company,
      linkedinUrl,
      email,
      phone,
      location,
      industry,
      status,
      connectionDegree,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      notesSummary
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// 5. Bulk delete
app.post('/api/leads/bulk-delete', (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Valid array of lead IDs is required' });
    }
    const count = leadsStore.bulkDelete(ids);
    res.json({ success: true, deletedCount: count });
  } catch (error) {
    console.error('Error bulk deleting:', error);
    res.status(500).json({ error: 'Failed to bulk delete leads' });
  }
});

// 6. Bulk status update
app.post('/api/leads/bulk-status', (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !status) {
      return res.status(400).json({ error: 'Array of IDs and target status are required' });
    }
    const count = leadsStore.bulkUpdateStatus(ids, status as LeadStatus);
    res.json({ success: true, updatedCount: count });
  } catch (error) {
    console.error('Error bulk updating status:', error);
    res.status(500).json({ error: 'Failed to bulk update status' });
  }
});

// 7. Import leads from CSV data
app.post('/api/leads/import', (req, res) => {
  try {
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ error: 'Array of lead objects is required' });
    }
    const result = leadsStore.importLeads(leads);
    res.json({
      success: true,
      imported: result.imported,
      skipped: result.skipped,
      total: result.total
    });
  } catch (error) {
    console.error('Error importing leads:', error);
    res.status(500).json({ error: 'Failed to import leads' });
  }
});

// 8. Reset to sample seed data
app.post('/api/leads/reset-seed', (_req, res) => {
  try {
    leadsStore.resetToSample();
    res.json({ success: true, message: 'Leads reset to default sample dataset' });
  } catch (error) {
    console.error('Error resetting sample seeds:', error);
    res.status(500).json({ error: 'Failed to reset seed data' });
  }
});

// 9. Single lead retrieval by ID
app.get('/api/leads/:id', (req, res) => {
  try {
    const lead = leadsStore.getById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// 10. Update existing lead
app.put('/api/leads/:id', (req, res) => {
  try {
    const updated = leadsStore.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// 11. Quick status update
app.patch('/api/leads/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = leadsStore.updateStatus(req.params.id, status as LeadStatus);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update lead status' });
  }
});

// 12. Add note to lead timeline
app.post('/api/leads/:id/notes', (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Note text cannot be empty' });
    }
    const updated = leadsStore.addNote(req.params.id, author || 'You', text);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// 14. Automation Engine Endpoints

app.get('/api/automation/posts', (_req, res) => {
  try {
    const posts = automationEngine.getPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching automation posts:', error);
    res.status(500).json({ error: 'Failed to fetch automation posts' });
  }
});

app.post('/api/automation/scan', (req, res) => {
  try {
    const { keywords, timeFilterHours, location } = req.body;
    const results = automationEngine.scanPosts({
      keywords: keywords || 'Java Developer C2C – Bench – Sales – W2 – Full-Time – Hotlist',
      timeFilterHours: timeFilterHours || 24,
      location: location || 'United States'
    });
    res.json({
      success: true,
      scannedCount: results.length,
      posts: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error scanning automation posts:', error);
    res.status(500).json({ error: 'Failed to scan posts' });
  }
});

app.post('/api/automation/send-email', (req, res) => {
  try {
    const { postId, recruiterEmail, recruiterName, companyName, subject, body } = req.body;
    if (!recruiterEmail) {
      return res.status(400).json({ error: 'Recruiter email is required' });
    }
    const result = automationEngine.sendOutreachEmail({
      postId,
      recruiterEmail,
      recruiterName: recruiterName || 'Recruiter',
      companyName: companyName || 'Client Company',
      subject: subject || 'Available C2C Bench Consultant',
      body: body || 'Please find our consultant profile attached.'
    });
    res.json(result);
  } catch (error) {
    console.error('Error sending outreach email:', error);
    res.status(500).json({ error: 'Failed to send outreach email' });
  }
});

app.get('/api/automation/templates', (_req, res) => {
  res.json(DEFAULT_EMAIL_TEMPLATES);
});

app.get('/api/automation/email-logs', (_req, res) => {
  res.json(automationEngine.getEmailLogs());
});


// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
