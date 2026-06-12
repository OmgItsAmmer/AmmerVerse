# AmmerVerse Portfolio — Master Layout Plan
*Goal: one unforgettable first impression, AI-first identity, proof across every domain — built on the existing space theme*

---

## Brand — AmmerVerse

**AmmerVerse** = **Ammer** + **Universe** — your personal universe as a portfolio.

| Element | Direction |
|---------|-----------|
| Name | **AmmerVerse** (camelCase in UI: `AmmerVerse`) |
| Meaning | The universe of Ammer — one cosmos, many worlds (AI, mobile, web, desktop) |
| Tone | Deep space, premium, calm confidence — not noisy sci-fi |
| Nav brand | `AmmerVerse` links to top; optional micro-tagline on hero only: *"Welcome to my universe."* |
| Footer | `© Ammer Saeed · AmmerVerse` |

Every visual choice (color, motion, glass cards, drifting assets) should feel like **one coherent universe**, not a template with space wallpaper pasted on.

---

## Core Positioning

**One expert. Four lanes of proof.**

| Role | Position |
|------|----------|
| **AI / LLM Engineer** | Primary identity — headline, hero copy, default carousel mode |
| Mobile Dev | Secondary — shipped apps, proof of full-stack depth |
| Web Dev | Secondary — platforms, APIs, cloud systems |
| Desktop Dev | Secondary — business tools, cross-platform delivery |

The site must never read as “generalist for hire.” It reads as: **“I’m an AI engineer who has already shipped across mobile, web, and desktop — here’s the evidence.”**

Mobile, Web, and Desktop are **modes inside My Projects**, not equal heroes competing with AI.

---

## Global Experience

### Single-page scroll + inertial motion

The entire site is one vertical journey. Every section is anchored by ID and reached via smooth scroll from the nav.

**Inertial scrolling (site-wide):**
- Implement momentum-based scroll so the page feels weightless and premium — not native browser snap.
- Recommended: **Lenis** (`@studio-freight/lenis` or `lenis`) wired in `main.jsx`, synced with `requestAnimationFrame`.
- Pair with existing **Framer Motion** `whileInView` for section reveals — Lenis handles scroll physics, Framer handles enter animations.
- Disable or reduce inertial intensity on `prefers-reduced-motion`.
- Section **pinning** (My Projects) uses Lenis `scrollTo` + `position: sticky` or a dedicated pin wrapper — do not fight Lenis with native `scroll-snap` unless tested together.

### Persistent space canvas

Keep across all sections (fixed layers, **behind all content** — never competing with text, cards, or CTAs):

| Layer | Z-index | Component | Notes |
|-------|---------|-----------|-------|
| Deep space black | 0 | `globals.css` `--bg-base` | Locked near-black — see Color System below |
| Starfield | 0 | `Starfield` | `position: fixed`, tuned opacity per display |
| Ambient drift | 1–2 | `SpaceMaterialsOrbit` | UFO, satellite, asteroid, meteorite PNGs — **very background** |

**Rule:** Foreground content (sections, nav, popups) stays at `z-index ≥ 10`. Space materials never intercept clicks on interactive UI (`pointer-events: none` on layer; individual assets only if intentionally playful and still behind modals).

### Ambient space materials (`SpaceMaterialsOrbit`)

**Keep the existing floating PNGs** — UFO, satellite, asteroid, meteorite from `assets/images/icons/space_material/`. They are a signature of AmmerVerse and add premium polish when done subtly.

