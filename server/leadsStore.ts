import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { LinkedInLead, LeadStatus, DashboardStats, ConnectionDegree } from '../src/types/lead.ts';
import { getDeterministicAvatar } from '../src/utils/avatar.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'leads.json');

const INITIAL_SEEDS: LinkedInLead[] = [
  {
    id: 'lead-1',
    fullName: 'Alex Rivera',
    jobTitle: 'VP of Engineering',
    company: 'CloudScale Systems',
    linkedinUrl: 'https://www.linkedin.com/in/alex-rivera-tech',
    avatarUrl: '/src/assets/images/avatar_alex_tech_1792802860657.jpg',
    email: 'alex.rivera@cloudscale.io',
    phone: '+1 (415) 892-4412',
    location: 'San Francisco, CA',
    industry: 'Enterprise Software',
    status: 'Qualified',
    connectionDegree: '1st',
    leadScore: 94,
    tags: ['High Value', 'Decision Maker', 'Q4 Budget'],
    notesSummary: 'Discussed Q4 expansion and API pipeline. Demo scheduled for next Tuesday at 2 PM PST.',
    notesTimeline: [
      {
        id: 'note-1-1',
        author: 'You',
        text: 'Initial LinkedIn connection accepted. Alex mentioned they are upgrading their developer infrastructure.',
        createdAt: '2026-10-18T10:14:00Z'
      },
      {
        id: 'note-1-2',
        author: 'You',
        text: 'Sent product overview deck and ROI metrics benchmark.',
        createdAt: '2026-10-20T14:30:00Z'
      },
      {
        id: 'note-1-3',
        author: 'You',
        text: 'Qualified call completed. Alex agreed to 45-min technical demonstration with architecture team.',
        createdAt: '2026-10-22T16:00:00Z'
      }
    ],
    createdAt: '2026-10-18T10:14:00Z',
    updatedAt: '2026-10-22T16:00:00Z',
    lastContactedAt: '2026-10-22T16:00:00Z'
  },
  {
    id: 'lead-2',
    fullName: 'Sarah Chen',
    jobTitle: 'Head of Product',
    company: 'FinPulse Technologies',
    linkedinUrl: 'https://www.linkedin.com/in/sarah-chen-product',
    avatarUrl: '/src/assets/images/avatar_sarah_product_1792802860781.jpg',
    email: 'schen@finpulse.com',
    phone: '+1 (212) 555-0193',
    location: 'New York, NY',
    industry: 'Financial Technology',
    status: 'Contacted',
    connectionDegree: '2nd',
    leadScore: 88,
    tags: ['Product Lead', 'Fintech', 'Mid-Market'],
    notesSummary: 'Sent tailored outreach on LinkedIn regarding automation bottlenecks. Responded asking for 1-pager.',
    notesTimeline: [
      {
        id: 'note-2-1',
        author: 'You',
        text: 'Sent personalized connection message mentioning their recent Series B round.',
        createdAt: '2026-10-19T11:20:00Z'
      },
      {
        id: 'note-2-2',
        author: 'Sarah Chen',
        text: 'Replied on LinkedIn: "Interesting timing, we are actively auditing our vendors. Send over the deck."',
        createdAt: '2026-10-21T09:45:00Z'
      }
    ],
    createdAt: '2026-10-19T11:20:00Z',
    updatedAt: '2026-10-21T09:45:00Z',
    lastContactedAt: '2026-10-21T09:45:00Z'
  },
  {
    id: 'lead-3',
    fullName: 'Marcus Vance',
    jobTitle: 'Chief Revenue Officer',
    company: 'HyperVenture SaaS',
    linkedinUrl: 'https://www.linkedin.com/in/marcus-vance-cro',
    avatarUrl: '/src/assets/images/avatar_marcus_cro_1792802861859.jpg',
    email: 'marcus@hyperventure.co',
    phone: '+1 (512) 782-9011',
    location: 'Austin, TX',
    industry: 'Cloud Infrastructure',
    status: 'In Discussion',
    connectionDegree: '2nd',
    leadScore: 91,
    tags: ['Executive', 'High Intent', 'Sales Leadership'],
    notesSummary: 'Evaluating for roll-out across 14 portfolio company sales teams. In pricing discussion.',
    notesTimeline: [
      {
        id: 'note-3-1',
        author: 'You',
        text: 'Found via mutual connection in Austin VC network.',
        createdAt: '2026-10-15T08:30:00Z'
      },
      {
        id: 'note-3-2',
        author: 'You',
        text: 'Discovery call completed. Key pain point is pipeline visibility and contact stale rates.',
        createdAt: '2026-10-21T15:15:00Z'
      }
    ],
    createdAt: '2026-10-15T08:30:00Z',
    updatedAt: '2026-10-21T15:15:00Z',
    lastContactedAt: '2026-10-21T15:15:00Z'
  },
  {
    id: 'lead-4',
    fullName: 'Elena Rostova',
    jobTitle: 'Director of Demand Generation',
    company: 'DataNexus Global',
    linkedinUrl: 'https://www.linkedin.com/in/elena-rostova-growth',
    avatarUrl: '/src/assets/images/avatar_elena_growth_1792802861333.jpg',
    email: 'elena.rostova@datanexus.io',
    phone: '+1 (206) 441-2908',
    location: 'Seattle, WA',
    industry: 'Big Data & Analytics',
    status: 'New',
    connectionDegree: '1st',
    leadScore: 76,
    tags: ['Marketing Director', 'Inbound'],
    notesSummary: 'Profile viewed our company page after reading LinkedIn case study. Ready for initial outreach.',
    notesTimeline: [
      {
        id: 'note-4-1',
        author: 'System',
        text: 'Prospect imported from LinkedIn Lead Gen event.',
        createdAt: '2026-10-23T04:12:00Z'
      }
    ],
    createdAt: '2026-10-23T04:12:00Z',
    updatedAt: '2026-10-23T04:12:00Z'
  },
  {
    id: 'lead-5',
    fullName: 'Dev Patel',
    jobTitle: 'Founder & CEO',
    company: 'Omnistack AI',
    linkedinUrl: 'https://www.linkedin.com/in/dev-patel-omni',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'dev@omnistack.ai',
    phone: '+1 (617) 320-9945',
    location: 'Boston, MA',
    industry: 'Artificial Intelligence',
    status: 'Qualified',
    connectionDegree: '3rd+',
    leadScore: 98,
    tags: ['Founder', 'Urgent', 'Enterprise Contract'],
    notesSummary: 'Active buyer. Wants pilot agreement reviewed and signed before month end.',
    notesTimeline: [
      {
        id: 'note-5-1',
        author: 'Dev Patel',
        text: 'Reached out directly: "Saw your LinkedIn demo. Need this deployed for our 30-person team ASAP."',
        createdAt: '2026-10-22T19:00:00Z'
      }
    ],
    createdAt: '2026-10-22T19:00:00Z',
    updatedAt: '2026-10-23T08:30:00Z',
    lastContactedAt: '2026-10-23T08:30:00Z'
  },
  {
    id: 'lead-6',
    fullName: 'Jessica Miller',
    jobTitle: 'Senior Sales Operations Manager',
    company: 'PeakPerform Corp',
    linkedinUrl: 'https://www.linkedin.com/in/jessica-miller-salesops',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'jmiller@peakperform.com',
    phone: '+1 (312) 678-2234',
    location: 'Chicago, IL',
    industry: 'B2B Software',
    status: 'Contacted',
    connectionDegree: '2nd',
    leadScore: 82,
    tags: ['SalesOps', 'CRM Migration'],
    notesSummary: 'Message delivered on LinkedIn. Waiting on internal budget approval meeting on Thursday.',
    notesTimeline: [
      {
        id: 'note-6-1',
        author: 'You',
        text: 'Shared case study on reducing lead response time by 48%.',
        createdAt: '2026-10-21T13:40:00Z'
      }
    ],
    createdAt: '2026-10-21T13:40:00Z',
    updatedAt: '2026-10-21T13:40:00Z',
    lastContactedAt: '2026-10-21T13:40:00Z'
  },
  {
    id: 'lead-7',
    fullName: "Liam O'Connor",
    jobTitle: 'VP of Growth & Operations',
    company: 'Stride Logistics',
    linkedinUrl: 'https://www.linkedin.com/in/liam-oconnor-logistics',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'liam@stridelogistics.eu',
    phone: '+353 1 496 0122',
    location: 'Dublin, Ireland',
    industry: 'Supply Chain & Logistics',
    status: 'Nurturing',
    connectionDegree: '1st',
    leadScore: 68,
    tags: ['International', 'Q1 Target'],
    notesSummary: 'Timing delayed due to internal ERP migration. Set automated follow-up reminder for early next quarter.',
    notesTimeline: [
      {
        id: 'note-7-1',
        author: 'Liam',
        text: 'Requested touchpoint in 60-90 days once warehouse software rollout settles.',
        createdAt: '2026-10-17T14:10:00Z'
      }
    ],
    createdAt: '2026-10-17T14:10:00Z',
    updatedAt: '2026-10-17T14:10:00Z',
    lastContactedAt: '2026-10-17T14:10:00Z'
  },
  {
    id: 'lead-8',
    fullName: 'Sophia Taylor',
    jobTitle: 'Chief Technology Officer',
    company: 'Horizon Health Dynamics',
    linkedinUrl: 'https://www.linkedin.com/in/sophia-taylor-healthtech',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'staylor@horizonhealth.org',
    phone: '+1 (858) 501-7781',
    location: 'San Diego, CA',
    industry: 'Healthcare & Life Sciences',
    status: 'New',
    connectionDegree: 'InMail',
    leadScore: 86,
    tags: ['HIPAA Compliance', 'Executive Buyer'],
    notesSummary: 'Viewed profile and liked company update on secure compliance protocols.',
    notesTimeline: [],
    createdAt: '2026-10-23T12:05:00Z',
    updatedAt: '2026-10-23T12:05:00Z'
  },
  {
    id: 'lead-9',
    fullName: 'Tyler Brooks',
    jobTitle: 'Partner & Growth Lead',
    company: 'Apex Capital Partners',
    linkedinUrl: 'https://www.linkedin.com/in/tyler-brooks-pe',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'tbrooks@apexcap.com',
    phone: '+1 (303) 890-4123',
    location: 'Denver, CO',
    industry: 'Private Equity & Venture',
    status: 'Contacted',
    connectionDegree: '2nd',
    leadScore: 74,
    tags: ['Investor', 'Portfolio Synergy'],
    notesSummary: 'Sent referral message via mutual partner Dan. Tyler confirmed receipt.',
    notesTimeline: [
      {
        id: 'note-9-1',
        author: 'You',
        text: 'Warm introduction email sent via mutual colleague.',
        createdAt: '2026-10-22T16:45:00Z'
      }
    ],
    createdAt: '2026-10-22T16:45:00Z',
    updatedAt: '2026-10-22T16:45:00Z',
    lastContactedAt: '2026-10-22T16:45:00Z'
  },
  {
    id: 'lead-10',
    fullName: 'Rachel Kim',
    jobTitle: 'Director of Talent & Strategy',
    company: 'NexaCorp Solutions',
    linkedinUrl: 'https://www.linkedin.com/in/rachel-kim-talent',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'rkim@nexacorp.ca',
    phone: '+1 (416) 923-8812',
    location: 'Toronto, ON',
    industry: 'HR Tech & Consulting',
    status: 'Unqualified',
    connectionDegree: '1st',
    leadScore: 42,
    tags: ['Not a Fit', 'Low Volume'],
    notesSummary: 'Currently using an internal proprietary tool and not considering third-party solutions.',
    notesTimeline: [
      {
        id: 'note-10-1',
        author: 'Rachel',
        text: 'Confirmed they are locked into an enterprise contract through 2028.',
        createdAt: '2026-10-16T11:00:00Z'
      }
    ],
    createdAt: '2026-10-16T11:00:00Z',
    updatedAt: '2026-10-16T11:00:00Z',
    lastContactedAt: '2026-10-16T11:00:00Z'
  },
  {
    id: 'lead-11',
    fullName: 'Benjamin Scott',
    jobTitle: 'Director of Enterprise Sales',
    company: 'CyberFortress Systems',
    linkedinUrl: 'https://www.linkedin.com/in/benjamin-scott-sec',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'bscott@cyberfortress.net',
    phone: '+1 (404) 732-5561',
    location: 'Atlanta, GA',
    industry: 'Cybersecurity',
    status: 'Qualified',
    connectionDegree: '2nd',
    leadScore: 92,
    tags: ['Security Audited', 'Enterprise'],
    notesSummary: 'Passed initial security audit questionnaire. Proposal presentation on Friday.',
    notesTimeline: [
      {
        id: 'note-11-1',
        author: 'You',
        text: 'InMail outreach sent inquiring on outbound deliverability challenges.',
        createdAt: '2026-10-14T09:00:00Z'
      },
      {
        id: 'note-11-2',
        author: 'Benjamin',
        text: 'Agreed to vendor assessment. Sent security review checklist.',
        createdAt: '2026-10-19T10:30:00Z'
      }
    ],
    createdAt: '2026-10-14T09:00:00Z',
    updatedAt: '2026-10-19T10:30:00Z',
    lastContactedAt: '2026-10-19T10:30:00Z'
  },
  {
    id: 'lead-12',
    fullName: 'Maya Lin',
    jobTitle: 'Product Marketing Lead',
    company: 'PulseCommerce Global',
    linkedinUrl: 'https://www.linkedin.com/in/maya-lin-marketing',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'maya.lin@pulsecommerce.com',
    phone: '+1 (310) 459-1120',
    location: 'Los Angeles, CA',
    industry: 'E-Commerce Software',
    status: 'In Discussion',
    connectionDegree: '1st',
    leadScore: 81,
    tags: ['Competitive Evaluation', 'Marketing'],
    notesSummary: 'Evaluating between us and legacy provider. Shared custom feature battlecard.',
    notesTimeline: [
      {
        id: 'note-12-1',
        author: 'You',
        text: 'Connected after her keynote panel at SaaStr.',
        createdAt: '2026-10-12T15:20:00Z'
      }
    ],
    createdAt: '2026-10-12T15:20:00Z',
    updatedAt: '2026-10-21T17:00:00Z',
    lastContactedAt: '2026-10-21T17:00:00Z'
  },
  {
    id: 'lead-13',
    fullName: 'Priya Venkatesh',
    jobTitle: 'VP of Talent Acquisition & Staffing',
    company: 'Databricks',
    linkedinUrl: 'https://www.linkedin.com/in/priya-venkatesh-talent',
    avatarUrl: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'priya.venkatesh@databricks.com',
    phone: '+1 (415) 349-8802',
    location: 'San Francisco, CA',
    industry: 'Data Infrastructure & AI',
    status: 'Qualified',
    connectionDegree: '1st',
    leadScore: 96,
    tags: ['Talent Executive', 'Enterprise C2C', 'High Intent'],
    notesSummary: 'Looking to scale 40+ senior data engineers & Java architects across North America. Scheduled contract sync on Monday.',
    notesTimeline: [
      {
        id: 'note-13-1',
        author: 'You',
        text: 'Met during Databricks Data + AI Summit breakout session on engineering staffing agility.',
        createdAt: '2026-10-19T14:00:00Z'
      },
      {
        id: 'note-13-2',
        author: 'Priya',
        text: 'Sent requirements for 40+ senior Spark/Java contractors. Requested MSA tier pricing.',
        createdAt: '2026-10-22T10:15:00Z'
      }
    ],
    createdAt: '2026-10-19T14:00:00Z',
    updatedAt: '2026-10-22T10:15:00Z',
    lastContactedAt: '2026-10-22T10:15:00Z'
  },
  {
    id: 'lead-14',
    fullName: 'David Sterling',
    jobTitle: 'Chief Revenue Officer',
    company: 'Snowflake',
    linkedinUrl: 'https://www.linkedin.com/in/david-sterling-cro',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'david.sterling@snowflake.com',
    phone: '+1 (406) 582-9104',
    location: 'Bozeman, MT',
    industry: 'Cloud Data Platform',
    status: 'In Discussion',
    connectionDegree: '2nd',
    leadScore: 92,
    tags: ['C-Level', 'Strategic Alliance', 'Revenue'],
    notesSummary: 'Reviewed partner expansion pipeline. Interested in bench deployment model for specialized professional services.',
    notesTimeline: [
      {
        id: 'note-14-1',
        author: 'You',
        text: 'Introduced by regional ecosystem lead. Presented our verified C2C hotlist deployment model.',
        createdAt: '2026-10-20T16:30:00Z'
      }
    ],
    createdAt: '2026-10-20T16:30:00Z',
    updatedAt: '2026-10-22T18:00:00Z',
    lastContactedAt: '2026-10-22T18:00:00Z'
  },
  {
    id: 'lead-15',
    fullName: 'Kendra Washington',
    jobTitle: 'Head of Technical Recruiting',
    company: 'Stripe',
    linkedinUrl: 'https://www.linkedin.com/in/kendra-washington-stripe',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'kendra.w@stripe.com',
    phone: '+1 (206) 774-3209',
    location: 'Seattle, WA',
    industry: 'Fintech & Payments',
    status: 'Contacted',
    connectionDegree: '1st',
    leadScore: 89,
    tags: ['Fintech', 'C2C Pipeline', 'Staffing'],
    notesSummary: 'Replied to InMail regarding Java backend and distributed systems hotlist. Requested bench skill breakdown.',
    notesTimeline: [
      {
        id: 'note-15-1',
        author: 'You',
        text: 'Sent message regarding our immediate availability on senior payment gateway engineers.',
        createdAt: '2026-10-21T11:20:00Z'
      }
    ],
    createdAt: '2026-10-21T11:20:00Z',
    updatedAt: '2026-10-22T14:45:00Z',
    lastContactedAt: '2026-10-22T14:45:00Z'
  },
  {
    id: 'lead-16',
    fullName: 'Mateo Alvarez',
    jobTitle: 'VP of Cloud Engineering',
    company: 'CrowdStrike',
    linkedinUrl: 'https://www.linkedin.com/in/mateo-alvarez-sec',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'm.alvarez@crowdstrike.com',
    phone: '+1 (512) 693-4411',
    location: 'Austin, TX',
    industry: 'Cybersecurity',
    status: 'Qualified',
    connectionDegree: '2nd',
    leadScore: 95,
    tags: ['Security Clearance', 'Cloud Architect', 'Q4 Spend'],
    notesSummary: 'Requires 12 senior SecOps & AWS Java microservices specialists for government cloud tier.',
    notesTimeline: [
      {
        id: 'note-16-1',
        author: 'You',
        text: 'Technical briefing call held. Client validated candidates with FedRAMP experience.',
        createdAt: '2026-10-18T15:00:00Z'
      }
    ],
    createdAt: '2026-10-18T15:00:00Z',
    updatedAt: '2026-10-23T09:00:00Z',
    lastContactedAt: '2026-10-23T09:00:00Z'
  },
  {
    id: 'lead-17',
    fullName: 'Chloe Tremblay',
    jobTitle: 'Director of People Operations',
    company: 'Figma',
    linkedinUrl: 'https://www.linkedin.com/in/chloe-tremblay-figma',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'chloe@figma.com',
    phone: '+1 (415) 812-7065',
    location: 'San Francisco, CA',
    industry: 'Design Technology',
    status: 'New',
    connectionDegree: '3rd+',
    leadScore: 78,
    tags: ['Design Systems', 'Vendor Onboarding'],
    notesSummary: 'Inbound interest through LinkedIn bench newsletter. Needs contingent workforce compliance review.',
    notesTimeline: [
      {
        id: 'note-17-1',
        author: 'System',
        text: 'Imported via LinkedIn campaign response.',
        createdAt: '2026-10-23T07:15:00Z'
      }
    ],
    createdAt: '2026-10-23T07:15:00Z',
    updatedAt: '2026-10-23T07:15:00Z'
  },
  {
    id: 'lead-18',
    fullName: 'Harrison Reed',
    jobTitle: 'Senior Director of Vendor Procurement',
    company: 'Atlassian',
    linkedinUrl: 'https://www.linkedin.com/in/harrison-reed-procurement',
    avatarUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'hreed@atlassian.com',
    phone: '+1 (415) 604-3329',
    location: 'Mountain View, CA',
    industry: 'Enterprise Collaboration',
    status: 'In Discussion',
    connectionDegree: '1st',
    leadScore: 87,
    tags: ['Procurement', 'MSA Review', 'Enterprise'],
    notesSummary: 'Master Services Agreement (MSA) in legal review. Discussing standard net-30 terms and liability caps.',
    notesTimeline: [
      {
        id: 'note-18-1',
        author: 'Harrison',
        text: 'Transmitted procurement vendor registration portal links and background check standards.',
        createdAt: '2026-10-21T16:10:00Z'
      }
    ],
    createdAt: '2026-10-17T09:30:00Z',
    updatedAt: '2026-10-21T16:10:00Z',
    lastContactedAt: '2026-10-21T16:10:00Z'
  },
  {
    id: 'lead-19',
    fullName: 'Ananya Desai',
    jobTitle: 'Head of Engineering - Core Banking',
    company: 'Ramp',
    linkedinUrl: 'https://www.linkedin.com/in/ananya-desai-ramp',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'ananya.desai@ramp.com',
    phone: '+1 (212) 489-6617',
    location: 'New York, NY',
    industry: 'Corporate Spend & Fintech',
    status: 'Qualified',
    connectionDegree: '1st',
    leadScore: 97,
    tags: ['Fintech', 'Java Bench', 'Immediate Need'],
    notesSummary: 'Needs 6 senior Java/Spring Boot & Kafka engineers for multi-currency ledger launch. Fast-track technical interviews.',
    notesTimeline: [
      {
        id: 'note-19-1',
        author: 'You',
        text: 'Submitted hotlist of 6 Java consultants with high-throughput banking experience.',
        createdAt: '2026-10-22T08:30:00Z'
      },
      {
        id: 'note-19-2',
        author: 'Ananya',
        text: 'Selected 4 profiles for 1-hour live coding rounds scheduled this Thursday.',
        createdAt: '2026-10-23T11:00:00Z'
      }
    ],
    createdAt: '2026-10-20T10:00:00Z',
    updatedAt: '2026-10-23T11:00:00Z',
    lastContactedAt: '2026-10-23T11:00:00Z'
  },
  {
    id: 'lead-20',
    fullName: 'Marcus Thorne',
    jobTitle: 'VP of Global Talent Strategy',
    company: 'HubSpot',
    linkedinUrl: 'https://www.linkedin.com/in/marcus-thorne-talent',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'mthorne@hubspot.com',
    phone: '+1 (617) 831-2940',
    location: 'Cambridge, MA',
    industry: 'Marketing & CRM SaaS',
    status: 'Contacted',
    connectionDegree: '2nd',
    leadScore: 84,
    tags: ['SaaS', 'Partner Network', 'Outreach Sent'],
    notesSummary: 'Delivered C2C staffing presentation deck. Follow-up meeting requested with his procurement leads.',
    notesTimeline: [
      {
        id: 'note-20-1',
        author: 'You',
        text: 'Followed up after recent HubSpot ecosystem webinar.',
        createdAt: '2026-10-22T14:15:00Z'
      }
    ],
    createdAt: '2026-10-22T14:15:00Z',
    updatedAt: '2026-10-22T14:15:00Z',
    lastContactedAt: '2026-10-22T14:15:00Z'
  },
  {
    id: 'lead-21',
    fullName: 'Dr. Evelyn Wu',
    jobTitle: 'Chief Medical Information Officer',
    company: 'Oscar Health',
    linkedinUrl: 'https://www.linkedin.com/in/dr-evelyn-wu',
    avatarUrl: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'ewu@hioscar.com',
    phone: '+1 (646) 512-8801',
    location: 'New York, NY',
    industry: 'Healthtech & Insurtech',
    status: 'In Discussion',
    connectionDegree: 'InMail',
    leadScore: 88,
    tags: ['Healthtech', 'HIPAA', 'FHIR APIs'],
    notesSummary: 'Exploring specialized bench talent for FHIR integrations and claims adjudications platform.',
    notesTimeline: [
      {
        id: 'note-21-1',
        author: 'Evelyn',
        text: 'Confirmed interest in reviewing healthcare-specialized backend developers with HL7/FHIR mastery.',
        createdAt: '2026-10-22T17:40:00Z'
      }
    ],
    createdAt: '2026-10-21T09:00:00Z',
    updatedAt: '2026-10-22T17:40:00Z',
    lastContactedAt: '2026-10-22T17:40:00Z'
  },
  {
    id: 'lead-22',
    fullName: 'Nathaniel Cole',
    jobTitle: 'Director of Enterprise Infrastructure',
    company: 'MongoDB',
    linkedinUrl: 'https://www.linkedin.com/in/nathaniel-cole-infra',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'n.cole@mongodb.com',
    phone: '+1 (212) 203-9124',
    location: 'Jersey City, NJ',
    industry: 'Database & Cloud',
    status: 'Nurturing',
    connectionDegree: '2nd',
    leadScore: 71,
    tags: ['Infrastructure', 'Re-engagement Q1'],
    notesSummary: 'Budget allocated for Q1 2027. Re-establishing contact in 6 weeks for database kernel support team.',
    notesTimeline: [
      {
        id: 'note-22-1',
        author: 'You',
        text: 'Quarterly check-in completed. Tagged for December re-engagement.',
        createdAt: '2026-10-18T13:00:00Z'
      }
    ],
    createdAt: '2026-10-18T13:00:00Z',
    updatedAt: '2026-10-18T13:00:00Z',
    lastContactedAt: '2026-10-18T13:00:00Z'
  },
  {
    id: 'lead-23',
    fullName: 'Gabriela Santos',
    jobTitle: 'Senior Director of Engineering',
    company: 'Toast',
    linkedinUrl: 'https://www.linkedin.com/in/gabriela-santos-toast',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'gsantos@toasttab.com',
    phone: '+1 (617) 991-3820',
    location: 'Boston, MA',
    industry: 'Restaurant Tech & Fintech',
    status: 'New',
    connectionDegree: '1st',
    leadScore: 83,
    tags: ['POS Systems', 'High Urgency', 'C2C Bench'],
    notesSummary: 'Connected after our post on Java full-stack microservices for POS telemetry. Sent introduction email.',
    notesTimeline: [
      {
        id: 'note-23-1',
        author: 'You',
        text: 'Accepted invitation with note on POS telemetry latency reduction.',
        createdAt: '2026-10-23T06:45:00Z'
      }
    ],
    createdAt: '2026-10-23T06:45:00Z',
    updatedAt: '2026-10-23T06:45:00Z'
  },
  {
    id: 'lead-24',
    fullName: 'Julian Vance',
    jobTitle: 'Head of Infrastructure & SRE',
    company: 'Cloudflare',
    linkedinUrl: 'https://www.linkedin.com/in/julian-vance-cloudflare',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'jvance@cloudflare.com',
    phone: '+1 (415) 791-5502',
    location: 'San Francisco, CA',
    industry: 'Network Security & CDN',
    status: 'Contacted',
    connectionDegree: '3rd+',
    leadScore: 85,
    tags: ['Distributed Systems', 'Edge Computing'],
    notesSummary: 'InMail accepted. Julian requested bench profiles with experience in Rust, Go, and high-throughput Java.',
    notesTimeline: [
      {
        id: 'note-24-1',
        author: 'You',
        text: 'Sent summary of 3 available systems engineers with CDN edge optimization experience.',
        createdAt: '2026-10-22T15:00:00Z'
      }
    ],
    createdAt: '2026-10-22T15:00:00Z',
    updatedAt: '2026-10-22T15:00:00Z',
    lastContactedAt: '2026-10-22T15:00:00Z'
  },
  {
    id: 'lead-25',
    fullName: 'Mei-Ling Zhou',
    jobTitle: 'VP of People & Talent Acquisition',
    company: 'Scale AI',
    linkedinUrl: 'https://www.linkedin.com/in/meiling-zhou-scale',
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'mzhou@scale.com',
    phone: '+1 (415) 902-1849',
    location: 'San Francisco, CA',
    industry: 'AI Data Platform',
    status: 'Qualified',
    connectionDegree: '1st',
    leadScore: 99,
    tags: ['GenAI', 'Contracting', 'Tier-1 Partner'],
    notesSummary: 'Signed vendor NDA. Reviewing hotlist of 15 senior annotation & pipeline engineers for enterprise AI delivery.',
    notesTimeline: [
      {
        id: 'note-25-1',
        author: 'Mei-Ling',
        text: 'NDA executed. Sent job order requisition for 15 dedicated data pipeline architects.',
        createdAt: '2026-10-22T18:20:00Z'
      }
    ],
    createdAt: '2026-10-19T11:00:00Z',
    updatedAt: '2026-10-22T18:20:00Z',
    lastContactedAt: '2026-10-22T18:20:00Z'
  },
  {
    id: 'lead-26',
    fullName: 'Brandon Hayes',
    jobTitle: 'Director of Enterprise Applications',
    company: 'ServiceNow',
    linkedinUrl: 'https://www.linkedin.com/in/brandon-hayes-snow',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'brandon.hayes@servicenow.com',
    phone: '+1 (858) 433-2890',
    location: 'San Diego, CA',
    industry: 'IT Service Management',
    status: 'In Discussion',
    connectionDegree: '2nd',
    leadScore: 89,
    tags: ['ITSM', 'Workflows', 'Enterprise'],
    notesSummary: 'Discussing rate cards for W2 and C2C specialists. Looking for certified ServiceNow architect contractors.',
    notesTimeline: [
      {
        id: 'note-26-1',
        author: 'Brandon',
        text: 'Shared contract rate bands for certified technical architects.',
        createdAt: '2026-10-21T14:30:00Z'
      }
    ],
    createdAt: '2026-10-20T10:15:00Z',
    updatedAt: '2026-10-21T14:30:00Z',
    lastContactedAt: '2026-10-21T14:30:00Z'
  },
  {
    id: 'lead-27',
    fullName: 'Alisha Campbell',
    jobTitle: 'VP of Strategic Sourcing',
    company: 'Epic Systems',
    linkedinUrl: 'https://www.linkedin.com/in/alisha-campbell-epic',
    avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'acampbell@epic.com',
    phone: '+1 (608) 271-9980',
    location: 'Madison, WI',
    industry: 'Healthcare Software',
    status: 'Nurturing',
    connectionDegree: 'InMail',
    leadScore: 73,
    tags: ['Healthcare EHR', 'Long Cycle'],
    notesSummary: 'Hospital rollout schedule moving into Phase 2. Kept in quarterly newsletter touchpoint.',
    notesTimeline: [
      {
        id: 'note-27-1',
        author: 'You',
        text: 'Introductory email sent outlining our healthcare bench expertise.',
        createdAt: '2026-10-15T11:00:00Z'
      }
    ],
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-15T11:00:00Z',
    lastContactedAt: '2026-10-15T11:00:00Z'
  },
  {
    id: 'lead-28',
    fullName: 'Christopher Morgan',
    jobTitle: 'Head of Product Engineering',
    company: 'Notion Labs',
    linkedinUrl: 'https://www.linkedin.com/in/christopher-morgan-notion',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'cmorgan@makenotion.com',
    phone: '+1 (415) 309-7714',
    location: 'San Francisco, CA',
    industry: 'Productivity & Workspace',
    status: 'New',
    connectionDegree: '1st',
    leadScore: 80,
    tags: ['Collaboration', 'Full Stack', 'Inbound'],
    notesSummary: 'Expressed interest in flexible contract staffing to accelerate Notion AI formula features.',
    notesTimeline: [],
    createdAt: '2026-10-23T08:00:00Z',
    updatedAt: '2026-10-23T08:00:00Z'
  },
  {
    id: 'lead-29',
    fullName: 'Tara Fitzpatrick',
    jobTitle: 'Chief Revenue Officer',
    company: 'Samsara',
    linkedinUrl: 'https://www.linkedin.com/in/tara-fitzpatrick-cro',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'tara.fitz@samsara.com',
    phone: '+1 (415) 993-2107',
    location: 'San Francisco, CA',
    industry: 'Connected Operations & IoT',
    status: 'Contacted',
    connectionDegree: '2nd',
    leadScore: 86,
    tags: ['IoT', 'Revenue Leadership', 'Enterprise'],
    notesSummary: 'Sent LinkedIn connection request and tailored note referencing their expansion in industrial fleet telemetry.',
    notesTimeline: [
      {
        id: 'note-29-1',
        author: 'You',
        text: 'Customized message delivered regarding real-time IoT backend telemetry engineers.',
        createdAt: '2026-10-22T13:00:00Z'
      }
    ],
    createdAt: '2026-10-22T13:00:00Z',
    updatedAt: '2026-10-22T13:00:00Z',
    lastContactedAt: '2026-10-22T13:00:00Z'
  },
  {
    id: 'lead-30',
    fullName: 'Zachary Weiss',
    jobTitle: 'VP of Enterprise Architecture',
    company: 'Zscaler',
    linkedinUrl: 'https://www.linkedin.com/in/zachary-weiss-sec',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'zweiss@zscaler.com',
    phone: '+1 (408) 550-9921',
    location: 'San Jose, CA',
    industry: 'Zero Trust Security',
    status: 'Qualified',
    connectionDegree: '1st',
    leadScore: 93,
    tags: ['Zero Trust', 'Architect', 'C2C High Rate'],
    notesSummary: 'Cleared technical screening for 4 Principal Java Zero Trust Security Architects. Rate approved at $115/hr C2C.',
    notesTimeline: [
      {
        id: 'note-30-1',
        author: 'Zachary',
        text: 'Approved vendor onboarding package. Ready for immediate contractor onboarding.',
        createdAt: '2026-10-23T10:00:00Z'
      }
    ],
    createdAt: '2026-10-18T16:20:00Z',
    updatedAt: '2026-10-23T10:00:00Z',
    lastContactedAt: '2026-10-23T10:00:00Z'
  },
  {
    id: 'lead-31',
    fullName: 'Monica Ruiz',
    jobTitle: 'Director of Technical Talent & Staffing',
    company: 'Rubrik',
    linkedinUrl: 'https://www.linkedin.com/in/monica-ruiz-rubrik',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'mruiz@rubrik.com',
    phone: '+1 (650) 419-8832',
    location: 'Palo Alto, CA',
    industry: 'Cloud Data Security',
    status: 'In Discussion',
    connectionDegree: '2nd',
    leadScore: 91,
    tags: ['Cyber Resiliency', 'Staffing Partner', 'SOW'],
    notesSummary: 'Working on Statement of Work (SOW) draft for backup cloud engineering pod. Scheduled call for Wednesday.',
    notesTimeline: [
      {
        id: 'note-31-1',
        author: 'You',
        text: 'Completed discovery meeting on multi-cloud immutable backup specialists.',
        createdAt: '2026-10-21T11:45:00Z'
      }
    ],
    createdAt: '2026-10-19T09:10:00Z',
    updatedAt: '2026-10-21T11:45:00Z',
    lastContactedAt: '2026-10-21T11:45:00Z'
  },
  {
    id: 'lead-32',
    fullName: 'Derek Fontaine',
    jobTitle: 'VP of Cloud Engineering & Platform',
    company: 'GitLab',
    linkedinUrl: 'https://www.linkedin.com/in/derek-fontaine-gitlab',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'dfontaine@gitlab.com',
    phone: '+1 (303) 728-1194',
    location: 'Denver, CO',
    industry: 'DevSecOps & Platform',
    status: 'Contacted',
    connectionDegree: '3rd+',
    leadScore: 82,
    tags: ['Remote First', 'DevOps', 'CI/CD'],
    notesSummary: 'Shared our bench availability for Kubernetes, Go, and Java cloud pipeline specialists.',
    notesTimeline: [
      {
        id: 'note-32-1',
        author: 'You',
        text: 'InMail message delivered outlining contract bench rates and talent availability.',
        createdAt: '2026-10-22T16:20:00Z'
      }
    ],
    createdAt: '2026-10-22T16:20:00Z',
    updatedAt: '2026-10-22T16:20:00Z',
    lastContactedAt: '2026-10-22T16:20:00Z'
  },
  {
    id: 'lead-33',
    fullName: 'Corinne Vance',
    jobTitle: 'Chief Technology Officer',
    company: 'Kustomer',
    linkedinUrl: 'https://www.linkedin.com/in/corinne-vance-kustomer',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'corinne@kustomer.com',
    phone: '+1 (212) 641-7730',
    location: 'New York, NY',
    industry: 'CRM & Customer Experience',
    status: 'Nurturing',
    connectionDegree: '1st',
    leadScore: 75,
    tags: ['Executive CTO', 'Omnichannel', 'Q1 Hiring'],
    notesSummary: 'Catching up post-Dreamforce conference. Reviewing upcoming platform refactor needs.',
    notesTimeline: [
      {
        id: 'note-33-1',
        author: 'Corinne',
        text: 'Touchpoint booked for December to review spring engineering contract headcount.',
        createdAt: '2026-10-18T10:00:00Z'
      }
    ],
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-18T10:00:00Z',
    lastContactedAt: '2026-10-18T10:00:00Z'
  },
  {
    id: 'lead-34',
    fullName: 'Jonathan Ross',
    jobTitle: 'Director of Talent Acquisition - Global Engineering',
    company: 'Palo Alto Networks',
    linkedinUrl: 'https://www.linkedin.com/in/jonathan-ross-talent',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'jross@paloaltonetworks.com',
    phone: '+1 (408) 753-4000',
    location: 'Santa Clara, CA',
    industry: 'Cybersecurity & SASE',
    status: 'New',
    connectionDegree: 'InMail',
    leadScore: 87,
    tags: ['Security', 'Bench Staffing', 'High Volume'],
    notesSummary: 'Reached out via InMail regarding their open Java C2C requirements in security analytics.',
    notesTimeline: [
      {
        id: 'note-34-1',
        author: 'You',
        text: 'InMail sent regarding bench talent for high-throughput network packet processing.',
        createdAt: '2026-10-23T05:30:00Z'
      }
    ],
    createdAt: '2026-10-23T05:30:00Z',
    updatedAt: '2026-10-23T05:30:00Z'
  }
];

