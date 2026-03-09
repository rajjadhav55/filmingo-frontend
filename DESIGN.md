# Design System: BookMyShow Sports & Cricket Match Booking
**Project ID:** 1485923216554363817

## 1. Visual Theme & Atmosphere
A cinematic, immersive dark-mode experience that evokes the thrill of live sports. The atmosphere is dense yet breathable — deep obsidian backgrounds create a "stadium at night" feel, while luminous crimson accents ignite excitement and urgency. The overall aesthetic is bold, modern, and premium — think a luxury sports broadcast overlay meets a sleek ticketing app. Glassmorphism layers add sophistication and depth.

## 2. Color Palette & Roles
- **Deep Obsidian** (`#0f0f13`) — Primary background. The foundation of the experience, providing maximum contrast.
- **Elevated Charcoal** (`#1a1a20`) — Card backgrounds, secondary surfaces, input fields. Creates subtle layering above the base.
- **Crimson Blaze** (`#e11d48`) — Primary call-to-action, active states, brand accent. Used for buttons, highlights, and interactive affordances.
- **Rose Glow** (`#f43f5e`) — Hover/active variant of Crimson Blaze. Slightly lighter for interactive feedback.
- **Pure White** (`#ffffff`) — Primary text, headings, and high-emphasis content.
- **Muted Zinc** (`#a1a1aa`) — Secondary text, descriptions, meta information.
- **Dim Graphite** (`#71717a`) — Tertiary text, subtle labels, placeholder text.
- **Whisper White** (`rgba(255,255,255,0.05-0.10)`) — Glass-card borders, dividers, and subtle separators.
- **Stadium Gold** (`#facc15`) — Ratings, star icons, VIP seat highlights.
- **Pitch Green** (`#22c55e`) — Available status, success states, "Live" badges.
- **Sky Blue** (`#38bdf8`) — Premium tier highlights, informational accents.

## 3. Typography Rules
- **Font Family:** Inter (Google Fonts) — clean, geometric, highly legible on screens.
- **Headings (H1):** 36–48px, font-weight 800 (Extra Bold), tight letter-spacing (-0.02em). White.
- **Headings (H2/H3):** 24–30px, font-weight 700 (Bold). White.
- **Body Text:** 14–16px, font-weight 400 (Regular). Muted Zinc.
- **Labels/Badges:** 10–12px, font-weight 700 (Bold), uppercase, wide letter-spacing (0.05em).
- **Numbers/Prices:** Tabular numerals, font-weight 700, white or Stadium Gold.

## 4. Component Stylings
* **Buttons:** Pill-shaped or generously rounded (`rounded-lg`, 8px). Crimson Blaze background with a soft glow shadow (`shadow-lg shadow-rose-600/25`). On hover: Rose Glow with expanded shadow. Active: slight scale-down (0.95). White bold text.
* **Cards/Containers:** Subtly rounded corners (`rounded-2xl`, 16px). Elevated Charcoal background. Whisper White border (`border border-white/5`). On hover: border brightens to `border-white/10`, card lifts with enhanced shadow. Group-hover transitions on images (slight zoom, 1.05 scale).
* **Inputs/Forms:** Rounded-lg. Elevated Charcoal background. Whisper White border. On focus: Crimson Blaze glow ring (`ring-1 ring-rose-500/50`).
* **Badges:** Small, uppercase, bold. Rounded or pill-shaped. Background uses 10% opacity of the badge color with matching text. Subtle border in 20% opacity of badge color.
* **Glass Cards:** `bg-white/5 backdrop-blur-md border border-white/10` — used for overlays, modals, floating elements.
* **Modals:** Centered overlay with `bg-black/60 backdrop-blur-sm` backdrop. Modal body uses Elevated Charcoal with rounded-2xl corners and Whisper White border.

## 5. Layout Principles
- **Max width:** 1440px, centered with horizontal padding (24px).
- **Grid:** CSS Grid or Flexbox. Cards in 3-column grid on desktop, 2 on tablet, 1 on mobile. Gap: 24px.
- **Spacing:** Generous whitespace. Section padding: 48–64px vertical. Card padding: 20–24px.
- **Responsive:** Mobile-first. All grids collapse gracefully. Text sizes scale down smoothly.

## 6. Design System Notes for Stitch Generation
Use this block in every Stitch prompt to ensure visual consistency:

**DESIGN SYSTEM (REQUIRED):**
- Background: Deep obsidian (#0f0f13) as primary, elevated charcoal (#1a1a20) for cards
- Accent: Crimson blaze (#e11d48) for CTAs, rose glow (#f43f5e) for hover states
- Text: Pure white (#ffffff) for headings, muted zinc (#a1a1aa) for body, dim graphite (#71717a) for labels
- Special colors: Stadium gold (#facc15) for ratings/VIP, pitch green (#22c55e) for live/available, sky blue (#38bdf8) for premium tier
- Font: Inter, extra bold headings, tight letter-spacing
- Cards: Rounded-2xl, elevated charcoal bg, whisper white borders (border-white/5), hover lifts with glow
- Buttons: Rounded-lg, crimson blaze bg, white bold text, shadow glow, hover scale effect
- Glass elements: bg-white/5 backdrop-blur-md for overlays and modals
- Aesthetic: Premium, cinematic, sports-broadcast feel. Dense but breathable.