| Principle | Implementation |
|-----------|----------------|
| **Do not disturb** | Low opacity (`0.25–0.45`), small scale, slow drift — felt more than seen |
| **Very background** | Always behind sections; never overlap hero face particles or project cards at full opacity |
| **Premium polish** | Soft violet `drop-shadow`, no harsh edges; assets “glide” not “bounce” |
| **Trajectories** | **Redesign allowed** — prefer long, shallow arcs across viewport edges (Bezier / linear paths in `SpaceMaterialsOrbit.jsx`); avoid crossing center content zones (hero face, avatar hub, Stackurn Saturn) |
| **Density** | 2–4 active drifters max on desktop; 1–2 on mobile |
| **Timing** | Stagger spawn ~5s after load; 18–45s crossing duration per asset |
| **UFO** | Curved path only; smallest size of the set; rarest spawn |
| **Satellite** | Slow linear pass; occasional gentle roll on Z |
| **Asteroid / meteorite** | Faster linear diagonal; slightly dimmer than satellite |

Trajectory zones to **avoid** (keep clear for readability):

```
┌─────────────────────────────────────┐
│  ░░░ safe drift along edges ░░░     │
│  ░   ┌─────────────────────┐   ░    │
│  ░   │  CENTER CONTENT     │   ░    │  ← no assets through here
│  ░   │  (hero, projects)   │   ░    │
│  ░   └─────────────────────┘   ░    │
│  ░░░ safe drift along edges ░░░     │
└─────────────────────────────────────┘
```

`prefers-reduced-motion`: freeze or hide drifters; starfield static.

### Navigation

```
AmmerVerse · Intro · Projects · Stackurn · Achievements · Contact · Resume ↓
```

| Link | Target | Behavior |
|------|--------|----------|
| Intro | `#hero` | Smooth scroll |
| Projects | `#my-projects` | Smooth scroll |
| Stackurn | `#stackurn` | Smooth scroll |
| Achievements | `#achievements` | Smooth scroll |
| Contact | `#contact` | Smooth scroll |
| Resume ↓ | Dropdown | Existing PDF downloads (CV, AI resume, etc.) |

Nav: sticky, glass blur on scroll, underline-grow hover.

---

## Site Structure (5 Sections)

```
/  (single page, inertial scroll)
│
├── [1] HERO — "They remember my name"
├── [2] MY PROJECTS — Avatar hub + Z-axis domain carousel
├── [3] STACKURN — Saturn + orbiting framework logos
├── [4] ACHIEVEMENTS — Deployments, clients, Mapbox globe
└── [5] CONTACT
```

---

## Section 1 — Hero (`#hero`)

### Purpose
Leave a **memorable event** in the viewer’s mind: your name, your face (as particles), your AI + DevOps identity — all inside the space theme with assets drifting around.

### Layout (desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  NAV                                                         │
│                                                              │
│   ┌──────────────────────┐    ┌──────────────────────────┐   │
│   │                      │    │  Eyebrow: LLM Engineer    │   │
│   │  PARTICLE DISSOLVE   │    │                           │   │
│   │  FACE ANIMATION      │    │  Headline (display):      │   │
│   │  (your face)         │    │  "Ammer Saeed"            │   │
│   │                      │    │  or memorable tagline     │   │
│   │  LEFT ~45%           │    │                           │   │
│   │                      │    │  Sub: AI systems +        │   │
│   │                      │    │  DevOps / LLMOps focus    │   │
│   └──────────────────────┘    │                           │   │
│                                │  CTA: See My Work ↓       │   │
│   ○ starfield + drifting assets│  CTA: Download Resume     │   │
│                                └──────────────────────────┘   │
│                                         RIGHT ~55%              │
└─────────────────────────────────────────────────────────────┘
```

### Rules
- **Remove all avatars** from the hero — no three-figure row, no domain silhouettes.
- **Left:** Particle Dissolve Face Animation (face images TBD — you will add to `assets/`).
- **Right:** Intro copy positioning you as **LLM Engineer** with **DevOps / LLMOps** as a core pillar (not an afterthought).
- Keep `SpaceMaterialsOrbit` ambient motion; tune so it supports the moment, not distracts from the face.

### Particle Dissolve Face Animation

**New component:** `ParticleFace` (Canvas 2D or WebGL — prefer **Three.js** / `@react-three/fiber` to match existing 3D stack).

| Requirement | Detail |
|-------------|--------|
| Asset input | One or more face images (portrait, high contrast) → `client/src/assets/images/face/` *(pending from you)* |
| Effect | Particles sample face pixels → assemble into face → slow dissolve / reform loop |
| Interaction | Optional: mouse repulsion or subtle parallax on cursor move |
| Performance | Cap particle count on mobile; static fallback image if `prefers-reduced-motion` |
| Mood | Ethereal, sci-fi, “materializing from stardust” — fits space theme |

**Memorable copy direction (right column):**
- Display name prominent: **Ammer Saeed**
- Headline angle: *“I build systems that think.”* or *“LLM Engineer. DevOps backbone. Production AI.”*
- One line on what you ship: RAG, agents, CI/CD, model serving
- CTAs scroll to `#my-projects` and resume download

