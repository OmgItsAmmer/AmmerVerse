# AmmerVerse — Implementation Plan
*Aesthetic direction: your existing SPACE theme (deep black, stars, globe) as the foundation, layered with Leonardo.ai-style elements — gradient-mesh glow, glass cards, bold display type, scroll-driven reveals. Not a copy — a blend adapted to your LLM Engineer positioning and content from updates.md.*

### The Blend, in One Sentence
Keep the night-sky canvas and starfield you already have; replace the flat dark cards with violet/indigo gradient-glow glass panels, and replace the click-based navigation with smooth scroll reveals — so it still feels like "your space," but reads as a polished AI-product site.

---

## 1. Design System

### Color Palette
```css
:root {
  /* SPACE base — kept from current site */
  --bg-base:        #050508;   /* deep space black, consistent across screens */
  --star-opacity:   0.5;

  /* LEONARDO-style glass + glow layered on top */
  --bg-elevated:    #0D0D16;
  --bg-glass:       rgba(255,255,255,0.04);
  --border-subtle:  rgba(255,255,255,0.08);
  --border-glow:    rgba(168,85,247,0.35);

  --accent-primary: #A855F7;   /* violet */
  --accent-secondary: #6366F1; /* indigo */
  --accent-glow:    #C084FC;

  --text-primary:   #F5F5F7;
  --text-secondary: #9CA3AF;
  --text-muted:     #6B7280;

  /* Gradient mesh overlay — sits ON TOP of the starfield, not replacing it */
  --gradient-mesh: radial-gradient(circle at 20% 20%, rgba(168,85,247,0.12) 0%, transparent 50%),
                   radial-gradient(circle at 80% 0%, rgba(99,102,241,0.10) 0%, transparent 50%),
                   radial-gradient(circle at 50% 100%, rgba(168,85,247,0.06) 0%, transparent 60%);
}
```

**Layering order (back to front):**
1. `--bg-base` solid space-black
2. Starfield (existing dots, opacity reduced to `--star-opacity` for screen consistency)
3. `--gradient-mesh` — slow-drifting violet/indigo glow (the Leonardo signature)
4. Content (glass cards, text, mockups)

### Typography
- **Display font:** `Clash Display` or `General Sans` (Fontshare, free) — bold, geometric, modern — for hero headline & section titles
- **Body font:** `Satoshi` or `Inter Tight` — clean, readable
- **Mono accent:** `JetBrains Mono` — for tech tags, code snippets, terminal-style elements (great for an LLM/DevOps theme)

Fontshare CDN (free, no license issues):
```html
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
```

### Grid & Spacing
- Max content width: `1280px`, generous side padding (`5vw` on desktop, `5%` mobile)
- Section vertical padding: `120px` desktop / `64px` mobile
- 12-column grid for project cards (responsive: 3 → 2 → 1 columns)

---

## 2. Layout Structure (Single-Page Scroll)

*Your starfield background and rotating globe stay — they're already a strength. The globe becomes the "Open to remote / available globally" indicator from updates.md, with a small tooltip on hover.*

```
┌─────────────────────────────────────────┐
│ NAV (sticky, glass blur)                 │
│ AmmerVerse   Work  AI/LLM  Contact  [CV] │
├─────────────────────────────────────────┤
│ HERO                                     │
│  - Gradient mesh background (animated)  │
│  - Massive display headline              │
│  - Subhead + dual CTA                    │
│  - Floating glass cards (skills proof)   │
│  - Subtle particle/star layer            │
├─────────────────────────────────────────┤
│ ABOUT (short bio strip)                  │
│  - Photo + 3-4 line bio                  │
│  - "Open to: LLM Engineer / LLMOps" badge│
├─────────────────────────────────────────┤
│ AI/LLM FOCUS (hero of this section)      │
│  - Large heading "What I build with AI"  │
│  - Tech pill strip (animated marquee)    │
│  - 2 featured LLM project cards          │
├─────────────────────────────────────────┤
│ ALL PROJECTS                             │
│  - Filter bar: All / LLM / Mobile/ Web / Desktop │
│  - Card grid, phone-mockup style cards   │
│  - Scroll-reveal stagger animation       │
├─────────────────────────────────────────┤
│ CONTACT                                  │
│  - Big CTA headline                      │
│  - Email / GitHub / LinkedIn buttons     │
├─────────────────────────────────────────┤
│ FOOTER (minimal)                         │
└─────────────────────────────────────────┘
```

