'use client';

import { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const totalSteps = 3; // 0-indexed, so 4 screens total (0, 1, 2, 3)

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user data and mark onboarding as complete
      localStorage.setItem('userName', name);
      localStorage.setItem('userBirthdate', `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`);
      localStorage.setItem('onboardingComplete', 'true');
      onComplete();
    }
  };

  const canContinueFromName = name.trim().length > 0;
  const canContinueFromBirthdate = birthMonth && birthDay && birthYear;

  const screens = [
    // Screen 0: "slow hour" Logo - MOST CRITICAL!
    <div key="logo" className="min-h-screen flex items-center justify-center bg-[#172211] overflow-hidden relative">
      {/* Optional background video */}
      {/* <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-10">
        <source src="/onboarding-bg.mp4" type="video/mp4" />
      </video> */}

      <div
        className="relative z-10"
        style={{
          overflow: 'visible',
          marginTop: '-100px',
          marginLeft: '-40px'
        }}
      >
        {/* "slow" line */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0',
          overflow: 'visible'
        }}>
          <span style={{
            fontSize: 'clamp(200px, 30vw, 550px)',
            lineHeight: '0.15',
            letterSpacing: '-0.07em',
            color: '#CEF17B',
            fontFamily: 'var(--font-reenie-beanie), cursive'
          }}>
            sl
          </span>

          {/* Spiral logo as "o" - NOTE: You need to add spiral-logo.png to /public/ */}
          <img
            src="/spiral-logo.png?v=3"
            alt="o"
            style={{
              height: 'clamp(125px, 18vw, 342px)',
              width: 'auto',
              marginTop: 'clamp(22px, 3.2vw, 61px)',
              marginLeft: 'clamp(-7px, -1vw, -18px)',
              marginRight: 'clamp(-7px, -1vw, -18px)',
              transform: 'scaleX(0.93)',
              filter: 'brightness(0) saturate(100%) invert(90%) sepia(13%) saturate(1487%) hue-rotate(27deg) brightness(104%) contrast(95%)'
            }}
            onError={(e) => {
              // Fallback if spiral logo doesn't exist
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.textContent = 'o';
              fallback.style.fontSize = 'clamp(200px, 30vw, 550px)';
              fallback.style.lineHeight = '0.15';
              fallback.style.letterSpacing = '-0.07em';
              fallback.style.color = '#CEF17B';
              fallback.style.fontFamily = 'var(--font-reenie-beanie), cursive';
              e.currentTarget.parentElement?.insertBefore(fallback, e.currentTarget.nextSibling);
            }}
          />

          <span style={{
            fontSize: 'clamp(200px, 30vw, 550px)',
            lineHeight: '0.15',
            letterSpacing: '-0.07em',
            color: '#CEF17B',
            marginLeft: 'clamp(-11px, -1.6vw, -30px)',
            fontFamily: 'var(--font-reenie-beanie), cursive'
          }}>
            w
          </span>
        </div>

        {/* "hour" line */}
        <div>
          <span style={{
            fontSize: 'clamp(200px, 30vw, 550px)',
            lineHeight: '0.15',
            letterSpacing: '-0.07em',
            color: '#CEF17B',
            fontFamily: 'var(--font-reenie-beanie), cursive'
          }}>
            hour
          </span>
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={handleNext}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-[#CEF17B] hover:bg-[#d4f58a] text-[#172211] rounded-full transition-all duration-200 text-4xl"
        style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
      >
        begin →
      </button>
    </div>,

    // Screen 1: Name Input
    <div key="name" className="min-h-screen flex flex-col items-center justify-center bg-[#172211] px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <h2
          className="text-[#CEF17B] mb-4 text-center"
          style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
        >
          what's your name?
        </h2>

        <p
          className="text-[#E1EEFC] text-center mb-12"
          style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontFamily: 'var(--font-reenie-beanie), cursive', opacity: 0.8 }}
        >
          this will be the name slow hour uses to refer to you
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canContinueFromName) {
              handleNext();
            }
          }}
          placeholder="your name"
          className="w-full max-w-sm px-6 py-4 bg-[#172211] border-2 border-[#CEF17B]/20 hover:border-[#CEF17B]/50 focus:border-[#CEF17B] text-[#E1EEFC] rounded-2xl focus:outline-none transition-colors text-center"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
          autoFocus
        />
      </div>

      <div className="mb-12">
        <button
          onClick={handleNext}
          disabled={!canContinueFromName}
          className={`px-8 py-4 rounded-full transition-all duration-200 ${
            canContinueFromName
              ? 'bg-[#CEF17B] hover:bg-[#d4f58a] text-[#172211]'
              : 'bg-[#CEF17B]/20 text-[#E1EEFC]/40 cursor-not-allowed'
          }`}
          style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
        >
          continue →
        </button>
      </div>
    </div>,

    // Screen 2: Birthdate
    <div key="birthdate" className="min-h-screen flex flex-col items-center justify-center bg-[#172211] px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <h2
          className="text-[#CEF17B] mb-4 text-center"
          style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
        >
          when were you born?
        </h2>

        <p
          className="text-[#E1EEFC] text-center mb-12"
          style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontFamily: 'var(--font-reenie-beanie), cursive', opacity: 0.8 }}
        >
          slow hour may surprise you with a birthday gift
        </p>

        <div className="flex gap-3 w-full max-w-sm">
          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
            className="flex-1 px-4 py-4 bg-[#172211] border-2 border-[#CEF17B]/20 hover:border-[#CEF17B]/50 focus:border-[#CEF17B] text-[#E1EEFC] rounded-2xl focus:outline-none transition-colors text-center appearance-none cursor-pointer"
            style={{ fontSize: 'clamp(16px, 2.5vw, 24px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
          >
            <option value="">month</option>
            <option value="1">january</option>
            <option value="2">february</option>
            <option value="3">march</option>
            <option value="4">april</option>
            <option value="5">may</option>
            <option value="6">june</option>
            <option value="7">july</option>
            <option value="8">august</option>
            <option value="9">september</option>
            <option value="10">october</option>
            <option value="11">november</option>
            <option value="12">december</option>
          </select>

          <input
            type="number"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            placeholder="day"
            min="1"
            max="31"
            className="w-24 px-4 py-4 bg-[#172211] border-2 border-[#CEF17B]/20 hover:border-[#CEF17B]/50 focus:border-[#CEF17B] text-[#E1EEFC] rounded-2xl focus:outline-none transition-colors text-center"
            style={{ fontSize: 'clamp(16px, 2.5vw, 24px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
          />

          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="year"
            min="1900"
            max="2026"
            className="w-28 px-4 py-4 bg-[#172211] border-2 border-[#CEF17B]/20 hover:border-[#CEF17B]/50 focus:border-[#CEF17B] text-[#E1EEFC] rounded-2xl focus:outline-none transition-colors text-center"
            style={{ fontSize: 'clamp(16px, 2.5vw, 24px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
          />
        </div>
      </div>

      <div className="mb-12">
        <button
          onClick={handleNext}
          disabled={!canContinueFromBirthdate}
          className={`px-8 py-4 rounded-full transition-all duration-200 ${
            canContinueFromBirthdate
              ? 'bg-[#CEF17B] hover:bg-[#d4f58a] text-[#172211]'
              : 'bg-[#CEF17B]/20 text-[#E1EEFC]/40 cursor-not-allowed'
          }`}
          style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
        >
          continue →
        </button>
      </div>
    </div>,

    // Screen 3: About - "Why one card each day?"
    <div key="about" className="min-h-screen flex flex-col items-center justify-center bg-[#172211] px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full">
        <h2
          className="text-[#CEF17B] mb-12 text-center"
          style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
        >
          why one card each day?
        </h2>

        <div className="space-y-8 text-[#E1EEFC]" style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '1.6' }}>
          <p>
            in our fast-paced world, we often rush through moments without truly experiencing them. slow hour invites you to pause.
          </p>

          <p>
            each day, you draw a single card. not as fortune-telling, but as a gentle prompt for reflection. a question to sit with. a theme to notice as your day unfolds.
          </p>

          <p>
            your daily card becomes a companion—something to return to, journal about, and carry with you. over time, you'll build a personal collection of moments and insights.
          </p>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="mb-12 px-12 py-5 bg-[#CEF17B] hover:bg-[#d4f58a] text-[#172211] rounded-full transition-all duration-200 shadow-lg"
        style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
      >
        draw my first card →
      </button>
    </div>,
  ];

  return <>{screens[currentStep]}</>;
}
