import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { LeadStatus } from '../types/lead.ts';

interface StatusBadgeProps {
  status: LeadStatus;
  onChangeStatus?: (newStatus: LeadStatus) => void;
  interactive?: boolean;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; textClass: string; bgClass: string; borderClass: string; dotClass: string }> = {
  'New': {
    label: 'NEW',
    textClass: 'text-[#0277bd]',
    bgClass: 'bg-[#e1f5fe]',
    borderClass: 'border-[#b3e5fc]',
    dotClass: 'bg-[#0277bd]',
  },
  'Contacted': {
    label: 'CONTACTED',
    textClass: 'text-[#1a73e8]',
    bgClass: 'bg-[#e8f0fe]',
    borderClass: 'border-[#d2e3fc]',
    dotClass: 'bg-[#1a73e8]',
  },
  'In Discussion': {
    label: 'IN DISCUSSION',
    textClass: 'text-[#b06000]',
    bgClass: 'bg-[#fef7e0]',
    borderClass: 'border-[#feefc3]',
    dotClass: 'bg-[#b06000]',
  },
  'Qualified': {
    label: 'QUALIFIED',
    textClass: 'text-[#137333]',
    bgClass: 'bg-[#e6f4ea]',
    borderClass: 'border-[#ceead6]',
    dotClass: 'bg-[#137333]',
  },
  'Nurturing': {
    label: 'NURTURING',
    textClass: 'text-[#7627bb]',
    bgClass: 'bg-[#f3e8fd]',
    borderClass: 'border-[#e1c5fb]',
    dotClass: 'bg-[#7627bb]',
  },
  'Unqualified': {
    label: 'UNQUALIFIED',
    textClass: 'text-[#5f6368]',
    bgClass: 'bg-[#f1f3f4]',
    borderClass: 'border-[#dadce0]',
    dotClass: 'bg-[#5f6368]',
  },
};

export const ALL_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'In Discussion',
  'Qualified',
  'Nurturing',
  'Unqualified',
];

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  onChangeStatus,
  interactive = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const config = STATUS_CONFIG[status] || STATUS_CONFIG['New'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!interactive || !onChangeStatus) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all ${config.bgClass} ${config.textClass} ${config.borderClass}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        <span>{config.label}</span>
      </span>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border transition-all hover:brightness-95 cursor-pointer ${config.bgClass} ${config.textClass} ${config.borderClass}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        <span>{config.label}</span>
        <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {isOpen && (
        <div
          className="absolute z-40 left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-[#e0dfdc] py-1 text-xs focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          {ALL_STATUSES.map((st) => {
            const isCurrent = st === status;
            const itemConf = STATUS_CONFIG[st];
            return (
              <button
                key={st}
                type="button"
                onClick={() => {
                  onChangeStatus(st);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-[#f3f2ef] transition-colors ${
                  isCurrent ? 'font-bold text-[#191919] bg-[#f3f2ef]' : 'text-[#666666]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${itemConf.dotClass}`} />
                  <span className="text-[11px] font-bold uppercase tracking-wide">
                    {itemConf.label}
                  </span>
                </div>
                {isCurrent && <Check className="w-3.5 h-3.5 text-[#0a66c2]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
