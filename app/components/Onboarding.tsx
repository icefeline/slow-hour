'use client';

import { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [reminderTime, setReminderTime] = useState('08:00');

  const totalSteps = 5; // 0-indexed, so 6 screens total

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save that onboarding is complete
      localStorage.setItem('onboardingComplete', 'true');
      if (reminderTime) {
        localStorage.setItem('reminderTime', reminderTime);
      }
      onComplete();
    }
  };

  const handleSkipReminder = () => {
    setCurrentStep(totalSteps);
  };

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

          <p className="text-forest-600 text-xl font-light">
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

    // Screen 1: The Practice
    <div key="practice" className="flex flex-col items-center justify-center min-h-screen bg-cream-50 px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md">
        {/* Simple card flip visual */}
        <div className="w-48 h-72 mb-12 perspective-1000">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-forest-600 to-forest-800 rounded-2xl shadow-2xl border-2 border-forest-300 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-32 h-32 text-cream-100">
                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
                <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
                <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
                <circle cx="50" cy="50" r="4" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-light text-forest-900 mb-4 text-center">
          Each morning, draw a single tarot card
        </h2>

        <p className="text-forest-600 text-lg font-light text-center">
          A gentle ritual for reflection and intention
        </p>
      </div>

      <div className="mb-12">
        <button
          onClick={handleNext}
          className="px-8 py-4 bg-forest-600 hover:bg-forest-700 text-cream-50 font-light rounded-full transition-all duration-200 hover:shadow-lg text-lg"
        >
          Continue →
        </button>
      </div>
    </div>,

    // Screen 2: Reflection
    <div key="reflection" className="flex flex-col items-center justify-center min-h-screen bg-cream-50 px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md">
        {/* Hand-drawn journal icon */}
        <div className="w-32 h-32 mb-12">
          <svg viewBox="0 0 100 100" className="w-full h-full text-forest-700">
            {/* Book/journal */}
            <rect x="20" y="15" width="60" height="70" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="40" y1="15" x2="40" y2="85" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <line x1="30" y1="35" x2="70" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <line x1="30" y1="45" x2="70" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <line x1="30" y1="55" x2="65" y2="55" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          </svg>
        </div>

        <h2 className="text-4xl font-light text-forest-900 mb-4 text-center">
          Write what it means to you
        </h2>

        <p className="text-forest-600 text-lg font-light text-center">
          Your reflections create a private journal,<br />
          a chronicle of your inner year
        </p>
      </div>

      <div className="mb-12">
        <button
          onClick={handleNext}
          className="px-8 py-4 bg-forest-600 hover:bg-forest-700 text-cream-50 font-light rounded-full transition-all duration-200 hover:shadow-lg text-lg"
        >
          Continue →
        </button>
      </div>
    </div>,

    // Screen 3: Your Journey
    <div key="journey" className="flex flex-col items-center justify-center min-h-screen bg-cream-50 px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md">
        {/* Mini year view preview */}
        <div className="mb-12 flex items-center gap-1 opacity-60">
          {/* Mix of vertical lines and mini cards */}
          {[...Array(30)].map((_, i) => {
            const hasCard = i % 5 === 0;
            return hasCard ? (
              <div
                key={i}
                className="w-4 h-6 bg-cream-100 border border-forest-400 rounded-sm"
              />
            ) : (
              <div key={i} className="w-0.5 h-6 bg-forest-300 opacity-40" />
            );
          })}
        </div>

        <h2 className="text-4xl font-light text-forest-900 mb-4 text-center">
          Watch your year unfold
        </h2>

        <p className="text-forest-600 text-lg font-light text-center">
          Every card you draw becomes part of<br />
          your visual tapestry
        </p>
      </div>

      <div className="mb-12">
        <button
          onClick={handleNext}
          className="px-8 py-4 bg-forest-600 hover:bg-forest-700 text-cream-50 font-light rounded-full transition-all duration-200 hover:shadow-lg text-lg"
        >
          Continue →
        </button>
      </div>
    </div>,

    // Screen 4: Choose Your Time
    <div key="reminder" className="flex flex-col items-center justify-center min-h-screen bg-cream-50 px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md">
        <h2 className="text-4xl font-light text-forest-900 mb-4 text-center">
          When would you like to draw?
        </h2>

        <p className="text-forest-600 text-lg font-light text-center mb-12">
          We'll send a gentle reminder
        </p>

        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="text-4xl font-light text-forest-900 bg-transparent border-b-2 border-forest-300 focus:border-forest-600 outline-none px-4 py-2 text-center mb-12"
        />
      </div>

      <div className="mb-12 flex gap-4">
        <button
          onClick={handleSkipReminder}
          className="px-8 py-4 bg-forest-100 hover:bg-forest-200 text-forest-700 font-light rounded-full transition-all duration-200 text-lg"
        >
          Skip for now
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-4 bg-forest-600 hover:bg-forest-700 text-cream-50 font-light rounded-full transition-all duration-200 hover:shadow-lg text-lg"
        >
          Set reminder
        </button>
      </div>

    </div>,

    // Screen 5: Ready
    <div key="ready" className="flex flex-col items-center justify-center min-h-screen bg-cream-50 px-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Card back illustration */}
        <div className="w-64 h-96 mb-12 bg-gradient-to-br from-forest-600 to-forest-800 rounded-2xl shadow-2xl border-2 border-forest-300 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-40 h-40 text-cream-100">
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4" />
            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.5" />
            <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.4" />
          </svg>
        </div>

        <h2 className="text-4xl font-light text-forest-900 mb-4 text-center">
          Your first card awaits
        </h2>

        <p className="text-forest-600 text-lg font-light text-center mb-12">
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
