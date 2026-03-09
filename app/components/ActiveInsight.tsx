'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';

interface ActiveInsightProps {
  insight: string;
  keyPhrase: string;
  action?: string;
  transitInfo?: string;
  userName?: string;
  isLoading?: boolean;
  isRateLimited?: boolean;
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

export function ActiveInsight({ insight, keyPhrase, action, transitInfo, userName, isLoading: externalLoading, isRateLimited, transitExplanation }: ActiveInsightProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [internalLoading, setInternalLoading] = useState(true);
  const [dots, setDots] = useState('');
  const marqueeContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!marqueeContainerRef.current || !transitInfo) return;
    const span = marqueeContainerRef.current.querySelector('span') as HTMLSpanElement;
    if (!span) return;
    const oneWidth = span.scrollWidth / 4;
    marqueeContainerRef.current.style.setProperty('--marquee-offset', `-${oneWidth}px`);
  }, [transitInfo]);

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
          {!isRateLimited && (
            <h4
              className="text-[#172211] mb-4"
              style={{
                fontSize: 'clamp(20px, 3vw, 24px)',
                fontFamily: 'var(--font-vt323), monospace',
                fontWeight: 700
              }}
            >
              what this could mean for you
            </h4>
          )}

          {isRateLimited && !insight ? (
            <div>
              <p
                className="text-[#172211]"
                style={{
                  fontSize: 'clamp(16px, 2.5vw, 21px)',
                  fontFamily: 'var(--font-vt323), monospace',
                  lineHeight: '1.4',
                  fontWeight: 400
                }}
              >
                hey! thank you so much for using slow hour. if this has meant something to you, you can unlock unlimited readings for a small one-time contribution — it goes directly toward keeping this running.
              </p>
              <a
                href="https://buymeacoffee.com/shxntxnx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-[#172211] underline underline-offset-4 hover:opacity-60 transition-opacity"
                style={{
                  fontSize: 'clamp(16px, 2.5vw, 21px)',
                  fontFamily: 'var(--font-vt323), monospace',
                  fontWeight: 700
                }}
              >
                buy me a coffee →
              </a>
              <p
                className="text-[#172211]/60 mt-4"
                style={{
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  fontFamily: 'var(--font-vt323), monospace',
                  lineHeight: '1.4',
                  fontWeight: 400
                }}
              >
                your past readings are always here whenever you want to come back to them.
              </p>
            </div>
          ) : (
          <p
            className="text-[#172211]"

            style={{
              fontSize: 'clamp(16px, 2.5vw, 21px)',
              fontFamily: 'var(--font-vt323), monospace',
              lineHeight: '1.4',
              fontWeight: 400
            }}
          >
            {insight.toLowerCase()}
          </p>
          )}

          {!isRateLimited && action && (
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

          {!isRateLimited && transitInfo && (
            <div className="mt-6 -mx-6">
              <div
                className="overflow-hidden cursor-pointer pb-1 transition-all"
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
                <div ref={marqueeContainerRef} className="overflow-hidden whitespace-nowrap">
                  <span
                    className="text-[#172211]/70 hover:text-[#172211] transition-colors"
                    style={{
                      display: 'inline-block',
                      fontSize: 'clamp(16px, 2vw, 18px)',
                      fontFamily: 'var(--font-vt323), monospace',
                      animation: 'marqueeScroll 22s linear infinite',
                      willChange: 'transform',
                      fontWeight: 400,
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted',
                      textUnderlineOffset: '4px'
                    }}
                  >
                    {(`${transitInfo.toLowerCase()} • `).repeat(4)}
                  </span>
                </div>
                {/* Tap hint — visible on mobile, disappears once expanded */}
                {!isExpanded && (
                  <div className="flex justify-center mt-1 px-6">
                    <span
                      className="text-[#172211]/40"
                      style={{ fontSize: '11px', fontFamily: 'var(--font-vt323), monospace', letterSpacing: '0.05em' }}
                    >
                      tap to explore ↓
                    </span>
                  </div>
                )}
              </div>

              {isExpanded && transitExplanation && (
                <div
                  className="mt-2 pt-2 px-6"
                  style={{
                    fontSize: 'clamp(13px, 1.8vw, 16px)',
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
                  <p className="mt-4 pt-3 border-t border-[#172211]/20 text-[#172211]/50">
                    slow hour reads using the vedic sidereal system. your placements may differ from your western horoscope — that&apos;s expected.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}


    </div>
  );
}
