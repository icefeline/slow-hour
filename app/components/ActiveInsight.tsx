'use client';

import { useState, useEffect } from 'react';

interface ActiveInsightProps {
  insight: string;
  keyPhrase: string;
  action?: string;
  transitInfo?: string;
  userName?: string;
  isLoading?: boolean;
  transitExplanation?: {
    transitingPlanet: string;
    transitingPlanetMeaning: string;
    natalPlanet: string;
    natalPlanetMeaning: string;
    aspectType: string;
    aspectMeaning: string;
    phaseMeaning: string;
  };
}

export function ActiveInsight({ insight, keyPhrase, action, transitInfo, userName, isLoading: externalLoading, transitExplanation }: ActiveInsightProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [internalLoading, setInternalLoading] = useState(true);
  const [dots, setDots] = useState('');

  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  useEffect(() => {
    // Animate the dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    // Show content after 2 seconds (only used when no external loading control)
    const loadingTimer = setTimeout(() => {
      setInternalLoading(false);
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <div className={`rounded-lg border border-[#CEF17B] bg-[#CEF17B] p-4 md:p-6 flex flex-col ${isLoading ? '' : 'min-h-[160px] md:min-h-[200px]'}`}>
      {isLoading ? (
        <div className="flex items-start">
          {/* Thinking text */}
          <p
            className="text-[#172211] italic"
            style={{
              fontSize: 'clamp(20px, 3vw, 24px)',
              fontFamily: 'var(--font-vt323), monospace',
              fontWeight: 400
            }}
          >
            thinking{dots}
          </p>
        </div>
      ) : (
        <div className="animate-fade-in">
          <h4
            className="text-[#172211] mb-4"
            style={{
              fontSize: 'clamp(20px, 3vw, 24px)',
              fontFamily: 'var(--font-vt323), monospace',
              fontWeight: 700
            }}
          >
            what this means for you
          </h4>

          <p
            className="text-[#172211]"
            style={{
              fontSize: 'clamp(18px, 3.5vw, 26px)',
              fontFamily: 'var(--font-vt323), monospace',
              lineHeight: '1.4',
              fontWeight: 400
            }}
          >
            {insight.toLowerCase()}
          </p>

          {action && (
            <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-[#172211]/20">
              <p
                className="text-[#172211]/60"
                style={{
                  fontSize: 'clamp(12px, 1.8vw, 15px)',
                  fontFamily: 'var(--font-vt323), monospace',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 400
                }}
              >
                try this
              </p>
              <p
                className="text-[#172211] mt-1"
                style={{
                  fontSize: 'clamp(16px, 2.5vw, 21px)',
                  fontFamily: 'var(--font-vt323), monospace',
                  lineHeight: '1.4',
                  fontWeight: 400
                }}
              >
                {action.toLowerCase()}
              </p>
            </div>
          )}

          {transitInfo && (
            <div className="mt-6 -mx-6">
              <div
                className="overflow-hidden cursor-pointer pb-2 transition-all"
                onClick={() => setIsExpanded(!isExpanded)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                  }
                }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? "Hide transit explanation" : "Show transit explanation"}
              >
                <div className="animate-marquee whitespace-nowrap">
                  <span
                    className="text-[#172211]/70 inline-block hover:text-[#172211] transition-colors"
                    style={{
                      fontSize: 'clamp(16px, 2vw, 18px)',
                      fontFamily: 'var(--font-vt323), monospace',
                      animation: 'marquee 15s linear infinite',
                      fontWeight: 400,
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted',
                      textUnderlineOffset: '4px'
                    }}
                  >
                    {transitInfo.toLowerCase()} • {transitInfo.toLowerCase()} • {transitInfo.toLowerCase()} • {transitInfo.toLowerCase()}
                  </span>
                </div>
              </div>

              {isExpanded && transitExplanation && (
                <div
                  className="mt-4 pt-4 px-6"
                  style={{
                    fontSize: 'clamp(18px, 2.5vw, 20px)',
                    fontFamily: 'var(--font-vt323), monospace',
                    lineHeight: '1.5',
                    color: '#172211',
                    fontWeight: 400
                  }}
                >
                  <p className="mb-3">
                    <strong>{transitExplanation.transitingPlanet.toLowerCase()}</strong> ({transitExplanation.transitingPlanetMeaning.toLowerCase()}) is making a <strong>{transitExplanation.aspectType.toLowerCase()}</strong> ({transitExplanation.aspectMeaning.toLowerCase()}) to your natal <strong>{transitExplanation.natalPlanet.toLowerCase()}</strong> ({transitExplanation.natalPlanetMeaning.toLowerCase()}).
                  </p>
                  <p>
                    {transitExplanation.phaseMeaning.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-25%);
          }
        }
      `}</style>
    </div>
  );
}
