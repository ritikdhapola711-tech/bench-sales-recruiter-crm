import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Building,
  Search,
  Plus,
  MessageSquare,
  Mail,
} from 'lucide-react';
import type { LinkedInLead, LeadStatus } from '../types/lead.ts';
import { StatusBadge, ALL_STATUSES } from './StatusBadge.tsx';
import { getDeterministicAvatar, handleAvatarError } from '../utils/avatar.ts';

interface PipelineBoardProps {
  leads: LinkedInLead[];
  onViewLead: (lead: LinkedInLead) => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onOpenAddModal: () => void;
  onOpenEmailOutreach: (lead: LinkedInLead) => void;
}

const PIPELINE_STAGES: LeadStatus[] = [
  'New',
  'Contacted',
  'In Discussion',
  'Qualified',
  'Nurturing',
];

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  leads,
  onViewLead,
  onUpdateStatus,
  onOpenAddModal,
  onOpenEmailOutreach,
}) => {
  const [boardSearch, setBoardSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState<'All' | LeadStatus>('All');

  const getNextStage = (current: LeadStatus): LeadStatus | null => {
    const idx = ALL_STATUSES.indexOf(current);
    if (idx !== -1 && idx < ALL_STATUSES.length - 1) {
      return ALL_STATUSES[idx + 1];
    }
    return null;
  };

  const getPrevStage = (current: LeadStatus): LeadStatus | null => {
    const idx = ALL_STATUSES.indexOf(current);
    if (idx > 0) {
      return ALL_STATUSES[idx - 1];
    }
    return null;
  };

  // Apply search query first so stage tab counts reflect current search
  const searchFilteredLeads = useMemo(() => {
    const q = boardSearch.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.jobTitle.toLowerCase().includes(q) ||
        (l.location || '').toLowerCase().includes(q)
    );
  }, [leads, boardSearch]);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { All: searchFilteredLeads.length };
    for (const st of PIPELINE_STAGES) {
      counts[st] = searchFilteredLeads.filter((l) => l.status === st).length;
    }
    return counts;
  }, [searchFilteredLeads]);

  const visibleLeads = useMemo(() => {
    if (selectedStage === 'All') return searchFilteredLeads;
    return searchFilteredLeads.filter((l) => l.status === selectedStage);
  }, [searchFilteredLeads, selectedStage]);

  return (
    <div className="w-full space-y-3">
      {/* Pipeline Control Header with Stage Filter Tabs & Instant Search */}
      <div className="linkedin-card p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#191919] leading-none">
                Recruiter &amp; Candidate Pipeline
              </h2>
              <span className="text-[11px] font-mono text-[#666666] bg-[#f3f2ef] px-2 py-0.5 rounded border border-[#e0dfdc]">
                {visibleLeads.length} Showing
              </span>
            </div>
            <p className="text-[11px] text-[#666666] leading-none mt-1.5">
              Filter by stage, email candidates directly, and advance qualified prospects
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="text"
                value={boardSearch}
                onChange={(e) => setBoardSearch(e.target.value)}
                placeholder="Search by name, role, or company..."
                className="pl-8 pr-3 py-1.5 text-xs bg-[#f3f2ef] focus:bg-white border border-[#e0dfdc] focus:border-[#0a66c2] focus:outline-none rounded-md w-full sm:w-64 transition-all text-[#191919]"
              />
            </div>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-xs rounded-full shadow-2xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Prospect</span>
            </button>
          </div>
        </div>

        {/* Horizontal Stage Filter Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-[#f3f2ef] scrollbar-none">
          {(['All', ...PIPELINE_STAGES] as const).map((stage) => {
            const isActive = selectedStage === stage;
            const count = stageCounts[stage] ?? 0;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setSelectedStage(stage)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#057642] text-white border-[#057642]'
                    : 'bg-white text-[#666666] border-[#e0dfdc] hover:border-[#666666] hover:bg-[#f3f2ef]'
                }`}
              >
                <span>{stage}</span>
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#f3f2ef] text-[#191919]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory-Style Responsive List Cards */}
      {visibleLeads.length === 0 ? (
        <div className="linkedin-card py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#ebf4fd] text-[#0a66c2] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#191919] mb-1">
            No prospects match this stage or filter
          </h3>
          <p className="text-xs text-[#666666] mb-4">
            Try switching to &quot;All&quot; stages or clearing your search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setBoardSearch('');
              setSelectedStage('All');
            }}
            className="px-4 py-1.5 border border-[#0a66c2] text-[#0a66c2] font-semibold text-xs rounded-full hover:bg-[#ebf4fd]"
          >
            Reset Pipeline Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleLeads.map((lead) => {
            const next = getNextStage(lead.status);
            const prev = getPrevStage(lead.status);
            const score = lead.leadScore ?? 50;
            const avatarSrc =
              lead.avatarUrl ||
              getDeterministicAvatar(lead.fullName, lead.jobTitle, lead.id);

            return (
              <div
                key={lead.id}
                onClick={() => onViewLead(lead)}
                className="linkedin-card p-4 hover:border-[#0a66c2] transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Human Avatar + Candidate / Prospect Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={avatarSrc}
                      alt={lead.fullName}
                      onError={(e) =>
                        handleAvatarError(e, lead.fullName, lead.jobTitle)
                      }
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-2xs bg-[#e2e8f0]"
                    />
                    {lead.status === 'Qualified' && (
                      <span
                        title="Qualified Prospect"
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#137333] border-2 border-white"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-[#191919] hover:text-[#0a66c2] hover:underline truncate">
                        {lead.fullName}
                      </h4>
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
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-[#191919] font-medium mt-0.5 line-clamp-1">
                      {lead.jobTitle} at{' '}
                      <span className="font-semibold">{lead.company}</span>
                    </p>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#666666] mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Building className="w-3 h-3 text-[#666666]" />
                        {lead.industry || 'Technology'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#666666]" />
                        {lead.location || 'United States'}
                      </span>
                      {lead.email && (
                        <span className="inline-flex items-center gap-1 text-[#0a66c2]">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </span>
                      )}
                    </div>

                    {lead.notesSummary && (
                      <p className="text-xs text-[#666666] italic mt-2 line-clamp-1 bg-[#f9fafb] px-2.5 py-1 rounded border border-[#e0dfdc]/70">
                        &ldquo;{lead.notesSummary}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Score, Interactive Status & Clean Horizontal Action Buttons */}
                <div
                  className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-2.5 shrink-0 pl-16 sm:pl-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono tabular-nums text-[#666666] font-semibold">
                      Score: <span className="text-[#191919]">{score}</span>
                    </span>
                    <StatusBadge
                      status={lead.status}
                      interactive={true}
                      onChangeStatus={(newStatus) =>
                        onUpdateStatus(lead.id, newStatus)
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onOpenEmailOutreach(lead)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#0a66c2] text-[#0a66c2] hover:bg-[#ebf4fd] font-semibold text-xs rounded-full transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewLead(lead)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#e0dfdc] text-[#191919] hover:bg-[#f3f2ef] font-semibold text-xs rounded-full transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#666666]" />
                      <span>Message</span>
                    </button>

                    {prev && (
                      <button
                        type="button"
                        title={`Move back to ${prev}`}
                        onClick={() => onUpdateStatus(lead.id, prev)}
                        className="p-1.5 border border-[#e0dfdc] text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef] rounded-full transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {next && (
                      <button
                        type="button"
                        title={`Advance to ${next}`}
                        onClick={() => onUpdateStatus(lead.id, next)}
                        className="flex items-center gap-1 px-3.5 py-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-xs rounded-full shadow-2xs transition-colors"
                      >
                        <span>Advance</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
