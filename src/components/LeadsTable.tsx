import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  CheckSquare, 
  Square, 
  X,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  MessageSquare,
  UserPlus,
  Send,
  LayoutList,
  Table as TableIcon,
  ChevronDown,
  Sparkles,
  Share2
} from 'lucide-react';
import type { LinkedInLead, LeadStatus } from '../types/lead.ts';
import { StatusBadge, ALL_STATUSES } from './StatusBadge.tsx';
import { getDeterministicAvatar } from '../utils/avatar.ts';

interface LeadsTableProps {
  leads: LinkedInLead[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  connectionFilter: string;
  setConnectionFilter: (c: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (o: 'asc' | 'desc') => void;
  onViewLead: (lead: LinkedInLead) => void;
  onEditLead: (lead: LinkedInLead) => void;
  onDeleteLead: (lead: LinkedInLead) => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkUpdateStatus: (ids: string[], newStatus: LeadStatus) => void;
  onExportSelected: (selectedLeads: LinkedInLead[]) => void;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  connectionFilter,
  setConnectionFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onViewLead,
  onEditLead,
  onDeleteLead,
  onUpdateStatus,
  onBulkDelete,
  onBulkUpdateStatus,
  onExportSelected,
  onOpenAddModal,
  onOpenImportModal,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [viewLayout, setViewLayout] = useState<'profiles' | 'table'>('profiles');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllSelected = leads.length > 0 && selectedIds.length === leads.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map(l => l.id));
    }
  };

  const handleSortToggle = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const selectedLeadObjects = useMemo(() => {
    const set = new Set(selectedIds);
    return leads.filter(l => set.has(l.id));
  }, [leads, selectedIds]);

  const statusTabOptions = ['All', 'New', 'Contacted', 'In Discussion', 'Qualified', 'Nurturing', 'Unqualified'];
  const degreeOptions = ['All', '1st', '2nd', '3rd+', 'InMail'];

  return (
    <div className="space-y-3">
      {/* Search, Filter & Layout Bar (LinkedIn Filter Ribbon) */}
      <div className="bg-white rounded-lg border border-[#e0dfdc] p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Status Filter Pill Buttons (LinkedIn Search Filters) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {statusTabOptions.map((st) => {
              const isActive = statusFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap text-xs border ${
                    isActive
                      ? 'bg-[#057642] text-white border-[#057642]'
                      : 'bg-white text-[#666666] border-[#e0dfdc] hover:border-[#666666] hover:bg-[#f3f2ef]'
                  }`}
                >
                  {st === 'All' ? 'All Leads' : st}
                </button>
              );
            })}
          </div>

          {/* Layout Mode Switcher & Sort */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs">
            {/* View Mode Toggle: Profile Feed vs Table */}
            <div className="flex items-center p-0.5 bg-[#f3f2ef] rounded-md border border-[#e0dfdc]">
              <button
                type="button"
                onClick={() => setViewLayout('profiles')}
                title="LinkedIn Profile Card View"
                className={`p-1.5 rounded transition-colors ${
                  viewLayout === 'profiles'
                    ? 'bg-white text-[#0a66c2] shadow-2xs font-semibold'
                    : 'text-[#666666] hover:text-[#191919]'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('table')}
                title="Compact Table View"
                className={`p-1.5 rounded transition-colors ${
                  viewLayout === 'table'
                    ? 'bg-white text-[#0a66c2] shadow-2xs font-semibold'
                    : 'text-[#666666] hover:text-[#191919]'
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Selector */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="py-1 px-2.5 bg-white border border-[#e0dfdc] rounded-full text-xs font-semibold text-[#666666] hover:border-[#666666] focus:outline-none"
            >
              <option value="createdAt-desc">Most Recent</option>
              <option value="leadScore-desc">Highest Score</option>
              <option value="fullName-asc">Name (A-Z)</option>
              <option value="company-asc">Company (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (when rows selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#ebf4fd] border border-[#cce4f7] rounded-lg p-3 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#004182] font-semibold">
            <span className="font-mono tabular-nums">{selectedIds.length}</span> lead{selectedIds.length > 1 ? 's' : ''} selected
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setBulkStatusOpen(!bulkStatusOpen)}
                className="px-3 py-1 bg-white border border-[#0a66c2] text-[#0a66c2] rounded-full font-semibold hover:bg-[#ebf4fd] flex items-center gap-1"
              >
                <span>Update Status</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {bulkStatusOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-[#e0dfdc] rounded-lg shadow-lg py-1 z-50">
                  {ALL_STATUSES.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onBulkUpdateStatus(selectedIds, st);
                        setBulkStatusOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#191919] hover:bg-[#f3f2ef]"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onExportSelected(selectedLeadObjects)}
              className="px-3 py-1 bg-white border border-[#0a66c2] text-[#0a66c2] rounded-full font-semibold hover:bg-[#ebf4fd]"
            >
              Export Selected
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete ${selectedIds.length} selected lead(s)?`)) {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="px-3 py-1 bg-[#cc1016] text-white rounded-full font-semibold hover:bg-red-700"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="p-1 text-[#666666] hover:text-[#191919]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Content: View Mode 1 - LinkedIn Profile Cards */}
      {viewLayout === 'profiles' ? (
        <div className="linkedin-card divide-y divide-[#e0dfdc] overflow-hidden">
          {/* Header count & Select All */}
          <div className="p-3 bg-white flex items-center justify-between text-xs text-[#666666]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-[#666666] hover:text-[#191919]"
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 text-[#0a66c2]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <span className="font-semibold text-[#191919]">
                {leads.length} LinkedIn Prospects
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="text-[#0a66c2] font-semibold hover:underline"
            >
              + Add Lead
            </button>
          </div>

          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 flex items-start gap-4 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-40" />
                  <div className="h-3 bg-slate-100 rounded w-60" />
                  <div className="h-3 bg-slate-100 rounded w-48" />
                </div>
              </div>
            ))
          ) : leads.length === 0 ? (
            // Empty State
            <div className="py-12 px-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#ebf4fd] text-[#0a66c2] flex items-center justify-center mx-auto mb-3">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-[#191919] mb-1">
                No matching prospects found
              </h3>
              <p className="text-xs text-[#666666] max-w-sm mx-auto mb-4">
                Try refining your search keyword or load sample prospect data to populate your pipeline.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setConnectionFilter('All');
                  }}
                  className="px-4 py-1.5 border border-[#0a66c2] text-[#0a66c2] font-semibold text-xs rounded-full hover:bg-[#ebf4fd]"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={onOpenImportModal}
                  className="px-4 py-1.5 bg-[#0a66c2] text-white font-semibold text-xs rounded-full hover:bg-[#004182]"
                >
                  Import Prospects
                </button>
              </div>
            </div>
          ) : (
            // Populated LinkedIn Profile Rows
            leads.map((lead) => {
              const isSelected = selectedIds.includes(lead.id);
              const score = lead.leadScore ?? 50;

              return (
                <div
                  key={lead.id}
                  onClick={() => onViewLead(lead)}
                  className={`p-4 hover:bg-[#f3f2ef]/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    isSelected ? 'bg-[#ebf4fd]/40' : ''
                  }`}
                >
                  {/* Left: Avatar & Profile Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Checkbox */}
                    <div 
                      className="pt-3"
                      onClick={(e) => toggleSelectOne(lead.id, e)}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0a66c2]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#666666]" />
                      )}
                    </div>

                    {/* Circular Avatar Thumbnail */}
                    <div className="relative shrink-0">
                      <img
                        src={lead.avatarUrl || getDeterministicAvatar(lead.fullName, lead.jobTitle)}
                        alt={lead.fullName}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = getDeterministicAvatar(lead.fullName, lead.jobTitle);
                        }}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-2xs bg-[#e2e8f0]"
                      />
                      {lead.status === 'Qualified' && (
                        <span 
                          title="Qualified Decision Maker"
                          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#137333] border-2 border-white"
                        />
                      )}
                    </div>

                    {/* Headline and Metadata */}
                    <div className="flex-1 min-w-0">
                      {/* Name & Tiny Gray Pill Connection Degree */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[#191919] hover:text-[#0a66c2] hover:underline text-sm truncate">
                          {lead.fullName}
                        </span>
                        <span className="linkedin-degree-badge">
                          {lead.connectionDegree || '2nd'}
                        </span>
                        {lead.linkedinUrl && (
                          <a
                            href={lead.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Open LinkedIn Profile"
                            className="text-[#0a66c2] hover:underline inline-flex items-center p-0.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Headline / Job Title at Company */}
                      <p className="text-xs text-[#191919] font-medium leading-snug line-clamp-1 mt-0.5">
                        {lead.jobTitle} at <span className="font-semibold">{lead.company}</span>
                      </p>

                      {/* Location & Industry */}
                      <p className="text-[11px] text-[#666666] mt-0.5 flex items-center gap-1 truncate">
                        <span>{lead.location || 'Remote'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{lead.industry || 'Technology'}</span>
                      </p>

                      {/* Mutual Connections text simulation */}
                      <p className="text-[11px] text-[#666666] mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#666666] shrink-0" />
                        <span>Shared connections with Alex & 12 others in your network</span>
                      </p>

                      {/* Summary note / context */}
                      {lead.notesSummary && (
                        <p className="text-xs text-[#666666] italic mt-1.5 line-clamp-1 bg-[#f9fafb] px-2 py-1 rounded border border-[#e0dfdc]/60">
                          "{lead.notesSummary}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: LinkedIn Action Buttons & Status */}
                  <div 
                    className="flex flex-col sm:items-end justify-between gap-2.5 shrink-0 pl-10 sm:pl-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Status Pill */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono tabular-nums text-[#666666] font-medium">
                        Score: {score}
                      </span>
                      <StatusBadge
                        status={lead.status}
                        interactive={true}
                        onChangeStatus={(newStatus) => onUpdateStatus(lead.id, newStatus)}
                      />
                    </div>

                    {/* LinkedIn Signature Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Secondary Outline LinkedIn Button: Message */}
                      <button
                        type="button"
                        onClick={() => onViewLead(lead)}
                        className="flex items-center gap-1.5 px-4 py-1.5 border border-[#0a66c2] text-[#0a66c2] hover:bg-[#ebf4fd] hover:border-2 font-semibold text-xs rounded-full transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>

                      {/* Primary Solid LinkedIn Button: Advance Status or Connect */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus = lead.status === 'New' ? 'Contacted' : lead.status === 'Contacted' ? 'In Discussion' : 'Qualified';
                          onUpdateStatus(lead.id, nextStatus as LeadStatus);
                        }}
                        className="flex items-center gap-1 px-3.5 py-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-xs rounded-full shadow-2xs transition-colors"
                      >
                        <span>Advance</span>
                      </button>

                      {/* More Menu Ellipsis */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === lead.id ? null : lead.id)}
                          className="p-1.5 text-[#666666] hover:bg-[#ebebeb] hover:text-[#191919] rounded-full transition-colors"
                          title="More Actions"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuId === lead.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-[#e0dfdc] rounded-lg shadow-lg py-1 z-50 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                onViewLead(lead);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-[#191919] hover:bg-[#f3f2ef] flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onEditLead(lead);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-[#191919] hover:bg-[#f3f2ef] flex items-center gap-1.5"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteLead(lead);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-[#cc1016] hover:bg-red-50 flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Lead</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Content: View Mode 2 - LinkedIn Compact Data Grid */
        <div className="linkedin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#e0dfdc] bg-[#f9fafb] text-[11px] font-semibold text-[#666666] uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-8 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-[#666666] hover:text-[#191919]"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0a66c2]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-3 min-w-[200px]">Prospect Profile</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Company & Role</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Status</th>
                  <th className="py-2.5 px-3 min-w-[80px]">Degree</th>
                  <th className="py-2.5 px-3 min-w-[70px] text-right">Score</th>
                  <th className="py-2.5 px-3 min-w-[140px]">Contact</th>
                  <th className="py-2.5 px-3 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0dfdc] text-[#191919]">
                {leads.map((lead) => {
                  const isSelected = selectedIds.includes(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onViewLead(lead)}
                      className={`hover:bg-[#f3f2ef] cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#ebf4fd]/40' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => toggleSelectOne(lead.id, e)}
                          className="text-[#666666] hover:text-[#191919]"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#0a66c2]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={lead.avatarUrl || getDeterministicAvatar(lead.fullName, lead.jobTitle)}
                            alt={lead.fullName}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = getDeterministicAvatar(lead.fullName, lead.jobTitle);
                            }}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#e0dfdc] bg-[#e2e8f0]"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-[#191919] hover:text-[#0a66c2] hover:underline truncate block">
                              {lead.fullName}
                            </span>
                            <span className="text-[11px] text-[#666666] truncate block">
                              {lead.jobTitle}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-medium text-[#191919] truncate">{lead.company}</div>
                        <div className="text-[11px] text-[#666666] truncate">{lead.industry || 'Technology'}</div>
                      </td>

                      <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                        <StatusBadge
                          status={lead.status}
                          interactive={true}
                          onChangeStatus={(newStatus) => onUpdateStatus(lead.id, newStatus)}
                        />
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="linkedin-degree-badge">
                          {lead.connectionDegree || '2nd'}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-bold text-xs text-[#0a66c2]">
                        {lead.leadScore ?? 50}
                      </td>

                      <td className="py-2.5 px-3 text-[11px] text-[#666666]">
                        {lead.email ? (
                          <div className="truncate text-[#0a66c2] hover:underline">{lead.email}</div>
                        ) : (
                          <span className="italic text-[#8c8c8c]">No email</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onViewLead(lead)}
                            className="px-2 py-1 border border-[#0a66c2] text-[#0a66c2] hover:bg-[#ebf4fd] font-semibold rounded-full text-[11px]"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditLead(lead)}
                            className="p-1 text-[#666666] hover:text-[#0a66c2]"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