class LeadsStore {
  private leads: LinkedInLead[] = [];

  constructor() {
    this.ensureDataDirectory();
    this.loadFromDisk();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with INITIAL_SEEDS so newly added seeds are automatically included
          const existingIds = new Set(parsed.map((l: any) => l.id));
          const missingSeeds = INITIAL_SEEDS.filter(s => !existingIds.has(s.id));

          // Also update avatarUrls and fields for existing seed leads if improved
          const updated = parsed.map((lead: any) => {
            const seed = INITIAL_SEEDS.find(s => s.id === lead.id);
            if (seed && (!lead.avatarUrl || lead.avatarUrl.includes('placeholder'))) {
              return { ...lead, avatarUrl: seed.avatarUrl };
            }
            if (seed && seed.avatarUrl && !lead.avatarUrl) {
              return { ...lead, avatarUrl: seed.avatarUrl };
            }
            return lead;
          });

          this.leads = [...updated, ...missingSeeds];
          this.saveToDisk();
          return;
        }
      }
    } catch (err) {
      console.warn('Could not read existing leads file, initializing seeds:', err);
    }

    // Seed defaults
    this.leads = [...INITIAL_SEEDS];
    this.saveToDisk();
  }

  public reloadFromSeeds(): LinkedInLead[] {
    this.leads = [...INITIAL_SEEDS];
    this.saveToDisk();
    return this.leads;
  }

  private saveToDisk() {
    try {
      this.ensureDataDirectory();
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.leads, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save leads to disk:', err);
    }
  }

  public getAll(filters?: {
    search?: string;
    status?: string;
    connectionDegree?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): LinkedInLead[] {
    let result = [...this.leads];

    if (filters?.status && filters.status !== 'All') {
      result = result.filter(l => l.status.toLowerCase() === filters.status!.toLowerCase());
    }

    if (filters?.connectionDegree && filters.connectionDegree !== 'All') {
      result = result.filter(l => l.connectionDegree.toLowerCase() === filters.connectionDegree!.toLowerCase());
    }

    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(l =>
        l.fullName.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.jobTitle.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.location && l.location.toLowerCase().includes(q)) ||
        (l.industry && l.industry.toLowerCase().includes(q)) ||
        l.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      let valA: any = a[sortBy as keyof LinkedInLead] ?? '';
      let valB: any = b[sortBy as keyof LinkedInLead] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return 0;
    });

    return result;
  }

  public getById(id: string): LinkedInLead | undefined {
    return this.leads.find(l => l.id === id);
  }

  public create(data: Partial<LinkedInLead>): LinkedInLead {
    const now = new Date().toISOString();
    const newLead: LinkedInLead = {
      id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      fullName: data.fullName?.trim() || 'Unnamed Prospect',
      jobTitle: data.jobTitle?.trim() || 'Professional',
      company: data.company?.trim() || 'Independent',
      linkedinUrl: data.linkedinUrl?.trim() || 'https://www.linkedin.com',
      avatarUrl: data.avatarUrl || getDeterministicAvatar(data.fullName?.trim() || 'Prospect', data.jobTitle?.trim()),
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      location: data.location?.trim() || 'Global',
      industry: data.industry?.trim() || 'Technology',
      status: (data.status as LeadStatus) || 'New',
      connectionDegree: (data.connectionDegree as ConnectionDegree) || '2nd',
      leadScore: typeof data.leadScore === 'number' ? data.leadScore : this.calculateLeadScore(data),
      tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
      notesSummary: data.notesSummary?.trim() || '',
      notesTimeline: [
        {
          id: 'note-' + Date.now(),
          author: 'You',
          text: 'Lead created in system.',
          createdAt: now
        }
      ],
      createdAt: now,
      updatedAt: now,
      lastContactedAt: data.status === 'Contacted' || data.status === 'Qualified' ? now : undefined
    };

    this.leads.unshift(newLead);
    this.saveToDisk();
    return newLead;
  }

  public update(id: string, updates: Partial<LinkedInLead>): LinkedInLead | null {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;

    const existing = this.leads[idx];
    const now = new Date().toISOString();

    const updated: LinkedInLead = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: now,
      tags: Array.isArray(updates.tags) ? updates.tags : existing.tags
    };

    // If status changed to contacted or qualified and no previous contact, set lastContactedAt
    if (updates.status && updates.status !== existing.status) {
      if (['Contacted', 'In Discussion', 'Qualified'].includes(updates.status)) {
        updated.lastContactedAt = now;
      }
      // Add status change to timeline
      const timeline = existing.notesTimeline ? [...existing.notesTimeline] : [];
      timeline.unshift({
        id: 'note-' + Date.now(),
        author: 'System',
        text: `Status changed from ${existing.status} to ${updates.status}.`,
        createdAt: now
      });
      updated.notesTimeline = timeline;
    }

    this.leads[idx] = updated;
    this.saveToDisk();
    return updated;
  }

  public updateStatus(id: string, status: LeadStatus): LinkedInLead | null {
    return this.update(id, { status });
  }

  public addNote(id: string, author: string, text: string): LinkedInLead | null {
    const lead = this.getById(id);
    if (!lead) return null;

    const now = new Date().toISOString();
    const newNote = {
      id: 'note-' + Date.now(),
      author: author || 'You',
      text: text.trim(),
      createdAt: now
    };

    const timeline = lead.notesTimeline ? [newNote, ...lead.notesTimeline] : [newNote];
    return this.update(id, {
      notesTimeline: timeline,
      notesSummary: text.trim(),
      lastContactedAt: now
    });
  }

  public delete(id: string): boolean {
    const initialLen = this.leads.length;
    this.leads = this.leads.filter(l => l.id !== id);
    if (this.leads.length !== initialLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  public bulkDelete(ids: string[]): number {
    const set = new Set(ids);
    const before = this.leads.length;
    this.leads = this.leads.filter(l => !set.has(l.id));
    const deleted = before - this.leads.length;
    if (deleted > 0) {
      this.saveToDisk();
    }
    return deleted;
  }

  public bulkUpdateStatus(ids: string[], status: LeadStatus): number {
    const set = new Set(ids);
    let updatedCount = 0;
    const now = new Date().toISOString();

    this.leads = this.leads.map(lead => {
      if (set.has(lead.id)) {
        updatedCount++;
        const timeline = lead.notesTimeline ? [...lead.notesTimeline] : [];
        timeline.unshift({
          id: 'note-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
          author: 'System',
          text: `Status bulk updated to ${status}.`,
          createdAt: now
        });
        return {
          ...lead,
          status,
          updatedAt: now,
          notesTimeline: timeline
        };
      }
      return lead;
    });

    if (updatedCount > 0) {
      this.saveToDisk();
    }
    return updatedCount;
  }

  public importLeads(items: Partial<LinkedInLead>[]): { imported: number; skipped: number; total: number } {
    let imported = 0;
    let skipped = 0;
    const now = new Date().toISOString();

    for (const item of items) {
      const name = item.fullName?.trim();
      if (!name) {
        skipped++;
        continue;
      }

      // Check if duplicate LinkedIn URL or Email exists
      const isDuplicate = this.leads.some(l => 
        (item.linkedinUrl && item.linkedinUrl.toLowerCase() === l.linkedinUrl.toLowerCase() && l.linkedinUrl !== 'https://www.linkedin.com') ||
        (item.email && l.email && item.email.toLowerCase() === l.email.toLowerCase())
      );

      if (isDuplicate) {
        skipped++;
        continue;
      }

      const newLead: LinkedInLead = {
        id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        fullName: name,
        jobTitle: item.jobTitle?.trim() || 'Prospect',
        company: item.company?.trim() || 'Company',
        linkedinUrl: item.linkedinUrl?.trim() || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name)}`,
        email: item.email?.trim() || undefined,
        phone: item.phone?.trim() || undefined,
        location: item.location?.trim() || 'Remote',
        industry: item.industry?.trim() || 'Technology',
        status: (item.status as LeadStatus) || 'New',
        connectionDegree: (item.connectionDegree as ConnectionDegree) || '2nd',
        leadScore: typeof item.leadScore === 'number' ? item.leadScore : this.calculateLeadScore(item),
        tags: Array.isArray(item.tags) ? item.tags : ['Imported CSV'],
        notesSummary: item.notesSummary?.trim() || 'Imported prospect from CSV file.',
        notesTimeline: [
          {
            id: 'note-' + Date.now(),
            author: 'System',
            text: 'Imported via CSV prospect data view.',
            createdAt: now
          }
        ],
        createdAt: now,
        updatedAt: now
      };

      this.leads.unshift(newLead);
      imported++;
    }

    if (imported > 0) {
      this.saveToDisk();
    }

    return { imported, skipped, total: this.leads.length };
  }

  public resetToSample(): void {
    this.leads = JSON.parse(JSON.stringify(INITIAL_SEEDS));
    this.saveToDisk();
  }

  public getStats(): DashboardStats {
    const totalLeads = this.leads.length;
    let newLeads = 0;
    let contactedLeads = 0;
    let qualifiedLeads = 0;
    let inDiscussionLeads = 0;
    let nurturingLeads = 0;
    let unqualifiedLeads = 0;

    const statusBreakdown: Record<LeadStatus, number> = {
      'New': 0,
      'Contacted': 0,
      'In Discussion': 0,
      'Qualified': 0,
      'Nurturing': 0,
      'Unqualified': 0
    };

    const connectionBreakdown: Record<string, number> = {
      '1st': 0,
      '2nd': 0,
      '3rd+': 0,
      'InMail': 0,
      'Connected': 0
    };

    for (const lead of this.leads) {
      if (lead.status === 'New') newLeads++;
      else if (lead.status === 'Contacted') contactedLeads++;
      else if (lead.status === 'Qualified') qualifiedLeads++;
      else if (lead.status === 'In Discussion') inDiscussionLeads++;
      else if (lead.status === 'Nurturing') nurturingLeads++;
      else if (lead.status === 'Unqualified') unqualifiedLeads++;

      if (statusBreakdown[lead.status] !== undefined) {
        statusBreakdown[lead.status]++;
      }

      const deg = lead.connectionDegree || '2nd';
      connectionBreakdown[deg] = (connectionBreakdown[deg] || 0) + 1;
    }

    const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      inDiscussionLeads,
      nurturingLeads,
      unqualifiedLeads,
      conversionRate,
      statusBreakdown,
      connectionBreakdown
    };
  }

  private calculateLeadScore(lead: Partial<LinkedInLead>): number {
    let score = 50;
    const title = (lead.jobTitle || '').toLowerCase();
    if (title.includes('ceo') || title.includes('founder') || title.includes('president') || title.includes('chief') || title.includes('vp') || title.includes('head') || title.includes('director')) {
      score += 25;
    } else if (title.includes('manager') || title.includes('lead')) {
      score += 15;
    }

    if (lead.email) score += 10;
    if (lead.phone) score += 5;
    if (lead.connectionDegree === '1st') score += 10;
    else if (lead.connectionDegree === '2nd') score += 5;

    return Math.min(score, 99);
  }
}

export const leadsStore = new LeadsStore();
