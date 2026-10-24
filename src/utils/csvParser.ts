import type { LinkedInLead, LeadStatus, ConnectionDegree } from '../types/lead.ts';
import { getDeterministicAvatar } from './avatar.ts';

// Robust CSV parser supporting quotes, commas, multiline values
export function parseCSV(csvText: string): Array<Record<string, string>> {
  const lines: string[][] = [];
  let row: string[] = [];
  let currentVal = '';
  let insideQuotes = false;

  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if (char === '\n' && !insideQuotes) {
      row.push(currentVal.trim());
      if (row.length > 0 && row.some(cell => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    if (row.some(cell => cell.length > 0)) {
      lines.push(row);
    }
  }

  if (lines.length === 0) return [];

  const headers = lines[0].map(h => h.trim().toLowerCase().replace(/[\s_-]+/g, ''));
  const rawHeaders = lines[0].map(h => h.trim());
  const records: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const record: Record<string, string> = {};
    for (let j = 0; j < rawHeaders.length; j++) {
      const headerKey = rawHeaders[j];
      record[headerKey] = line[j] !== undefined ? line[j] : '';
    }
    records.push(record);
  }

  return records;
}

// Map parsed CSV records to LinkedInLead objects
export function mapCsvRecordsToLeads(records: Array<Record<string, string>>): Partial<LinkedInLead>[] {
  return records.map(record => {
    const keys = Object.keys(record);

    const findVal = (possibleKeys: string[]) => {
      const cleanPossible = possibleKeys.map(k => k.toLowerCase().replace(/[\s_-]+/g, ''));
      for (const k of keys) {
        const cleanK = k.toLowerCase().replace(/[\s_-]+/g, '');
        if (cleanPossible.includes(cleanK)) {
          return record[k]?.trim();
        }
      }
      return undefined;
    };

    // Name detection
    let fullName = findVal(['full name', 'fullname', 'name', 'prospect name', 'lead name', 'contact name']);
    if (!fullName) {
      const first = findVal(['first name', 'firstname', 'given name']) || '';
      const last = findVal(['last name', 'lastname', 'surname', 'family name']) || '';
      if (first || last) {
        fullName = `${first} ${last}`.trim();
      }
    }

    const jobTitle = findVal(['job title', 'title', 'role', 'position', 'occupation', 'headline']) || 'Prospect';
    const company = findVal(['company', 'company name', 'organization', 'account', 'employer']) || 'Independent';
    let linkedinUrl = findVal(['linkedin url', 'linkedin', 'profile url', 'person linkedin url', 'linkedin profile']) || '';
    if (linkedinUrl && !linkedinUrl.startsWith('http')) {
      linkedinUrl = `https://${linkedinUrl}`;
    }

    const email = findVal(['email', 'work email', 'corporate email', 'email address', 'contact email']) || undefined;
    const phone = findVal(['phone', 'phone number', 'mobile', 'telephone', 'direct phone']) || undefined;
    const location = findVal(['location', 'city', 'country', 'region', 'state', 'metro area']) || 'Remote';
    const industry = findVal(['industry', 'sector', 'vertical', 'business']) || 'Technology';
    
    // Status normalization
    const rawStatus = (findVal(['status', 'lead status', 'stage', 'pipeline stage']) || 'New').toLowerCase();
    let status: LeadStatus = 'New';
    if (rawStatus.includes('qualif')) status = 'Qualified';
    else if (rawStatus.includes('discuss') || rawStatus.includes('meeting')) status = 'In Discussion';
    else if (rawStatus.includes('contact') || rawStatus.includes('sent')) status = 'Contacted';
    else if (rawStatus.includes('nurtur') || rawStatus.includes('hold')) status = 'Nurturing';
    else if (rawStatus.includes('unqual') || rawStatus.includes('disqual') || rawStatus.includes('lost')) status = 'Unqualified';

    // Connection degree normalization
    const rawConn = (findVal(['connection', 'connection degree', 'degree', 'network']) || '2nd').toLowerCase();
    let connectionDegree: ConnectionDegree = '2nd';
    if (rawConn.includes('1')) connectionDegree = '1st';
    else if (rawConn.includes('3')) connectionDegree = '3rd+';
    else if (rawConn.includes('inmail')) connectionDegree = 'InMail';
    else if (rawConn.includes('connect')) connectionDegree = 'Connected';

    // Tags
    const rawTags = findVal(['tags', 'tag', 'categories', 'segment', 'labels']) || '';
    const tags = rawTags
      ? rawTags.split(/[;,]/).map(t => t.trim()).filter(Boolean)
      : ['CSV Import'];

    // Notes
    const notesSummary = findVal(['notes', 'note', 'summary', 'description', 'comments']) || 'Imported via CSV prospect dataset.';

    // Avatar detection or deterministic fallback
    const rawAvatar = findVal(['avatar', 'avatar url', 'photo', 'picture', 'headshot', 'profile photo', 'image']);
    const finalName = fullName || 'Unnamed Lead';

    return {
      fullName: finalName,
      jobTitle,
      company,
      linkedinUrl: linkedinUrl || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(finalName)}`,
      avatarUrl: rawAvatar || getDeterministicAvatar(finalName, jobTitle),
      email,
      phone,
      location,
      industry,
      status,
      connectionDegree,
      tags,
      notesSummary
    };
  });
}

// Generate sample CSV text for 1-click test import
export function getSampleLinkedInCsv(): string {
  return `"Full Name","Job Title","Company","LinkedIn URL","Email","Phone","Location","Industry","Status","Connection Degree","Tags","Notes"
"Danielle Moreau","VP of Product Design","Stripe","https://www.linkedin.com/in/danielle-moreau-design","dmoreau@stripe.com","+1 (415) 330-1928","San Francisco, CA","Financial Services","New","2nd","Fintech; Design Leader","Liked our case study on frictionless checkout interfaces."
"Carlos Mendoza","Head of Enterprise Architecture","Snowflake","https://www.linkedin.com/in/carlos-mendoza-data","carlos.m@snowflake.com","+1 (650) 492-8819","San Mateo, CA","Data Warehousing","Contacted","1st","Cloud; Decision Maker","Sent InMail follow up after BigData NYC conference."
"Aisha Bello","Chief Information Security Officer","Zenith Health","https://www.linkedin.com/in/aisha-bello-ciso","a.bello@zenithhealth.org","+1 (212) 809-4411","New York, NY","Health Tech","Qualified","2nd","HIPAA; High Value","Needs enterprise security questionnaire validated before pilot."
"Jonas Lindqvist","Director of Inbound Growth","Spotify","https://www.linkedin.com/in/jonas-lindqvist-growth","jonas.l@spotify.com","+46 8 500 1200","Stockholm, Sweden","Media & Audio","In Discussion","1st","Growth; International","Looking for automated outreach sequencing for Nordic sales."
"Kavita Raman","Senior Director of Global Procurement","Cisco","https://www.linkedin.com/in/kavita-raman-procurement","kraman@cisco.com","+1 (408) 526-4000","San Jose, CA","Telecommunications","Nurturing","3rd+","Enterprise; Multi-Seat","Budget locked until next fiscal quarter; follow up in December."`;
}
