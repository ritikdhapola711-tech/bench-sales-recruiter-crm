import React from 'react';
import { ExternalLink, ArrowRight, ArrowLeft, Mail, MapPin } from 'lucide-react';
import type { LinkedInLead, LeadStatus } from '../types/lead.ts';
import { ALL_STATUSES } from './StatusBadge.tsx';
import { getDeterministicAvatar } from '../utils/avatar.ts';

interface PipelineBoardProps {
  leads: LinkedInLead[];
  onViewLead: (lead: LinkedInLead) => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onOpenAddModal: () => void;
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  leads,
  onViewLead,
  onUpdateStatus,
  onOpenAddModal,
}) => {
  const columns: { stage: LeadStatus; label: string; countBadge: string }[] = [
    { stage: 'New', label: 'New Inbound', countBadge: 'bg-[#e1f5fe] text-[#0277bd] border border-[#b3e5fc]' },
    { stage: 'Contacted', label: 'Outreach Sent', countBadge: 'bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]' },
    { stage: 'In Discussion', label: 'In Discussion', countBadge: 'bg-[#fef7e0] text-[#b06000] border border-[#feefc3]' },
    { stage: 'Qualified', label: 'Qualified', countBadge: 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]' },
    { stage: 'Nurturing', label: 'Nurturing', countBadge: 'bg-[#f3e8fd] text-[#7627bb] border border-[#e1c5fb]' },
  ];

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

  return (
    <div className="space-y-3">
      {/* Board Header */}
      <div className="linkedin-card p-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#191919]">LinkedIn Pipeline Stages</h2>
          <p className="text-xs text-[#666666]">
            Visual progression of prospects from initial connection to qualified deal
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="px-3.5 py-1 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-xs rounded-full transition-colors"
        >
          + Add Prospect
        </button>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 overflow-x-auto pb-4">
        {columns.map(({ stage, label, countBadge }) => {
          const stageLeads = leads.filter(l => l.status === stage);

          return (
            <div
              key={stage}
              className="linkedin-card p-2.5 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="p-2 border-b border-[#e0dfdc] mb-2 flex items-center justify-between">
                <span className="font-semibold text-xs text-[#191919]">{label}</span>
                <span className={`font-mono text-xs tabular-nums font-bold px-2 py-0.5 rounded-full ${countBadge}`}>
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[70vh] pr-0.5">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[#8c8c8c] italic">
                    No leads here
                  </div>
                ) : (
                  stageLeads.map(lead => {
                    const next = getNextStage(lead.status);
                    const prev = getPrevStage(lead.status);

                    return (
                      <div
                        key={lead.id}
                        onClick={() => onViewLead(lead)}
                        className="p-3 bg-white rounded-md border border-[#e0dfdc] hover:border-[#0a66c2] transition-all cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={lead.avatarUrl || getDeterministicAvatar(lead.fullName, lead.jobTitle)}
                            alt={lead.fullName}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = getDeterministicAvatar(lead.fullName, lead.jobTitle);
                            }}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#e0dfdc] bg-[#e2e8f0]"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <h4 className="font-bold text-xs text-[#191919] group-hover:text-[#0a66c2] truncate">
                                {lead.fullName}
                              </h4>
                              <span className="linkedin-degree-badge">
                                {lead.connectionDegree || '2nd'}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#666666] block truncate">
                              {lead.jobTitle}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] font-medium text-[#191919] truncate mb-1">
                          {lead.company}
                        </div>

                        {lead.location && (
                          <div className="flex items-center gap-1 text-[10px] text-[#666666] mb-2 truncate">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{lead.location}</span>
                          </div>
                        )}

                        {/* Controls */}
                        <div className="pt-2 border-t border-[#f3f2ef] flex items-center justify-between text-[11px]">
                          <div>
                            {prev && (
                              <button
                                type="button"
                                title={`Move back to ${prev}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateStatus(lead.id, prev);
                                }}
                                className="p-1 text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef] rounded-full"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {lead.linkedinUrl && (
                              <a
                                href={lead.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[#0a66c2] hover:underline p-0.5"
                                title="Open LinkedIn Profile"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}

                            {next && (
                              <button
                                type="button"
                                title={`Advance to ${next}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateStatus(lead.id, next);
                                }}
                                className="px-2 py-0.5 bg-[#ebf4fd] hover:bg-[#0a66c2] text-[#0a66c2] hover:text-white rounded-full text-[10px] font-semibold transition-colors flex items-center gap-0.5"
                              >
                                <span>Next</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
