import type { LinkedInLead, DashboardStats, LeadStatus } from '../types/lead.ts';

export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
  return res.json();
}

export interface LeadFilterParams {
  search?: string;
  status?: string;
  connectionDegree?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function fetchLeads(params?: LeadFilterParams): Promise<LinkedInLead[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status && params.status !== 'All') query.set('status', params.status);
  if (params?.connectionDegree && params.connectionDegree !== 'All') query.set('connectionDegree', params.connectionDegree);
  if (params?.sortBy) query.set('sortBy', params.sortBy);
  if (params?.sortOrder) query.set('sortOrder', params.sortOrder);

  const res = await fetch(`/api/leads?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch leads');
  return res.json();
}

export async function fetchLeadById(id: string): Promise<LinkedInLead> {
  const res = await fetch(`/api/leads/${id}`);
  if (!res.ok) throw new Error('Failed to fetch lead');
  return res.json();
}

export async function createLead(data: Partial<LinkedInLead>): Promise<LinkedInLead> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create lead');
  }
  return res.json();
}

export async function updateLead(id: string, data: Partial<LinkedInLead>): Promise<LinkedInLead> {
  const res = await fetch(`/api/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update lead');
  }
  return res.json();
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<LinkedInLead> {
  const res = await fetch(`/api/leads/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update lead status');
  }
  return res.json();
}

export async function addLeadNote(id: string, text: string, author = 'You'): Promise<LinkedInLead> {
  const res = await fetch(`/api/leads/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, author }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to add note');
  }
  return res.json();
}

export async function deleteLead(id: string): Promise<void> {
  const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete lead');
}

export async function bulkDeleteLeads(ids: string[]): Promise<number> {
  const res = await fetch('/api/leads/bulk-delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error('Failed to bulk delete leads');
  const data = await res.json();
  return data.deletedCount;
}

export async function bulkUpdateStatus(ids: string[], status: LeadStatus): Promise<number> {
  const res = await fetch('/api/leads/bulk-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status }),
  });
  if (!res.ok) throw new Error('Failed to bulk update status');
  const data = await res.json();
  return data.updatedCount;
}

export async function importLeads(leads: Partial<LinkedInLead>[]): Promise<{ imported: number; skipped: number; total: number }> {
  const res = await fetch('/api/leads/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leads }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to import leads');
  }
  return res.json();
}

export function getExportUrl(params?: LeadFilterParams): string {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status && params.status !== 'All') query.set('status', params.status);
  if (params?.connectionDegree && params.connectionDegree !== 'All') query.set('connectionDegree', params.connectionDegree);
  return `/api/leads/export?${query.toString()}`;
}

export async function resetToSampleSeed(): Promise<void> {
  const res = await fetch('/api/leads/reset-seed', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset sample data');
}

// Automation Engine API Client Methods
export async function fetchAutomationPosts() {
  const res = await fetch('/api/automation/posts');
  if (!res.ok) throw new Error('Failed to fetch automation posts');
  return res.json();
}

export async function runAutomationScan(params: {
  keywords?: string;
  timeFilterHours?: number;
  location?: string;
}) {
  const res = await fetch('/api/automation/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to scan LinkedIn posts');
  return res.json();
}

export async function sendOutreachEmail(data: {
  postId?: string;
  recruiterEmail: string;
  recruiterName: string;
  companyName: string;
  subject: string;
  body: string;
}) {
  const res = await fetch('/api/automation/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send outreach email');
  }
  return res.json();
}

export async function fetchEmailTemplates() {
  const res = await fetch('/api/automation/templates');
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export async function fetchEmailLogs() {
  const res = await fetch('/api/automation/email-logs');
  if (!res.ok) throw new Error('Failed to fetch email logs');
  return res.json();
}