---

## 3. Animation & Motion Plan

### Hero
- **Background layers:** existing starfield (kept, opacity tuned per Color Palette section) + new gradient mesh on top, slow drift animation, 20s loop, `background-position` shift — gives the "living AI canvas over deep space" feel
- **Headline reveal:** staggered word/line fade-up on load (`opacity 0→1`, `translateY 24px→0`, 0.6s, 80ms stagger per line)
- **Floating cards:** gentle continuous float (`translateY ±8px`, 6s ease-in-out infinite), each card offset by different delay so they don't move in sync
- **Globe:** keep current position, add slow continuous rotation (already implied) + hover tooltip "Open to remote work"

### Scroll-Triggered Reveals
- Use `IntersectionObserver` (vanilla) or `framer-motion`'s `whileInView` (if React)
- Each section: fade-up + slight scale (`scale(0.96 → 1)`) as it enters viewport
- Project cards: staggered reveal (100ms delay between cards) when grid scrolls into view

### Micro-interactions
- Nav links: underline grows from center on hover
- Buttons: primary CTA has a subtle gradient shift on hover + glow shadow
- Project cards: lift on hover (`translateY(-6px)`, shadow deepens, border glows violet)
- Tech pills: subtle scale + glow on hover

### Tech Pill Marquee (AI/LLM section)
- Horizontal infinite scroll strip of tool logos/names (OpenAI, LangChain, Docker, etc.)
- CSS-only: `@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }` on a duplicated list, `animation: scroll 30s linear infinite`
- Pause on hover

---

## 4. Component Breakdown

### Hero Component
```
- Background: gradient mesh + low-opacity star field (canvas or CSS dots)
- Headline: "LLM Engineer." / "Full-stack foundation." (two lines, display font, ~96px desktop)
- Subhead: "I build AI systems that ship — RAG pipelines, agents, and production LLMOps."
- CTA row: [View Projects] (filled gradient button) + [Download Resume] (outlined)
- 3-4 floating glass cards positioned around/behind a portrait photo:
  - "Tech Stack: Flutter · Rust · Python · LangChain"
  - "Currently: Open to LLM Engineer / LLMOps roles"
  - "Proof: 10+ shipped projects across 4 domains"
```

### Project Card
```
- Glass card, border-radius 16px, border 1px solid var(--border-subtle)
- Top: phone/browser mockup screenshot (reuse your existing mockup assets)
- Tag row: mono-font pills (e.g. "RAG", "LangChain", "FastAPI")
- Title + 1-line description
- Footer: [GitHub icon] [Live Demo icon]
- Hover: lift + violet border glow
```

### Filter Bar
```
- Horizontal pill buttons: All | LLM/AI | Mobile | Web | Desktop
- Active state: filled gradient background
- Inactive: glass background, text-secondary
- Click → filter grid with fade-out/fade-in transition (200ms)
- Default active filter: "LLM/AI"
```

---

## 5. Tech Stack for Build

- **Framework:** React (Vite) — fast, component-based, good for scroll animations
- **Animation library:** `framer-motion` (whileInView, layout animations for filter grid)
- **Icons:** `lucide-react`
- **Styling:** Tailwind CSS with custom CSS variables for the palette above
- **Fonts:** Fontshare CDN (Clash Display + Satoshi + JetBrains Mono)

---

## 6. Build Order (Phased)

| Phase | Deliverable |
|-------|-------------|
| 1 | Design tokens + global styles (colors, fonts, base layout) |
| 2 | Hero section with gradient mesh + headline animation |
| 3 | Nav (sticky, glass blur, smooth-scroll links) |
| 4 | About/bio strip |
| 5 | AI/LLM focus section + tech pill marquee |
| 6 | Project grid + filter bar + cards |
| 7 | Contact section + footer |
| 8 | Scroll-reveal pass across all sections |
| 9 | Mobile responsive pass |
| 10 | Performance check (animation jank, image sizes) |

---

## Next Step
Once you confirm this direction, I can start building Phase 1–3 (design tokens, hero, nav) as a working React/Tailwind artifact you can preview and iterate on.