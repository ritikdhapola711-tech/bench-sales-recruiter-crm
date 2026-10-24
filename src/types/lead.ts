export type LeadStatus = 'New' | 'Contacted' | 'In Discussion' | 'Qualified' | 'Nurturing' | 'Unqualified';
export type ConnectionDegree = '1st' | '2nd' | '3rd+' | 'InMail' | 'Connected';

export interface LeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface LinkedInLead {
  id: string;
  fullName: string;
  jobTitle: string;
  company: string;
  linkedinUrl: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  industry?: string;
  status: LeadStatus;
  connectionDegree: ConnectionDegree;
  notesSummary?: string;
  notesTimeline?: LeadNote[];
  leadScore?: number; // 0 - 100
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  inDiscussionLeads: number;
  nurturingLeads: number;
  unqualifiedLeads: number;
  conversionRate: number; // percentage
  statusBreakdown: Record<LeadStatus, number>;
  connectionBreakdown: Record<string, number>;
}

export interface ExtractedRecruiterPost {
  id: string;
  recruiterName: string;
  recruiterTitle: string;
  company: string;
  linkedinProfileUrl: string;
  email: string;
  phone?: string;
  location: string;
  postSnippet: string;
  postedTimeAgo: string;
  jobRole: string;
  workType: 'C2C' | 'W2' | 'Full-Time' | 'Hotlist' | 'Contract';
  extractedRate?: string;
  avatarUrl?: string;
  outreachSent: boolean;
  outreachSentAt?: string;
}

export interface EmailOutreachTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

