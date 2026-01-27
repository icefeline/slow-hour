// Card-specific insights for each house placement
// Format: [cardSlug]: { [houseNumber]: insight }

export const CARD_HOUSE_INSIGHTS: Record<string, Record<number, string>> = {

  // THE TOWER
  'tower': {
    1: "The Tower in your 1st house, your identity and sense of self. What you thought you were is being revised. This isn't destruction. It's liberation from a self-concept that was always too small.",
    4: "The Tower in your 4th house, foundations and family. What's crumbling isn't your enemy. It's making space for what's true.",
    7: "The Tower in your 7th house of relationships. Sometimes love asks us to break open, not break apart. What needs to fall away so something more honest can emerge?",
    10: "The Tower in your 10th house, your public life and legacy. The world's version of you is being revised. Who do you want to become when the old structure falls?"
  },

  // THE HERMIT
  'hermit': {
    1: "The Hermit in your 1st house. Your outward self is being called inward. What would it mean to meet yourself without an audience?",
    4: "The Hermit in your 4th house. This solitude is about coming home to yourself, not hiding from the world.",
    7: "The Hermit in your 7th house of partnerships. Sometimes the deepest intimacy is the one you cultivate with yourself first.",
    9: "The Hermit in your 9th house, philosophy and meaning-making. The answers you're seeking won't come from outside. Go inward.",
    12: "The Hermit in your 12th house of the subconscious. You're being asked to befriend the parts of yourself you've kept in shadow."
  },

  // DEATH
  'death': {
    4: "Death in your 4th house, home and foundation. Something ancestral is ending in you. This is grief work and liberation work at once.",
    7: "Death in your 7th house of relationships. Not all endings are failures. Some are completions. What has run its course?",
    8: "Death in your 8th house, transformation and shared resources. This is the house Death knows best. Something is composting into new soil.",
    10: "Death in your 10th house of career and public identity. The version of success you've been chasing is dying. What wants to be born in its place?"
  },

  // THE FOOL
  'fool': {
    1: "The Fool in your 1st house, your identity and self-expression. You're being called to begin again, to meet yourself as if for the first time.",
    5: "The Fool in your 5th house of creativity and pleasure. What would you create if you weren't afraid of getting it wrong?",
    9: "The Fool in your 9th house, philosophy and expansion. There's a journey calling that has no roadmap. Trust the not-knowing.",
    11: "The Fool in your 11th house of community and future vision. The path forward requires you to walk before the road appears."
  },

  // THE DEVIL
  'devil': {
    2: "The Devil in your 2nd house of values and resources. What are you spending (money, time, energy) on things that don't actually nourish you?",
    5: "The Devil in your 5th house of pleasure and creativity. Desire isn't the enemy. But notice what pleasures have become prisons?",
    7: "The Devil in your 7th house of relationships. What patterns are you repeating because they feel familiar, even when they hurt?",
    8: "The Devil in your 8th house, shared resources and intimacy. Where are you giving your power away and calling it love?"
  },

  // THE STAR
  'star': {
    1: "The Star in your 1st house, your sense of self. After everything that's broken, you're being asked to hope again. Not naive hope. Earned hope.",
    4: "The Star in your 4th house of home and foundation. Healing is happening in the most private parts of your life. Trust what's growing in the dark.",
    11: "The Star in your 11th house of community and vision. You're not healing alone. Your hope is contagious.",
    12: "The Star in your 12th house, the subconscious and spirituality. There's a quiet faith building beneath all the noise. Let it sustain you."
  },

  // THE MOON
  'moon': {
    4: "The Moon in your 4th house, family and emotional foundation. What you're feeling isn't always what's true. But it's real. Can you hold both?",
    7: "The Moon in your 7th house of relationships. What are you projecting onto others that actually belongs to you?",
    8: "The Moon in your 8th house, the unconscious and transformation. Something beneath the surface is stirring. Don't force clarity yet.",
    12: "The Moon in your 12th house of the subconscious. Your dreams are louder than your waking thoughts right now. Listen to them."
  },

  // THE SUN
  'sun': {
    1: "The Sun in your 1st house, your identity and vitality. You're being invited to take up space, to be seen without apology.",
    5: "The Sun in your 5th house of creativity and joy. What makes you feel alive? Do more of that. It's not frivolous. It's fuel.",
    10: "The Sun in your 10th house of public life and career. Your work is meant to be visible. Step into the light.",
    11: "The Sun in your 11th house of community and collective vision. Your joy is not selfish. It's what you have to offer."
  },

  // WHEEL OF FORTUNE
  'wheel-of-fortune': {
    2: "The Wheel of Fortune in your 2nd house of resources and values. What you have (and what you don't) is shifting. Can you hold your worth steady in the spin?",
    6: "The Wheel of Fortune in your 6th house of daily life and health. The routines that worked last month might not serve you now. Adapt.",
    10: "The Wheel of Fortune in your 10th house of career. Luck and timing are converging. But you still have to show up."
  },

  // TEMPERANCE
  'temperance': {
    1: "Temperance in your 1st house, your identity. You're learning to hold opposing truths about yourself. Both can be true.",
    6: "Temperance in your 6th house of health and daily ritual. Balance isn't a destination. It's something you calibrate every single day.",
    7: "Temperance in your 7th house of relationships. The work is learning to be yourself while staying connected to someone else."
  },

  // Add more cards as needed...
};
