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

  const totalSteps = 3; // 0-indexed, so 4 screens total (0: logo, 1: name, 2: birthdate, 3: about)

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
    // Screen 0: "slow hour" Logo (THE MOST IMPORTANT SCREEN - Perfected on Jan 19, 2026)
    <div key="welcome" className="flex flex-col items-center justify-center min-h-screen bg-white px-8">
      <div className="flex-1 flex items-center justify-center">
        <div style={{
          overflow: 'visible',
          marginTop: '-100px',
          marginLeft: '-40px'
        }}>
          {/* "slow" line */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0',
            overflow: 'visible'
          }}>
            <span style={{
              fontSize: '550px',
              lineHeight: '0.15',
              letterSpacing: '-0.07em',
              color: '#000000',
              fontFamily: 'Reenie Beanie, cursive'
            }}>
              sl
            </span>

            <img
              src="/spiral-logo.svg?v=3"
              alt="o"
              style={{
                height: '342px',
                width: 'auto',
                marginTop: '61px',
                marginLeft: '-18px',
                marginRight: '-18px',
                transform: 'scaleX(0.93)',
                filter: 'brightness(0)'
              }}
            />

            <span style={{
              fontSize: '550px',
              lineHeight: '0.15',
              letterSpacing: '-0.07em',
              color: '#000000',
              marginLeft: '-30px',
              fontFamily: 'Reenie Beanie, cursive'
            }}>
              w
            </span>
          </div>

          {/* "hour" line */}
          <div>
            <span style={{
              fontSize: '550px',
              lineHeight: '0.15',
              letterSpacing: '-0.07em',
              color: '#000000',
              fontFamily: 'Reenie Beanie, cursive'
            }}>
              hour
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="mb-12 px-8 py-4 bg-black hover:bg-gray-800 text-white font-light rounded-full transition-all duration-200 hover:shadow-lg text-lg"
      >
        Begin →
      </button>
    </div>,

    // Screen 1: Name
    <div key="name" className="flex flex-col items-center justify-center min-h-screen bg-[#172211] px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <h2 className="text-5xl font-handwritten text-[#E1EEFC] mb-4 text-center" style={{fontSize: '48px'}}>
          What's your name?
        </h2>

        <p className="text-[#E1EEFC]/70 text-2xl font-handwritten text-center mb-12" style={{fontSize: '24px'}}>
          This will be the name Slow Hour uses to refer to you
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
          placeholder="Your name"
          className="w-full max-w-sm px-6 py-4 font-handwritten text-[#172211] bg-white border-2 border-[#CEF17B]/20 rounded-2xl focus:outline-none focus:border-[#CEF17B] transition-colors text-center"
          style={{fontSize: '36px'}}
          autoFocus
        />
      </div>

      <div className="mb-12">
        <button
          onClick={handleNext}
          disabled={!canContinueFromName}
          className={`px-8 py-4 font-handwritten rounded-full transition-all duration-200 text-lg ${
            canContinueFromName
              ? 'bg-[#CEF17B] hover:bg-[#CEF17B]/90 text-[#172211] hover:shadow-lg'
              : 'bg-[#CEF17B]/20 text-[#E1EEFC]/30 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>,

    // Screen 2: Birthdate
    <div key="birthdate" className="flex flex-col items-center justify-center min-h-screen bg-[#172211] px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <h2 className="text-5xl font-handwritten text-[#E1EEFC] mb-4 text-center" style={{fontSize: '48px'}}>
          When were you born?
        </h2>

        <p className="text-[#E1EEFC]/70 text-2xl font-handwritten text-center mb-12" style={{fontSize: '24px'}}>
          Slow Hour may surprise you with a birthday gift
        </p>

        <div className="flex gap-3 w-full max-w-sm">
          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
            className="flex-1 px-4 py-4 font-handwritten text-[#172211] bg-white border-2 border-[#CEF17B]/20 rounded-2xl focus:outline-none focus:border-[#CEF17B] transition-colors text-center appearance-none cursor-pointer"
          >
            <option value="">Month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

          <input
            type="number"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            placeholder="Day"
            min="1"
            max="31"
            className="w-24 px-4 py-4 font-handwritten text-[#172211] bg-white border-2 border-[#CEF17B]/20 rounded-2xl focus:outline-none focus:border-[#CEF17B] transition-colors text-center"
          />

          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="Year"
            min="1900"
            max="2026"
            className="w-28 px-4 py-4 font-handwritten text-[#172211] bg-white border-2 border-[#CEF17B]/20 rounded-2xl focus:outline-none focus:border-[#CEF17B] transition-colors text-center"
          />
        </div>
      </div>

      <div className="mb-12">
        <button
          onClick={handleNext}
          disabled={!canContinueFromBirthdate}
          className={`px-8 py-4 font-handwritten rounded-full transition-all duration-200 text-lg ${
            canContinueFromBirthdate
              ? 'bg-[#CEF17B] hover:bg-[#CEF17B]/90 text-[#172211] hover:shadow-lg'
              : 'bg-[#CEF17B]/20 text-[#E1EEFC]/30 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>,

    // Screen 3: About the App
    <div key="about" className="flex flex-col items-center justify-center min-h-screen bg-[#172211] px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full">
        <h2 className="text-4xl font-handwritten text-[#E1EEFC] mb-8 text-center">
          Why one card each day?
        </h2>

        <div className="space-y-6 text-[#E1EEFC]/80 text-xl font-handwritten leading-relaxed">
          <p>
            In our fast-paced world, we often rush through moments without truly experiencing them.
            Slow Hour invites you to pause.
          </p>

          <p>
            Each day, you draw a single card. Not as fortune-telling, but as a gentle prompt for reflection.
            A question to sit with. A theme to notice as your day unfolds.
          </p>

          <p>
            Your daily card becomes a companion—something to return to, journal about, and carry with you.
            Over time, you'll build a personal collection of moments and insights.
          </p>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="mb-12 px-8 py-4 bg-[#CEF17B] hover:bg-[#CEF17B]/90 text-[#172211] font-handwritten rounded-full transition-all duration-200 hover:shadow-lg text-lg"
      >
        Draw my first card →
      </button>
    </div>,

  ];

  return <>{screens[currentStep]}</>;
}
