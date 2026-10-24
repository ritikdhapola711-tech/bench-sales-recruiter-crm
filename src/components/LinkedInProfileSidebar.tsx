import React from 'react';
import { Bookmark, Users, UserCheck, ShieldCheck, TrendingUp, Sparkles, Filter } from 'lucide-react';
import type { DashboardStats } from '../types/lead.ts';

interface LinkedInProfileSidebarProps {
  stats: DashboardStats | null;
  activeStatusFilter: string;
  onFilterStatus: (status: string) => void;
  activeConnectionFilter: string;
  onFilterConnection: (conn: string) => void;
  onOpenImport: () => void;
  onOpenAutomation?: () => void;
}

export const LinkedInProfileSidebar: React.FC<LinkedInProfileSidebarProps> = ({
  stats,
  activeStatusFilter,
  onFilterStatus,
  activeConnectionFilter,
  onFilterConnection,
  onOpenImport,
  onOpenAutomation,
}) => {
  return (
    <div className="space-y-2">
      {/* Profile & Console Card */}
      <div className="linkedin-card overflow-hidden">
        {/* Cover Banner */}
        <div className="h-14 bg-gradient-to-r from-[#004182] via-[#0a66c2] to-[#388fe6] relative" />

        {/* Avatar & Info */}
        <div className="px-4 pb-4 pt-0 text-center relative -mt-8">
          <img
            src="/src/assets/images/avatar_marcus_cro_1792802861859.jpg"
            alt="Bench Sales Director"
            className="w-16 h-16 rounded-full border-2 border-white object-cover mx-auto shadow-xs bg-[#e2e8f0]"
          />
          <h3 className="mt-2 text-sm font-semibold text-[#191919] hover:underline cursor-pointer">
            Bench &amp; Sales Recruiter CRM
          </h3>
          <p className="text-xs text-[#0a66c2] font-medium leading-tight mt-0.5">
            LinkedIn C2C Lead Finder
          </p>
          <p className="text-[11px] text-[#666666] leading-tight mt-0.5">
            Java Bench Sales &amp; Recruiter Outreach
          </p>
        </div>

        {/* Analytics Breakdown Strip */}
        <div className="border-t border-[#e0dfdc] py-2 text-xs">
          <div 
            onClick={() => onFilterStatus('All')}
            className="px-4 py-1.5 flex items-center justify-between hover:bg-[#f3f2ef] cursor-pointer transition-colors"
          >
            <span className="text-[#666666]">Total Prospects</span>
            <span className="font-semibold text-[#0a66c2] font-mono tabular-nums">
              {stats?.totalLeads ?? 0}
            </span>
          </div>

          <div 
            onClick={() => onFilterStatus('Qualified')}
            className="px-4 py-1.5 flex items-center justify-between hover:bg-[#f3f2ef] cursor-pointer transition-colors"
          >
            <span className="text-[#666666]">Qualified Deals</span>
            <span className="font-semibold text-emerald-600 font-mono tabular-nums">
              {stats?.qualifiedLeads ?? 0}
            </span>
          </div>

          <div className="px-4 py-1.5 flex items-center justify-between">
            <span className="text-[#666666]">Conversion Rate</span>
            <span className="font-semibold text-[#191919] font-mono tabular-nums">
              {stats?.conversionRate ?? 0}%
            </span>
          </div>
        </div>

        {/* Quick Link Footer */}
        <div className="border-t border-[#e0dfdc] px-4 py-2.5 bg-[#fafafa] space-y-1.5">
          {onOpenAutomation && (
            <button
              type="button"
              onClick={onOpenAutomation}
              className="w-full flex items-center gap-1.5 text-xs text-[#0a66c2] hover:text-[#004182] font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>C2C Post Scanner &amp; Outreach</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenImport}
            className="w-full flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#0a66c2] font-semibold transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Import Sales Navigator CSV</span>
          </button>
        </div>
      </div>

      {/* Network & Pipeline Filters Card */}
      <div className="linkedin-card p-3 text-xs">
        <div className="flex items-center justify-between text-[#666666] font-semibold mb-2 px-1">
          <span className="text-[11px] uppercase tracking-wider">Quick Filters</span>
          <Filter className="w-3 h-3" />
        </div>

        <div className="space-y-0.5">
          {[
            { label: 'All Leads', status: 'All' },
            { label: 'New Inbounds', status: 'New' },
            { label: 'Contacted', status: 'Contacted' },
            { label: 'In Discussion', status: 'In Discussion' },
            { label: 'Qualified', status: 'Qualified' },
          ].map(item => {
            const isActive = activeStatusFilter === item.status;
            return (
              <button
                key={item.status}
                type="button"
                onClick={() => onFilterStatus(item.status)}
                className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#ebf4fd] text-[#0a66c2] font-semibold'
                    : 'text-[#191919] hover:bg-[#f3f2ef]'
                }`}
              >
                <span>{item.label}</span>
                {item.status !== 'All' && stats?.statusBreakdown && (
                  <span className="font-mono tabular-nums text-[11px] opacity-70">
                    {stats.statusBreakdown[item.status as keyof typeof stats.statusBreakdown] ?? 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="border-t border-[#e0dfdc] my-2 pt-2">
          <div className="text-[11px] font-semibold text-[#666666] uppercase tracking-wider mb-1.5 px-1">
            Network Degree
          </div>
          <div className="flex flex-wrap gap-1">
            {['All', '1st', '2nd', '3rd+', 'InMail'].map(deg => {
              const isActive = activeConnectionFilter === deg;
              return (
                <button
                  key={deg}
                  type="button"
                  onClick={() => onFilterConnection(deg)}
                  className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors ${
                    isActive
                      ? 'bg-[#0a66c2] text-white border-[#0a66c2] font-medium'
                      : 'bg-white text-[#666666] border-[#e0dfdc] hover:border-[#666666]'
                  }`}
                >
                  {deg}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
