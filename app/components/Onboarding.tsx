'use client';

import { useState, useEffect } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(''); // MM/DD/YYYY
  const [birthTime, setBirthTime] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [noKnowBirthTime, setNoKnowBirthTime] = useState(false);

  // Error states
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [locationError, setLocationError] = useState('');

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Draggable card state
  const [isDragging, setIsDragging] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [cascadedCards, setCascadedCards] = useState<Array<{ x: number; y: number; rotation: number; id: number }>>([]);
  const [cardIdCounter, setCardIdCounter] = useState(0);
  const [shouldCrumble, setShouldCrumble] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const totalSteps = 3; // 0: welcome screen, 1: name, 2: birthdate+time+location, 3: message

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save user data and mark onboarding as complete
      localStorage.setItem('userName', name);
      localStorage.setItem('userBirthdate', birthDate);
      if (birthTime && !noKnowBirthTime) {
        localStorage.setItem('userBirthTime', birthTime);
      }
      if (birthLocation) {
        localStorage.setItem('userBirthLocation', birthLocation);
      }
      localStorage.setItem('onboardingComplete', 'true');
      onComplete();
    }
  };

  const canContinueFromName = name.trim().length > 0;
  const canContinueFromBirthdate = birthDate.length === 10 && !dateError; // MM/DD/YYYY format and no errors

  // Format date input with auto-slashes (allow backspace to remove all)
  const handleDateChange = (value: string) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');

    // Allow clearing completely
    if (digitsOnly === '') {
      setBirthDate('');
      setDateError('');
      return;
    }

    // Format with slashes
    let formatted = digitsOnly;
    if (digitsOnly.length >= 2) {
      formatted = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2);
    }
    if (digitsOnly.length >= 4) {
      formatted = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4) + '/' + digitsOnly.slice(4, 8);
    }

    setBirthDate(formatted);

    // Validate date when complete
    if (digitsOnly.length === 8) {
      const month = parseInt(digitsOnly.slice(0, 2));
      const day = parseInt(digitsOnly.slice(2, 4));
      const year = parseInt(digitsOnly.slice(4, 8));

      const date = new Date(year, month - 1, day);
      const today = new Date();

      // Check if date is valid
      if (date.getMonth() + 1 !== month || date.getDate() !== day || date.getFullYear() !== year) {
        setDateError('please enter a valid date');
      } else if (date > today) {
        setDateError('birthdate cannot be in the future');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  };

  // Format time input with validation (allow backspace to remove all)
  const handleTimeChange = (value: string) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');

    // Allow clearing completely
    if (digitsOnly === '') {
      setBirthTime('');
      setTimeError('');
      return;
    }

    // Format with colon
    let formatted = digitsOnly;
    if (digitsOnly.length >= 2) {
      formatted = digitsOnly.slice(0, 2) + ':' + digitsOnly.slice(2, 4);
    }

    setBirthTime(formatted);

    // Validate time when complete
    if (digitsOnly.length === 4) {
      const hours = parseInt(digitsOnly.slice(0, 2));
      const minutes = parseInt(digitsOnly.slice(2, 4));

      if (hours > 23 || minutes > 59) {
        setTimeError('please enter a valid time (00:00-23:59)');
      } else {
        setTimeError('');
      }
    } else {
      setTimeError('');
    }
  };

  // Validate location (basic check for now - can be enhanced with API)
  const handleLocationChange = (value: string) => {
    setBirthLocation(value);

    if (value.length === 0) {
      setLocationError('');
      return;
    }

    // If it contains a comma, validate as city, country format
    if (value.includes(',')) {
      const parts = value.split(',').map(p => p.trim());
      const city = parts[0];
      const country = parts[1];

      // If country part is empty or too short, show error
      if (country && country.length > 0 && country.length < 2) {
        setLocationError('please enter a valid location');
        return;
      }

      // If city is too short, show error
      if (city.length < 2) {
        setLocationError('please enter a valid location');
        return;
      }

      // Both parts look good
      setLocationError('');
    } else {
      // No comma - treat as city-state (Singapore, Monaco, etc)
      if (value.trim().length < 2) {
        setLocationError('please enter a valid location');
        return;
      }
      setLocationError('');
    }
  };

  // Calculate sun sign from birthdate (MM/DD/YYYY)
  const getSunSign = (dateStr: string): string => {
    const [month, day] = dateStr.split('/').map(num => parseInt(num));
    const m = month;
    const d = day;

    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'aries';
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'taurus';
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'gemini';
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'cancer';
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'leo';
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'virgo';
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'libra';
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'scorpio';
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'sagittarius';
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'capricorn';
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'aquarius';
    return 'pisces';
  };

  // Helper: Calculate life path number from birthdate (MM/DD/YYYY)
  const getLifePathNumber = (dateStr: string): number => {
    const digits = dateStr.replace(/\//g, '').split('').map(Number);
    let sum = digits.reduce((acc, digit) => acc + digit, 0);

    // Reduce to single digit (except master numbers 11, 22, 33)
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
    }

    return sum;
  };

  // Helper: Get moon sign (simplified - needs full ephemeris for accuracy)
  // This is a placeholder that returns a moon sign based on day of month
  // In production, you'd use an astronomy library like astronomy-engine
  const getMoonSign = (dateStr: string, timeStr: string): string => {
    const [month, day, year] = dateStr.split('/').map(Number);
    // Simplified: moon changes signs approximately every 2.5 days
    const dayOfYear = Math.floor((new Date(year, month - 1, day).getTime() - new Date(year, 0, 0).getTime()) / 86400000);
    const moonIndex = Math.floor((dayOfYear * 12) / 365) % 12;
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    return signs[moonIndex];
  };

  // Helper: Get rising sign (simplified - needs exact time and location)
  // This is a placeholder that uses birth hour
  const getRisingSign = (dateStr: string, timeStr: string): string => {
    const [hours] = timeStr.split(':').map(Number);
    const risingIndex = Math.floor(hours / 2) % 12;
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    return signs[risingIndex];
  };

  // Modular message building blocks
  const sunInsights: { [key: string]: string } = {
    aries: "you move through the world with this quiet fire, and people see the action but miss how much you're holding back. there's a part of you that second-guesses before the leap, even when everyone assumes you're certain.",
    taurus: "you show up steady and people lean on that, but underneath there's this exhaustion from always being the one who holds it together. sometimes you just want permission to be soft without the world needing something from you.",
    gemini: "you're quick and adaptable, and people think that means you're light. but there's this depth you carry that no one sees, thoughts that circle back when you're alone and the performance is over.",
    cancer: "you feel everything even when you don't show it, and people mistake your care for simplicity. but you're learning the harder thing: when to protect yourself, when to let others carry their own weight.",
    leo: "you shine in rooms and people assume it's confidence, but sometimes the spotlight feels like a weight you didn't ask for. there's a version of you that just wants to rest without worrying the light will go out.",
    virgo: "you notice everything, the details and patterns others miss. but sometimes all that analyzing is just a way to stay above the mess instead of sitting in the feeling itself.",
    libra: "you make it look easy, the balance and the grace. but inside you're constantly weighing what you gave against what you got back, wondering if you disappeared somewhere in the middle.",
    scorpio: "you hold things close because you've learned that intensity scares people. but what they don't see is how carefully you choose what to reveal, how much protection that distance really is.",
    sagittarius: "you're always looking ahead, searching for the next thing. but sometimes the optimism is just armor keeping you moving so you don't have to sit with what's uncomfortable right here.",
    capricorn: "you carry responsibility like it's woven into you, and people see composure. but they miss the weight of it, the exhaustion you don't name because naming it feels like failing.",
    aquarius: "you see patterns others miss and think in ways that feel different from everyone around you. but sometimes that distance is lonely, like you're watching from outside a window you can't quite open.",
    pisces: "you dissolve into the emotions around you and feel everything like it's yours. but sometimes you need permission to put it down, to remember that not all of it belongs to you."
  };

  const moonInsights: { [key: string]: string } = {
    aries: "emotionally, you can't sit still with what hurts. you need to move through it, do something, anything. processing while static feels like drowning.",
    taurus: "your emotional world craves the familiar, the solid ground. when things shift unexpectedly, it shakes you more than anyone sees.",
    gemini: "you need to talk through what you feel, turn it over in conversation until it makes sense. silence with emotion feels suffocating.",
    cancer: "your feelings go deeper than this lifetime, like you're carrying emotions your family never had words for. it's ancestral weight.",
    leo: "you need people to see you when you're soft, not just when you're shining. the attention isn't vanity, it's how you know you're real.",
    virgo: "you try to organize emotions like they're problems to solve, tasks to complete. but some feelings refuse to be fixed.",
    libra: "you feel through the people around you, absorbing and reflecting until you're not sure what's yours anymore. it's exhausting.",
    scorpio: "your emotions don't know moderation. you're either diving into the depths or shutting down completely, no in-between.",
    sagittarius: "you need space around your feelings, room to breathe and move. when commitment tightens, it starts to feel like captivity.",
    capricorn: "you guard your soft parts with discipline, keep vulnerability contained. letting it loose feels like losing control of everything.",
    aquarius: "you need distance to understand what you feel, space to think it through. raw emotion without analysis makes you panic.",
    pisces: "you soak up everything around you like you're made of water. other people's pain becomes yours, and you forget where you end."
  };

  const risingInsights: { [key: string]: string } = {
    aries: "you walk into rooms like you're braced for impact, direct and unfiltered. people mistake it for fearlessness, but really you just can't do pretense.",
    taurus: "there's something grounded in how you show up that makes people feel safe. they don't know you're still finding your footing too.",
    gemini: "you shift to match whoever's in front of you, adapting without thinking. it's useful until you can't remember which version is actually you.",
    cancer: "you lead with something soft even when you're trying to protect yourself. people pick up on it before you've said anything.",
    leo: "you take up space without meaning to, even when you're trying to make yourself smaller. there's something magnetic you can't turn off.",
    virgo: "you arrive looking like you've considered every detail, put together and prepared. no one sees how much overthinking it took to get there.",
    libra: "you smooth things over without trying, make everyone comfortable. but sometimes in all that harmony, you disappear.",
    scorpio: "there's an intensity people feel before you've even spoken. you're terrible at small talk because you can't do surface level.",
    sagittarius: "you show up open and enthusiastic, like nothing could weigh you down. people don't realize you're just better at moving forward than sitting still.",
    capricorn: "you carry yourself with this serious composure that makes people think you're fine. they can't see the pressure you're holding inside.",
    aquarius: "you show up slightly outside the frame, different in a way that's hard to name. people either get it or they don't, rarely anything in between.",
    pisces: "you absorb the feeling of rooms without meaning to, porous in a way that makes people feel seen. it takes more from you than they realize."
  };

  const numerologyInsights: { [key: number]: string } = {
    1: "your path keeps pushing you to lead even when it feels isolating. you're learning to trust where you're going when no one else is coming with you.",
    2: "you're here to find the middle ground, build bridges between people. but sometimes keeping peace means you've lost track of your own voice.",
    3: "expression is what you're here to do, whether it's through words or art or just being fully yourself. when you hold it back, it festers inside.",
    4: "you're building something meant to last, something solid. but that pressure to be the stable one can feel like you're holding up the ceiling.",
    5: "freedom isn't optional for you, it's oxygen. routine makes you want to crawl out of your skin. you're figuring out how to commit without disappearing.",
    6: "you're built to take care of people, to serve and nurture. but you're learning the hard way that martyrdom isn't love.",
    7: "you're here to go deep, question everything, seek what's true underneath. surface conversations make your skin itch. you need solitude like other people need air.",
    8: "your work is about power and legacy, building something that matters. but you're learning that real strength isn't the same as control.",
    9: "you're always finishing cycles, letting go of what other people cling to. wisdom for you means releasing, again and again, even when it hurts.",
    11: "you pick up on things most people miss, tuned into frequencies others can't hear. the sensitivity is overwhelming until you realize it's a gift.",
    22: "you're here to build something massive, something that outlives you. the vision is crystal clear but bringing it to life takes everything you have.",
    33: "you carry this healing frequency that people can feel before you speak. the responsibility of it gets heavy when you realize they're all looking to you."
  };

  const getWelcomeMessage = (): string => {
    if (!birthDate) return '';

    const sunSign = getSunSign(birthDate);
    const hasBirthTime = birthTime && !noKnowBirthTime;
    const hasLocation = birthLocation && birthLocation.trim().length >= 2;

    // TIER 1: has birthdate + time + location (Sun/Moon/Rising)
    if (hasBirthTime && hasLocation) {
      const moonSign = getMoonSign(birthDate, birthTime);
      const risingSign = getRisingSign(birthDate, birthTime);

      return `${name}, hey.\n\n${sunInsights[sunSign]} ${moonInsights[moonSign]} ${risingInsights[risingSign]}\n\nthe cards see all of it. take your time here.`;
    }

    // TIER 2A: has birthdate + time (Sun/Moon)
    if (hasBirthTime) {
      const moonSign = getMoonSign(birthDate, birthTime);

      return `nice to meet you, ${name}.\n\n${sunInsights[sunSign]} ${moonInsights[moonSign]}\n\nthe cards get it. they're here when you need them.`;
    }

    // TIER 2B: has birthdate + location (Sun only, simplified)
    if (hasLocation) {
      return `nice to meet you, ${name}.\n\n${sunInsights[sunSign]}\n\nthe cards get it. they're here when you need them.`;
    }

    // TIER 3: birthdate only (Sun + Numerology)
    const lifePathNumber = getLifePathNumber(birthDate);
    return `${name}, welcome.\n\n${sunInsights[sunSign]} ${numerologyInsights[lifePathNumber]}\n\nthe cards won't ask you to explain yourself. draw whenever it feels right.`;
  };

  // Typewriter effect - triggers when entering step 3
  useEffect(() => {
    if (currentStep === 3) {
      setDisplayedText('');
      setIsTypingComplete(false);

      const fullText = getWelcomeMessage();
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTypingComplete(true);
          clearInterval(typingInterval);
        }
      }, 30); // 30ms per character for smooth typing

      return () => clearInterval(typingInterval);
    }
  }, [currentStep, name, birthDate]);

  // Global mouse event listeners for smooth dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;
      setCardPosition({ x: newX, y: newY });

      // Create smooth cascade trail - only add card if moved enough distance
      setCascadedCards(prev => {
        const lastCard = prev[prev.length - 1];
        if (lastCard) {
          const distance = Math.sqrt(
            Math.pow(newX - lastCard.x, 2) + Math.pow(newY - lastCard.y, 2)
          );

          // Only add new card if moved at least 15px from last card
          if (distance > 15) {
            const rotation = Math.random() * 30 - 15;
            setCardIdCounter(prev => prev + 1);
            return [...prev, { x: newX, y: newY, rotation, id: prev.length }];
          }
        }
        return prev;
      });
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Drag handlers for card cascade
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTypingComplete) return; // Only allow dragging after typing completes
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setCardPosition({ x: e.clientX, y: e.clientY });

    // Add initial card at starting position
    const rotation = Math.random() * 30 - 15;
    setCascadedCards([{ x: e.clientX, y: e.clientY, rotation, id: cardIdCounter }]);
    setCardIdCounter(prev => prev + 1);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    // User released the mouse - always trigger the completion
    // No minimum drag requirement - any drag counts
    setIsDragging(false);
    setShouldCrumble(true);

    // After crumble animation, show loading screen
    setTimeout(() => {
      setShowLoading(true);

      // Save user data
      localStorage.setItem('userName', name);
      localStorage.setItem('userBirthdate', birthDate);
      if (birthTime && !noKnowBirthTime) {
        localStorage.setItem('userBirthTime', birthTime);
      }
      if (birthLocation) {
        localStorage.setItem('userBirthLocation', birthLocation);
      }
      localStorage.setItem('onboardingComplete', 'true');

      // After loading screen, transition to main app
      setTimeout(() => {
        onComplete();
      }, 2000); // Show loading for 2 seconds
    }, 1000);
  };

  // Render content inside the blue screen area
  const renderScreenContent = () => {
    switch (currentStep) {
      case 0:
        // Welcome screen with logo
        return (
          <div className="flex flex-col items-center justify-center h-full px-12">
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full">
              {/* "slow hour" logo image */}
              <div className="relative mb-16 w-full px-8">
                <img
                  src="/slow-hour-logo.png"
                  alt="slow hour"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    maxWidth: '900px',
                    margin: '0 auto',
                    display: 'block'
                  }}
                />
              </div>

              <button
                onClick={handleNext}
                className="px-12 py-4 bg-black text-white rounded-full transition-all duration-200 hover:bg-black/80 text-3xl"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                continue →
              </button>
            </div>
          </div>
        );

      case 1:
        // Name input
        return (
          <div className="flex flex-col items-center justify-center h-full px-12 relative">
            <div className="flex flex-col items-center max-w-lg w-full">
              <h2
                className="text-5xl text-center text-black"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                what's your name?
              </h2>

              <p
                className="text-2xl text-center text-black/60 mt-1"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                the one that feels most like you
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
                className="w-full max-w-md px-8 py-6 rounded-3xl text-black text-center focus:outline-none text-3xl mt-8"
                style={{
                  fontFamily: 'var(--font-reenie-beanie), cursive',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                autoFocus
              />
            </div>

            {canContinueFromName && (
              <button
                onClick={handleNext}
                className="absolute bottom-16 px-8 py-3 bg-black text-white rounded-full transition-all duration-200 hover:bg-black/80 text-xl"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                continue →
              </button>
            )}
          </div>
        );

      case 2:
        // Birthdate + Time + Location
        return (
          <div className="flex flex-col items-center justify-center h-full px-12 relative">
            <div className="flex flex-col items-center max-w-lg w-full">
              <h2
                className="text-5xl text-center text-black"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                when were you born?
              </h2>

              <p
                className="text-2xl text-center text-black/60 mt-1"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                time moves differently depending on when you arrived
              </p>

              <div className="w-full max-w-2xl space-y-4 mt-8">
                {/* Date and Time inputs side by side */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={birthDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && canContinueFromBirthdate) {
                          handleNext();
                        }
                        if (e.key === 'Backspace' && birthDate.length > 0) {
                          e.preventDefault();
                          const digitsOnly = birthDate.replace(/\D/g, '');
                          const newDigits = digitsOnly.slice(0, -1);
                          handleDateChange(newDigits);
                        }
                      }}
                      maxLength={10}
                      className="w-full px-8 py-6 rounded-3xl text-black text-center focus:outline-none text-3xl"
                      style={{
                        fontFamily: 'var(--font-reenie-beanie), cursive',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        border: dateError ? '2px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    />
                    {dateError && (
                      <p className="text-red-600 text-lg mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                        {dateError}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="hh:mm"
                      value={birthTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && birthTime.length > 0) {
                          e.preventDefault();
                          const digitsOnly = birthTime.replace(/\D/g, '');
                          const newDigits = digitsOnly.slice(0, -1);
                          handleTimeChange(newDigits);
                        }
                      }}
                      maxLength={5}
                      className="w-full px-8 py-6 rounded-3xl text-black text-center focus:outline-none text-3xl"
                      style={{
                        fontFamily: 'var(--font-reenie-beanie), cursive',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        border: timeError ? '2px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    />
                    {timeError && (
                      <p className="text-red-600 text-lg mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                        {timeError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="city, country"
                    value={birthLocation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full px-8 py-6 rounded-3xl text-black text-center focus:outline-none text-3xl"
                    style={{
                      fontFamily: 'var(--font-reenie-beanie), cursive',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(10px)',
                      border: locationError ? '2px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                  />
                  {locationError && (
                    <p className="text-red-600 text-lg mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                      {locationError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {canContinueFromBirthdate && (
              <button
                onClick={handleNext}
                className="absolute bottom-16 px-8 py-3 bg-black text-white rounded-full transition-all duration-200 hover:bg-black/80 text-xl"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                continue →
              </button>
            )}
          </div>
        );

      case 3:
        // Welcome message with typewriter effect and draggable card
        // Calculate if message is long (more than 400 characters means it needs more space)
        const messageLength = getWelcomeMessage().length;
        const isLongMessage = messageLength > 400;

        return (
          <div className="flex flex-col items-center h-full px-12 py-16" style={{ justifyContent: 'space-between' }}>
            <div
              className="flex flex-col items-center max-w-2xl w-full"
              style={{
                marginTop: isLongMessage ? '1rem' : '3rem',
                paddingBottom: isLongMessage ? '3rem' : '0'
              }}
            >
              <p
                className="text-3xl text-center text-black whitespace-pre-line"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '1.4' }}
              >
                {displayedText}
              </p>
            </div>

            {isTypingComplete && !isDragging && (
              <div className="relative flex items-center gap-4 mb-8">
                <img
                  src="/card-back.png"
                  alt="Card back"
                  className="rounded-2xl shadow-xl select-none"
                  style={{
                    width: '140px',
                    height: '210px',
                    objectFit: 'cover',
                    cursor: 'grab',
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                  }}
                  onMouseDown={handleMouseDown}
                  draggable="false"
                />
                <p
                  className="text-2xl text-black/70 animate-bounce"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  ← drag me
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading screen after cascade
  if (showLoading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#172211' }}>
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-[#CEF17B]/30 border-t-[#CEF17B] rounded-full animate-spin"></div>
          <p
            className="text-3xl text-[#CEF17B]"
            style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
          >
            preparing your reading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        opacity: shouldCrumble ? 0 : 1,
        filter: shouldCrumble ? 'blur(20px)' : 'blur(0px)',
        transition: shouldCrumble ? 'opacity 1s ease-out, filter 1s ease-out' : 'none',
      }}
    >
      {/* Animated cosmic background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/onboarding-bg.mp4" type="video/mp4" />
      </video>

      {/* Container for device frame + screen */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="relative flex items-center justify-center">
          {/* Device frame with deck fan - sits BEHIND the blue screen */}
          <img
            src="/device-frame-deck.png"
            alt=""
            className="absolute pointer-events-none z-0"
            style={{
              width: '801px',
              height: '1000px',
              maxWidth: '110vw',
              maxHeight: '100vh',
              objectFit: 'contain',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Blue screen area - this is where content appears and is interactive */}
          {/* Sits ON TOP so users can click/interact with the content */}
          {/* Positioned to fit within the device bezel of the top card in the deck fan */}
          <div
            className="bg-[#E1EEFC] overflow-hidden absolute z-20"
            style={{
              width: '647px',
              height: '909px',
              maxWidth: '85vw',
              maxHeight: '80vh',
              left: '50%',
              top: '50%',
              transform: 'translate(-60.5%, -50%)', // Fine-tune position to sit within device bezel
            }}
          >
            {renderScreenContent()}
          </div>
        </div>
      </div>

      {/* Cascaded cards trail - rendered at root level so they can go anywhere on screen */}
      {cascadedCards.map((card, index) => (
        <img
          key={card.id}
          src="/card-back.png"
          alt=""
          className="rounded-2xl select-none"
          draggable="false"
          style={{
            position: 'fixed',
            left: card.x - 70,
            top: card.y - 105,
            width: '140px',
            height: '210px',
            objectFit: 'cover',
            transform: `rotate(${card.rotation}deg)`,
            opacity: shouldCrumble ? 0 : 1,
            filter: shouldCrumble ? 'blur(10px)' : 'blur(0px)',
            transition: shouldCrumble ? 'opacity 0.8s ease-out, filter 0.8s ease-out' : 'none',
            pointerEvents: 'none',
            zIndex: 9000 + index,
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        />
      ))}

      {/* Active dragging card - always visible during drag */}
      {isDragging && (
        <img
          src="/card-back.png"
          alt="Dragging card"
          className="rounded-2xl shadow-2xl select-none"
          draggable="false"
          style={{
            position: 'fixed',
            left: cardPosition.x - 70,
            top: cardPosition.y - 105,
            width: '140px',
            height: '210px',
            objectFit: 'cover',
            cursor: 'grabbing',
            zIndex: 10000,
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        />
      )}
    </div>
  );
}