### Hero motion
- Staggered fade-up on headline words (80ms stagger)
- Particle face: continuous subtle dissolve cycle (4–8s loop)
- Gradient mesh overlay on hero only (`--gradient-mesh` from design tokens)
- Scroll hint at bottom: `↓`

### Mobile
- Stack: particle face on top (shorter height), intro below
- Reduce particle density

---

## Section 2 — My Projects (`#my-projects`)

### Purpose
Show **one avatar in the center** with **floating project cards** orbiting around it. The active “dev mode” switches between **AI · Mobile · Web · Desktop**. Clicking any card opens the existing **`ProjectPopup`**.

### Existing code to reuse

| Piece | Path | Status |
|-------|------|--------|
| Project data | `data/developerModels.js` → `PROJECTS`, `DEVELOPERS` | ✅ |
| Project card UI | `components/ProjectCard/` | ✅ |
| Floating overlay layout | `components/ProjectCardsOverlay/` | ✅ (adapt for scroll-pinned section) |
| Detail modal | `components/ProjectPopup/ProjectPopup.jsx` | ✅ |
| Avatar images | `assets/images/avatar/` | ✅ |
| Mobile / Web / Desktop projects | `developerModels.js` categories | ✅ |
| **AI projects + AI card theme** | — | ❌ **Must create** |

### Domain modes (carousel order)

| Index | Mode | Default? | Center avatar | Card style |
|-------|------|----------|---------------|------------|
| 0 | **AI / LLM** | ✅ Yes | AI-themed avatar or primary portrait | New AI glass card (neural glow, mono tags) |
| 1 | Mobile | | Mobile dev avatar (`avatar2`) | Phone mockup cards (existing) |
| 2 | Web | | Web dev avatar (`avatar1`) | Browser / screenshot cards (existing) |
| 3 | Desktop | | Desktop dev avatar (`avatar3`) | Desktop window cards (existing) |

### Layout (when section is active / centered)

```
                    [Project Card]
                          ╲
         [Project Card]    👤 Avatar    [Project Card]
                          ╱
                    [Project Card]

        ◀  AI · Mobile · Web · Desktop  ▶     (mode tabs / arrows)
              ● ○ ○ ○  (carousel dots)
```

- **Avatar:** fixed center, swaps or cross-fades per mode
- **Cards:** 2–4 projects per mode, positioned in an arc around the avatar (reuse absolute positioning pattern from `ProjectCardsOverlay`)
- **AI mode:** create at least **2 AI project entries** in `developerModels.js` (personal RAG/agent projects count) + **AI-themed `ProjectCard` variant** (violet neural border, chip/tag styling)

### Scroll behavior — section pins and centers

When the user scrolls into My Projects:

1. Section **pins** to viewport (sticky / scroll-triggered pin via Lenis + CSS or GSAP ScrollTrigger)
2. Content **centers** vertically — user feels “inside” the project hub
3. While pinned, vertical scroll input can optionally advance carousel OR user uses controls only (decide in build: **manual + auto, scroll does not hijack** unless shift+scroll)

### Z-axis carousel (auto + manual)

**New component:** `DomainCarousel` wrapping avatar + orbiting cards.

