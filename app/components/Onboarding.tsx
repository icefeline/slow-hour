'use client';

import React, { useState, useEffect, useRef } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(''); // DD/MM/YYYY
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

  // Device scale for MacBook / smaller-viewport desktop layout
  const [deviceScale, setDeviceScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Location geocode feedback
  const [locationResolved, setLocationResolved] = useState<string | null>(null);
  const [locationChecking, setLocationChecking] = useState(false);
  const locationDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Claude-generated welcome message for step 3
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(false);

  const totalSteps = 3; // 0: welcome screen, 1: name, 2: birthdate+time+location, 3: message

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Compute the scale so the device frame + content area always fit within the viewport
  useEffect(() => {
    const computeScale = () => {
      // Leave ~5% breathing room on each dimension
      const scaleW = (window.innerWidth * 0.95) / 801;
      const scaleH = (window.innerHeight * 0.95) / 1000;
      setDeviceScale(Math.min(1, scaleW, scaleH));
    };
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, []);

  const handleNext = () => {
    if (currentStep === 2) {
      // Transition to step 3 immediately and fetch the welcome message in parallel
      setCurrentStep(3);
      setWelcomeMessage(null);
      setIsLoadingWelcome(true);
      fetch('/api/welcome-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birthDate,
          birthTime: noKnowBirthTime ? '' : birthTime,
          birthLocation,
        }),
      })
        .then(res => res.json())
        .then(data => {
          setWelcomeMessage(data.message || getWelcomeMessage());
          setIsLoadingWelcome(false);
        })
        .catch(() => {
          setWelcomeMessage(getWelcomeMessage());
          setIsLoadingWelcome(false);
        });
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
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
  const canContinueFromBirthdate = birthDate.length === 10 && !dateError;

  const handleDateChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly === '') { setBirthDate(''); setDateError(''); return; }
    let formatted = digitsOnly;
    if (digitsOnly.length >= 2) formatted = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2);
    if (digitsOnly.length >= 4) formatted = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4) + '/' + digitsOnly.slice(4, 8);
    setBirthDate(formatted);
    if (digitsOnly.length === 8) {
      const day = parseInt(digitsOnly.slice(0, 2));
      const month = parseInt(digitsOnly.slice(2, 4));
      const year = parseInt(digitsOnly.slice(4, 8));
      const date = new Date(year, month - 1, day);
      const today = new Date();
      if (date.getMonth() + 1 !== month || date.getDate() !== day || date.getFullYear() !== year) {
        setDateError('please enter a valid date');
      } else if (date > today) {
        setDateError('birthdate cannot be in the future');
      } else { setDateError(''); }
    } else { setDateError(''); }
  };

  const handleTimeChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly === '') { setBirthTime(''); setTimeError(''); return; }
    let formatted = digitsOnly;
    if (digitsOnly.length >= 2) formatted = digitsOnly.slice(0, 2) + ':' + digitsOnly.slice(2, 4);
    setBirthTime(formatted);
    if (digitsOnly.length === 4) {
      const hours = parseInt(digitsOnly.slice(0, 2));
      const minutes = parseInt(digitsOnly.slice(2, 4));
      if (hours > 23 || minutes > 59) { setTimeError('please enter a valid time (00:00-23:59)'); }
      else { setTimeError(''); }
    } else { setTimeError(''); }
  };

  const handleLocationChange = (value: string) => {
    setBirthLocation(value);
    setLocationResolved(null);
    if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current);

    if (value.length === 0) { setLocationError(''); return; }
    if (value.includes(',')) {
      const parts = value.split(',').map(p => p.trim());
      if (parts[1] && parts[1].length > 0 && parts[1].length < 2) { setLocationError('please enter a valid location'); return; }
      if (parts[0].length < 2) { setLocationError('please enter a valid location'); return; }
      setLocationError('');
    } else {
      if (value.trim().length < 2) { setLocationError('please enter a valid location'); return; }
      setLocationError('');
    }

    if (value.trim().length >= 3) {
      locationDebounceRef.current = setTimeout(async () => {
        setLocationChecking(true);
        try {
          const res = await fetch(`/api/geocode-check?q=${encodeURIComponent(value.trim())}`);
          const data = await res.json();
          setLocationResolved(data.found ?? '');
        } catch {
          setLocationResolved('');
        } finally {
          setLocationChecking(false);
        }
      }, 800);
    }
  };

  const getSunSign = (dateStr: string): string => {
    const [day, month] = dateStr.split('/').map(num => parseInt(num));
    const m = month; const d = day;
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

  const getLifePathNumber = (dateStr: string): number => {
    const digits = dateStr.replace(/\//g, '').split('').map(Number);
    let sum = digits.reduce((acc, digit) => acc + digit, 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
    }
    return sum;
  };

  const getMoonSign = (dateStr: string, timeStr: string): string => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const dayOfYear = Math.floor((new Date(year, month - 1, day).getTime() - new Date(year, 0, 0).getTime()) / 86400000);
    const moonIndex = Math.floor((dayOfYear * 12) / 365) % 12;
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    return signs[moonIndex];
  };

  const getRisingSign = (dateStr: string, timeStr: string): string => {
    const [hours] = timeStr.split(':').map(Number);
    const risingIndex = Math.floor(hours / 2) % 12;
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    return signs[risingIndex];
  };

  const sunInsights: { [key: string]: string } = {
    aries: "you carry more under the surface than people tend to see. there's a lot more going on than you tend to show, and that's what makes this interesting.",
    taurus: "you hold things together in ways others only notice when you stop. there's something in you that needs far more than it asks for.",
    gemini: "you think fast and feel deeply, and most people only catch one of those things. the cards tend to find both.",
    cancer: "you absorb more than you let on — other people's heaviness, old patterns, things that were never even yours. it shows up.",
    leo: "there's more tenderness in you than the confidence suggests. it's often the softer version that people actually need.",
    virgo: "you notice everything, including the things that would be easier to miss. the cards like working with that kind of attention.",
    libra: "you carry a lot for the people around you and make it look effortless. the cards are good at finding what that costs.",
    scorpio: "you already sense more than you're saying — about the situation, about people, about yourself. the cards just confirm it.",
    sagittarius: "you keep looking forward because standing still feels uncomfortable. there's usually something worth pausing for.",
    capricorn: "you hold everything together and almost never let anyone see the effort. the cards notice what you've stopped noticing about yourself.",
    aquarius: "you observe more than you participate. the cards tend to ask what you're watching from that distance.",
    pisces: "everything you feel lands twice as hard because you feel it for yourself and for everyone else. sorting that out is the real work.",
  };

  // Short mobile-only insights (1 sentence each)
  const sunInsightsMobile: { [key: string]: string } = {
    aries: "you carry more under the surface than people know.",
    taurus: "steadiness that costs more than it looks.",
    gemini: "quick on the outside, much deeper underneath.",
    cancer: "you absorb so much that isn't yours to carry.",
    leo: "more tender than the confidence suggests.",
    virgo: "you notice everything. even the things you'd rather not.",
    libra: "holding a lot together for everyone.",
    scorpio: "you already know. you're just waiting to be sure.",
    sagittarius: "always moving so you don't have to stop.",
    capricorn: "composure that takes effort they can't see.",
    aquarius: "observing from a distance, feeling it all anyway.",
    pisces: "everything lands twice as hard when you feel it for everyone.",
  };

  const moonInsightsMobile: { [key: string]: string } = {
    aries: "you process by moving, not by sitting still with it.",
    taurus: "you need solid ground. change shakes you more than anyone sees.",
    gemini: "you need to talk it through to make sense of what you feel.",
    cancer: "your emotions go back further than you — it's ancestral weight.",
    leo: "you need to be seen when you're soft, not just when you're shining.",
    virgo: "you try to organise feelings like problems to solve. some refuse to be fixed.",
    libra: "you feel through the people around you until you've lost track of what's yours.",
    scorpio: "you're all the way in or all the way shut. no in-between.",
    sagittarius: "you need space around your feelings. when it tightens, it starts to feel like captivity.",
    capricorn: "you keep vulnerability contained. letting it loose feels like losing control.",
    aquarius: "you need distance to understand what you feel. raw emotion without analysis panics you.",
    pisces: "you soak up everything around you. other people's pain becomes yours.",
  };

  const risingInsightsMobile: { [key: string]: string } = {
    aries: "you walk in direct and braced. people mistake it for fearlessness.",
    taurus: "you make people feel safe without trying, even when you're still finding your footing.",
    gemini: "you shift to match whoever's in front of you, then forget which version is actually you.",
    cancer: "you lead with softness even when you're trying to protect yourself.",
    leo: "you take up space without trying, even when you're making yourself smaller.",
    virgo: "you arrive looking put-together. no one sees how much overthinking it took.",
    libra: "you make everyone comfortable. sometimes you disappear in the process.",
    scorpio: "people feel your intensity before you've spoken. small talk is agony.",
    sagittarius: "you show up open and light. people don't realise you're just better at moving than sitting still.",
    capricorn: "you look composed and fine. they can't see the pressure you're holding inside.",
    aquarius: "you show up slightly outside the frame. people either get it or they don't.",
    pisces: "you absorb the feeling of rooms without meaning to. it takes more from you than they realise.",
  };

  const numerologyInsightsMobile: { [key: number]: string } = {
    1: "you're here to lead, even when it's isolating.",
    2: "you build bridges between people. but sometimes you've lost your own voice in the process.",
    3: "expression is what you're here to do. holding it back makes it fester.",
    4: "you're building something meant to last. the pressure of being the stable one is exhausting.",
    5: "freedom isn't optional for you. you're figuring out how to commit without disappearing.",
    6: "you're built to care for people. you're learning that martyrdom isn't love.",
    7: "you're here to go deep. surface conversations make your skin itch.",
    8: "your path is about legacy. real strength isn't the same as control.",
    9: "you're always finishing cycles, releasing things even when it hurts.",
    11: "you pick up on frequencies others can't hear. the sensitivity is overwhelming until you realise it's a gift.",
    22: "you're here to build something massive. the vision is clear but bringing it to earth takes everything.",
    33: "you carry a healing frequency people feel before you speak. the responsibility gets heavy.",
  };

  const getWelcomeMessageMobile = (): string => {
    if (!birthDate) return '';
    const sunSign = getSunSign(birthDate);
    const hasBirthTime = birthTime && !noKnowBirthTime;
    const hasLocation = birthLocation && birthLocation.trim().length >= 2;
    if (hasBirthTime && hasLocation) {
      const moonSign = getMoonSign(birthDate, birthTime);
      const risingSign = getRisingSign(birthDate, birthTime);
      return `${name}!\n${sunInsightsMobile[sunSign]}\n${moonInsightsMobile[moonSign]}\n${risingInsightsMobile[risingSign]}\nthe cards are ready — pull one!`;
    }
    if (hasBirthTime) {
      const moonSign = getMoonSign(birthDate, birthTime);
      return `${name}!\n${sunInsightsMobile[sunSign]}\n${moonInsightsMobile[moonSign]}\nthe cards are excited. pull one!`;
    }
    if (hasLocation) {
      return `${name}!\n${sunInsightsMobile[sunSign]}\nthe cards are ready for you. pull one!`;
    }
    const lifePathNumber = getLifePathNumber(birthDate);
    return `${name}!\n${sunInsightsMobile[sunSign]}\n${numerologyInsightsMobile[lifePathNumber]}\nthe cards are ready. pull one!`;
  };

  const moonInsights: { [key: string]: string } = {
    aries: "emotionally, you process by moving — you need to do something with it, not sit still.",
    taurus: "your inner world needs stability. unexpected shifts rattle you harder than most people around you know.",
    gemini: "you need to talk through what you feel to make sense of it. silence with big emotions doesn't work for you.",
    cancer: "some of what you carry emotionally is older than you — pattern, not just feeling.",
    leo: "you need to be seen when you're soft, not just when you're on.",
    virgo: "you try to organise feelings like problems to solve. some of them refuse.",
    libra: "you feel through the people around you until you've lost track of what's actually yours.",
    scorpio: "there's no in-between emotionally — all in or all the way shut.",
    sagittarius: "you need space around your feelings. too much closeness starts to feel like confinement.",
    capricorn: "vulnerability feels like losing control. you're slowly learning that it isn't.",
    aquarius: "you process feelings better from a distance. raw emotion without analysis makes things worse.",
    pisces: "you absorb everything around you. other people's pain becomes yours before you've noticed.",
  };

  const risingInsights: { [key: string]: string } = {
    aries: "you show up direct and ready, even when you're not — people read that as certainty.",
    taurus: "something in your presence makes people feel settled before you've said anything.",
    gemini: "you shift to fit whoever's in front of you, which works until you've lost track of which one is you.",
    cancer: "you lead with care even when you're trying to protect yourself — it comes through anyway.",
    leo: "you take up space effortlessly, even when you're actively trying not to.",
    virgo: "you arrive looking composed and prepared. they can't see the analysis that got you there.",
    libra: "you smooth everything over for everyone. sometimes you disappear a little in the process.",
    scorpio: "people feel the intensity before you've spoken. small talk genuinely costs you something.",
    sagittarius: "you come across bright and open. people don't realise you're just faster at moving than stopping.",
    capricorn: "you carry a composed, reliable presence. the pressure behind it isn't visible.",
    aquarius: "you arrive slightly outside the frame. people either get that or they don't.",
    pisces: "you absorb the mood of whatever room you enter. it takes more from you than it looks.",
  };

  const numerologyInsights: { [key: number]: string } = {
    1: "you're being pushed to lead, even when it feels like a solo thing.",
    2: "you build bridges between people. sometimes you lose your own voice doing it.",
    3: "expression is what you're here for. holding it in makes things worse.",
    4: "you're building something solid, and carrying the weight of being the stable one.",
    5: "freedom isn't optional for you — you're figuring out how to commit without losing yourself.",
    6: "you're built to care for people. the line between love and self-erasure is the real work.",
    7: "you're here to go deep. surface-level anything makes your skin itch.",
    8: "building something real that lasts. strength and control aren't the same thing.",
    9: "you're always releasing things that others cling to. that's the path.",
    11: "you pick up on frequencies others miss. the sensitivity is the gift, even when it's overwhelming.",
    22: "you're here to build something massive. bringing the vision down to earth is everything.",
    33: "you carry something people feel before you speak. the weight of that responsibility is real.",
  };

  const getWelcomeMessage = (): string => {
    if (!birthDate) return '';
    const sunSign = getSunSign(birthDate);
    const hasBirthTime = birthTime && !noKnowBirthTime;
    const hasLocation = birthLocation && birthLocation.trim().length >= 2;
    if (hasBirthTime && hasLocation) {
      const moonSign = getMoonSign(birthDate, birthTime);
      const risingSign = getRisingSign(birthDate, birthTime);
      return `${name}!\n\n${sunInsights[sunSign]}\n\n${moonInsights[moonSign]}\n\n${risingInsights[risingSign]}\n\nthe cards see all of it — let's find out what's up.`;
    }
    if (hasBirthTime) {
      const moonSign = getMoonSign(birthDate, birthTime);
      return `${name}!\n\n${sunInsights[sunSign]}\n\n${moonInsights[moonSign]}\n\nthe cards get it. pull one when you're ready.`;
    }
    if (hasLocation) {
      return `${name}!\n\n${sunInsights[sunSign]}\n\nthe cards get it. pull one when you're ready.`;
    }
    const lifePathNumber = getLifePathNumber(birthDate);
    return `${name}!\n\n${sunInsights[sunSign]}\n\n${numerologyInsights[lifePathNumber]}\n\nthe cards are ready whenever you are.`;
  };

  // Typewriter effect — waits for the API-generated welcome message
  useEffect(() => {
    if (currentStep === 3 && welcomeMessage !== null) {
      setDisplayedText('');
      setIsTypingComplete(false);
      const fullText = welcomeMessage;
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTypingComplete(true);
          clearInterval(typingInterval);
        }
      }, 30);
      return () => clearInterval(typingInterval);
    }
  }, [currentStep, welcomeMessage]);

  // ── Drag helpers ─────────────────────────────────────────────────────────
  const addCascadeCard = (x: number, y: number) => {
    setCascadedCards(prev => {
      const lastCard = prev[prev.length - 1];
      if (lastCard) {
        const distance = Math.sqrt(Math.pow(x - lastCard.x, 2) + Math.pow(y - lastCard.y, 2));
        if (distance <= 15) return prev;
      }
      const rotation = Math.random() * 30 - 15;
      setCardIdCounter(c => c + 1);
      return [...prev, { x, y, rotation, id: prev.length }];
    });
  };

  const completeDrag = () => {
    setIsDragging(false);
    setShouldCrumble(true);
    setTimeout(() => {
      setShowLoading(true);
      localStorage.setItem('userName', name);
      localStorage.setItem('userBirthdate', birthDate);
      if (birthTime && !noKnowBirthTime) localStorage.setItem('userBirthTime', birthTime);
      if (birthLocation) localStorage.setItem('userBirthLocation', birthLocation);
      localStorage.setItem('onboardingComplete', 'true');
      setTimeout(() => onComplete(), 2000);
    }, 1000);
  };

  // Mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTypingComplete) return;
    e.preventDefault();
    setIsDragging(true);
    setCardPosition({ x: e.clientX, y: e.clientY });
    const rotation = Math.random() * 30 - 15;
    setCascadedCards([{ x: e.clientX, y: e.clientY, rotation, id: cardIdCounter }]);
    setCardIdCounter(c => c + 1);
  };

  // Touch drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTypingComplete) return;
    e.preventDefault(); // Prevent iOS tap highlight / scale flash before drag
    const touch = e.touches[0];
    setIsDragging(true);
    setCardPosition({ x: touch.clientX, y: touch.clientY });
    const rotation = Math.random() * 30 - 15;
    setCascadedCards([{ x: touch.clientX, y: touch.clientY, rotation, id: cardIdCounter }]);
    setCardIdCounter(c => c + 1);
  };

  // Global mouse listeners
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setCardPosition({ x: e.clientX, y: e.clientY });
      addCascadeCard(e.clientX, e.clientY);
    };
    const handleMouseUp = () => completeDrag();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Global touch listeners
  useEffect(() => {
    if (!isDragging) return;
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      setCardPosition({ x: touch.clientX, y: touch.clientY });
      addCascadeCard(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = () => completeDrag();
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  // ── Shared input style ────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    fontFamily: 'var(--font-vt323), monospace',
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#E1EEFC',
    borderRadius: '1.5rem',   // explicit radius — prevents iOS from squaring corners on focus
    WebkitAppearance: 'none',
    appearance: 'none',
  };

  const inputErrorStyle = {
    ...inputStyle,
    border: '2px solid rgba(239, 68, 68, 0.6)',
  } as const;

  // ── Step content (MOBILE) ──────────────────────────────────────────────────────────
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col flex-1">
            {/* "slow hour + logo" group — 85vw wide (331px at 390px ref), centred, 18vh from top */}
            {/* Text overflows the group edges — viewport clips symmetrically */}
            <div style={{
              position: 'relative',
              width: '85vw',
              height: '90vw',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '18vh',
              flexShrink: 0,
            }}>
              {/* Glass text: "sl w / hour" — split for per-line letter-spacing */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  fontFamily: 'var(--font-instrument-serif), "Instrument Serif", serif',
                  fontWeight: 400,
                  textTransform: 'lowercase',
                  textAlign: 'center',
                  WebkitTextFillColor: 'rgba(206, 241, 123, 0.20)',
                  color: 'rgba(206, 241, 123, 0.20)',
                  WebkitTextStroke: '0.7px rgba(206, 241, 123, 0.80)',
                  margin: 0,
                  padding: 0,
                  userSelect: 'none',
                } as React.CSSProperties}
              >
                <span style={{ display: 'block', fontSize: '56.4vw', lineHeight: '44.9vw', letterSpacing: '-0.025em' }}>sl w</span>
                <span style={{ display: 'block', fontSize: '56.4vw', lineHeight: '44.9vw', letterSpacing: '-0.03em' }}>hour</span>
              </div>
              {/* Spiral — sized to sit within the 'sl w' line, not touching 'hour' */}
              <img
                src="/spiral-icon.svg"
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  width: '58vw',
                  height: '49.7vw',
                  top: '10vw',
                  left: '16vw',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Subtitle */}
            <p
              className="text-center text-[#CEF17B]"
              style={{
                fontFamily: 'var(--font-reenie-beanie), cursive',
                fontSize: '24px',
                lineHeight: '24px',
                fontWeight: 500,
                padding: '0 24px',
                marginTop: '20px',
              }}
            >
              build your archive of daily perspectives.
            </p>

            {/* Spacer — pushes button to the bottom */}
            <div className="flex-1" />

            {/* Continue button */}
            <div className="flex justify-center" style={{ padding: '0 20px', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 56px)' }}>
              <button
                onClick={handleNext}
                className="transition-all duration-200"
                style={{
                  display: 'flex',
                  width: '350px',
                  maxWidth: '100%',
                  height: '56px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-reenie-beanie), cursive',
                  fontSize: '24px',
                  fontWeight: 500,
                  background: '#CEF17B',
                  color: '#172211',
                  boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25)',
                }}
              >
                continue →
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col items-center w-full flex-1 py-6">
            {/* flex-1 centers the content vertically in the remaining space */}
            <div className="flex-1 flex flex-col items-center justify-center w-full gap-8">
              <div className="text-center">
                <h2
                  className="text-5xl md:text-6xl text-[#E1EEFC]"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  what's your name?
                </h2>
                <p
                  className="text-2xl text-[#E1EEFC]/60 mt-0"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  the one that feels most like you
                </p>
              </div>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && canContinueFromName) handleNext(); }}
                placeholder="your name"
                className="w-full px-6 py-4 rounded-3xl text-center focus:outline-none text-3xl placeholder:text-[#E1EEFC]/30"
                style={inputStyle}
                autoFocus
              />
            </div>

            {/* Button sits at the bottom — opacity toggles to avoid layout shift */}
            <button
              onClick={handleNext}
              disabled={!canContinueFromName}
              tabIndex={canContinueFromName ? 0 : -1}
              aria-hidden={!canContinueFromName}
              className="w-full md:w-auto md:px-10 py-3 rounded-full text-2xl transition-opacity duration-200"
              style={{
                fontFamily: 'var(--font-reenie-beanie), cursive',
                background: '#CEF17B',
                color: '#172211',
                opacity: canContinueFromName ? 1 : 0,
                pointerEvents: canContinueFromName ? 'auto' : 'none',
              }}
            >
              continue →
            </button>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center w-full flex-1 py-6">
            {/* flex-1 centers the content vertically; errors expand the group but button stays at bottom */}
            <div className="flex-1 flex flex-col items-center justify-center w-full gap-8">
              <div className="text-center">
                <h2
                  className="text-5xl text-[#E1EEFC]"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  when were you born?
                </h2>
                <p
                  className="text-2xl text-[#E1EEFC]/60 mt-0"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  an ai reads your vedic birth chart — time and location make it precise
                </p>
              </div>

              <div className="w-full flex flex-col gap-4">
                {/* Date — full width */}
                <div>
                  <input
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={birthDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canContinueFromBirthdate) handleNext();
                      if (e.key === 'Backspace' && birthDate.length > 0) {
                        e.preventDefault();
                        handleDateChange(birthDate.replace(/\D/g, '').slice(0, -1));
                      }
                    }}
                    maxLength={10}
                    className="w-full px-6 py-4 rounded-3xl text-center focus:outline-none text-3xl placeholder:text-[#E1EEFC]/30"
                    style={dateError ? inputErrorStyle : inputStyle}
                  />
                  {dateError && (
                    <p className="text-red-400 text-base mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>{dateError}</p>
                  )}
                </div>

                {/* Time + Location — stacked on mobile, side by side on md+ */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="hh:mm (optional)"
                      value={birthTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && birthTime.length > 0) {
                          e.preventDefault();
                          handleTimeChange(birthTime.replace(/\D/g, '').slice(0, -1));
                        }
                      }}
                      maxLength={5}
                      className="w-full px-6 py-4 rounded-3xl text-center focus:outline-none text-3xl placeholder:text-[#E1EEFC]/30"
                      style={timeError ? inputErrorStyle : inputStyle}
                    />
                    {timeError && (
                      <p className="text-red-400 text-base mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>{timeError}</p>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="city, country (optional)"
                      value={birthLocation}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="w-full px-6 py-4 rounded-3xl text-center focus:outline-none text-3xl placeholder:text-[#E1EEFC]/30"
                      style={locationError ? inputErrorStyle : inputStyle}
                    />
                    {locationError && (
                      <p className="text-red-400 text-base mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>{locationError}</p>
                    )}
                    {!locationError && locationChecking && (
                      <p className="text-[#E1EEFC]/40 text-base mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>checking...</p>
                    )}
                    {!locationError && !locationChecking && locationResolved !== null && (
                      <p className={`text-base mt-1 text-center ${locationResolved ? 'text-[#CEF17B]/80' : 'text-[#E1EEFC]/40'}`} style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                        {locationResolved ? `↳ ${locationResolved}` : "couldn't find that — try a different spelling"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Button sits at the bottom — opacity toggles to avoid layout shift */}
            <button
              onClick={handleNext}
              disabled={!canContinueFromBirthdate}
              tabIndex={canContinueFromBirthdate ? 0 : -1}
              aria-hidden={!canContinueFromBirthdate}
              className="w-full md:w-auto md:px-10 py-3 rounded-full text-2xl transition-opacity duration-200"
              style={{
                fontFamily: 'var(--font-reenie-beanie), cursive',
                background: '#CEF17B',
                color: '#172211',
                opacity: canContinueFromBirthdate ? 1 : 0,
                pointerEvents: canContinueFromBirthdate ? 'auto' : 'none',
              }}
            >
              continue →
            </button>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center justify-between h-full py-3 gap-2">
            <div className="flex-1 w-full min-h-0 overflow-y-auto flex items-center justify-center">
              {isLoadingWelcome ? (
                <div className="flex gap-2 items-center justify-center">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-[#E1EEFC]/50"
                      style={{ animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              ) : (
                <p
                  className="text-3xl text-[#E1EEFC] text-center whitespace-pre-line"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '1.4' }}
                >
                  {displayedText}
                </p>
              )}
            </div>

            <div
              className="flex flex-col items-center gap-1.5 pb-1 shrink-0"
              style={{ visibility: isTypingComplete && !isDragging ? 'visible' : 'hidden' }}
            >
              <img
                src="/card-back.png"
                alt="Card back"
                className="rounded-2xl shadow-xl select-none"
                style={{
                  width: '110px',
                  height: '165px',
                  objectFit: 'cover',
                  cursor: 'grab',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  touchAction: 'none',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                draggable="false"
              />
              <p
                className="text-base text-[#E1EEFC]/60 animate-bounce"
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                drag me to begin
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Loading screen ────────────────────────────────────────────────────────
  if (showLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#172211' }}>
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-[#CEF17B]/30 border-t-[#CEF17B] rounded-full animate-spin" />
          <p className="text-3xl text-[#CEF17B]" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
            preparing your reading...
          </p>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        opacity: shouldCrumble ? 0 : 1,
        filter: shouldCrumble ? 'blur(20px)' : 'none',
        transition: shouldCrumble ? 'opacity 1s ease-out, filter 1s ease-out' : 'none',
      }}
    >
      {/* Background video */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/onboarding-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay so text is readable over video */}
      <div className="absolute inset-0 bg-[#172211]/60" />

      {/* ── MOBILE layout — full screen, no device frame ── */}
      <div className={`md:hidden relative z-10 flex flex-col h-[100dvh]
        ${currentStep === 0 ? '' : 'px-5'}
        ${currentStep === 3 ? 'overflow-hidden py-6' : currentStep === 0 ? '' : 'py-8'}`}>
        <div className={`flex-1 flex flex-col ${currentStep === 0 ? 'w-full' : 'w-full max-w-sm mx-auto'}`}>
          {renderStepContent()}
        </div>
      </div>

      {/* ── DESKTOP layout — device frame, proportionally scaled to fit viewport ── */}
      <div className="hidden md:flex relative z-10 items-center justify-center min-h-screen">
        {/*
          Outer sizing box: gives the flex container real dimensions (scaled) so
          centering works correctly without relying on the absolutely-positioned children.
        */}
        <div style={{ position: 'relative', width: `${801 * deviceScale}px`, height: `${1000 * deviceScale}px` }}>
          {/*
            Inner natural-size container scaled via transform.
            Both the device frame image and the content area live here at their natural
            pixel sizes, so they always stay in exact proportion regardless of viewport.
          */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '801px',
              height: '1000px',
              transformOrigin: 'top left',
              transform: `scale(${deviceScale})`,
            }}
          >
            {/* Device frame with deck fan */}
            <img
              src="/device-frame-deck.png"
              alt=""
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '801px',
                height: '1000px',
                objectFit: 'contain',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Blue screen content area — positioned to sit exactly inside the device frame image */}
            <div
              className="overflow-hidden absolute z-20"
              style={{
                width: '647px',
                height: '909px',
                left: '50%',
                top: '50%',
                transform: 'translate(-60.5%, -50%)',
                background: '#E1EEFC',
              }}
            >
              {/* Cloud background — shown on all onboarding steps */}
              <img
                src="/onboarding-desktop-bg.png"
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.2,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              {/* Desktop content uses original dark-on-light styling */}
              <div className={`h-full overflow-y-auto ${currentStep === 0 ? '' : 'px-12'}`} style={{ color: '#172211', position: 'relative', zIndex: 1 }}>

                {/* Step 0 — welcome / logo */}
                {currentStep === 0 && (
                  <div className="flex flex-col h-full" style={{ position: 'relative' }}>
                    {/* Content — flex column; font metrics from Figma ×1.1234 scale, spiral mobile-proportioned */}
                    <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                      {/* Logo group: relative container for text + spiral */}
                      <div style={{
                        position: 'absolute',
                        top: '153px',
                        left: 0,
                        right: 0,
                        height: '460px',
                      }}>
                        {/* Glass text */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            fontFamily: 'var(--font-instrument-serif), "Instrument Serif", serif',
                            fontWeight: 400,
                            textTransform: 'lowercase',
                            textAlign: 'center',
                            WebkitTextFillColor: 'rgba(23, 34, 17, 0.20)',
                            color: 'rgba(23, 34, 17, 0.20)',
                            WebkitTextStroke: '0.7px rgba(23, 34, 17, 0.80)',
                            margin: 0,
                            padding: 0,
                            userSelect: 'none',
                          } as React.CSSProperties}
                        >
                          <span style={{ display: 'block', fontSize: '315px', lineHeight: '251px', letterSpacing: '-0.025em' }}>sl w</span>
                          <span style={{ display: 'block', fontSize: '315px', lineHeight: '251px', letterSpacing: '-0.03em' }}>hour</span>
                        </div>
                        {/* Spiral — #172211 fill + 2px stroke, mobile-scale (433×371px), centred in "o" gap */}
                        <img
                          src="/spiral-icon-desktop.svg"
                          alt=""
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            width: '385px',
                            height: '330px',
                            top: '25px',
                            left: '147px',
                            pointerEvents: 'none',
                          }}
                        />
                      </div>
                      {/* Subtitle: Figma position (661px from card top) */}
                      <p
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '661px',
                          transform: 'translateX(-50%) translateY(-50%)',
                          width: '481px',
                          fontFamily: 'var(--font-reenie-beanie), cursive',
                          fontSize: '36px',
                          lineHeight: '27px',
                          fontWeight: 400,
                          textAlign: 'center',
                          color: '#172211',
                          margin: 0,
                        }}
                      >
                        build your archive of daily perspectives.
                      </p>
                      {/* Button: Figma position (50% + 344px from card top) */}
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: 'calc(50% + 344px)',
                        transform: 'translateX(-50%) translateY(-50%)',
                      }}>
                        <button
                          onClick={handleNext}
                          style={{
                            display: 'flex',
                            width: '208px',
                            height: '68px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '9999px',
                            fontFamily: 'var(--font-reenie-beanie), cursive',
                            fontSize: '30px',
                            fontWeight: 400,
                            background: '#172211',
                            color: '#E1EEFC',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          continue →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1 — name */}
                {currentStep === 1 && (
                  <div className="flex flex-col items-center justify-center h-full gap-8">
                    <div className="text-center">
                      <h2 className="text-5xl text-black" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>what's your name?</h2>
                      <p className="text-2xl text-black/60 mt-1" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>the one that feels most like you</p>
                    </div>
                    <input
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && canContinueFromName) handleNext(); }}
                      className="w-full max-w-md px-8 py-6 rounded-3xl text-black text-center focus:outline-none text-3xl"
                      style={{ fontFamily: 'var(--font-reenie-beanie), cursive', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}
                      autoFocus
                    />
                    {/* Always rendered — opacity toggles to avoid layout shift */}
                    <button
                      onClick={handleNext}
                      disabled={!canContinueFromName}
                      tabIndex={canContinueFromName ? 0 : -1}
                      aria-hidden={!canContinueFromName}
                      className="transition-opacity duration-200"
                      style={{
                        display: 'flex', width: '185px', height: '60px',
                        justifyContent: 'center', alignItems: 'center',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-reenie-beanie), cursive',
                        fontSize: '24px', fontWeight: 500,
                        background: '#172211', color: '#E1EEFC',
                        opacity: canContinueFromName ? 1 : 0,
                        pointerEvents: canContinueFromName ? 'auto' : 'none',
                      }}
                    >
                      continue →
                    </button>
                  </div>
                )}

                {/* Step 2 — birthdate */}
                {currentStep === 2 && (
                  <div className="flex flex-col items-center justify-center h-full gap-6">
                    <div className="text-center">
                      <h2 className="text-5xl text-black" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>when were you born?</h2>
                      <p className="text-2xl text-black/60 mt-1" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>an ai reads your vedic birth chart — time and location make it precise</p>
                    </div>
                    <div className="w-full max-w-2xl space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <input type="text" placeholder="dd/mm/yyyy" value={birthDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && canContinueFromBirthdate) handleNext();
                              if (e.key === 'Backspace' && birthDate.length > 0) { e.preventDefault(); handleDateChange(birthDate.replace(/\D/g, '').slice(0, -1)); }
                            }}
                            maxLength={10}
                            className="w-full px-8 py-6 rounded-3xl text-black text-center focus:outline-none text-3xl"
                            style={{ fontFamily: 'var(--font-reenie-beanie), cursive', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', border: dateError ? '2px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.3)' }}
                          />
                          {dateError && <p className="text-red-600 text-lg mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>{dateError}</p>}
                        </div>
                        <div className="flex-1">
                          <input type="text" placeholder="hh:mm" value={birthTime}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Backspace' && birthTime.length > 0) { e.preventDefault(); handleTimeChange(birthTime.replace(/\D/g, '').slice(0, -1)); } }}
                            maxLength={5}
                            className="w-full px-8 py-6 rounded-3xl text-black text-center focus:outline-none text-3xl"
                            style={{ fontFamily: 'var(--font-reenie-beanie), cursive', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', border: timeError ? '2px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.3)' }}
                          />
                          {timeError && <p className="text-red-600 text-lg mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>{timeError}</p>}
                        </div>
                      </div>
                      <input type="text" placeholder="city, country (optional)" value={birthLocation}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        className="w-full px-8 py-6 rounded-3xl text-black text-center focus:outline-none text-3xl"
                        style={{ fontFamily: 'var(--font-reenie-beanie), cursive', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', border: locationError ? '2px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.3)' }}
                      />
                      {locationError && <p className="text-red-600 text-lg mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>{locationError}</p>}
                      {!locationError && locationChecking && (
                        <p className="text-black/40 text-lg mt-1 text-center" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>checking...</p>
                      )}
                      {!locationError && !locationChecking && locationResolved !== null && (
                        <p className={`text-lg mt-1 text-center ${locationResolved ? 'text-green-700/80' : 'text-black/40'}`} style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                          {locationResolved ? `↳ ${locationResolved}` : "couldn't find that — try a different spelling"}
                        </p>
                      )}
                    </div>
                    {/* Always rendered — opacity toggles to avoid layout shift */}
                    <button
                      onClick={handleNext}
                      disabled={!canContinueFromBirthdate}
                      tabIndex={canContinueFromBirthdate ? 0 : -1}
                      aria-hidden={!canContinueFromBirthdate}
                      className="transition-opacity duration-200"
                      style={{
                        display: 'flex', width: '185px', height: '60px',
                        justifyContent: 'center', alignItems: 'center',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-reenie-beanie), cursive',
                        fontSize: '24px', fontWeight: 500,
                        background: '#172211', color: '#E1EEFC',
                        opacity: canContinueFromBirthdate ? 1 : 0,
                        pointerEvents: canContinueFromBirthdate ? 'auto' : 'none',
                      }}
                    >
                      continue →
                    </button>
                  </div>
                )}

                {/* Step 3 — typewriter message + drag card */}
                {currentStep === 3 && (
                  <div className="flex flex-col items-center justify-between h-full py-16 gap-8">
                    <div className="flex-1 overflow-y-auto flex items-center justify-center w-full">
                      {isLoadingWelcome ? (
                        <div className="flex gap-3 items-center justify-center">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className="w-3 h-3 rounded-full bg-black/30"
                              style={{ animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-3xl text-black text-center whitespace-pre-line" style={{ fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '1.4' }}>{displayedText}</p>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-4 mb-8"
                      style={{ visibility: isTypingComplete && !isDragging ? 'visible' : 'hidden' }}
                    >
                      <img src="/card-back.png" alt="Card back" className="rounded-2xl shadow-xl select-none"
                        style={{ width: '180px', height: '270px', objectFit: 'cover', cursor: 'grab', userSelect: 'none', WebkitUserSelect: 'none' }}
                        onMouseDown={handleMouseDown} draggable="false"
                      />
                      <p className="text-2xl text-black/70 animate-bounce" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>← drag me</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cascaded cards trail */}
      {cascadedCards.map((card, index) => {
        const cw = isMobile ? 110 : 140;
        const ch = isMobile ? 165 : 210;
        return (
          <img key={card.id} src="/card-back.png" alt="" className="rounded-2xl select-none"
            draggable="false"
            style={{
              position: 'fixed', left: card.x - cw / 2, top: card.y - ch / 2,
              width: `${cw}px`, height: `${ch}px`, objectFit: 'cover',
              transform: `rotate(${card.rotation}deg)`,
              animation: shouldCrumble ? 'sandDissolve 1.2s ease-out forwards' : 'none',
              pointerEvents: 'none', zIndex: 9000 + index,
              userSelect: 'none', WebkitUserSelect: 'none',
            }}
          />
        );
      })}

      {/* Active dragging card */}
      {isDragging && (() => {
        const cw = isMobile ? 110 : 140;
        const ch = isMobile ? 165 : 210;
        return (
          <img src="/card-back.png" alt="Dragging card" className="rounded-2xl shadow-2xl select-none"
            draggable="false"
            style={{
              position: 'fixed', left: cardPosition.x - cw / 2, top: cardPosition.y - ch / 2,
              width: `${cw}px`, height: `${ch}px`, objectFit: 'cover',
              cursor: 'grabbing', zIndex: 10000, pointerEvents: 'none',
              userSelect: 'none', WebkitUserSelect: 'none',
            }}
          />
        );
      })()}
    </div>
  );
}
