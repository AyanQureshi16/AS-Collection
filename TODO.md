# Fix Hero Section - DONE ✅

## Issue
"AS Collection" text in the Hero section of the homepage was not showing up when the website opens.

## Root Cause
The `Hero.jsx` component had a broken rotating word feature:
1. `RotatingWord` had a static `key={words[0]}` that never changes (should be dynamic index)
2. `AnimatedText` used `exit` animation prop but there was **no `AnimatePresence`** wrapper, which framer-motion requires
3. This caused a silent render error, preventing the ENTIRE Hero section (including "AS Collection" heading) from rendering

## Fix Applied ✅
1. Removed the broken multi-component chain: `RotatingWord` → `AnimatingWords` → `AnimatedText` → `useIndexRotator`
2. Replaced with a single clean `RotatingWord` component that:
   - Uses `useState` + `useEffect` for word rotation
   - Properly wraps the `motion.span` with `<AnimatePresence mode="wait">`
   - Uses dynamic `key={index}` so framer-motion detects the change for exit/enter animations
3. Added `AnimatePresence` to the import from framer-motion