| Feature | Behavior |
|---------|----------|
| Auto-advance | Every **6–8s**, rotate to next domain (AI → Mobile → Web → Desktop → loop) |
| Manual | Prev/Next arrows + dot indicators; click tab label to jump |
| Z-axis transition | Outgoing cards: `scale(0.85)`, `opacity: 0`, `translateZ(-80px)`; incoming: reverse — `framer-motion` `AnimatePresence` with `perspective: 1200px` on container |
| Pause auto | On hover, focus, or manual interaction — resume after 12s idle |
| Default slide | **AI / LLM** on first entry |

### Card click → popup

```jsx
onProjectClick={(project) => setSelectedProject(project)}
// ...
{selectedProject && (
  <ProjectPopup project={selectedProject} onClose={() => setSelectedProject(null)} />
)}
```

`ProjectPopup` already supports: images slider, tech stack, duration, GitHub/live links, client reviews.

### Mobile
- Pin section for shorter duration or skip pin
- Single-card carousel (pattern from `ProjectCardsOverlay` mobile branch)
- Domain switcher: horizontal pill tabs below avatar

---

## Section 3 — Stackurn (`#stackurn`)

### Purpose
**Framework showoff** — Saturn-inspired visual metaphor: a planet of stacks, frameworks orbiting like rings.

> Name: **Stackurn** = Stack + Saturn

### Layout

```
              [Docker]
         [LangChain]     [React]
    [Python]    🪐 SATURN    [FastAPI]
         [K8s]         [Flutter]
              [OpenAI]
```

