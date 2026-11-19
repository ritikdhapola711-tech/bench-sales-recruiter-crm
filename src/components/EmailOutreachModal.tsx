import React, { useState, useEffect, useMemo } from 'react';
import { X, Mail, Send, Sparkles, CheckCircle2, AlertCircle, User, Building2, FileText } from 'lucide-react';
import type { LinkedInLead, EmailOutreachTemplate } from '../types/lead.ts';
import { fetchEmailTemplates, sendOutreachEmail } from '../services/api.ts';
import { getDeterministicAvatar, handleAvatarError } from '../utils/avatar.ts';

interface EmailOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LinkedInLead | null;
  leads: LinkedInLead[];
  onEmailSent: (msg: string) => Promise<void> | void;
}

const DEFAULT_CANDIDATE_TEMPLATE: EmailOutreachTemplate = {
  id: 'tpl-candidate-outreach',
  name: 'Direct Candidate / Prospect Opportunity Outreach (Digital Marketing & Growth)',
  subject: 'Exciting Digital Marketing & Growth Role Opportunity - {{recruiter_name}}',
  body: `Hi {{recruiter_name}},

Hope you are doing well!

I reviewed your background in Digital Marketing & SEO (including your experience at JobPrepped and Cortracker 360) and wanted to reach out directly regarding an immediate growth marketing and SEO opportunity with one of our direct clients.

Key Highlights:
• Role Focus: Digital Marketing, SEO, Google Ads, & Email Automation
• Engagement Type: C2C / W2 / Full-Time options available
• Location: Remote / Hybrid (US)

Please let me know your current availability and expected rate/compensation so we can schedule a brief intro call and submit your profile.

Best regards,
Bench & Sales Recruitment Team
Direct: +1 (321) 209-5351 | sales@benchcrm.io`,
};

