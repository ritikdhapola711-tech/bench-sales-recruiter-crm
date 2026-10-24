import React, { useState } from 'react';
import { 
  ExternalLink, 
  Globe, 
  Link as LinkIcon, 
  MoreHorizontal, 
  Phone, 
  MapPin, 
  TrendingUp, 
  ShieldCheck,
  Check,
  Share2
} from 'lucide-react';
import { CroppedAsset } from './CroppedAsset.tsx';

interface AlexBermanProfileHeaderProps {
  onOpenAddModal?: () => void;
  onOpenImportModal?: () => void;
}

export const AlexBermanProfileHeader: React.FC<AlexBermanProfileHeaderProps> = ({
  onOpenAddModal,
  onOpenImportModal,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText('https://www.linkedin.com/in/alexberman');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="linkedin-card overflow-hidden">
      {/* 1. Full Blue Hero Banner from image_1.png */}
      <div className="relative w-full overflow-hidden bg-[#002f6c] border-b border-[#e0dfdc]">
        {/* Exact cropped banner from image asset */}
        <div className="w-full relative aspect-[644/162] max-h-[220px]">
          <CroppedAsset
            x={5}
            y={67}
            width={644}
            height={162}
            renderWidth={undefined}
            renderHeight={undefined}
            className="w-full h-full object-cover"
            alt="We build lead pipelines that generate significant ROI - Alex Berman Co-Founder & CMO x27"
          />

          {/* Interactive Clickable Hotspots overlaying the banner */}
          <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
            {/* Top right badges */}
            <div className="flex justify-between items-start pointer-events-auto">
              {/* Lead Score '86' Metric Badge */}
              <div 
                className="bg-white/95 backdrop-blur-xs text-[#0a66c2] px-2.5 py-1 rounded-md shadow-xs border border-blue-200 flex items-center gap-1.5 text-xs font-bold font-mono"
                title="Lead Intelligence Score: 86/100"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#057642]" />
                <span>Lead Score: 86</span>
              </div>

              {/* Ready to Begin the Change CTA pill button */}
              <a
                href="https://www.x27marketing.com"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1 text-[11px] font-semibold bg-black/85 hover:bg-black text-white px-3 py-1 rounded-full shadow-md transition-all hover:scale-105 pointer-events-auto"
              >
                <span>Visit our website!</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Bottom Row links matching banner */}
            <div className="flex flex-wrap items-center justify-between text-[10px] text-white/90 gap-1 pt-1 pointer-events-auto">
              <a 
                href="tel:+13212095351" 
                className="hidden md:inline-flex items-center gap-1 bg-black/40 hover:bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs"
              >
                <Phone className="w-2.5 h-2.5" />
                <span>+1 321 209 5351</span>
              </a>

              <a
                href="https://www.x27marketing.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold bg-[#0073b1] hover:bg-[#005582] text-white px-2.5 py-0.5 rounded-full shadow-xs"
              >
                <Globe className="w-2.5 h-2.5" />
                <span>www.x27marketing.com</span>
              </a>

              <span className="hidden lg:inline-flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                <MapPin className="w-2.5 h-2.5" />
                <span>12236 McKinnon Rd, Windermere, FL 34786</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Profile Intro Card */}
      <div className="px-6 pb-6 pt-0 relative">
        {/* Avatar and Top Actions Bar */}
        <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-3">
          {/* Exact circular profile image of Alex Berman from reference image */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-md overflow-hidden bg-white ring-2 ring-black">
              <CroppedAsset
                x={26}
                y={248}
                width={102}
                height={102}
                renderWidth={undefined}
                renderHeight={undefined}
                className="w-full h-full object-cover"
                isCircle={true}
                alt="Alex Berman Profile Headshot"
              />
            </div>
          </div>

          {/* Three dots menu */}
          <div className="flex items-center gap-1.5 pb-2">
            <button
              type="button"
              onClick={handleShare}
              title="Copy Profile Link"
              className="p-2 text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef] rounded-full transition-colors"
            >
              {copiedLink ? <Check className="w-5 h-5 text-[#057642]" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              type="button"
              className="p-2 text-[#666666] hover:text-[#191919] hover:bg-[#f3f2ef] rounded-full transition-colors"
              title="More actions"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Bold Blue Name */}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0a66c2] hover:underline cursor-pointer leading-tight">
                Alex Berman
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#ebf4fd] text-[#0a66c2] rounded-full border border-[#cce4f7]">
                86 Score
              </span>
            </div>

            {/* Headline */}
            <p className="text-sm text-[#191919] font-medium leading-relaxed max-w-2xl">
              Founder and Head of Linkedin Content at Taplio | Ask me about AI | YouTuber at AlexBerman.com | Producer | Director of Marketing at x27 | Finance | Project Management | Operations | B2B Sales Trainer | 2 SaaS Exits
            </p>

            {/* Location & Connections */}
            <div className="flex items-center gap-1.5 text-xs text-[#666666] pt-1">
              <span>Los Angeles, California, United States</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#0a66c2] font-semibold hover:underline cursor-pointer">
                500+ connections
              </span>
            </div>
          </div>

          {/* Company & Website Links on Right */}
          <div className="space-y-2 text-xs shrink-0 pt-1">
            {/* Taplio */}
            <a
              href="https://taplio.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[#191919] hover:text-[#0a66c2] font-semibold transition-colors group"
            >
              <div className="w-5 h-5 rounded-full bg-[#004182] flex items-center justify-center text-white ring-2 ring-[#0a66c2]">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <span className="group-hover:underline">Taplio</span>
            </a>

            {/* Websites */}
            <a
              href="https://www.x27marketing.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[#0a66c2] font-semibold hover:underline transition-colors"
            >
              <LinkIcon className="w-4 h-4 text-[#666666]" />
              <span>Websites</span>
            </a>
          </div>
        </div>

        {/* Primary Action Button: "Join to follow" (Notice: NO "Private to you" text) */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
              isFollowing
                ? 'bg-[#057642] text-white hover:bg-[#046237]'
                : 'bg-[#0a66c2] hover:bg-[#004182] text-white'
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-4 h-4" />
                <span>Following</span>
              </>
            ) : (
              <span>Join to follow</span>
            )}
          </button>

          <a
            href="https://www.x27marketing.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-1.5 rounded-full text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] hover:bg-[#ebf4fd] hover:border-2 transition-all flex items-center gap-1"
          >
            <span>Visit x27 Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
