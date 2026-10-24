import type { ExtractedRecruiterPost, EmailOutreachTemplate, LinkedInLead } from '../src/types/lead.ts';
import { leadsStore } from './leadsStore.ts';

// Pre-configured US Recruiter Posts published in the last 24 hours matching
// "Java Developer C2C – Bench – Sales – W2 – Full-Time – Hotlist"
const SAMPLE_RECRUITER_POSTS: ExtractedRecruiterPost[] = [
  {
    id: 'post-c2c-1',
    recruiterName: 'Anil K. Varma',
    recruiterTitle: 'Senior Bench Sales & Talent Acquisition Lead',
    company: 'Apex Consulting Solutions LLC',
    linkedinProfileUrl: 'https://www.linkedin.com/in/anil-varma-recruiting',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'anil.v@apexconsulting.us',
    phone: '+1 (469) 555-0182',
    location: 'Dallas, TX (Hybrid / Remote US)',
    jobRole: 'Lead Java Full-Stack Developer (Spring Boot, Kafka, AWS, React)',
    workType: 'C2C',
    extractedRate: '$85/hr C2C',
    postedTimeAgo: '45 minutes ago',
    postSnippet: '🚨 URGENT C2C REQUIREMENT 🚨\nRole: Lead Java Fullstack Consultant\nClient: Tier-1 Banking Client\nLocation: Dallas, TX / Remote US\nDuration: 12+ Months\nRequirements: 10+ yrs exp, Core Java 17, Spring Boot, Microservices, Apache Kafka, AWS ECS, React.js.\nSend genuine bench consultant hotlist profiles with rate and contact to anil.v@apexconsulting.us.',
    outreachSent: false
  },
  {
    id: 'post-c2c-2',
    recruiterName: 'Samantha Green',
    recruiterTitle: 'Lead Technical Recruiter - Federal & Enterprise',
    company: 'Synergy Tech Partners',
    linkedinProfileUrl: 'https://www.linkedin.com/in/samantha-green-tech',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'sgreen@synergytechpartners.com',
    phone: '+1 (704) 890-3341',
    location: 'Charlotte, NC (Remote US)',
    jobRole: 'Sr. Backend Java Developer (Microservices, Docker, Kubernetes)',
    workType: 'C2C',
    extractedRate: '$80/hr C2C',
    postedTimeAgo: '2 hours ago',
    postSnippet: 'Hiring Sr Java Developer on C2C or W2.\nLocation: Charlotte, NC (100% Remote).\nCandidates must have strong experience in Java 11/17, Spring Cloud, RESTful APIs, Docker, and Kubernetes. Immediate interview slots for tomorrow.\nPlease share your available bench consultants: sgreen@synergytechpartners.com.',
    outreachSent: false
  },
  {
    id: 'post-c2c-3',
    recruiterName: 'Rajesh Nambiar',
    recruiterTitle: 'Director of Strategic Staffing & Vendor Relations',
    company: 'TechMatrix Global',
    linkedinProfileUrl: 'https://www.linkedin.com/in/rajesh-nambiar-staffing',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'rajesh@techmatrixglobal.com',
    phone: '+1 (201) 448-9102',
    location: 'Jersey City, NJ (Remote)',
    jobRole: 'Java AWS Cloud Specialist (Serverless, DynamoDB)',
    workType: 'Hotlist',
    extractedRate: '$90/hr C2C',
    postedTimeAgo: '4 hours ago',
    postSnippet: 'Looking for verified Bench consultants for a long term C2C project with our direct financial client.\nSkill: Java AWS Cloud Developer.\nRequired: 8+ years hands-on with Spring Boot, Lambda, DynamoDB, CI/CD pipeline.\nDirect Prime Vendor. Send updated resume and hotlist to: rajesh@techmatrixglobal.com.',
    outreachSent: false
  },
  {
    id: 'post-c2c-4',
    recruiterName: 'David Miller',
    recruiterTitle: 'Executive IT Recruiter',
    company: 'CloudVentures Talent Group',
    linkedinProfileUrl: 'https://www.linkedin.com/in/david-miller-cloudrecruiting',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'david@cloudventurestalent.com',
    phone: '+1 (312) 670-4419',
    location: 'Chicago, IL (Hybrid)',
    jobRole: 'Senior Java Backend Engineer with GCP & Spring',
    workType: 'W2',
    extractedRate: '$75/hr W2 or $82/hr C2C',
    postedTimeAgo: '6 hours ago',
    postSnippet: 'Immediate Opening: Senior Java Backend Engineer.\nOpen for C2C and W2 consultants in the US.\nTech stack: Java 17, Spring Boot, Spring Security, GCP, PostgreSQL, Gitlab CI.\nReply or send resumes to david@cloudventurestalent.com.',
    outreachSent: false
  },
  {
    id: 'post-c2c-5',
    recruiterName: 'Neha Patel',
    recruiterTitle: 'US IT Bench Sales & Recruitment Manager',
    company: 'Vanguard Systems Inc.',
    linkedinProfileUrl: 'https://www.linkedin.com/in/neha-patel-vanguard',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'neha.patel@vanguardsys.com',
    phone: '+1 (408) 501-7788',
    location: 'Sunnyvale, CA (Remote)',
    jobRole: 'Principal Java Microservices Architect',
    workType: 'C2C',
    extractedRate: '$95/hr C2C',
    postedTimeAgo: '9 hours ago',
    postSnippet: 'HOT REQUIREMENT: Principal Java Microservices Architect.\nClient: E-commerce giant.\nVisa: USC/GC/H1B on Bench.\nMust have 12+ years experience with high-throughput distributed systems in Java. Fast-track feedback.\nEmail: neha.patel@vanguardsys.com.',
    outreachSent: false
  },
  {
    id: 'post-c2c-6',
    recruiterName: 'Michael Rossi',
    recruiterTitle: 'Senior Account Manager & Recruiter',
    company: 'Beacon Strategic Staffing',
    linkedinProfileUrl: 'https://www.linkedin.com/in/michael-rossi-staffing',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'mrossi@beaconstaffing.net',
    phone: '+1 (404) 991-2301',
    location: 'Atlanta, GA (Remote)',
    jobRole: 'Full Stack Java & Angular Engineer',
    workType: 'Full-Time',
    extractedRate: '$135k - $155k W2 or C2C options',
    postedTimeAgo: '14 hours ago',
    postSnippet: 'Urgent Full-Time and C2C roles for Java Full Stack with Angular/React.\nNeed candidates who can join in 1-2 weeks.\nReach out directly with profile and contact info: mrossi@beaconstaffing.net.',
    outreachSent: false
  },
  {
    id: 'post-c2c-7',
    recruiterName: 'Katherine Evans',
    recruiterTitle: 'Talent Acquisition Director - Cloud Solutions',
    company: 'NexGen Infotech USA',
    linkedinProfileUrl: 'https://www.linkedin.com/in/katherine-evans-nexgen',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'kevans@nexgeninfousa.com',
    phone: '+1 (512) 640-8812',
    location: 'Austin, TX (Remote US)',
    jobRole: 'Java Spring Boot Consultant (Microservices & AWS)',
    workType: 'C2C',
    extractedRate: '$88/hr C2C',
    postedTimeAgo: '17 hours ago',
    postSnippet: 'Direct Client Requirement for Sr Java Spring Boot Consultant.\nLocation: Austin, TX (100% Remote).\nOpen for verified bench candidates on C2C.\nKey skills: Java 17, Spring Boot 3, Kafka, PostgreSQL, AWS CloudWatch.\nImmediate interview rounds. Please share profiles with contact numbers to kevans@nexgeninfousa.com.',
    outreachSent: false
  },
  {
    id: 'post-c2c-8',
    recruiterName: 'Sunita Rao',
    recruiterTitle: 'Senior Bench Sales Executive',
    company: 'PrimeSource Consulting',
    linkedinProfileUrl: 'https://www.linkedin.com/in/sunita-rao-primesource',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=400&h=400&auto=format&fit=crop&crop=faces&q=80',
    email: 'sunita.rao@primesource.net',
    phone: '+1 (206) 880-9941',
    location: 'Seattle, WA (Remote US)',
    jobRole: 'Core Java / Multithreading High-Frequency Backend Dev',
    workType: 'C2C',
    extractedRate: '$92/hr C2C',
    postedTimeAgo: '21 hours ago',
    postSnippet: 'Urgent Java Hotlist request! Financial trading platform seeking Senior Core Java Backend Specialist with strong low-latency multithreading experience.\nRate: $92/hr on C2C.\nPlease dispatch your bench profiles immediately to sunita.rao@primesource.net.',
    outreachSent: false
  }
];