export const EmailOutreachModal: React.FC<EmailOutreachModalProps> = ({
  isOpen,
  onClose,
  lead,
  leads,
  onEmailSent,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [templates, setTemplates] = useState<EmailOutreachTemplate[]>([DEFAULT_CANDIDATE_TEMPLATE]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-candidate-outreach');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [markAsContacted, setMarkAsContacted] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentConfirmation, setSentConfirmation] = useState<string | null>(null);

  const activeLead = useMemo(() => {
    if (selectedLeadId) {
      return leads.find(l => l.id === selectedLeadId) || lead || null;
    }
    return lead;
  }, [selectedLeadId, leads, lead]);

  const applyTemplateToFields = (
    tpl: EmailOutreachTemplate,
    target: { fullName: string; company: string; jobTitle: string }
  ) => {
    const firstName = target.fullName.trim().split(/\s+/)[0] || 'there';
    const company = target.company || 'your team';
    const role = target.jobTitle || 'Digital Marketing & Growth Specialist';
    const replaceVars = (str: string) =>
      str
        .replace(/\{\{recruiter_name\}\}/g, firstName)
        .replace(/\{\{company_name\}\}/g, company)
        .replace(/\{\{requirement_title\}\}/g, role);

    setSubject(replaceVars(tpl.subject));
    setBody(replaceVars(tpl.body));
  };

  // Load templates when modal opens
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    fetchEmailTemplates()
      .then((data: EmailOutreachTemplate[]) => {
        if (cancelled) return;
        setTemplates(data);
      })
      .catch((err) => {
        console.error('Failed to load email templates:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Sync active recipient when modal opens or selected lead changes
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSentConfirmation(null);

    setSelectedTemplateId('tpl-candidate-outreach');

    const initialTarget =
      lead ||
      leads.find(l => l.fullName.toLowerCase().includes('siddhu kolamala')) ||
      leads.find(l => l.fullName.toLowerCase().includes('siddhu')) ||
      leads[0] ||
      null;
    if (initialTarget) {
      setSelectedLeadId(initialTarget.id);
      setRecipientName(initialTarget.fullName);
      setRecipientEmail(initialTarget.email || '');
      setCompanyName(initialTarget.company || '');
    } else {
      setSelectedLeadId('');
      setRecipientName('');
      setRecipientEmail('');
      setCompanyName('');
    }
  }, [isOpen, lead]);

  // Apply chosen template once templates or active recipient are ready
  useEffect(() => {
    if (!isOpen || templates.length === 0) return;
    const tpl =
      templates.find(t => t.id === selectedTemplateId) ||
      templates.find(t => t.id === 'tpl-candidate-outreach') ||
      templates[0];
    if (tpl) {
      applyTemplateToFields(tpl, {
        fullName: recipientName || activeLead?.fullName || 'Siddhu',
        company: companyName || activeLead?.company || 'your organization',
        jobTitle: activeLead?.jobTitle || 'Digital Marketing & Growth Role',
      });
    }
  }, [isOpen, templates, selectedTemplateId, selectedLeadId]);

  if (!isOpen) return null;

  const handleRecipientDropdownChange = (id: string) => {
    setSelectedLeadId(id);
    setError(null);
    const chosen = leads.find(l => l.id === id);
    if (chosen) {
      setRecipientName(chosen.fullName);
      setRecipientEmail(chosen.email || '');
      setCompanyName(chosen.company || '');
      const tpl = templates.find(t => t.id === selectedTemplateId) || templates[0];
      if (tpl) {
        applyTemplateToFields(tpl, {
          fullName: chosen.fullName,
          company: chosen.company,
          jobTitle: chosen.jobTitle,
        });
      }
    }
  };

  const handleTemplateChange = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = templates.find(t => t.id === tplId);
    if (tpl) {
      applyTemplateToFields(tpl, {
        fullName: recipientName || 'Siddhu',
        company: companyName || 'your organization',
        jobTitle: activeLead?.jobTitle || 'Digital Marketing & Growth Role',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = recipientEmail.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid recipient email address.');
      return;
    }
    if (!subject.trim()) {
      setError('Please enter an email subject line.');
      return;
    }
    if (!body.trim()) {
      setError('Please enter an email message body.');
      return;
    }

    try {
      setIsSending(true);
      const res = await sendOutreachEmail({
        leadId: activeLead?.id,
        recruiterEmail: trimmedEmail,
        recruiterName: recipientName.trim() || 'Candidate',
        companyName: companyName.trim() || 'Client Company',
        subject: subject.trim(),
        body: body.trim(),
        markAsContacted,
      });

      const confirmMsg = `Email sent to ${recipientName || trimmedEmail} (${trimmedEmail})`;
      setSentConfirmation(res?.message || confirmMsg);
      await onEmailSent(confirmMsg);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      setError(err?.message || 'Failed to send outreach email.');
    } finally {
      setIsSending(false);
    }
  };

  const avatarSrc = activeLead
    ? activeLead.avatarUrl || getDeterministicAvatar(activeLead.fullName, activeLead.jobTitle, activeLead.id)
    : getDeterministicAvatar(recipientName || 'Siddhu Kolamala', 'Digital Marketing Specialist');

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl border border-[#e0dfdc] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#e0dfdc] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ebf4fd] text-[#0a66c2] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191919] leading-tight">
                Compose Email Outreach
              </h3>
              <p className="text-[11px] text-[#666666]">
                Send directly and log touchpoint to the candidate&apos;s CRM timeline
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef] rounded-full transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Recipient Selector / Profile Banner */}
          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e0dfdc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={avatarSrc}
                alt={recipientName || 'Recipient'}
                onError={(e) => handleAvatarError(e, recipientName || 'Siddhu Kolamala', activeLead?.jobTitle || 'Digital Marketing Specialist')}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-[#e0dfdc] bg-[#e2e8f0] shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#191919] truncate">
                  {activeLead ? activeLead.fullName : recipientName || 'New Recipient'}
                </div>
                <div className="text-[11px] text-[#666666] truncate">
                  {activeLead ? `${activeLead.jobTitle} · ${activeLead.company}` : 'Direct Email Outreach'}
                </div>
              </div>
            </div>

            {leads.length > 0 && (
              <div className="sm:w-64 shrink-0">
                <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#666666] mb-1">
                  CRM Candidate / Prospect
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => handleRecipientDropdownChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#e0dfdc] rounded-md text-[#191919] focus:outline-none focus:border-[#0a66c2]"
                >
                  {leads.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.fullName} — {item.company}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Recipient Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="flex items-center gap-1 text-[11px] font-semibold text-[#191919] mb-1">
                <User className="w-3 h-3 text-[#666666]" />
                <span>Recipient Name</span>
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Siddhu Kolamala"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#e0dfdc] rounded-md text-[#191919] focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-[11px] font-semibold text-[#191919] mb-1">
                <Mail className="w-3 h-3 text-[#666666]" />
                <span>To Email *</span>
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="candidate@company.com"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#e0dfdc] rounded-md text-[#191919] focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-[11px] font-semibold text-[#191919] mb-1">
                <Building2 className="w-3 h-3 text-[#666666]" />
                <span>Company / Organization</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#e0dfdc] rounded-md text-[#191919] focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          {/* Template Selector */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#191919] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#0a66c2]" />
              <span>Outreach Email Template</span>
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#f8f9fa] border border-[#e0dfdc] rounded-md text-[#191919] focus:bg-white focus:outline-none focus:border-[#0a66c2]"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-semibold text-[#191919] mb-1">
              <FileText className="w-3 h-3 text-[#666666]" />
              <span>Subject Line *</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Opportunity / Bench Consultant Outreach"
              className="w-full px-3 py-2 text-xs bg-white border border-[#e0dfdc] rounded-md text-[#191919] font-medium focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-[11px] font-semibold text-[#191919] mb-1">
              Email Message *
            </label>
            <textarea
              required
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your personalized message..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#e0dfdc] rounded-md text-[#191919] leading-relaxed focus:outline-none focus:border-[#0a66c2] font-sans"
            />
          </div>

          {/* CRM Status Toggle */}
          <label className="flex items-center gap-2 text-xs text-[#191919] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={markAsContacted}
              onChange={(e) => setMarkAsContacted(e.target.checked)}
              className="rounded border-[#e0dfdc] text-[#0a66c2] focus:ring-[#0a66c2]"
            />
            <span>Automatically advance status to Contacted (if currently New) and log on timeline</span>
          </label>

          {/* Error / Success feedback */}
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-md bg-red-50 border border-red-200 text-xs text-[#cc1016]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {sentConfirmation && (
            <div className="flex items-center gap-2 p-2.5 rounded-md bg-[#e6f4ea] border border-[#ceead6] text-xs text-[#137333] font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{sentConfirmation}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-[#e0dfdc] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-1.5 text-xs font-semibold text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef] rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="flex items-center gap-1.5 px-5 py-1.5 bg-[#0a66c2] hover:bg-[#004182] disabled:opacity-50 text-white text-xs font-semibold rounded-full shadow-2xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending...' : 'Send Email'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
