// This file contains the screen render logic - will be integrated into Onboarding.tsx
// Separated temporarily for clarity during refactoring

// Screen 0: Name input
/*
<div className="flex flex-col items-center justify-center h-full px-12">
  <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full space-y-8">
    <h2
      className="text-5xl text-center text-black"
      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
    >
      what's your name?
    </h2>

    <p
      className="text-lg text-center text-black/60"
      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
    >
      this will be the name slow hour uses to refer to you
    </p>

    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full max-w-md px-8 py-6 bg-white/50 rounded-3xl text-black text-center focus:outline-none text-3xl"
      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
      autoFocus
    />
  </div>
</div>
*/

// Screen 1: Birthdate + Time + Location
/*
<div className="flex flex-col items-center justify-center h-full px-12">
  <div className="flex-1 flex flex-col items-center justify-center max-w-lg w-full space-y-6">
    <h2
      className="text-5xl text-center text-black mb-4"
      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
    >
      when were you born?
    </h2>

    <p
      className="text-lg text-center text-black/60 mb-8"
      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
    >
      slow hour may surprise you with a birthday gift
    </p>

    <div className="flex gap-4 w-full max-w-md">
      <input
        type="text"
        placeholder="07/07/1999"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="flex-1 px-6 py-5 bg-white/50 rounded-3xl text-black text-center focus:outline-none text-2xl"
        style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
      />
      <input
        type="text"
        placeholder="6:00am"
        value={birthTime}
        onChange={(e) => setBirthTime(e.target.value)}
        disabled={noKnowBirthTime}
        className="flex-1 px-6 py-5 bg-white/50 rounded-3xl text-black text-center focus:outline-none text-2xl disabled:opacity-40"
        style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
      />
    </div>

    <label className="flex items-center gap-3 text-black/70 text-lg cursor-pointer">
      <input
        type="checkbox"
        checked={noKnowBirthTime}
        onChange={(e) => setNoKnowBirthTime(e.target.checked)}
        className="w-5 h-5"
      />
      <span style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
        i don't know my birth time
      </span>
    </label>

    <input
      type="text"
      placeholder="e.g. singapore, singapore"
      value={birthLocation}
      onChange={(e) => setBirthLocation(e.target.value)}
      className="w-full max-w-md px-8 py-5 bg-white/50 rounded-3xl text-black text-center focus:outline-none text-2xl mt-4"
      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
    />

    <p
      className="text-base text-center text-black/60 mt-2"
      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
    >
      where you entered the world adds depth to your reading
    </p>
  </div>
</div>
*/

// Screen 2: Welcome message with draggable card
/*
<div className="flex flex-col items-center justify-center h-full px-12 py-16">
  <div className="flex-1 flex flex-col items-center justify-start max-w-2xl w-full">
    <h2
      className="text-3xl text-center text-black mb-12"
      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
    >
      {name}, hey.
    </h2>

    <p
      className="text-2xl text-center text-black leading-relaxed whitespace-pre-line"
      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
    >
      {getWelcomeMessage()}
    </p>
  </div>

  <div className="relative mt-auto">
    <img
      src="/card-back.png"
      alt="Card back"
      className="w-48 h-72 rounded-2xl object-cover cursor-grab active:cursor-grabbing"
      draggable="true"
    />
    <p
      className="text-xl text-black/70 mt-4 text-center"
      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
    >
      ← drag me
    </p>
  </div>
</div>
*/
