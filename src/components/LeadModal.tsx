import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Building, Linkedin, Mail, Phone, MapPin, Tag, FileText } from 'lucide-react';
import type { LinkedInLead, LeadStatus, ConnectionDegree } from '../types/lead.ts';
import { ALL_STATUSES } from './StatusBadge.tsx';
import { getDeterministicAvatar } from '../utils/avatar.ts';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leadData: Partial<LinkedInLead>) => Promise<void>;
  initialLead?: LinkedInLead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLead,
}) => {
  const isEditing = Boolean(initialLead);

  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [connectionDegree, setConnectionDegree] = useState<ConnectionDegree>('2nd');
  const [tagsInput, setTagsInput] = useState('');
  const [notesSummary, setNotesSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialLead) {
      setFullName(initialLead.fullName || '');
      setJobTitle(initialLead.jobTitle || '');
      setCompany(initialLead.company || '');
      setLinkedinUrl(initialLead.linkedinUrl || '');
      setEmail(initialLead.email || '');
      setPhone(initialLead.phone || '');
      setLocation(initialLead.location || '');
      setIndustry(initialLead.industry || '');
      setStatus(initialLead.status || 'New');
      setConnectionDegree(initialLead.connectionDegree || '2nd');
      setTagsInput((initialLead.tags || []).join(', '));
      setNotesSummary(initialLead.notesSummary || '');
    } else {
      setFullName('');
      setJobTitle('');
      setCompany('');
      setLinkedinUrl('');
      setEmail('');
      setPhone('');
      setLocation('');
      setIndustry('');
      setStatus('New');
      setConnectionDegree('2nd');
      setTagsInput('');
      setNotesSummary('');
    }
    setErrorMsg('');
  }, [initialLead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      let finalUrl = linkedinUrl.trim();
      if (finalUrl && !finalUrl.startsWith('http')) {
        finalUrl = `https://${finalUrl}`;
      }

      await onSave({
        fullName: fullName.trim(),
        jobTitle: jobTitle.trim() || 'Prospect',
        company: company.trim() || 'Independent',
        linkedinUrl: finalUrl || (fullName.trim() ? `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(fullName.trim())}` : ''),
        avatarUrl: initialLead?.avatarUrl || getDeterministicAvatar(fullName.trim(), jobTitle.trim()),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        location: location.trim() || 'Remote',
        industry: industry.trim() || 'Technology',
        status,
        connectionDegree,
        tags,
        notesSummary: notesSummary.trim()
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-2xl border border-[#e0dfdc] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#e0dfdc] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#0a66c2] text-white flex items-center justify-center font-bold text-sm">
              in
            </div>
            <div>
              <h3 className="text-base font-bold text-[#191919]">
                {isEditing ? 'Edit Prospect Profile' : 'Add LinkedIn Prospect'}
              </h3>
              <p className="text-xs text-[#666666]">
                {isEditing ? 'Update profile information and stage.' : 'Track a new connection or outreach candidate.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block font-semibold text-[#191919] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-9 pr-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label className="block font-semibold text-[#191919] mb-1">
                  Headline / Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. VP of Engineering"
                    className="w-full pl-9 pr-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block font-semibold text-[#191919] mb-1">
                  Company
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. CloudScale Systems"
                    className="w-full pl-9 pr-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="block font-semibold text-[#191919] mb-1">
                  Industry / Sector
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Enterprise Software"
                  className="w-full px-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                />
              </div>

              {/* LinkedIn URL */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#191919] mb-1">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0a66c2]" />
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/prospect"
                    className="w-full pl-9 pr-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2] font-mono"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-[#191919] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@cloudscale.io"
                    className="w-full pl-9 pr-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold text-[#191919] mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (415) 555-0199"
                    className="w-full pl-9 pr-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold text-[#191919] mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco Bay Area"
                    className="w-full pl-9 pr-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              {/* Connection Degree */}
              <div>
                <label className="block font-semibold text-[#191919] mb-1">
                  Connection Degree
                </label>
                <select
                  value={connectionDegree}
                  onChange={(e) => setConnectionDegree(e.target.value as ConnectionDegree)}
                  className="w-full px-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                >
                  <option value="1st">1st Degree</option>
                  <option value="2nd">2nd Degree</option>
                  <option value="3rd+">3rd+ Degree</option>
                  <option value="InMail">InMail Outreach</option>
                  <option value="Connected">Connected</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-[#191919] mb-1">
                  Pipeline Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className="w-full px-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2] font-semibold text-[#0a66c2]"
                >
                  {ALL_STATUSES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#191919] mb-1">
                  Tags (comma-separated)
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Decision Maker, Cloud, Q4 Target"
                    className="w-full pl-9 pr-3 py-2 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#191919] mb-1">
                  Touchpoint Context / Notes
                </label>
                <textarea
                  rows={3}
                  value={notesSummary}
                  onChange={(e) => setNotesSummary(e.target.value)}
                  placeholder="Recent post comments, mutual colleagues, or conversation summary..."
                  className="w-full p-3 bg-[#f3f2ef] border border-[#e0dfdc] rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0a66c2] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer with LinkedIn pill buttons */}
          <div className="px-6 py-3.5 bg-[#f9fafb] border-t border-[#e0dfdc] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold text-[#666666] hover:text-[#191919] hover:bg-[#e0dfdc] rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] rounded-full shadow-2xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Save Prospect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
