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

  const totalSteps = 4; // 0-indexed, so 5 screens total

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
    // Screen 0: Welcome
    <div key="welcome" className="flex flex-col items-center justify-center min-h-screen bg-cream-50 px-8">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {/* Hand-drawn sun/moon icon */}
          <div className="w-32 h-32 mx-auto mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full text-forest-700">
              {/* Crescent moon */}
              <path
                d="M 50 10 A 30 30 0 1 0 50 90 A 25 25 0 1 1 50 10 Z"
                fill="currentColor"
                opacity="0.15"
              />
              <path
                d="M 50 10 A 30 30 0 1 0 50 90 A 25 25 0 1 1 50 10 Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          <h1 className="text-6xl font-handwritten text-forest-900 mb-4">
            Slow Hour
          </h1>

          <p className="text-forest-600 text-xl md:text-3xl font-light">
            One card. One moment. One day.
          </p>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="mb-12 px-8 py-4 bg-forest-600 hover:bg-forest-700 text-cream-50 font-light rounded-full transition-all duration-200 hover:shadow-lg text-lg"
      >
        Begin →
      </button>
    </div>,

    // Screen 1: Name
    <div key="name" className="flex flex-col items-center justify-center min-h-screen bg-cream-50 px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <h2 className="text-4xl font-light text-forest-900 mb-2 text-center">
          What's your name?
        </h2>

        <p className="text-forest-600 text-xl md:text-2xl font-light text-center mb-12">
          So we can greet you properly
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
          className="w-full max-w-sm px-6 py-4 text-lg font-light text-forest-900 bg-white border-2 border-forest-200 rounded-2xl focus:outline-none focus:border-forest-500 transition-colors text-center"
          autoFocus
        />
      </div>

      <div className="mb-12">
        <button
          onClick={handleNext}
          disabled={!canContinueFromName}
          className={`px-8 py-4 font-light rounded-full transition-all duration-200 text-lg ${
            canContinueFromName
              ? 'bg-forest-600 hover:bg-forest-700 text-cream-50 hover:shadow-lg'
              : 'bg-forest-200 text-forest-400 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>,

    // Screen 2: Birthdate
    <div key="birthdate" className="flex flex-col items-center justify-center min-h-screen bg-cream-50 px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <h2 className="text-4xl font-light text-forest-900 mb-2 text-center">
          When were you born?
        </h2>

        <p className="text-forest-600 text-xl md:text-2xl font-light text-center mb-12">
          Your cards will be drawn just for you
        </p>

        <div className="flex gap-3 w-full max-w-sm">
          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
            className="flex-1 px-4 py-4 text-lg font-light text-forest-900 bg-white border-2 border-forest-200 rounded-2xl focus:outline-none focus:border-forest-500 transition-colors text-center appearance-none cursor-pointer"
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
            className="w-24 px-4 py-4 text-lg font-light text-forest-900 bg-white border-2 border-forest-200 rounded-2xl focus:outline-none focus:border-forest-500 transition-colors text-center"
          />

          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="Year"
            min="1900"
            max="2024"
            className="w-28 px-4 py-4 text-lg font-light text-forest-900 bg-white border-2 border-forest-200 rounded-2xl focus:outline-none focus:border-forest-500 transition-colors text-center"
          />
        </div>
      </div>

      <div className="mb-12">
        <button
          onClick={handleNext}
          disabled={!canContinueFromBirthdate}
          className={`px-8 py-4 font-light rounded-full transition-all duration-200 text-lg ${
            canContinueFromBirthdate
              ? 'bg-forest-600 hover:bg-forest-700 text-cream-50 hover:shadow-lg'
              : 'bg-forest-200 text-forest-400 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>,

    // Screen 3: About the App
    <div key="about" className="flex flex-col items-center justify-center min-h-screen bg-cream-50 px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full">
        <h2 className="text-4xl font-light text-forest-900 mb-8 text-center">
          Why one card each day?
        </h2>

        <div className="space-y-6 text-forest-700 text-xl md:text-2xl font-light leading-relaxed">
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
        className="mb-12 px-8 py-4 bg-forest-600 hover:bg-forest-700 text-cream-50 font-light rounded-full transition-all duration-200 hover:shadow-lg text-lg"
      >
        Continue →
      </button>
    </div>,

    // Screen 4: Ready to Draw
    <div key="ready" className="flex flex-col items-center justify-center min-h-screen bg-cream-50 px-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Card back illustration with botanical pattern */}
        <div className="w-64 h-96 mb-12 bg-cream-50 rounded-2xl shadow-2xl border-2 border-forest-300 flex items-center justify-center overflow-hidden relative">
          <div
            className="absolute inset-8 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/card-back-pattern.png)',
              backgroundSize: 'cover',
            }}
          />
        </div>

        <h2 className="text-4xl font-light text-forest-900 mb-4 text-center">
          Your first card awaits{name ? `, ${name}` : ''}
        </h2>

        <p className="text-forest-600 text-xl md:text-2xl font-light text-center mb-12">
          Take a breath. When you're ready...
        </p>

        <button
          onClick={handleNext}
          className="px-12 py-5 bg-forest-600 hover:bg-forest-700 text-cream-50 font-light rounded-full transition-all duration-200 hover:shadow-lg text-xl"
        >
          Draw my card
        </button>
      </div>

    </div>,
  ];

  return <>{screens[currentStep]}</>;
}
