# Current Issues to Fix

## 1. Historias Reales testimonial cards still being cut off
- The marquee animation moves cards horizontally but they get clipped on the sides
- Need to completely redesign this section - either:
  - Show cards in a static grid (3 columns) 
  - Or use a proper carousel with one card visible at a time with prev/next buttons
- The user wants them NOT cut off - full cards visible

## 2. Collaborators section needs to scroll (marquee)
- Already implemented with CSS animation `collab-scroll`
- Need to verify it's working in the browser

## 3. Cumplimiento icons
- Already replaced with numbers only (1-5 in circles)
- Need to verify this is rendering correctly

## Key file: client/src/pages/Saludable.tsx
- Historias Reales section starts around line 1950-2010
- Uses GSAP marquee animation (beneficiary-track)
- Cards are 340px/380px wide with overflow-x-clip