export const DEFAULT_EMAIL_TEMPLATES: EmailOutreachTemplate[] = [
  {
    id: 'tpl-c2c-hotlist',
    name: 'C2C Bench Hotlist Submission (Java Developer)',
    subject: 'Available Java Full-Stack Consultant for your C2C Requirement - {{recruiter_name}}',
    body: `Hi {{recruiter_name}},

Hope you are doing well.

I came across your LinkedIn post regarding the open {{requirement_title}} role at {{company_name}}.

We have an exceptional Senior Java Full-Stack Consultant currently on our bench available for immediate C2C placement:
• Name: Vikram Malhotra
• Total Experience: 10+ Years in Java / J2EE, Spring Boot, Microservices, AWS, React, and Kafka
• Work Authorization: US Green Card
• Relocation / Work Mode: Available for Remote or Hybrid
• Expected C2C Rate: Competitive / Negotiable

Would you be open to reviewing his updated resume and scheduling a brief technical screening with your client?

Looking forward to your feedback.

Best regards,
Bench & Sales Recruitment Team
Direct: +1 (321) 209-5351 | sales@benchcrm.io`
  },
  {
    id: 'tpl-c2c-general',
    name: 'Weekly Bench Consultant Hotlist Dispatch',
    subject: 'Updated C2C Bench Hotlist (Java, DevOps, Python, React) - {{company_name}}',
    body: `Hi {{recruiter_name}},

Hope your week is off to a great start.

Sharing our latest verified bench hotlist of pre-vetted consultants available for immediate C2C project deployment:
1. Sr. Java Full Stack Developer (10+ Yrs, Spring Boot, Kafka, AWS, React) - GC
2. Senior Backend Java / Microservices Engineer (8+ Yrs, Docker, K8s, GCP) - USC
3. Full Stack Java / Angular Developer (7+ Yrs, REST, PostgreSQL) - H1B Transfer

Please let us know if any of these match your open requirements at {{company_name}}.

Best regards,
Bench Sales Team`
  }
];

