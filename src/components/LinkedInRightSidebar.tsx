import React from 'react';
import { ExternalLink, UserPlus, Check, Download, Bookmark } from 'lucide-react';
import { CroppedAsset } from './CroppedAsset.tsx';
import type { LinkedInLead } from '../types/lead.ts';
import { getDeterministicAvatar } from '../utils/avatar.ts';

interface LinkedInRightSidebarProps {
  onExportCsv?: () => void;
  onSelectLead?: (lead: Partial<LinkedInLead>) => void;
}

interface PeopleViewedItem {
  id: string;
  name: string;
  avatarCrop: { x: number; y: number; width: number; height: number };
  badge?: string;
  headline: string;
  location: string;
  company: string;
  email: string;
}

export const LinkedInRightSidebar: React.FC<LinkedInRightSidebarProps> = ({
  onExportCsv,
  onSelectLead,
}) => {
  const peopleAlsoViewed: PeopleViewedItem[] = [
    {
      id: 'patrick-dang',
      name: 'Patrick Dang',
      avatarCrop: { x: 671, y: 108, width: 38, height: 38 },
      headline: 'Start & Accelerate Your Sales Career at SalesLegacy.com',
      location: 'United States',
      company: 'SalesLegacy.com',
      email: 'patrick@saleslegacy.com',
    },
    {
      id: 'div-sharma',
      name: 'Div Sharma',
      avatarCrop: { x: 671, y: 192, width: 38, height: 38 },
      headline: 'Director Of Marketing And Public Relations at Experiment 27: Marketing for Mobile App Development Agencies',
      location: 'Faridabad',
      company: 'Experiment 27',
      email: 'div@x27marketing.com',
    },
    {
      id: 'seth-godin',
      name: 'Seth Godin',
      avatarCrop: { x: 671, y: 295, width: 38, height: 38 },
      badge: '🟡',
      headline: 'Founder of the Carbon Almanac, blogger, entrepreneur and author.',
      location: 'Hastings-On-Hudson, NY',
      company: 'The Carbon Almanac',
      email: 'seth@sethgodin.com',
    },
    {
      id: 'robert-indries',
      name: 'Robert Indries',
      avatarCrop: { x: 671, y: 380, width: 38, height: 38 },
      headline: 'Wealth Advisor. Owner Of 8 Businesses Generating 7-Figures. Family Man.',
      location: 'Sheffield',
      company: 'Private Wealth',
      email: 'robert@indries.com',
    },
    {
      id: 'kiran-ramaiah',
      name: 'Kiran Ramaiah',
      avatarCrop: { x: 671, y: 484, width: 38, height: 38 },
      headline: 'Helping B2B Companies Generate An Extra $1M | Product Enthusiast | Founder of AddFitt | Growth Partner at X27',
      location: 'Helsinki',
      company: 'AddFitt / X27',
      email: 'kiran@addfitt.com',
    },
    {
      id: 'andrew-mewborn',
      name: 'Andrew Mewborn',
      avatarCrop: { x: 671, y: 604, width: 38, height: 38 },
      headline: "I talk about digital building & digital selling // Helped over 3,456 people start creating content online at Brand30.io // Started at the bottom @ Outreach.io now I'm here helping you build online",
      location: 'San Diego, California',
      company: 'Brand30.io',
      email: 'andrew@brand30.io',
    },
  ];

  const [connectedIds, setConnectedIds] = React.useState<string[]>([]);

  const handleToggleConnect = (person: PeopleViewedItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectedIds.includes(person.id)) {
      setConnectedIds(connectedIds.filter(id => id !== person.id));
    } else {
      setConnectedIds([...connectedIds, person.id]);
      if (onSelectLead) {
        onSelectLead({
          fullName: person.name,
          jobTitle: person.headline,
          company: person.company,
          location: person.location,
          email: person.email,
          avatarUrl: getDeterministicAvatar(person.name, person.headline),
          status: 'Contacted',
          connectionDegree: '2nd',
        });
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* "People also viewed" Card - Matching image_1.png */}
      <div className="linkedin-card p-4">
        <h3 className="text-base font-bold text-[#191919] mb-4">
          People also viewed
        </h3>

        <div className="space-y-4">
          {peopleAlsoViewed.map((person) => {
            const isConnected = connectedIds.includes(person.id);

            return (
              <div
                key={person.id}
                className="group flex items-start gap-3 pb-3 border-b border-[#f3f2ef] last:border-0 last:pb-0"
              >
                {/* Circular Profile Picture extracted from image_1.png */}
                <div className="relative shrink-0 pt-0.5">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-[#e0dfdc] shadow-2xs group-hover:border-[#0a66c2] transition-colors">
                    <CroppedAsset
                      x={person.avatarCrop.x}
                      y={person.avatarCrop.y}
                      width={person.avatarCrop.width}
                      height={person.avatarCrop.height}
                      renderWidth={44}
                      renderHeight={44}
                      isCircle={true}
                      alt={person.name}
                    />
                  </div>
                </div>

                {/* Person details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-[#191919] group-hover:text-[#0a66c2] group-hover:underline truncate cursor-pointer leading-tight">
                      {person.name}
                    </h4>
                    {person.badge && (
                      <span className="text-xs" title="Verified Creator">
                        {person.badge}
                      </span>
                    )}
                    <span className="linkedin-degree-badge">
                      {person.name === 'Div Sharma' || person.name === 'Kiran Ramaiah' ? '1st' : person.name === 'Seth Godin' ? '3rd+' : '2nd'}
                    </span>
                  </div>

                  <p className="text-xs text-[#191919] leading-snug line-clamp-2 mt-0.5 font-normal">
                    {person.headline}
                  </p>

                  <p className="text-[11px] text-[#666666] mt-0.5 truncate">
                    {person.location}
                  </p>

                  {/* Connect / Message Button */}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={(e) => handleToggleConnect(person, e)}
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all flex items-center gap-1 ${
                        isConnected
                          ? 'bg-[#ebf4fd] text-[#0a66c2] border-[#0a66c2]'
                          : 'bg-white text-[#666666] border-[#666666] hover:bg-[#f3f2ef] hover:border-[#191919] hover:text-[#191919]'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#0a66c2]" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Connect</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Pipeline Quick Actions */}
      <div className="bg-white rounded-lg border border-[#e0dfdc] p-3 text-xs shadow-xs space-y-2">
        <div className="text-xs font-semibold text-[#191919]">
          Lead Intelligence Export
        </div>
        <p className="text-[11px] text-[#666666]">
          Download prospect contact data & pipeline interactions in standard CSV.
        </p>
        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 border border-[#0a66c2] text-[#0a66c2] hover:bg-[#ebf4fd] font-semibold rounded-full transition-all text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 text-[10px] text-[#666666] text-center leading-relaxed">
        <span>LinkedIn Corporation © {new Date().getFullYear()}</span>
      </div>
    </div>
  );
};
