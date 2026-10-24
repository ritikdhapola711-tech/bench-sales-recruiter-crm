import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Search, 
  ChevronDown, 
  Plus, 
  Upload, 
  Download, 
  RotateCcw, 
  Layers, 
  Check, 
  X,
  ExternalLink,
  Sparkles,
  Zap
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'directory' | 'pipeline' | 'import' | 'automation';
  setActiveTab: (tab: 'directory' | 'pipeline' | 'import' | 'automation') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onExportCsv: () => void;
  onResetSeed: () => void;
  totalLeadsCount: number;
  newLeadsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onOpenImportModal,
  onExportCsv,
  onResetSeed,
  totalLeadsCount,
  newLeadsCount,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e0dfdc]">
      <div className="max-w-[1128px] mx-auto px-4">
        <div className="flex items-center justify-between h-[52px]">
          {/* Left Zone: LinkedIn Logo & Global Search */}
          <div className="flex items-center gap-2 flex-1 max-w-sm sm:max-w-md">
            {/* LinkedIn Iconic Brand Symbol */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('directory');
              }}
              className="shrink-0 flex items-center justify-center w-[34px] h-[34px] bg-[#0a66c2] text-white font-bold text-[22px] rounded leading-none hover:bg-[#004182] transition-colors"
              title="Bench & Sales Recruiter CRM - LinkedIn C2C Lead Finder"
            >
              in
            </a>

            {/* LinkedIn Search Bar */}
            <div className="relative w-full max-w-[280px] lg:max-w-[340px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads, companies, titles..."
                className={`w-full pl-9 pr-7 py-1.5 text-xs bg-[#edf3f8] text-[#191919] placeholder-[#666666] rounded focus:bg-white focus:outline-none border transition-all ${
                  isSearchFocused ? 'border-[#0a66c2] ring-1 ring-[#0a66c2] bg-white' : 'border-transparent'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#191919]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Center & Right Navigation Items (Desktop Header) */}
          <nav className="flex items-center space-x-1 sm:space-x-3 md:space-x-4">
            {/* Lead Directory Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`flex flex-col items-center justify-center min-w-[56px] h-[52px] text-center border-b-2 transition-colors relative ${
                activeTab === 'directory'
                  ? 'border-[#191919] text-[#191919]'
                  : 'border-transparent text-[#666666] hover:text-[#191919]'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-medium leading-none whitespace-nowrap">Directory</span>
            </button>

            {/* Pipeline Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`flex flex-col items-center justify-center min-w-[56px] h-[52px] text-center border-b-2 transition-colors relative ${
                activeTab === 'pipeline'
                  ? 'border-[#191919] text-[#191919]'
                  : 'border-transparent text-[#666666] hover:text-[#191919]'
              }`}
            >
              <Layers className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-medium leading-none whitespace-nowrap">Pipeline</span>
              {newLeadsCount > 0 && (
                <span className="absolute top-1 right-2.5 px-1 min-w-[14px] h-[14px] bg-[#cc1016] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {newLeadsCount}
                </span>
              )}
            </button>

            {/* C2C Lead Finder & Outreach Automation Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('automation')}
              className={`flex flex-col items-center justify-center min-w-[56px] h-[52px] text-center border-b-2 transition-colors relative group ${
                activeTab === 'automation'
                  ? 'border-[#0a66c2] text-[#0a66c2] font-semibold'
                  : 'border-transparent text-[#666666] hover:text-[#0a66c2]'
              }`}
            >
              <div className="relative">
                <Sparkles className={`w-5 h-5 mb-0.5 ${activeTab === 'automation' ? 'text-[#0a66c2]' : 'text-amber-500 fill-amber-400 group-hover:scale-110 transition-transform'}`} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>
              <span className="text-[11px] font-medium leading-none whitespace-nowrap">C2C Finder</span>
            </button>

            {/* Import Prospects */}
            <button
              type="button"
              onClick={() => setActiveTab('import')}
              className={`flex flex-col items-center justify-center min-w-[56px] h-[52px] text-center border-b-2 transition-colors relative ${
                activeTab === 'import'
                  ? 'border-[#191919] text-[#191919]'
                  : 'border-transparent text-[#666666] hover:text-[#191919]'
              }`}
            >
              <Upload className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-medium leading-none whitespace-nowrap">Import</span>
            </button>

            {/* Messaging / InMail trigger */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('directory');
              }}
              className="hidden lg:flex flex-col items-center justify-center min-w-[56px] h-[52px] text-center border-b-2 border-transparent text-[#666666] hover:text-[#191919] transition-colors relative"
            >
              <MessageSquare className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-medium leading-none whitespace-nowrap">Messaging</span>
            </button>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-8 w-[1px] bg-[#e0dfdc] mx-1" />

            {/* Profile Dropdown "Me" */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex flex-col items-center justify-center min-w-[50px] h-[52px] text-[#666666] hover:text-[#191919] transition-colors"
              >
                <img 
                  src="/src/assets/images/avatar_marcus_cro_1792802861859.jpg"
                  alt="Account Profile"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-[#e0dfdc]" 
                />
                <div className="flex items-center text-[11px] font-medium mt-0.5 leading-none">
                  <span>Me</span>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-[#e0dfdc] py-2 z-50 text-xs text-[#191919]">
                  {/* Account Header */}
                  <div className="px-4 py-2 border-b border-[#e0dfdc]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="/src/assets/images/avatar_marcus_cro_1792802861859.jpg"
                        alt="Account Profile"
                        className="w-10 h-10 rounded-full object-cover border border-[#e0dfdc] shadow-2xs"
                      />
                      <div>
                        <div className="font-semibold text-sm">Bench &amp; Sales CRM</div>
                        <p className="text-[11px] text-[#666666] truncate">LinkedIn C2C Lead Finder</p>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-[#0a66c2] font-semibold">
                      {totalLeadsCount} Tracked Prospects
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        onExportCsv();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-[#f3f2ef] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#666666]" />
                      <span>Export All Leads to CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onResetSeed();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-amber-700 hover:bg-[#f3f2ef] transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Sample LinkedIn Leads</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button: Styled like LinkedIn Primary Button */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-xs rounded-full shadow-xs transition-colors whitespace-nowrap ml-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Lead</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
