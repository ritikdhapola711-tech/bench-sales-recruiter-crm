import React from 'react';
import { Users, UserPlus, Send, CheckCircle2, TrendingUp, Lock } from 'lucide-react';
import type { DashboardStats } from '../types/lead.ts';

interface StatCardsProps {
  stats: DashboardStats | null;
  activeStatusFilter: string;
  onFilterStatus: (status: string) => void;
  isLoading: boolean;
}

export const StatCards: React.FC<StatCardsProps> = ({
  stats,
  activeStatusFilter,
  onFilterStatus,
  isLoading,
}) => {
  const metrics = [
    {
      id: 'total',
      filterKey: 'All',
      title: 'Total Leads',
      value: stats?.totalLeads ?? 0,
      subtext: 'Prospects in database',
      icon: Users,
    },
    {
      id: 'new',
      filterKey: 'New',
      title: 'New',
      value: stats?.newLeads ?? 0,
      subtext: 'Uncontacted leads',
      icon: UserPlus,
    },
    {
      id: 'contacted',
      filterKey: 'Contacted',
      title: 'Contacted',
      value: stats?.contactedLeads ?? 0,
      subtext: 'Outreach in flight',
      icon: Send,
    },
    {
      id: 'qualified',
      filterKey: 'Qualified',
      title: 'Qualified',
      value: stats?.qualifiedLeads ?? 0,
      subtext: 'High-intent meetings',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="linkedin-card overflow-hidden mb-4">
      {/* Header with LinkedIn Analytics style */}
      <div className="px-4 py-3 border-b border-[#e0dfdc] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#191919]">
            Pipeline Analytics
          </h2>
          <p className="text-xs text-[#666666]">
            Real-time outreach & lead qualification metrics
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ebf4fd] text-[#0a66c2] rounded-full text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{stats?.conversionRate ?? 0}% Qualification Rate</span>
        </div>
      </div>

      {/* 4 Interactive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#e0dfdc]">
        {metrics.map(metric => {
          const isSelected = activeStatusFilter === metric.filterKey;

          return (
            <button
              key={metric.id}
              type="button"
              onClick={() => onFilterStatus(metric.filterKey)}
              className={`p-3.5 text-left transition-colors relative hover:bg-[#f3f2ef] ${
                isSelected ? 'bg-[#ebf4fd]/50' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#666666] mb-1 font-medium">
                <span className={isSelected ? 'text-[#0a66c2] font-semibold' : ''}>
                  {metric.title}
                </span>
                <metric.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0a66c2]' : 'text-[#666666]'}`} />
              </div>

              <div className="text-xl sm:text-2xl font-bold text-[#191919] tabular-nums font-mono">
                {isLoading ? '...' : metric.value.toLocaleString()}
              </div>

              <p className="text-[11px] text-[#666666] truncate mt-0.5">
                {metric.subtext}
              </p>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0a66c2]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
