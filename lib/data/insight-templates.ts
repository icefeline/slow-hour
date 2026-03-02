// Insight templates for generating personalized, emotionally intelligent active insights
// These are combined based on user context (transit phase, repetition, house placement, etc.)

export const INSIGHT_TEMPLATES = {

  // REPETITION AWARENESS
  // Used when the user draws the same card multiple times during a transit
  repetition: {
    second_draw: [
      "{CardName} is back. Something here still needs your attention.",
      "You're being asked to go deeper with {CardName}. What did you miss the first time?",
      "{CardName} again. Not because you failed, but because this layer takes time to integrate.",
      "{CardName} appears twice. Not a loop. An invitation to spiral deeper.",
      "The second time {CardName} shows up isn't repetition. It's insistence."
    ],

    third_plus_draw: [
      "{CardName} has become a companion in this chapter. What is it teaching you about staying present?",
      "This is the {ordinal} time {CardName} has appeared. Notice you're not where you were on day one.",
      "Still working with {CardName}. Healing isn't linear. Where do you feel movement, even if it's subtle?",
      "{CardName} keeps showing up because you keep showing up. That's not failure. That's commitment.",
      "You've drawn {CardName} {ordinal} times now. Each time, you meet it differently. That's the work.",
      "{CardName} again. Not because you're stuck, but because transformation has layers you can't rush."
    ]
  },

  // TRANSIT PHASE CONTEXT
  // Provides context about where the user is in their current astrological transit
  transit_phase: {
    beginning: [
      "This {transitName} is just beginning. {CardName} arrives as preparation, not punishment.",
      "You're in the early days of {transitName}. Let {CardName} show you what needs tending before the intensity peaks.",
      "{transitName} is awakening. {CardName} is your early warning system. Pay attention to the whispers before they become shouts.",
      "The opening phase of {transitName}. {CardName} isn't here to scare you. It's here to orient you.",
      "{transitName} has barely begun. {CardName} is giving you a preview of the terrain. Take notes."
    ],

    approaching: [
      "{transitName} is building. The pressure you feel is the transit gathering strength. {CardName} asks how can you move with this, not against it?",
      "As {transitName} approaches exactness, {CardName} shows you what this transit is really about. Trust what's surfacing.",
      "{transitName} is tightening its grip. {CardName} didn't come to save you from it. It came to help you understand it.",
      "The intensity is rising as {transitName} approaches peak. {CardName} says this is supposed to feel like something.",
      "{transitName} is almost exact. {CardName} is here to help you name what you're feeling before it names you."
    ],

    peak: [
      "You're at the heart of {transitName} now. What {CardName} is showing you is the work.",
      "{transitName} is exact today. The intensity you feel isn't wrong. {CardName} is here to help you metabolize it.",
      "Peak {transitName}. {CardName} didn't come to fix you. It came to witness what's already happening.",
      "{transitName} is at maximum intensity. {CardName} asks what becomes possible when you stop resisting what is?",
      "This is the exact moment of {transitName}. {CardName} is the eye of the storm. The still point in all this motion.",
      "{transitName} reaches its peak. {CardName} reminds you the most intense moment is also the turning point."
    ],

    separating: [
      "{transitName} is loosening its hold. {CardName} asks what felt impossible two weeks ago that you're now living through?",
      "The intensity of {transitName} is easing. {CardName} invites you to notice what's already shifted, even if it's not yet visible.",
      "{transitName} is beginning to separate. {CardName} says you're on the other side of the peak. Breathe.",
      "As {transitName} pulls away, {CardName} asks what did this teach you about your capacity?",
      "{transitName} is releasing. {CardName} is here for the exhale after the long hold."
    ],

    integration: [
      "{transitName} is beginning to release its grip. {CardName} asks what are you taking forward from this?",
      "As {transitName} separates, {CardName} invites reflection. How have you changed since this began?",
      "The lesson of {transitName} is settling into your bones. {CardName} is here for the integration, not the crisis.",
      "{transitName} is almost complete. {CardName} asks who are you becoming because of what you've moved through?",
      "You're in the final phase of {transitName}. {CardName} says don't rush past the harvest. What did you learn?",
      "{transitName} is ending. {CardName} reminds you the transit may fade, but the transformation stays."
    ]
  },

  // HOUSE PLACEMENT CONTEXT
  // These are more card-specific and stored with each card's data
  // But here are some generic house themes that can be mixed in
  house_themes: {
    1: "your sense of self, your identity, how you meet the world",
    2: "your values, your resources, what you consider worth protecting",
    3: "communication, learning, how you make sense of things",
    4: "home, family, foundation, the private self you don't show the world",
    5: "creativity, pleasure, what makes you feel alive",
    6: "daily life, health, service, the small rituals that sustain you",
    7: "relationships, partnerships, how you meet others as equals",
    8: "transformation, shared resources, what you merge with and what you release",
    9: "meaning-making, philosophy, the bigger picture you're reaching for",
    10: "career, public life, legacy, how the world sees you",
    11: "community, hopes, the future you're building with others",
    12: "the subconscious, spirituality, what dissolves boundaries"
  },

  // SUPPORTING TRANSIT WEAVES
  // Short phrases that can be appended when supporting transits add nuance
  supporting_transit: {
    mercury_retrograde: [
      "With Mercury retrograde, notice what's being said, and what's finally being heard.",
      "Mercury retrograde adds a layer: the answers might come backwards, through what you've already lived.",
      "Mercury retrograde in the mix means this isn't about moving forward yet. It's about reviewing, revising, remembering."
    ],

    venus_transit: [
      "Venus whispers through this: there's beauty even in the breaking.",
      "With Venus in the picture, ask: what would it mean to be gentle with yourself through this?",
      "Venus adds softness to the edges. You don't have to harden to survive this."
    ],

    mars_transit: [
      "Mars is also active, anger might be information, not a problem to solve.",
      "With Mars in play, the urge to act is strong. But {CardName} asks: what if stillness is the bravest choice right now?",
      "Mars energy is here too. Sometimes the fight is staying present, not charging forward."
    ]
  }
};

// Helper to get house-specific insight phrase
export function getHouseInsightPhrase(houseNumber: number): string {
  return INSIGHT_TEMPLATES.house_themes[houseNumber as keyof typeof INSIGHT_TEMPLATES.house_themes] ||
         "an important area of your life";
}
