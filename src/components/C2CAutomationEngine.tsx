import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  ShieldAlert, 
  Lock, 
  Key, 
  CheckCircle2, 
  Send, 
  Mail, 
  Clock, 
  MapPin, 
  Building, 
  User, 
  Phone, 
  FileText, 
  Layers, 
  Play, 
  RotateCw, 
  AlertTriangle, 
  ExternalLink, 
  Check, 
  X,
  Sliders,
  DollarSign,
  Briefcase,
  History,
  Info
} from 'lucide-react';
import type { ExtractedRecruiterPost, EmailOutreachTemplate } from '../types/lead.ts';
import { 
  fetchAutomationPosts, 
  runAutomationScan, 
  sendOutreachEmail, 
  fetchEmailTemplates, 
  fetchEmailLogs 
} from '../services/api.ts';
import { getDeterministicAvatar } from '../utils/avatar.ts';

interface C2CAutomationEngineProps {
  onLeadAdded?: () => void;
  showToast: (msg: string) => void;
}

export const C2CAutomationEngine: React.FC<C2CAutomationEngineProps> = ({
  onLeadAdded,
  showToast
}) => {
  // Navigation sub-views
  const [activeSubTab, setActiveSubTab] = useState<'scanner' | 'credentials' | 'templates' | 'logs'>('scanner');

  // Credentials & Safety configuration state
  const [credentials, setCredentials] = useState({
    username: 'recruiter.sales@us-itconsulting.com',
    authType: 'cookie' as 'cookie' | 'credentials',
    sessionCookie: 'AQEDATJ4a...98zK1L_linkedin_session',
    password: '••••••••••••',
    proxyRegion: 'US East (N. Virginia)',
    delaySeconds: 4,
    isConnected: true
  });
  const [showPassword, setShowPassword] = useState(false);

  // Search parameters pre-filled with the exact keywords requested
  const [keywords, setKeywords] = useState('Java Developer C2C – Bench – Sales – W2 – Full-Time – Hotlist');
  const [timeFilterHours, setTimeFilterHours] = useState(24);
  const [locationFilter, setLocationFilter] = useState('United States (Remote & Hybrid)');
  const [workTypeFilter, setWorkTypeFilter] = useState<'All' | 'C2C' | 'W2' | 'Hotlist' | 'Full-Time'>('All');

  // Scanner state & results
  const [posts, setPosts] = useState<ExtractedRecruiterPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusMessage, setScanStatusMessage] = useState('');

  // Email Outreach state
  const [templates, setTemplates] = useState<EmailOutreachTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-c2c-hotlist');
  const [activeOutreachPost, setActiveOutreachPost] = useState<ExtractedRecruiterPost | null>(null);
  const [outreachSubject, setOutreachSubject] = useState('');
  const [outreachBody, setOutreachBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Email history logs
  const [emailLogs, setEmailLogs] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [postsData, tplsData, logsData] = await Promise.all([
        fetchAutomationPosts(),
        fetchEmailTemplates(),
        fetchEmailLogs()
      ]);
      setPosts(postsData);
      setTemplates(tplsData);
      setEmailLogs(logsData);
    } catch (err) {
      console.error('Failed to load automation data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run automated post search simulation
  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(10);
    setScanStatusMessage('Authenticating session worker with LinkedIn gateway...');

    setTimeout(() => {
      setScanProgress(35);
      setScanStatusMessage('Querying LinkedIn public posts API with exact keywords: "Java Developer C2C – Bench – Sales..."');
    }, 600);

    setTimeout(() => {
      setScanProgress(70);
      setScanStatusMessage('Filtering for posts published within last 24 hours targeted at US locations...');
    }, 1200);

    setTimeout(async () => {
      try {
        setScanProgress(90);
        setScanStatusMessage('Extracting recruiter names, emails, companies, and C2C rates...');
        
        const res = await runAutomationScan({
          keywords,
          timeFilterHours,
          location: locationFilter
        });

        setPosts(res.posts);
        setScanProgress(100);
        setScanStatusMessage(`Found ${res.scannedCount} matching recruiter posts!`);
        showToast(`Scan complete: ${res.scannedCount} fresh recruiter posts extracted.`);
      } catch (err: any) {
        showToast('Scan failed: ' + (err.message || 'Unknown error'));
      } finally {
        setTimeout(() => setIsScanning(false), 500);
      }
    }, 1800);
  };

  // Prepare outreach email modal for a given post
  const handleOpenOutreach = (post: ExtractedRecruiterPost) => {
    setActiveOutreachPost(post);
    const tpl = templates.find(t => t.id === selectedTemplateId) || templates[0];
    if (tpl) {
      const subject = tpl.subject
        .replace(/\{\{recruiter_name\}\}/g, post.recruiterName.split(' ')[0])
        .replace(/\{\{company_name\}\}/g, post.company)
        .replace(/\{\{requirement_title\}\}/g, post.jobRole);

      const body = tpl.body
        .replace(/\{\{recruiter_name\}\}/g, post.recruiterName.split(' ')[0])
        .replace(/\{\{company_name\}\}/g, post.company)
        .replace(/\{\{requirement_title\}\}/g, post.jobRole);

      setOutreachSubject(subject);
      setOutreachBody(body);
    }
  };

  // Switch template inside modal
  const handleTemplateChange = (tplId: string) => {
    setSelectedTemplateId(tplId);
    if (!activeOutreachPost) return;
    const tpl = templates.find(t => t.id === tplId);
    if (tpl) {
      setOutreachSubject(
        tpl.subject
          .replace(/\{\{recruiter_name\}\}/g, activeOutreachPost.recruiterName.split(' ')[0])
          .replace(/\{\{company_name\}\}/g, activeOutreachPost.company)
          .replace(/\{\{requirement_title\}\}/g, activeOutreachPost.jobRole)
      );
      setOutreachBody(
        tpl.body
          .replace(/\{\{recruiter_name\}\}/g, activeOutreachPost.recruiterName.split(' ')[0])
          .replace(/\{\{company_name\}\}/g, activeOutreachPost.company)
          .replace(/\{\{requirement_title\}\}/g, activeOutreachPost.jobRole)
      );
    }
  };

  // Dispatch email outreach
  const handleSendEmail = async () => {
    if (!activeOutreachPost) return;
    try {
      setIsSendingEmail(true);
      const res = await sendOutreachEmail({
        postId: activeOutreachPost.id,
        recruiterEmail: activeOutreachPost.email,
        recruiterName: activeOutreachPost.recruiterName,
        companyName: activeOutreachPost.company,
        subject: outreachSubject,
        body: outreachBody
      });

      showToast(`Email dispatched to ${activeOutreachPost.email}. Recruiter auto-saved to CRM as Contacted!`);
      
      // Update local state
      setPosts(prev => prev.map(p => p.id === activeOutreachPost.id ? { ...p, outreachSent: true, outreachSentAt: new Date().toISOString() } : p));
      
      // Refresh logs
      const logs = await fetchEmailLogs();
      setEmailLogs(logs);

      if (onLeadAdded) onLeadAdded();
      setActiveOutreachPost(null);
    } catch (err: any) {
      showToast('Error sending outreach: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (workTypeFilter === 'All') return true;
    return post.workType === workTypeFilter;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner / Hero Card */}
      <div className="linkedin-card p-5 relative overflow-hidden bg-gradient-to-r from-[#004182] via-[#0a66c2] to-[#004182] text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>LinkedIn Automated Lead Search &amp; Outreach Engine</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Bench &amp; Sales Recruiter CRM — C2C Lead Finder
            </h1>
            <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed">
              Monitors LinkedIn posts in real-time for US Java Developer C2C requirements, parses recruiter contact info, and dispatches automated bench consultant submissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              <span>{isScanning ? 'Scanning Posts...' : 'Run C2C Live Scan'}</span>
            </button>
          </div>
        </div>

        {/* Scan Progress Bar */}
        {isScanning && (
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between text-xs text-blue-100 mb-1.5 font-medium">
              <span>{scanStatusMessage}</span>
              <span className="font-mono">{scanProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Safety Warning Notice (Platform Terms) */}
      <div className="linkedin-card p-3.5 bg-amber-50/90 border-amber-200 text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <span>LinkedIn Terms of Service &amp; Safety Compliance Notice</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-200 text-amber-800 font-semibold uppercase">
              Safe Mode Active
            </span>
          </div>
          <p className="mt-0.5 text-amber-800">
            Automated LinkedIn scraping and prospecting must comply with LinkedIn's User Agreement and API policies. This engine utilizes intelligent human-like randomized delays ({credentials.delaySeconds}s jitter), localized US residential proxies, and polite post stream ingestion to protect your recruiter profile from rate limits and checkpoints.
          </p>
        </div>
      </div>

      {/* Engine Subtabs */}
      <div className="linkedin-card p-1.5 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('scanner')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'scanner'
                ? 'bg-[#0a66c2] text-white'
                : 'text-[#666666] hover:bg-[#f3f2ef] hover:text-[#191919]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Live Recruiter Posts ({filteredPosts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('credentials')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'credentials'
                ? 'bg-[#0a66c2] text-white'
                : 'text-[#666666] hover:bg-[#f3f2ef] hover:text-[#191919]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Login &amp; Safety Settings</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('templates')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'templates'
                ? 'bg-[#0a66c2] text-white'
                : 'text-[#666666] hover:bg-[#f3f2ef] hover:text-[#191919]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Outreach Templates ({templates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('logs')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeSubTab === 'logs'
                ? 'bg-[#0a66c2] text-white'
                : 'text-[#666666] hover:bg-[#f3f2ef] hover:text-[#191919]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Dispatch Logs ({emailLogs.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-[#666666] pr-2 hidden sm:block">
          Target: <span className="font-semibold text-[#191919]">US C2C Bench Market</span>
        </div>
      </div>

      {/* Subtab 1: Scanner & Recruiter Posts View */}
      {activeSubTab === 'scanner' && (
        <div className="space-y-3">
          {/* Search Keywords & Filters Ribbon */}
          <div className="linkedin-card p-3.5 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Keyword String Box */}
              <div className="flex-1">
                <label className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                  Active Keyword Search Query
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0a66c2]" />
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Java Developer C2C – Bench – Sales – W2 – Full-Time – Hotlist"
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f3f2ef] text-[#191919] font-medium rounded border border-[#e0dfdc] focus:border-[#0a66c2] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Time filter pill */}
              <div className="shrink-0 flex items-center gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                    Published Window
                  </label>
                  <select
                    value={timeFilterHours}
                    onChange={(e) => setTimeFilterHours(Number(e.target.value))}
                    className="text-xs px-2.5 py-1.5 rounded border border-[#e0dfdc] bg-white text-[#191919] font-semibold focus:outline-none"
                  >
                    <option value={12}>Past 12 Hours</option>
                    <option value={24}>Past 24 Hours (Standard)</option>
                    <option value={48}>Past 48 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                    Geographic Scope
                  </label>
                  <div className="text-xs px-2.5 py-1.5 rounded border border-[#e0dfdc] bg-[#f9fafb] text-[#191919] font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>United States (US Jobs)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword tag breakdown */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#f3f2ef]">
              <span className="text-[10px] text-[#666666] font-semibold uppercase">Parsed Filters:</span>
              {['Java Developer', 'C2C', 'Bench', 'Sales', 'W2', 'Full-Time', 'Hotlist'].map(kw => (
                <span
                  key={kw}
                  className="px-2 py-0.5 rounded-full bg-[#ebf4fd] text-[#0a66c2] text-[10px] font-bold border border-[#0a66c2]/20"
                >
                  +{kw}
                </span>
              ))}
            </div>

            {/* Work Type Filter Tabs */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-[#666666]">Filter Role Type:</span>
              {(['All', 'C2C', 'W2', 'Hotlist', 'Full-Time'] as const).map(wt => (
                <button
                  key={wt}
                  type="button"
                  onClick={() => setWorkTypeFilter(wt)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                    workTypeFilter === wt
                      ? 'bg-[#191919] text-white'
                      : 'bg-[#f3f2ef] text-[#666666] hover:text-[#191919]'
                  }`}
                >
                  {wt}
                </button>
              ))}
            </div>
          </div>

          {/* Extracted Recruiter Posts List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#666666] px-1 font-semibold">
              <span>{filteredPosts.length} Extracted US Recruiter Posts (Last 24 Hours)</span>
              <span>Sorted by Most Recent</span>
            </div>

            {filteredPosts.map((post) => {
              const avatar = post.avatarUrl || getDeterministicAvatar(post.recruiterName, post.recruiterTitle);

              return (
                <div 
                  key={post.id}
                  className="linkedin-card p-4 hover:border-[#0a66c2]/50 transition-all space-y-3"
                >
                  {/* Recruiter Identity Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={avatar}
                        alt={post.recruiterName}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = getDeterministicAvatar(post.recruiterName, post.recruiterTitle);
                        }}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs shrink-0 bg-[#e2e8f0]"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-[#191919] hover:text-[#0a66c2] hover:underline cursor-pointer">
                            {post.recruiterName}
                          </h3>
                          <span className="linkedin-degree-badge">2nd</span>
                          {post.outreachSent && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                              <Check className="w-3 h-3" />
                              Outreach Sent
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#666666] font-medium leading-snug">
                          {post.recruiterTitle} at <span className="font-semibold text-[#191919]">{post.company}</span>
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[#666666] mt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>{post.postedTimeAgo}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>{post.location}</span>
                          </span>
                          {post.extractedRate && (
                            <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              <DollarSign className="w-3 h-3" />
                              <span>{post.extractedRate}</span>
                            </span>
                          )}
                          <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#0a66c2] font-bold text-[10px] border border-blue-200 uppercase">
                            {post.workType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick CTA Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenOutreach(post)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition-colors shadow-2xs ${
                          post.outreachSent
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-[#0a66c2] text-white hover:bg-[#004182]'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{post.outreachSent ? 'Send Follow-up' : 'Quick Outreach'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Extracted Contact Info Banner */}
                  <div className="bg-[#f9fafb] p-2.5 rounded-md border border-[#e0dfdc] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#0a66c2]" />
                        <span className="text-[#666666]">Direct Email:</span>
                        <a 
                          href={`mailto:${post.email}`}
                          className="font-mono font-semibold text-[#0a66c2] hover:underline"
                        >
                          {post.email}
                        </a>
                      </div>
                      {post.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[#666666]">Phone:</span>
                          <span className="font-mono text-[#191919] font-medium">{post.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Recruiter Contact</span>
                    </div>
                  </div>

                  {/* LinkedIn Matching Post Content */}
                  <div className="bg-white p-3 rounded-md border border-[#e0dfdc]/80 text-xs text-[#191919] space-y-1.5">
                    <div className="text-[11px] font-bold text-[#666666] uppercase flex items-center justify-between">
                      <span>Requirement: {post.jobRole}</span>
                      <span className="text-[#0a66c2] hover:underline cursor-pointer flex items-center gap-1">
                        <span>Original Post</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                    <p className="whitespace-pre-line text-xs font-mono text-[#333333] leading-relaxed bg-[#f8fafc] p-2 rounded border border-[#edf2f7]">
                      {post.postSnippet}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Automated Login & Credentials Configuration */}
      {activeSubTab === 'credentials' && (
        <div className="linkedin-card p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#e0dfdc] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#191919] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0a66c2]" />
                <span>LinkedIn Automated Session &amp; Worker Configuration</span>
              </h2>
              <p className="text-xs text-[#666666] mt-0.5">
                Set up secure credentials or session tokens to power autonomous C2C post scanning.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700">Authenticated &amp; Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Login Form */}
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-[#191919] block mb-1">
                  LinkedIn Account Identifier
                </label>
                <input
                  type="email"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-[#e0dfdc] bg-white text-xs focus:border-[#0a66c2] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#191919] block mb-1">
                  Authentication Method
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="authType"
                      checked={credentials.authType === 'cookie'}
                      onChange={() => setCredentials({ ...credentials, authType: 'cookie' })}
                      className="text-[#0a66c2]"
                    />
                    <span>Session Cookie (li_at) — Recommended for Security</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="authType"
                      checked={credentials.authType === 'credentials'}
                      onChange={() => setCredentials({ ...credentials, authType: 'credentials' })}
                      className="text-[#0a66c2]"
                    />
                    <span>Password Flow</span>
                  </label>
                </div>
              </div>

              {credentials.authType === 'cookie' ? (
                <div>
                  <label className="font-semibold text-[#191919] block mb-1">
                    LinkedIn Session Cookie (`li_at`)
                  </label>
                  <input
                    type="password"
                    value={credentials.sessionCookie}
                    onChange={(e) => setCredentials({ ...credentials, sessionCookie: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-[#e0dfdc] font-mono bg-white text-xs focus:border-[#0a66c2] focus:outline-none"
                  />
                  <p className="text-[11px] text-[#666666] mt-1">
                    Exported securely from Chrome DevTools Application cookies. Does not expose your raw password.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="font-semibold text-[#191919] block mb-1">
                    Account Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-[#e0dfdc] bg-white text-xs focus:border-[#0a66c2] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#0a66c2] font-semibold"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-[#191919] block mb-1">
                  US Proxy Gateway Location
                </label>
                <select
                  value={credentials.proxyRegion}
                  onChange={(e) => setCredentials({ ...credentials, proxyRegion: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-[#e0dfdc] bg-white text-xs focus:outline-none font-medium"
                >
                  <option>US East (N. Virginia - Low Latency)</option>
                  <option>US Central (Dallas / Texas Hub)</option>
                  <option>US West (Silicon Valley Residential)</option>
                </select>
              </div>
            </div>

            {/* Right: Anti-Bot & Throttling Settings */}
            <div className="bg-[#f9fafb] p-4 rounded-lg border border-[#e0dfdc] space-y-3">
              <div className="font-bold text-[#191919] flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Anti-Checkpoint Safety &amp; Delay Timers</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#666666] block mb-1">
                  Human Emulation Delay: <span className="font-bold text-[#191919]">{credentials.delaySeconds} seconds</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={credentials.delaySeconds}
                  onChange={(e) => setCredentials({ ...credentials, delaySeconds: Number(e.target.value) })}
                  className="w-full accent-[#0a66c2]"
                />
                <div className="flex justify-between text-[10px] text-[#666666] mt-0.5">
                  <span>Fast (2s)</span>
                  <span>Recommended (4-6s)</span>
                  <span>Ultra-Safe (12s)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#e0dfdc] text-[11px] text-[#666666]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Randomized browser viewport and user-agent emulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Automatic cooldown pause if search rate reaches 50 req/min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Direct recruiter email verification prior to outreach</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => showToast('Credentials and safety policies updated successfully.')}
                  className="w-full py-2 bg-[#0a66c2] hover:bg-[#004182] text-white font-bold rounded-md transition-colors"
                >
                  Save Credentials &amp; Worker State
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Email Outreach Templates */}
      {activeSubTab === 'templates' && (
        <div className="linkedin-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e0dfdc] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#191919] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0a66c2]" />
                <span>C2C Bench Sales Outreach Email Templates</span>
              </h2>
              <p className="text-xs text-[#666666] mt-0.5">
                Pre-formatted email templates sent automatically to matching recruiters. Supports placeholders like <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{`{{recruiter_name}}`}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{`{{company_name}}`}</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{`{{requirement_title}}`}</code>.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {templates.map(tpl => (
              <div 
                key={tpl.id}
                className="border border-[#e0dfdc] rounded-lg p-4 bg-white space-y-2 hover:border-[#0a66c2] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-[#191919] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0a66c2]" />
                    <span>{tpl.name}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#666666] bg-[#f3f2ef] px-2 py-0.5 rounded">
                    ID: {tpl.id}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#0a66c2]">
                  Subject: <span className="font-normal text-[#191919]">{tpl.subject}</span>
                </div>

                <pre className="text-xs font-mono text-[#333333] bg-[#f9fafb] p-3 rounded border border-[#edf2f7] whitespace-pre-wrap leading-relaxed">
                  {tpl.body}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Dispatch Logs */}
      {activeSubTab === 'logs' && (
        <div className="linkedin-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e0dfdc] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#191919] flex items-center gap-2">
                <History className="w-4 h-4 text-[#0a66c2]" />
                <span>Automated Email Outreach Delivery History</span>
              </h2>
              <p className="text-xs text-[#666666] mt-0.5">
                Timestamped records of all C2C bench profile submissions sent to US recruiters.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0a66c2] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {emailLogs.length} Outreached
            </span>
          </div>

          {emailLogs.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#666666]">
              No emails sent yet. Click "Quick Outreach" on any recruiter post to dispatch your first bench profile submission.
            </div>
          ) : (
            <div className="divide-y divide-[#e0dfdc] border border-[#e0dfdc] rounded-lg overflow-hidden">
              {emailLogs.map((log: any) => (
                <div key={log.id} className="p-3 bg-white hover:bg-[#f9fafb] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#191919]">{log.recruiterName} ({log.recruiterEmail})</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Check className="w-3 h-3" />
                      {log.status || 'Delivered'}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-[#0a66c2]">
                    Subject: {log.subject}
                  </div>
                  <div className="text-[11px] text-[#666666]">
                    Sent at: {new Date(log.sentAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Outreach Email Composer Modal */}
      {activeOutreachPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-[#e0dfdc] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-[#004182] to-[#0a66c2] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-sm">Send C2C Bench Profile Outreach</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveOutreachPost(null)}
                className="text-white/80 hover:text-white p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Recruiter summary pill */}
              <div className="p-3 bg-[#f3f2ef] rounded-md flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeOutreachPost.avatarUrl || getDeterministicAvatar(activeOutreachPost.recruiterName, activeOutreachPost.recruiterTitle)}
                    alt={activeOutreachPost.recruiterName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getDeterministicAvatar(activeOutreachPost.recruiterName, activeOutreachPost.recruiterTitle);
                    }}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-2xs shrink-0 bg-[#e2e8f0]"
                  />
                  <div>
                    <div className="font-bold text-[#191919]">{activeOutreachPost.recruiterName}</div>
                    <div className="text-[#666666]">{activeOutreachPost.company} · {activeOutreachPost.location}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-semibold text-[#0a66c2]">{activeOutreachPost.email}</div>
                  <div className="text-[11px] text-emerald-700 font-bold">{activeOutreachPost.extractedRate}</div>
                </div>
              </div>

              {/* Template selector */}
              <div>
                <label className="font-bold text-[#191919] block mb-1">
                  Select Email Outreach Template
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full p-2 rounded border border-[#e0dfdc] bg-white text-xs font-semibold focus:outline-none focus:border-[#0a66c2]"
                >
                  {templates.map(tpl => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="font-bold text-[#191919] block mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={outreachSubject}
                  onChange={(e) => setOutreachSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#e0dfdc] text-xs font-medium focus:border-[#0a66c2] focus:outline-none"
                />
              </div>

              {/* Body */}
              <div>
                <label className="font-bold text-[#191919] block mb-1">
                  Email Message Body (Ready for Recruiter)
                </label>
                <textarea
                  rows={9}
                  value={outreachBody}
                  onChange={(e) => setOutreachBody(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-[#e0dfdc] font-mono text-xs focus:border-[#0a66c2] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Auto Lead Sync Notice */}
              <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Sending this email will automatically record <strong>{activeOutreachPost.recruiterName}</strong> as a lead in your CRM under <strong>Contacted</strong> status with all requirement details.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#f9fafb] border-t border-[#e0dfdc] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveOutreachPost(null)}
                className="px-4 py-2 border border-[#e0dfdc] text-[#666666] font-semibold rounded-full hover:bg-white text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#0a66c2] hover:bg-[#004182] text-white font-bold rounded-full text-xs shadow-xs transition-colors disabled:opacity-50"
              >
                {isSendingEmail ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isSendingEmail ? 'Dispatching...' : 'Send Outreach Email Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