- **Center:** Saturn asset from `assets/` *(you will provide — PNG or GLB)*
- **Orbit:** Framework/tool logos arranged on a **Y-axis circular path** (vertical ring — logos travel around Saturn like a hoop viewed from the side)
- **Logo source:** Fetch from public CDN at runtime, e.g.:
  - [Simple Icons CDN](https://cdn.simpleicons.org/{slug}/{color})
  - [Devicon](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{name}/{name}-original.svg)
- Cache logo URLs in a config file `stackurnLogos.js` — don’t hardcode broken links

### Suggested orbit stacks (two rings)

**Inner ring — AI / LLMOps:** OpenAI, LangChain, Hugging Face, Pinecone, Ollama, Python, Docker, vLLM

**Outer ring — Full-stack / DevOps:** React, Flutter, Rust, FastAPI, Kubernetes, GitHub Actions, Supabase, MongoDB

### Implementation notes

| Piece | Approach |
|-------|----------|
| Saturn | `<img>` or Three.js mesh with ring geometry; slow Y rotation |
| Logos | CSS 3D `transform: rotateY()` on parent + counter-rotate children so icons stay upright OR Three.js orbit group |
| Section title | “Stackurn” with subtitle: *“The stacks I ship with.”* |
| Motion | Logos orbit continuously (20–40s per revolution); pause on hover |
| Fallback | If CDN fails, show mono text pill |

### Mobile
- Saturn smaller, single ring, fewer logos
- Marquee fallback if 3D perf is poor

---

## Section 4 — Achievements (`#achievements`)

### Purpose
**Deployments and clients** — social proof with geography. Mapbox globe shows **where clients / deployments live**.

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ACHIEVEMENTS                                                │
│                                                              │
│  ┌─────────────────────┐   ┌─────────────────────────────┐  │
│  │  Stats / highlights │   │                             │  │
│  │  · N deployments    │   │   MAPBOX EARTH GLOBE        │  │
│  │  · Client names     │   │   (client location pins)    │  │
│  │  · Key outcomes     │   │                             │  │
│  └─────────────────────┘   └─────────────────────────────┘  │
│                                                              │
│  Client cards: NUST · KK's Online · ... (as available)      │
└─────────────────────────────────────────────────────────────┘
```

### Reuse

| Component | Path | Change from today |
|-----------|------|-------------------|
| Earth globe | `components/EarthModel/` | Move from corner widget → **hero of this section**; full-width or half-panel |
| Mapbox | Already integrated | Add **client markers** per deployment (lat/lng from config) |

### Data model (new)

`achievements.js`:

```js
export const CLIENTS = [
  { name: "NUST University", project: "Sportivex", lat: 33.67, lng: 72.99, type: "web" },
  // ...
];
export const DEPLOYMENT_STATS = [
  { label: "Production deployments", value: "10+" },
  { label: "Domains shipped", value: "4" },
  // ...
];
```

### Globe behavior
- Auto-rotate slowly
- Pins pulse on client cities
- Click pin → tooltip: client name + project
- Optional: click zooms globe to region (reuse existing `isZoomed` pattern from `EarthModel`)

### Content
- “Built for [Client]” labels
- Deployment highlights (GKE, Supabase Edge, etc.)
- One short testimonial quote per major client if available

---

## Section 5 — Contact (`#contact`)

### Purpose
Clear closing CTA — hire me, message me, find me.

- Headline: *“Let’s build something that thinks.”*
- Status line: **Open to LLM Engineer & LLMOps roles** (remote-friendly)
- Primary: **Send a Message** → existing `MessagePopup`
- Secondary: GitHub, LinkedIn, Email
- Resume download
- Minimal footer: `© Ammer Saeed · AmmerVerse`

---

## Design System — Color & Display Consistency

Space-themed **blackish** palette that reads as deep space on **OLED** and does **not** wash out to muddy purple-grey on **older LCD / low-gamut** panels.

### Problem to solve

| Display | Risk |
|---------|------|
| OLED / IPS | Background too bright → stars blow out; glass cards glow too much |
| Old LCD / greyish panels | Purple-tinted dark greys → looks cheap, not “space black” |
| Mixed | Accent purple fights background on low contrast screens |

### Core tokens

```css
:root {
  /* SPACE — neutral black with barely perceptible cool tint (not purple-grey) */
  --bg-base:           #050508;   /* primary page fill */
  --bg-elevated:       #0A0A10;   /* cards, dropdowns */
  --bg-glass:          rgba(255, 255, 255, 0.04);
  --bg-glass-strong:   rgba(8, 8, 14, 0.82);  /* cool neutral, not purple wash */

  /* Borders — visible on dim LCD without looking loud on OLED */
  --border-subtle:     rgba(255, 255, 255, 0.08);
  --border-mid:        rgba(255, 255, 255, 0.12);
  --border-glow:       rgba(168, 85, 247, 0.30);  /* accent only on hover/active */

  /* Accent — violet/indigo; use sparingly (headings, tags, CTAs, active states) */
  --accent-primary:    #A855F7;
  --accent-secondary:  #6366F1;
  --accent-glow:       #C084FC;

  /* Text — high legibility on both OLED and washed LCD */
  --text-primary:      #F0F0F2;
  --text-secondary:    #A1A1AA;
  --text-muted:        #71717A;

  /* Stars & ambient assets */
  --star-opacity:      0.45;      /* 0.4–0.5; never full white dots */
  --space-asset-opacity: 0.35;    /* UFO / satellite layer */

  /* Depth — subtle; invisible as “gradient” on bad screens */
  --gradient-mesh:
    radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 0%,   rgba(99, 102, 241, 0.06) 0%, transparent 50%);
  --gradient-hero-center:
    radial-gradient(ellipse at 50% 40%, rgba(80, 60, 140, 0.06) 0%, transparent 70%);
}
```

### Rules by element

| Element | OLED-safe | LCD-safe |
|---------|-----------|----------|
| Page background | Solid `#050508` — no full-screen purple gradient | Same solid base avoids grey shift |
| Starfield | `opacity: var(--star-opacity)`; star size 1–2px | Same; prevents “snow” on bright panels |
| Glass cards | `rgba(255,255,255,0.04)` + `blur(12px)` | Stronger border `1px solid rgba(255,255,255,0.10)` for edge definition |
| Body text | `#F0F0F2` at 14–16px minimum | Avoid `#EAEAEA` on translucent purple stacks |
| Accent purple | Headlines, pills, CTA, hover borders only | Never use as large background fill |
| Space PNGs | `opacity: 0.25–0.35` + soft shadow | Keep out of center content zone |
| Selection / focus | `--accent-primary` fill | Sufficient contrast on both display types |

### What to avoid

- Large `rgba(26, 11, 46, …)` or `#1a0b2e` purple washes as section backgrounds — reads grey on old screens
- `rgba(255,255,255,0.08+)` card fills without borders — bloom on OLED
- Full-opacity white stars or space assets
- Competing glows (mesh + card glow + asset shadow all maxed at once)

### Typography

Fonts: **Clash Display** (headlines), **Satoshi** (body), **JetBrains Mono** (tech tags).

See also: `002_lenardo-ui.md` for glass + gradient-mesh motion details.

---

## Assets Pending (from you)

| Asset | Path | Used in |
|-------|------|---------|
| Face image(s) for particle effect | `assets/images/face/` | Hero `ParticleFace` |
| Saturn image / 3D model | `assets/images/stackurn/saturn.*` | Stackurn section |
| AI project screenshots | `assets/images/ai_dev/projects/` | AI project cards |

---

## New Components Summary

| Component | Section | Priority |
|-----------|---------|----------|
| `ParticleFace` | Hero | 🔴 P0 |
| `DomainCarousel` | My Projects | 🔴 P0 |
| `AIProjectCard` (variant) | My Projects | 🔴 P0 |
| AI projects in `developerModels.js` | My Projects | 🔴 P0 |
| `Stackurn` | Stackurn | 🟡 P1 |
| `AchievementsSection` | Achievements | 🟡 P1 |
| `LenisProvider` / scroll wrapper | Global | 🔴 P0 |
| Updated `Navbar` anchors | Global | 🟡 P1 |

---

## Build Phases

| Phase | Deliverable |
|-------|-------------|
| **0** | Color tokens + display-safe globals; tune `Starfield` + `SpaceMaterialsOrbit` opacity/trajectories |
| **1** | Lenis inertial scroll + updated nav anchors + section IDs |
| **2** | Hero: remove avatars, layout split, `ParticleFace` placeholder until face assets arrive |
| **3** | My Projects: scroll pin, `DomainCarousel`, AI data + card theme, `ProjectPopup` wire-up |
| **4** | Stackurn: Saturn asset + Y-axis logo orbit + CDN logo config |
| **5** | Achievements: relocate `EarthModel`, client markers, stats panel |
| **6** | Contact section polish + mobile pass + `prefers-reduced-motion` audit |
| **7** | Performance: particle count, Mapbox lazy load, logo CDN cache |

---

## Success Criteria

- [ ] Visitor remembers **name + face + AI identity** within 5 seconds of landing
- [ ] **AI is the default** domain in My Projects carousel
- [ ] Mobile / Web / Desktop feel like **proof lanes**, not competing identities
- [ ] Project cards open **`ProjectPopup`** with full detail
- [ ] Scroll feels **inertial and premium** site-wide
- [ ] **Stackurn** is visually distinct and explains your stack without a boring list
- [ ] **Achievements** globe shows real client geography
- [ ] **AmmerVerse** brand reads as one universe — name, tone, and visuals aligned
- [ ] Colors look **deep-space black on OLED** and **clean (not muddy grey-purple) on old LCD**
- [ ] UFO / satellite / asteroid drifters add **premium polish** without distracting from content
- [ ] Space theme + drifting assets remain cohesive, not chaotic

---

## Out of Scope (removed from this plan)

- Three-avatar hero row
- Click-only view-mode navigation (`default` → `selected` → `projects`)
- Separate About / LLM / filter-grid sections from the previous iteration
- Filter bar project grid as primary projects UX (replaced by orbiting carousel hub)
