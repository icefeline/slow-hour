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
    // Allow empty string
    if (value === '') {
      setBirthDate('');
      setDateError('');
      return;
    }

    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');

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
    // Allow empty string
    if (value === '') {
      setBirthTime('');
      setTimeError('');
      return;
    }

    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');

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

    // Basic validation: must contain at least one letter and comma
    if (value.length > 0 && !value.includes(',')) {
      setLocationError('please enter city, country');
    } else if (value.length > 2) {
      // Clear error if format looks valid
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

  // Sun sign observations
  const sunObservations: { [key: string]: string } = {
    aries: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    taurus: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    gemini: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    cancer: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    leo: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    virgo: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    libra: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    scorpio: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    sagittarius: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    capricorn: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    aquarius: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all.",
    pisces: "you show up composed, together—people assume you've got it all figured out. there's this seriousness to you, this sense of responsibility. but sometimes you wish people would see the uncertainty underneath. but underneath that? you're holding so much closer than anyone realizes. and your mind wants to understand feelings from above, make sense of the patterns. like you feel everything intensely, but need distance to process it all."
  };

  const getWelcomeMessage = (): string => {
    if (!birthDate) return '';

    const sunSign = getSunSign(birthDate);
    const hasBirthTime = birthTime && !noKnowBirthTime;
    const hasLocation = birthLocation && birthLocation.includes(',');

    // TIER 1: has birthdate + time + location
    if (hasBirthTime && hasLocation) {
      return `${name}, hey.\n\n${sunObservations[sunSign]}\n\nthe cards see all of it. take your time here.`;
    }

    // TIER 2: has birthdate + time OR birthdate + location
    if (hasBirthTime || hasLocation) {
      return `nice to meet you, ${name}.\n\n${sunObservations[sunSign]}\n\nthe cards get it. they're here when you need them.`;
    }

    // TIER 3: birthdate only
    return `${name}, welcome.\n\n${sunObservations[sunSign]}\n\nthe cards won't ask you to explain yourself. draw whenever it feels right.`;
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
        // Welcome screen
        return (
          <div className="flex flex-col items-center justify-center h-full px-12">
            <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full">
              <img
                src="/spiral-logo.png"
                alt="Slow Hour"
                className="w-64 h-auto mb-8"
              />
              <button
                onClick={handleNext}
                className="px-12 py-4 bg-black text-white rounded-full transition-all duration-200 hover:bg-black/80 text-2xl"
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
          <div className="flex flex-col items-center justify-between h-full px-12">
            <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full space-y-4">
              <h2
                className="text-5xl text-center text-black"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                what's your name?
              </h2>

              <p
                className="text-2xl text-center text-black/60 mb-4"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
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
                className="w-full max-w-md px-8 py-6 rounded-3xl text-black text-center focus:outline-none text-3xl"
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
                className="mb-16 px-8 py-3 bg-black text-white rounded-full transition-all duration-200 hover:bg-black/80 text-xl"
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
          <div className="flex flex-col items-center justify-between h-full px-12">
            <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full">
              <h2
                className="text-5xl text-center text-black"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                when were you born?
              </h2>

              <p
                className="text-2xl text-center text-black/60 mt-2 mb-8"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                slow hour may surprise you with a birthday gift
              </p>

              <div className="w-full max-w-2xl space-y-4">
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
                      }}
                      maxLength={10}
                      className="w-full px-8 py-5 rounded-full text-black text-center focus:outline-none text-2xl"
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
                      maxLength={5}
                      className="w-full px-8 py-5 rounded-full text-black text-center focus:outline-none text-2xl"
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
                    className="w-full px-8 py-5 rounded-full text-black text-center focus:outline-none text-2xl"
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

                <p
                  className="text-xl text-center text-black/60 pt-2"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  where you entered the world adds depth to your reading
                </p>
              </div>
            </div>

            {canContinueFromBirthdate && (
              <button
                onClick={handleNext}
                className="mb-16 px-8 py-3 bg-black text-white rounded-full transition-all duration-200 hover:bg-black/80 text-xl"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                continue →
              </button>
            )}
          </div>
        );

      case 3:
        // Welcome message with typewriter effect and draggable card
        return (
          <div className="flex flex-col items-center justify-between h-full px-12 py-16">
            <div className="flex flex-col items-center max-w-2xl w-full mt-8">
              <p
                className="text-3xl text-center text-black whitespace-pre-line"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '1.4' }}
              >
                {displayedText}
              </p>
            </div>

            {isTypingComplete && !isDragging && (
              <div className="relative flex items-center gap-4">
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
        transform: shouldCrumble ? 'scale(0)' : 'scale(1)',
        opacity: shouldCrumble ? 0 : 1,
        transition: shouldCrumble ? 'all 1s ease-out' : 'none',
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
            transform: `rotate(${card.rotation}deg) ${shouldCrumble ? 'scale(0)' : 'scale(1)'}`,
            opacity: shouldCrumble ? 0 : 1,
            transition: shouldCrumble ? 'all 0.8s ease-out' : 'none',
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