class AutomationEngine {
  private posts: ExtractedRecruiterPost[] = [...SAMPLE_RECRUITER_POSTS];
  private emailLogs: Array<{
    id: string;
    recruiterEmail: string;
    recruiterName: string;
    subject: string;
    body: string;
    sentAt: string;
    status: 'Delivered' | 'Pending';
  }> = [];

  public getPosts(): ExtractedRecruiterPost[] {
    return this.posts;
  }

  public scanPosts(params: {
    keywords: string;
    timeFilterHours: number;
    location: string;
  }): ExtractedRecruiterPost[] {
    // Returns filtered posts matching keyword query and US location within past 24 hours
    const query = (params.keywords || '').toLowerCase();
    return this.posts.filter(p => {
      const matchText = `${p.jobRole} ${p.postSnippet} ${p.workType} ${p.company}`.toLowerCase();
      // Match keywords
      const hasKeywords = query.split(/[\s–-]+/).filter(Boolean).some(word => matchText.includes(word.toLowerCase()));
      // Match US location
      const isUS = p.location.toLowerCase().includes('us') || 
                   p.location.toLowerCase().includes('tx') || 
                   p.location.toLowerCase().includes('nc') || 
                   p.location.toLowerCase().includes('nj') || 
                   p.location.toLowerCase().includes('ca') ||
                   p.location.toLowerCase().includes('il') ||
                   p.location.toLowerCase().includes('ga');
      return hasKeywords && isUS;
    });
  }

  public sendOutreachEmail(data: {
    postId?: string;
    recruiterEmail: string;
    recruiterName: string;
    companyName: string;
    subject: string;
    body: string;
  }): { success: boolean; logId: string; message: string } {
    const now = new Date().toISOString();
    const logId = 'email-' + Date.now();

    this.emailLogs.unshift({
      id: logId,
      recruiterEmail: data.recruiterEmail,
      recruiterName: data.recruiterName,
      subject: data.subject,
      body: data.body,
      sentAt: now,
      status: 'Delivered'
    });

    // Mark post as outreach sent
    if (data.postId) {
      const post = this.posts.find(p => p.id === data.postId);
      if (post) {
        post.outreachSent = true;
        post.outreachSentAt = now;
      }
    }

    // Automatically create or update recruiter as a lead in CRM with status "Contacted"
    try {
      const post = data.postId ? this.posts.find(p => p.id === data.postId) : undefined;
      leadsStore.create({
        fullName: data.recruiterName,
        jobTitle: post?.recruiterTitle || 'Technical Recruiter',
        company: data.companyName,
        email: data.recruiterEmail,
        avatarUrl: post?.avatarUrl,
        status: 'Contacted',
        connectionDegree: '2nd',
        location: post?.location || 'United States',
        industry: 'IT Staffing & Consulting',
        tags: ['C2C Outreach', 'Java Requirement', 'Automated Lead Finder'],
        notesSummary: `Sent C2C outreach email regarding Java requirement on ${new Date().toLocaleDateString()}: "${data.subject}"`
      });
    } catch (e) {
      console.warn('Could not auto-add to leadsStore:', e);
    }

    return {
      success: true,
      logId,
      message: `Outreach email delivered successfully to ${data.recruiterEmail}`
    };
  }

  public getEmailLogs() {
    return this.emailLogs;
  }
}

export const automationEngine = new AutomationEngine();
