import React, { useState } from 'react';

export const AboutSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="linkedin-card p-6 space-y-3">
      <h2 className="text-xl font-bold text-[#191919]">About</h2>

      <div className="text-sm text-[#191919] leading-relaxed space-y-3 font-normal">
        <p>
          Generating leads, no matter the industry, can be difficult. The digital agency space is vast, and getting leads presents its own challenges. At Experiment 27, we focus on optimizing your digital agency’s sales cycle and empowering the inbound marketing strategies.
        </p>

        <p>
          At Experiment 27, we offer a top-down approach to your company. After analyzing your current sales process, identifying bottlenecks, and creating bespoke outbound lead generation campaigns, we help B2B service companies and digital agencies consistently sign $10k–$100k+ enterprise contracts.
        </p>

        {isExpanded ? (
          <>
            <p>
              Through our proven cold email masterclasses, YouTube channel (over 100k+ subscribers), and hands-on consulting, we’ve generated tens of millions of dollars in qualified pipeline and B2B client revenue across 500+ client accounts.
            </p>
            <p>
              Specialties include: B2B Cold Email Outreach, Pipeline Architecture, InMail Optimization, Agency Sales Training, SaaS Go-To-Market Strategy, and High-Ticket Client Acquisition.
            </p>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-[#666666] hover:text-[#0a66c2] text-xs font-semibold hover:underline block pt-1"
            >
              ...see less
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-[#666666] hover:text-[#0a66c2] text-xs font-semibold hover:underline block pt-1"
          >
            ...see more
          </button>
        )}
      </div>
    </div>
  );
};
