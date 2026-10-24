import React, { useState, useEffect, useCallback } from 'react';
import { 
  fetchStats, 
  fetchLeads, 
  createLead, 
  updateLead, 
  updateLeadStatus, 
  addLeadNote, 
  deleteLead, 
  bulkDeleteLeads, 
  bulkUpdateStatus, 
  resetToSampleSeed,
  getExportUrl
} from './services/api.ts';
import type { LinkedInLead, DashboardStats, LeadStatus } from './types/lead.ts';

import { Navbar } from './components/Navbar.tsx';
import { StatCards } from './components/StatCards.tsx';
import { LeadsTable } from './components/LeadsTable.tsx';
import { PipelineBoard } from './components/PipelineBoard.tsx';
import { ImportView } from './components/ImportView.tsx';
import { LeadModal } from './components/LeadModal.tsx';
import { LeadDetailDrawer } from './components/LeadDetailDrawer.tsx';
import { ConfirmModal } from './components/ConfirmModal.tsx';
import { LinkedInProfileSidebar } from './components/LinkedInProfileSidebar.tsx';
import { LinkedInRightSidebar } from './components/LinkedInRightSidebar.tsx';
import { AlexBermanProfileHeader } from './components/AlexBermanProfileHeader.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { C2CAutomationEngine } from './components/C2CAutomationEngine.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<'directory' | 'pipeline' | 'import' | 'automation'>('directory');
  const [leads, setLeads] = useState<LinkedInLead[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [connectionFilter, setConnectionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LinkedInLead | null>(null);
  const [selectedDetailLead, setSelectedDetailLead] = useState<LinkedInLead | null>(null);
  const [deletingLead, setDeletingLead] = useState<LinkedInLead | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [leadsData, statsData] = await Promise.all([
        fetchLeads({
          search: searchQuery,
          status: statusFilter,
          connectionDegree: connectionFilter,
          sortBy,
          sortOrder
        }),
        fetchStats()
      ]);
      setLeads(leadsData);
      setStats(statsData);

      if (selectedDetailLead) {
        const fresh = leadsData.find(l => l.id === selectedDetailLead.id);
        if (fresh) setSelectedDetailLead(fresh);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      showToast('Could not sync with lead server.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, connectionFilter, sortBy, sortOrder, selectedDetailLead?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Save
  const handleSaveLead = async (leadData: Partial<LinkedInLead>) => {
    try {
      if (editingLead) {
        const updated = await updateLead(editingLead.id, leadData);
        showToast(`Updated profile for ${updated.fullName}`);
        setEditingLead(null);
      } else {
        const created = await createLead(leadData);
        showToast(`Added ${created.fullName} to leads`);
        setIsAddModalOpen(false);
      }
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save lead');
      throw err;
    }
  };

  // Quick Status Update
  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      setLeads(prev =>
        prev.map(l => (l.id === id ? { ...l, status: newStatus } : l))
      );
      if (selectedDetailLead && selectedDetailLead.id === id) {
        setSelectedDetailLead(prev => prev ? { ...prev, status: newStatus } : null);
      }

      await updateLeadStatus(id, newStatus);
      const newStats = await fetchStats();
      setStats(newStats);
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      await loadData();
    }
  };

  // Add Note
  const handleAddNote = async (id: string, text: string) => {
    try {
      const updated = await addLeadNote(id, text);
      setSelectedDetailLead(updated);
      setLeads(prev => prev.map(l => (l.id === id ? updated : l)));
      showToast('Logged note to lead history');
    } catch (err) {
      console.error('Failed to add note:', err);
      showToast('Failed to add note');
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!deletingLead) return;
    try {
      await deleteLead(deletingLead.id);
      showToast(`Removed ${deletingLead.fullName} from directory`);
      setDeletingLead(null);
      if (selectedDetailLead?.id === deletingLead.id) {
        setSelectedDetailLead(null);
      }
      await loadData();
    } catch (err) {
      console.error('Failed to delete:', err);
      showToast('Failed to delete lead');
    }
  };

  // Bulk Delete
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const count = await bulkDeleteLeads(ids);
      showToast(`Deleted ${count} prospects.`);
      await loadData();
    } catch (err) {
      console.error('Bulk delete error:', err);
      showToast('Failed bulk delete');
    }
  };

  // Bulk Update Status
  const handleBulkUpdateStatus = async (ids: string[], newStatus: LeadStatus) => {
    try {
      const count = await bulkUpdateStatus(ids, newStatus);
      showToast(`Updated ${count} leads to ${newStatus}`);
      await loadData();
    } catch (err) {
      console.error('Bulk status update error:', err);
      showToast('Failed bulk status update');
    }
  };

  // CSV Export Trigger
  const handleExportCsv = (customLeads?: LinkedInLead[]) => {
    if (customLeads && customLeads.length > 0) {
      const headers = ['Full Name', 'Job Title', 'Company', 'LinkedIn URL', 'Email', 'Status', 'Connection Degree', 'Lead Score', 'Tags'];
      const escape = (v: any) => `"${String(v || '').replace(/"/g, '""')}"`;
      const rows = [headers.join(',')];
      for (const l of customLeads) {
        rows.push([
          escape(l.fullName),
          escape(l.jobTitle),
          escape(l.company),
          escape(l.linkedinUrl),
          escape(l.email || ''),
          escape(l.status),
          escape(l.connectionDegree),
          escape(l.leadScore ?? 50),
          escape((l.tags || []).join('; '))
        ].join(','));
      }
      const blob = new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `linkedin_leads_selected_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported ${customLeads.length} leads to CSV.`);
      return;
    }

    const exportUrl = getExportUrl({
      search: searchQuery,
      status: statusFilter,
      connectionDegree: connectionFilter
    });
    window.location.href = exportUrl;
    showToast('Exporting leads to CSV...');
  };

  // Reset to default sample seeds
  const handleResetConfirm = async () => {
    try {
      await resetToSampleSeed();
      setConfirmResetOpen(false);
      showToast('Lead directory re-seeded with sample LinkedIn profiles.');
      await loadData();
    } catch (err) {
      console.error('Failed to reset:', err);
      showToast('Failed to reset dataset');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-[#191919] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191919] text-white px-4 py-2 rounded-lg shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* LinkedIn Desktop Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => {
          setEditingLead(null);
          setIsAddModalOpen(true);
        }}
        onOpenImportModal={() => setActiveTab('import')}
        onExportCsv={() => handleExportCsv()}
        onResetSeed={() => setConfirmResetOpen(true)}
        totalLeadsCount={stats?.totalLeads ?? 0}
        newLeadsCount={stats?.newLeads ?? 0}
      />

      {/* LinkedIn 3-Column Main Canvas */}
      <main className="flex-1 max-w-[1128px] w-full mx-auto px-4 py-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Column (225px width on desktop) */}
          <div className="md:col-span-4 lg:col-span-3">
            <LinkedInProfileSidebar
              stats={stats}
              activeStatusFilter={statusFilter}
              onFilterStatus={(st) => {
                setStatusFilter(st);
                if (activeTab === 'import') setActiveTab('directory');
              }}
              activeConnectionFilter={connectionFilter}
              onFilterConnection={(conn) => setConnectionFilter(conn)}
              onOpenImport={() => setActiveTab('import')}
              onOpenAutomation={() => setActiveTab('automation')}
            />
          </div>

          {/* Center Column (Primary Feed / Profile View) */}
          <div className="md:col-span-8 lg:col-span-6 space-y-4">
            {/* 1. Recreated Profile Header matching image_1.png */}
            <AlexBermanProfileHeader
              onOpenAddModal={() => {
                setEditingLead(null);
                setIsAddModalOpen(true);
              }}
              onOpenImportModal={() => setActiveTab('import')}
            />

            {/* 2. Prominent About Section matching image_1.png */}
            <AboutSection />

            {/* 3. Pipeline Analytics Strip */}
            <StatCards
              stats={stats}
              activeStatusFilter={statusFilter}
              onFilterStatus={(st) => {
                setStatusFilter(st);
                if (activeTab === 'import') setActiveTab('directory');
              }}
              isLoading={isLoading}
            />

            {/* View Tab 1: Directory */}
            {activeTab === 'directory' && (
              <LeadsTable
                leads={leads}
                isLoading={isLoading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                connectionFilter={connectionFilter}
                setConnectionFilter={setConnectionFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onViewLead={(lead) => setSelectedDetailLead(lead)}
                onEditLead={(lead) => setEditingLead(lead)}
                onDeleteLead={(lead) => setDeletingLead(lead)}
                onUpdateStatus={handleUpdateStatus}
                onBulkDelete={handleBulkDelete}
                onBulkUpdateStatus={handleBulkUpdateStatus}
                onExportSelected={(sel) => handleExportCsv(sel)}
                onOpenAddModal={() => {
                  setEditingLead(null);
                  setIsAddModalOpen(true);
                }}
                onOpenImportModal={() => setActiveTab('import')}
              />
            )}

            {/* View Tab 2: Pipeline Kanban */}
            {activeTab === 'pipeline' && (
              <PipelineBoard
                leads={leads}
                onViewLead={(lead) => setSelectedDetailLead(lead)}
                onUpdateStatus={handleUpdateStatus}
                onOpenAddModal={() => {
                  setEditingLead(null);
                  setIsAddModalOpen(true);
                }}
              />
            )}

            {/* View Tab 3: CSV Import View */}
            {activeTab === 'import' && (
              <ImportView
                onImportComplete={async () => {
                  await loadData();
                  showToast('Prospects successfully imported!');
                  setActiveTab('directory');
                }}
              />
            )}

            {/* View Tab 4: Automated LinkedIn C2C Lead Finder & Outreach Engine */}
            {activeTab === 'automation' && (
              <C2CAutomationEngine
                onLeadAdded={async () => {
                  await loadData();
                }}
                showToast={showToast}
              />
            )}
          </div>

          {/* Right Column (People also viewed matching image_1.png) */}
          <div className="hidden lg:block lg:col-span-3">
            <LinkedInRightSidebar
              onExportCsv={() => handleExportCsv()}
              onSelectLead={async (personLead) => {
                try {
                  const created = await createLead(personLead);
                  showToast(`Added ${created.fullName} to your pipeline.`);
                  await loadData();
                } catch (err: any) {
                  showToast('Lead already in directory');
                }
              }}
            />
          </div>
        </div>
      </main>

      {/* Add / Edit Lead Profile Modal */}
      <LeadModal
        isOpen={isAddModalOpen || Boolean(editingLead)}
        initialLead={editingLead}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
      />

      {/* Lead Detail Slide-over Profile Drawer */}
      <LeadDetailDrawer
        lead={selectedDetailLead}
        isOpen={Boolean(selectedDetailLead)}
        onClose={() => setSelectedDetailLead(null)}
        onEdit={(lead) => {
          setSelectedDetailLead(null);
          setEditingLead(lead);
        }}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddNote}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingLead)}
        title="Remove Prospect"
        message={`Are you sure you want to delete ${deletingLead?.fullName}? This removes them from your LinkedIn pipeline.`}
        confirmText="Delete"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingLead(null)}
      />

      {/* Reset Seed Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmResetOpen}
        title="Reset Lead Dataset"
        message="This will re-initialize the directory with default verified LinkedIn prospect profiles and activities."
        confirmText="Reset Leads"
        isDestructive={false}
        onConfirm={handleResetConfirm}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  );
}
