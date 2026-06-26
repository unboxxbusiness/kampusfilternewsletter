# Logo Collage Redesign Spec

## Goal
Redesign the homepage logo grid into a premium 3x3 card collage matching the visual layout and aesthetic of the uploaded black-and-white portraits image. 

## Requirements
1. **Grid Layout**: A 3x3 layout featuring exactly 9 cards:
   - 3 Worldwide Universities: Stanford, Harvard, MIT
   - 3 Top Indian Private Universities: BITS Pilani, VIT, Ashoka
   - 3 Top Companies: Google, Microsoft, Apple
2. **Card Dimensions & Aesthetic**:
   - Portrait aspect ratio (`aspect-[3/4]`) resembling the uploaded portraits.
   - Distinct rounded corners (`rounded-2xl`).
   - Cards container styling matching a premium dark grid.
3. **Logo Colors & Interactions**:
   - Grayscale/monochrome logos on dark gradient card backgrounds by default (matching the black-and-white look of the portraits).
   - On hover, cards transition to their authentic brand colors and scale up slightly (`hover:scale-[1.02]`).
   - Support for both dark and light modes.

## Technical Details

### Selected Logos & Brand Colors
- **Stanford**: `#8C1515` (Cardinal Red)
- **Harvard**: `#A51C30` (Crimson)
- **MIT**: `#A31F34` (Red/Gray)
- **BITS Pilani**: `#003366` (Navy Blue)
- **VIT**: `#0055A5` (Blue)
- **Ashoka**: `#6A1B29` (Maroon)
- **Google**: Multi-color (Red, Yellow, Green, Blue)
- **Microsoft**: Multi-color (Red, Green, Blue, Yellow)
- **Apple**: `#000000` (Light mode) / `#FFFFFF` (Dark mode)

### Theme Adaptation
- **Dark Mode**: 
  - Grid Container: `bg-black/40 border border-neutral-900`
  - Cards: `bg-gradient-to-b from-[#18181B] to-[#090909] border border-neutral-800`
  - Logos: Gray (`text-neutral-500`) transitioning to their brand colors on hover.
- **Light Mode**:
  - Grid Container: `bg-gray-50/40 border border-gray-200`
  - Cards: `bg-gradient-to-b from-[#FFFFFF] to-[#F5F5F7] border border-gray-200/60`
  - Logos: Gray (`text-neutral-400`) transitioning to their brand colors on hover.

### Component to Modify
- [page.tsx](file:///e:/kampusfilter/src/app/(marketing)/page.tsx)
