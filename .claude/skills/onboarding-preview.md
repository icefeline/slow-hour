# /onboarding-preview

Reset the app to a fresh state and walk through the full onboarding flow.

## steps

1. Take a screenshot of the current app state for reference

2. Clear all slow garden localStorage keys by running in the browser console:
   ```js
   // The app's keys are not all under one prefix — the profile and per-day
   // entries predate the `slow-garden-` convention, so a prefix filter alone
   // silently clears nothing and the walkthrough starts mid-flow.
   Object.keys(localStorage)
     .filter(k =>
       k.startsWith('slow-garden-') ||
       /^(card|reflection|reversed|insight)-/.test(k) ||
       ['userName', 'userBirthdate', 'userBirthTime', 'userBirthLocation',
        'onboardingComplete', 'cardRevealed', 'lastDrawDate', 'slowHourMemory',
        'notificationsEnabled', 'notificationTime', 'notificationTimeoutId',
        'testSeed'].includes(k)
     )
     .forEach(k => localStorage.removeItem(k))
   location.reload()
   ```
   Use `preview_eval` to run this.

3. Take a screenshot — should show the splash screen with the slow garden logo and "continue →" button

4. Walk through each onboarding screen in sequence:
   - Splash → name entry
   - Name → birthdate picker
   - Birthdate → birth time (optional)
   - Birth time → birth location (optional)
   - Location → sun/moon/rising reveal
   - Reveal → drag gesture tutorial
   - Tutorial → main card view

5. Screenshot each screen transition

6. Note any issues:
   - copy that doesn't match tone guidelines
   - layout breaks on mobile viewport
   - transitions that feel abrupt
   - any screens that feel skippable but aren't marked optional

7. After completing onboarding, confirm the main card view loads with a card drawn for today

## useful context
- the onboarding component is `app/components/Onboarding.tsx` + `OnboardingScreens.tsx`
- birth time and location are optional — the app degrades gracefully without them (less precise house/rising info)
- the drag gesture tutorial teaches the reveal mechanic before the first card
