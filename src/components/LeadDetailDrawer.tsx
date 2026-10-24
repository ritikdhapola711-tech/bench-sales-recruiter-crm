import React, { useState } from 'react';
import { 
  X, 
  Linkedin, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Briefcase, 
  Clock, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  Edit3, 
  MessageSquare,
  ShieldCheck,
  Share2,
  Users
} from 'lucide-react';
import type { LinkedInLead, LeadStatus } from '../types/lead.ts';
import { StatusBadge } from './StatusBadge.tsx';
import { getDeterministicAvatar } from '../utils/avatar.ts';

interface LeadDetailDrawerProps {
  lead: LinkedInLead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: LinkedInLead) => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onAddNote: (id: string, text: string) => Promise<void>;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onEdit,
  onUpdateStatus,
  onAddNote,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  if (!isOpen || !lead) return null;

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setIsSubmittingNote(true);
      await onAddNote(lead.id, newNote.trim());
      setNewNote('');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const getDraftMessage = () => {
    const firstName = lead.fullName.split(' ')[0] || 'there';
    return `Hi ${firstName}, loved seeing your leadership work as ${lead.jobTitle} at ${lead.company}. We are helping enterprise teams in ${lead.industry || 'the tech space'} streamline high-volume prospect outreach and pipeline velocity. Would love to connect and share a quick 2-minute overview if you're exploring options this quarter!`;
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(getDraftMessage());
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const score = lead.leadScore ?? 50;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs flex justify-end">
      <div 
        className="w-full max-w-xl bg-[#f3f2ef] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header bar */}
        <div className="bg-white border-b border-[#e0dfdc] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#191919]">
            <span className="w-5 h-5 rounded bg-[#0a66c2] text-white flex items-center justify-center font-bold text-xs">
              in
            </span>
            <span>LinkedIn Prospect Profile</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(lead)}
              className="p-1.5 text-[#666666] hover:text-[#0a66c2] hover:bg-[#f3f2ef] rounded-full transition-colors"
              title="Edit Profile"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef] rounded-full transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Main Profile Header Card */}
          <div className="linkedin-card overflow-hidden">
            {/* Banner */}
            <div className="h-24 bg-gradient-to-r from-[#004182] via-[#0a66c2] to-[#388fe6] relative" />

            {/* Profile Intro */}
            <div className="px-5 pb-5 relative">
              {/* Avatar overlapping banner */}
              <div className="relative -mt-12 mb-3">
                <img
                  src={lead.avatarUrl || getDeterministicAvatar(lead.fullName, lead.jobTitle)}
                  alt={lead.fullName}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getDeterministicAvatar(lead.fullName, lead.jobTitle);
                  }}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xs bg-[#e2e8f0]"
                />
                {lead.status === 'Qualified' && (
                  <span className="absolute bottom-1 left-18 w-5 h-5 rounded-full bg-[#137333] border-2 border-white flex items-center justify-center text-white text-[10px]">
                    ✓
                  </span>
                )}
              </div>

              {/* Name & Headline */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#191919] leading-tight">
                      {lead.fullName}
                    </h2>
                    <span className="linkedin-degree-badge">
                      {lead.connectionDegree || '2nd'}
                    </span>
                  </div>
                  <p className="text-xs text-[#191919] font-medium leading-relaxed mt-1">
                    {lead.jobTitle} at <span className="font-semibold">{lead.company}</span>
                  </p>
                  <p className="text-xs text-[#666666] mt-1 flex items-center gap-1">
                    <span>{lead.location || 'Remote'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#0a66c2] font-semibold hover:underline cursor-pointer">
                      500+ connections
                    </span>
                  </p>
                </div>

                {/* Lead Score Badge */}
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-[#666666] uppercase font-semibold">Lead Score</div>
                  <div className="text-xl font-bold font-mono text-[#0a66c2] tabular-nums">
                    {score}/100
                  </div>
                </div>
              </div>

              {/* Action Buttons: Message / Open LinkedIn / Update Status */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {lead.linkedinUrl && (
                  <a
                    href={lead.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-xs rounded-full shadow-2xs transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>View LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#666666]">Status:</span>
                  <StatusBadge
                    status={lead.status}
                    interactive={true}
                    onChangeStatus={(newStatus) => onUpdateStatus(lead.id, newStatus)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Outreach InMail Draft Box */}
          <div className="linkedin-card p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0a66c2]">
                <Sparkles className="w-4 h-4" />
                <span>Personalized LinkedIn Outreach Draft</span>
              </div>

              <button
                type="button"
                onClick={handleCopyDraft}
                className="flex items-center gap-1 px-3 py-1 border border-[#0a66c2] text-[#0a66c2] hover:bg-[#ebf4fd] rounded-full text-xs font-semibold transition-all"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#137333]" />
                    <span className="text-[#137333]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy InMail</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-[#f3f2ef] rounded-md text-xs text-[#191919] leading-relaxed border border-[#e0dfdc]">
              {getDraftMessage()}
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="linkedin-card p-4 text-xs space-y-2.5">
            <h4 className="font-semibold text-sm text-[#191919]">Contact Info</h4>
            <div className="space-y-2 text-[#666666]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#666666]" /> Email
                </span>
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="font-semibold text-[#0a66c2] hover:underline">
                    {lead.email}
                  </a>
                ) : (
                  <span className="italic text-[#8c8c8c]">No email provided</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#666666]" /> Phone
                </span>
                {lead.phone ? (
                  <span className="font-medium text-[#191919]">{lead.phone}</span>
                ) : (
                  <span className="italic text-[#8c8c8c]">No phone provided</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#666666]" /> Company & Sector
                </span>
                <span className="font-medium text-[#191919]">
                  {lead.company} ({lead.industry || 'Tech'})
                </span>
              </div>
            </div>
          </div>

          {/* Activity & Timeline Notes Card */}
          <div className="linkedin-card p-4 text-xs space-y-3">
            <h4 className="font-semibold text-sm text-[#191919] flex items-center justify-between">
              <span>Activity & Interaction History</span>
              <span className="text-[#666666] text-xs font-normal">
                {lead.notesTimeline?.length || 0} touchpoints
              </span>
            </h4>

            {/* Quick Add Note Form */}
            <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a call, message reply, or outreach note..."
                className="flex-1 px-3 py-1.5 bg-[#f3f2ef] border border-[#e0dfdc] rounded-full text-xs text-[#191919] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
              />
              <button
                type="submit"
                disabled={isSubmittingNote || !newNote.trim()}
                className="px-4 py-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold rounded-full text-xs transition-colors disabled:opacity-40 shrink-0"
              >
                Log
              </button>
            </form>

            {/* Timeline Notes List */}
            <div className="space-y-2 pt-1">
              {lead.notesTimeline && lead.notesTimeline.length > 0 ? (
                lead.notesTimeline.map((item) => (
                  <div key={item.id} className="p-2.5 bg-[#f9fafb] border border-[#e0dfdc] rounded-md">
                    <div className="flex items-center justify-between text-[11px] text-[#666666] mb-1">
                      <span className="font-semibold text-[#191919]">{item.author}</span>
                      <span className="font-mono tabular-nums">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-[#191919] leading-relaxed">{item.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#666666] italic text-center py-4">
                  No touchpoints logged yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
