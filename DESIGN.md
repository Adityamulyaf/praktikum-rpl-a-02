# DESIGN.md — HaloMBG Desktop Design System

> **Version:** 1.0  
> **Last Updated:** May 2026  
> **Status:** Source of Truth  
> **Platform:** ReactJS Web Application (Desktop-first, responsive)  
> **Context:** Civic monitoring platform for Indonesia's Program Makan Bergizi Gratis (MBG)

---

## 1. Design Philosophy

HaloMBG serves real people in a real public program. Parents checking if their children received nutritious meals. Kitchen operators logging daily menus under time pressure. Teachers moderating student reviews between classes. Government administrators overseeing distribution across hundreds of kitchens.

This is not a SaaS product selling subscriptions. This is public infrastructure.

**The interface must feel like a trustworthy institution that happens to be digital** — not a startup dashboard wearing a government costume.

### Emotional Goals

**Trust first.** Every pixel should communicate reliability. Users are entrusting this platform with information about their children's nutrition. The design must earn that trust through clarity, not decoration.

**Calm competence.** The feeling of a well-organized public library — everything has its place, nothing demands attention unnecessarily, help is always findable.

**Warmth without sweetness.** This platform deals with children's wellbeing. The tone should feel caring and human, like a good school administrator — professional, approachable, never patronizing.

**Transparency as aesthetic.** Information should feel open and accessible. No dark patterns, no hidden states, no ambiguity about what's happening in the system.

### Interaction Feeling

Using HaloMBG should feel like:
- Reading a well-typeset report, not scrolling through a feed
- Talking to a competent civil servant who respects your time
- Using a tool made by people who understand the work you do

It should never feel like:
- A demo for investors
- A template someone bought and reskinned
- A toy pretending to be serious software

---

## 2. Visual Principles

### 2.1 Spacing System

Use an **8px base grid**. All spacing derives from multiples of 8.

| Token        | Value | Usage                                       |
|-------------|-------|---------------------------------------------|
| `space-xs`  | 4px   | Inline icon gaps, tight label pairs         |
| `space-sm`  | 8px   | Related element spacing, input padding      |
| `space-md`  | 16px  | Default component internal padding          |
| `space-lg`  | 24px  | Section gaps within a content area          |
| `space-xl`  | 32px  | Between distinct content groups              |
| `space-2xl` | 48px  | Major section separators                     |
| `space-3xl` | 64px  | Page-level breathing room                    |

**Never eyeball spacing.** If it's not a token, it's wrong.

### 2.2 Rhythm

Content should follow a **vertical rhythm anchored to 24px line-height** for body text. Headings, spacing, and component heights should snap to multiples of this rhythm where practical.

Horizontal rhythm follows a **12-column grid** with 24px gutters and 32px page margins on desktop.

### 2.3 Hierarchy

Establish hierarchy through **three mechanisms only**, in this priority:

1. **Size and weight of typography** — the primary tool
2. **Spatial proximity and grouping** — what's near what
3. **Color value contrast** — darker = more important, lighter = supporting

Avoid establishing hierarchy through:
- Borders and dividers (these flatten hierarchy)
- Background color blocks (these create visual noise)
- Icons used as importance indicators
- Shadow depth (not a reliable hierarchy signal)

### 2.4 Density

HaloMBG handles operational data — menu tables, distribution statuses, kitchen lists. **Respect information density.**

**Default density:** Comfortable — enough whitespace for scannability, tight enough that users don't scroll endlessly to find what they need.

**Data-heavy views** (tables, lists, monitoring dashboards): increase density. Reduce padding, tighten line-height to 20px, use smaller type sizes. Users in these views are working, not browsing.

**Public-facing views** (kitchen profiles, menu displays): decrease density. Give content room to breathe. Users here are reading, not operating.

### 2.5 Whitespace Philosophy

Whitespace is structural, not decorative. Use it to **group and separate**, never to "look premium."

- Between related items: `space-sm` to `space-md`
- Between groups within a section: `space-lg` to `space-xl`
- Between sections: `space-2xl` to `space-3xl`

**If you can't articulate why a space exists, remove it.**

---

## 3. Typography

### 3.1 Font Stack

| Role         | Font Family                                     | Fallback                    |
|-------------|------------------------------------------------|----------------------------|
| **Headings** | **Plus Jakarta Sans** (600, 700)               | system-ui, sans-serif       |
| **Body**     | **Plus Jakarta Sans** (400, 500)               | system-ui, sans-serif       |
| **Data/Mono**| **JetBrains Mono** or **IBM Plex Mono** (400)  | monospace                   |

**Why Plus Jakarta Sans:** Designed with Southeast Asian readability in mind. Humanist proportions with a contemporary feel. Geometric enough to feel modern, organic enough to feel warm. Excellent Bahasa Indonesia character support. Not overused in AI-generated UIs.

**Avoid:** Inter (generic), Poppins (childish at body sizes), Roboto (too Google), Space Grotesk (AI slop marker), Montserrat (dated), any font that signals "startup" over "institution."

### 3.2 Type Scale

| Token      | Size  | Weight | Line-Height | Usage                                  |
|-----------|-------|--------|-------------|----------------------------------------|
| `display` | 32px  | 700    | 40px        | Page titles only (1 per page max)      |
| `h1`      | 24px  | 700    | 32px        | Primary section headings               |
| `h2`      | 20px  | 600    | 28px        | Subsection headings                    |
| `h3`      | 16px  | 600    | 24px        | Card titles, group labels              |
| `body`    | 14px  | 400    | 22px        | Default paragraph text                 |
| `body-sm` | 13px  | 400    | 20px        | Secondary descriptions, table cells    |
| `caption` | 12px  | 500    | 16px        | Labels, timestamps, metadata           |
| `overline`| 11px  | 600    | 16px        | Category labels, uppercase sparingly   |
| `footer-display` | 80–120px | 700–800 | 1.0 | Footer brand wordmark only   |

### 3.3 Typography Rules

**Line length:** 60–75 characters for body text. Never let paragraphs span the full width of a wide content area.

**Letter-spacing:** Only adjust for `overline` (+0.5px) and `display` (-0.3px). Leave everything else at default.

**Emphasis:**
- Use `font-weight: 500` (medium) for inline emphasis — **not bold**. Reserve 600/700 for headings.
- Use color (the primary navy) for semantic emphasis over typographic weight.
- Italic only for proper nouns, foreign terms, or technical names — never for generic emphasis.
- Underline only for links. No exceptions.

**Uppercase:** Only for `overline` labels (e.g., "STATUS DISTRIBUSI", "KATEGORI"). Never for buttons, headings, or body text.

---

## 4. Color System

### 4.1 Palette

```
PRIMARY         #071E49   Deep Navy        — Trust, authority, stability
SECONDARY       #92D05D   Fresh Green      — Growth, wellbeing, optimism
ACCENT          #B5E0EA   Soft Pastel Blue — Openness, calmness
HIGHLIGHT       #D1B06C   Warm Gold        — Achievement, aspiration

SURFACE-1       #FFFFFF   White            — Primary background
SURFACE-2       #F8F7F5   Warm Off-white   — Secondary background, cards
SURFACE-3       #F0EEEB   Light Warm Gray  — Tertiary, sidebar background

TEXT-PRIMARY     #1A1A18   Near Black       — Headings, primary content
TEXT-SECONDARY   #5C5B57   Warm Gray        — Descriptions, secondary info
TEXT-TERTIARY    #8E8D88   Light Warm Gray  — Placeholders, disabled text
TEXT-INVERSE     #FFFFFF   White            — Text on dark backgrounds

BORDER-DEFAULT   #E5E3DF   Warm Light Gray  — Subtle borders where needed
BORDER-STRONG    #C4C2BC   Medium Warm Gray — Emphasized borders (rare)

STATUS-SUCCESS   #2E7D32   Deep Green       — Verified, complete, valid
STATUS-WARNING   #E8A817   Amber            — Pending, needs attention
STATUS-ERROR     #C62828   Deep Red         — Error, critical, rejected
STATUS-INFO      #1565C0   Blue             — Informational, neutral alerts
```

### 4.2 Usage Proportions

| Color        | Proportion | Where                                              |
|-------------|------------|-----------------------------------------------------|
| **Surfaces** (whites/off-whites) | ~70% | Backgrounds, content areas, cards |
| **Text colors** | ~15% | All text content                                |
| **Primary** (#071E49) | ~8% | Sidebar, navigation active states, primary buttons, headings in hero sections |
| **Secondary** (#92D05D) | ~3% | Success indicators, progress bars, positive metrics, CTA buttons (sparingly) |
| **Accent** (#B5E0EA) | ~2% | Selected state backgrounds, info callouts, gentle highlights |
| **Highlight** (#D1B06C) | ~1% | Achievement badges, premium labels, validated status icons |
| **Status colors** | ~1% | Contextual only — never decorative |

### 4.3 Where NOT to Use Colors

| Color | Never use for |
|-------|--------------|
| **Secondary green** | Large background fills, text color, borders, card backgrounds |
| **Accent blue** | Buttons, text, headings, icons (too low contrast) |
| **Highlight gold** | Backgrounds, borders, large areas, body text |
| **Status colors** | Decoration, branding, persistent UI elements |
| **Primary navy** | More than 2 large surfaces on one screen (overwhelming) |

### 4.4 Accessibility Requirements

All text must meet **WCAG 2.1 AA** minimum contrast ratios:

| Context | Minimum Ratio |
|---------|--------------|
| Body text on white/off-white | 4.5:1 |
| Large text (18px+) on white/off-white | 3:1 |
| Interactive elements | 3:1 against background |
| Text on primary navy background | Use white (#FFFFFF) only |
| Text on secondary green background | Use primary navy (#071E49) only |
| Text on accent blue background | Use primary navy (#071E49) only |

**Never use accent blue (#B5E0EA) as text color** — it will fail contrast on any light background.

**Status colors must be paired with icons or text labels** — never color-only indication.

### 4.5 Dark Backgrounds

The primary navy (#071E49) is the **only** dark background allowed in the interface. It appears in:
- Login panel (left side branding area)
- Sidebar navigation
- Footer (public-facing pages)
- Notification toasts (error/critical only)

**No gradients, no dark-to-light fades, no overlays.** Solid color only.

---

## 5. Component Guidelines

### 5.1 Buttons

**Variants:**

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| **Primary** | `#071E49` | White | None | 1 per visible area. Main action only. |
| **Secondary** | Transparent | `#071E49` | 1px `#071E49` | Supporting actions. |
| **Tertiary** | Transparent | `#5C5B57` | None | Cancel, dismiss, low-priority. |
| **Destructive** | `#C62828` | White | None | Delete, remove. Always requires confirmation. |

**Sizing:**

| Size | Height | Padding | Font |
|------|--------|---------|------|
| Default | 40px | 16px 20px | 14px / 500 |
| Small | 32px | 8px 12px | 13px / 500 |

**Corner radius:** 6px. Not 8, not 12, not 16. **6px everywhere, consistently.**

**Rules:**
- ✓ One primary button per visible viewport area
- ✓ Button labels are verbs: "Simpan Menu", "Kirim Ulasan", "Unduh Laporan"
- ✓ Loading state replaces label with spinner + "Menyimpan..." text
- ✗ No icon-only buttons without tooltip (except universally understood: close, search)
- ✗ No gradient backgrounds
- ✗ No shadow on buttons
- ✗ No pill-shaped buttons (border-radius: 999px)
- ✗ No "ghost" buttons with colored text on colored backgrounds
- ✗ No uppercase button labels

### 5.2 Cards

Cards are **content containers**, not decorative elements.

**Default card styling:**
```css
background: var(--surface-2);    /* #F8F7F5 */
border-radius: 8px;
padding: 20px;
border: none;                    /* NO BORDER by default */
box-shadow: none;                /* NO SHADOW by default */
```

**When to add a border:** Only when multiple cards are adjacent and need visual separation that spacing alone can't provide (e.g., a grid of kitchen cards).

**When to add a border, use:**
```css
border: 1px solid var(--border-default);  /* #E5E3DF */
```

**Rules:**
- ✓ Cards group related content — a kitchen's info, a menu entry, a review
- ✓ Content inside cards uses the card's internal spacing system
- ✓ Cards on `surface-1` (white) backgrounds use `surface-2` fill
- ✓ Cards on `surface-2` backgrounds use `surface-1` (white) fill
- ✗ No cards inside cards (nesting is forbidden)
- ✗ No elevated cards (box-shadow for "depth")
- ✗ No cards with colored left-border accents
- ✗ No cards with header stripes or colored top edges
- ✗ No hover effects that lift cards with shadow
- ✗ No cards as clickable surfaces without explicit affordance (link or button inside)

### 5.3 Navigation

**Sidebar (authenticated views):**
- Width: 240px collapsed / expanded
- Background: `#071E49` (primary navy)
- Text: White, opacity 0.7 for inactive items, 1.0 for active
- Active indicator: 3px left border in `#92D05D` (secondary green), NOT a background highlight
- Icons: 20px, outlined style, white
- Spacing: 8px between nav items, 24px between nav groups
- Logo area: Top, 64px height, minimal
- Profile/settings: Bottom-anchored

**Top bar:**
- Height: 56px
- Background: `surface-1` (white)
- Bottom border: 1px `border-default`
- Contains: breadcrumb (text only, no icons), search input, notification icon, user avatar
- No shadows, no gradients
- Scroll behavior: Can transition to a floating rounded layout with a subtle shadow and side margins on scroll to maximize vertical reading space.

**Rules:**
- ✓ Current page indicated in both sidebar (active state) and breadcrumb
- ✓ Search bar is always visible in top bar
- ✗ No hamburger menu on desktop — sidebar is always visible
- ✗ No mega-menus or dropdown navigation trees
- ✗ No icon-only sidebar on desktop (text labels always visible)

### 5.4 Tables

Tables are **the primary data display component** in HaloMBG. They must be excellent.

**Styling:**
```css
/* Header */
background: var(--surface-2);
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.3px;
color: var(--text-secondary);
padding: 10px 16px;
border-bottom: 1px solid var(--border-default);

/* Rows */
padding: 12px 16px;
font-size: 14px;
border-bottom: 1px solid var(--border-default);  /* between rows only */

/* Hover */
background: var(--surface-2);  /* subtle, not dramatic */
```

**Rules:**
- ✓ Zebra striping is optional — use only if rows exceed 10 and columns exceed 5
- ✓ Right-align numeric columns
- ✓ Truncate long text with ellipsis and tooltip
- ✓ Sticky header on scroll
- ✓ Sortable columns indicated with subtle caret icon
- ✗ No rounded corners on tables
- ✗ No card-wrapped tables (table IS the container)
- ✗ No colored row backgrounds for status — use a status badge in a column instead
- ✗ No vertical borders between columns

### 5.5 Forms

**Input fields:**
```css
height: 40px;
padding: 8px 12px;
border: 1px solid var(--border-default);
border-radius: 6px;
font-size: 14px;
background: white;
```

**Focus state:**
```css
border-color: var(--primary);
outline: 2px solid rgba(7, 30, 73, 0.15);
outline-offset: 1px;
```

**Error state:**
```css
border-color: var(--status-error);
/* Error message below input, 12px, color: status-error */
```

**Labels:**
- Always above the input, never inside (no floating labels)
- 13px, weight 500, color `text-primary`
- Required fields marked with `*` in `status-error` color
- Optional fields can say "(opsional)" in `text-tertiary`

**Rules:**
- ✓ Group related fields with a section heading, not a fieldset border
- ✓ Single-column forms for data entry (SPPG menu input, reviews)
- ✓ Two-column forms only for short admin settings
- ✓ Helper text below fields in `caption` size, `text-secondary` color
- ✗ No inline validation on every keystroke — validate on blur or submit
- ✗ No placeholder text as the only label
- ✗ No custom-styled checkboxes/radios that break native accessibility
- ✗ No toggle switches for yes/no where a checkbox would do
- ✗ No multi-step wizards for forms under 8 fields

### 5.6 Badges & Status Indicators

**Badge sizes:**
| Size | Height | Padding | Font |
|------|--------|---------|------|
| Default | 24px | 4px 10px | 12px / 500 |
| Small | 20px | 2px 8px | 11px / 500 |

**Corner radius:** 4px (NOT pill-shaped).

**Status badge styles:**

| Status | Background | Text | Example |
|--------|-----------|------|---------|
| Tervalidasi (Verified) | `#E8F5E9` | `#2E7D32` | AI nutrition validated |
| Menunggu (Pending) | `#FFF8E1` | `#E8A817` | Awaiting moderation |
| Ditolak (Rejected) | `#FFEBEE` | `#C62828` | Review flagged |
| Info | `#E3F2FD` | `#1565C0` | General info |
| Netral | `#F0EEEB` | `#5C5B57` | Default/inactive |

**Rules:**
- ✓ Badges communicate status — they are functional, not decorative
- ✓ Always include a text label — never color-only
- ✗ No more than 2 badges on a single card or row
- ✗ No animated badges, pulsing dots, or attention-grabbing effects
- ✗ No badge with the highlight gold color (gold is for icons/accents only)

### 5.7 Modals

**Sizing:**
| Type | Width | Usage |
|------|-------|-------|
| Small | 400px | Confirmations, simple alerts |
| Default | 520px | Form submissions, detail views |
| Large | 680px | Complex content, data review |

**Styling:**
```css
background: white;
border-radius: 8px;
padding: 24px;
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);  /* shadow allowed ONLY on modals */
```

**Overlay:** `rgba(0, 0, 0, 0.4)` — not too dark, not transparent.

**Rules:**
- ✓ Close button (X) top-right, always
- ✓ ESC key closes non-critical modals
- ✓ Destructive actions require explicit confirmation text
- ✓ Modal title is always present and descriptive
- ✗ No nested modals (modal opening another modal)
- ✗ No full-screen modals on desktop
- ✗ No modals for content that could be inline
- ✗ No auto-opening modals on page load

### 5.8 Empty States

Empty states occur when: no data exists yet, search returns no results, or a section hasn't been configured.

**Structure:**
1. A simple illustrative icon (from the icon set, 48px, `text-tertiary` color)
2. A clear heading explaining the state: "Belum ada menu hari ini"
3. A brief supporting sentence: "Menu akan muncul setelah SPPG menginput data harian."
4. A single action button if applicable: "Input Menu Sekarang"

**Rules:**
- ✓ Center-aligned within the content area
- ✓ Tone is helpful and forward-looking, never blaming
- ✗ No large illustrations or mascots
- ✗ No decorative SVG scenes (mountains, clouds, plants)
- ✗ No "Oops!" or cutesy language
- ✗ No empty states that just say "Tidak ada data" with no context

### 5.9 Footer

The footer appears on **public-facing pages only** (landing page, kitchen profiles). Authenticated dashboard views do NOT have a footer.

**Structure (top to bottom):**

1. **CTA + Navigation row** — tagline on the left, link columns on the right
2. **Brand display** — oversized "HaloMBG" wordmark as visual anchor
3. **Bottom bar** — copyright text and legal links

**Styling:**
```css
background: var(--color-primary);   /* #071E49 — solid navy, no gradient */
color: var(--text-inverse);          /* White */
padding: var(--space-3xl) var(--space-2xl) var(--space-lg);
```

**CTA tagline:**
- Font: display size (32px) or larger, weight 700
- Color: white
- Max one line, no period

**Navigation columns:**
- 2–3 columns of links, 14px weight 400
- Color: `rgba(255, 255, 255, 0.7)` default, `1.0` on hover
- No underline by default, underline on hover
- No icons

**Brand display:**
- Font size: 80–120px (responsive), weight 700–800
- Color: white, opacity 1.0
- Letter-spacing: tight (-1px to -2px)
- Purely decorative — not wrapped in a heading tag (use `<span>` or `<div>`)
- Overflow-clip allowed on smaller viewports

**Bottom bar:**
- Separated by `1px rgba(255, 255, 255, 0.1)` top border
- Font: caption size (12px), weight 400
- Color: `rgba(255, 255, 255, 0.45)`
- Left: brand name or "© 2026 HaloMBG"
- Right: legal links (Kebijakan Privasi, Syarat Layanan)

**Rules:**
- ✓ Footer is the only place where oversized decorative typography is allowed
- ✓ Keep link count under 12 total across all columns
- ✗ No social media icons (this is a civic platform, not a brand)
- ✗ No newsletter signup form in footer
- ✗ No background image, pattern, or gradient
- ✗ No "back to top" button

---

## 6. Layout Rules

### 6.1 Page Structure

Every authenticated page follows this anatomy:

```
┌─────────────────────────────────────────────────┐
│  Sidebar (240px)  │  Top Bar (56px)             │
│                   ├─────────────────────────────│
│  - Logo           │  Content Area               │
│  - Nav Items      │  ┌─────────────────────────┐│
│  - Nav Groups     │  │  Page Title + Actions   ││
│                   │  │                         ││
│                   │  │  Content                ││
│                   │  │  (max-width: 1120px)    ││
│                   │  │                         ││
│  - Profile        │  └─────────────────────────┘│
└─────────────────────────────────────────────────┘
```

**Content max-width:** 1120px, centered within the content area. Data-heavy pages (admin tables, monitoring) can stretch to 1280px.

### 6.2 Content Grouping

**Use spacing to group — not boxes, not borders, not background colors.**

Instead of wrapping related content in a bordered card:
```
✗  ┌──────────────────────┐
   │  Section Title        │
   │  Content here...      │
   └──────────────────────┘
```

Use spacing and typography:
```
✓  Section Title              ← h2, with space-2xl above
   Content here...            ← body, space-sm below title
                              ← space-xl before next group
```

**Borders and dividers are a last resort.** Use a 1px `border-default` horizontal line only when:
- Content groups are same-level and spacing alone is ambiguous
- Separating a fixed header from scrollable content
- Between table rows (expected convention)

### 6.3 Avoid Dashboard Syndrome

"Dashboard Syndrome" is when every page becomes a grid of cards with metrics, charts, and status indicators competing for attention.

**HaloMBG's dashboard should:**
- ✓ Show 3–4 key metrics at the top, as plain text with labels — not "metric cards"
- ✓ Have 1 primary chart that tells today's most important story
- ✓ Show a list of items needing attention, as a simple table or list
- ✓ Feel like a morning briefing, not a cockpit

**HaloMBG's dashboard should not:**
- ✗ Have more than 2 charts visible without scrolling
- ✗ Use colored metric cards (green card for "good", red card for "bad")
- ✗ Show sparklines, donuts, gauges, and progress rings all on one screen
- ✗ Have a 3- or 4-column card grid as the primary layout

### 6.4 Asymmetry

Not everything needs to be a grid. Consider:
- A wide content column (2/3) next to a narrow details panel (1/3) for kitchen profiles
- Full-width tables with no card wrapping
- Left-aligned content that doesn't center on the page
- Text blocks at 65ch width within a wider container

Symmetry is a default, not a requirement. **Break the grid when the content calls for it.**

---

## 7. Motion Principles

### 7.1 Core Rules

**Motion exists to provide feedback, not entertainment.**

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Color, opacity | 150ms | ease-out | Hover states, focus |
| Transform (small) | 200ms | ease-out | Button press, toggle |
| Layout shifts | 250ms | ease-in-out | Accordion, expand/collapse |
| Page transitions | 300ms | ease-in-out | Route changes (if used) |
| Modal entrance | 200ms | ease-out | Fade + slight scale (0.98 → 1) |

### 7.2 Allowed Animations

- Hover color/background changes on interactive elements
- Focus ring appearance
- Accordion/disclosure open and close
- Modal fade in/out
- Toast notification slide in from top-right
- Loading spinner (simple rotation, no bouncing dots)
- Skeleton loading for content areas (subtle pulse)
- ✓ Number counting-up animations on landing page metrics

### 7.3 Forbidden Animations

- ✗ Staggered card entrance animations
- ✗ Parallax scrolling
- ✗ Bouncing, elastic, or spring physics
- ✗ Confetti, particles, or celebration effects
- ✗ Page transition slides or morphs
- ✗ Hover effects that move or "lift" elements
- ✗ Animated gradients or color-cycling backgrounds
- ✗ Typing/typewriter effects
- ✗ Lottie animations for loading states

---

## 8. Illustration & Iconography

### 8.1 Icons

**Icon set:** Use a single outlined icon library — **Lucide** (default in most React ecosystems) or **Phosphor Icons** (outlined weight).

**Sizing:**
| Context | Size | Stroke |
|---------|------|--------|
| Navigation | 20px | 1.5px |
| Inline with text | 16px | 1.5px |
| Empty states | 48px | 1.5px |
| Feature highlights | 32px | 1.5px |

**Color:** Icons inherit text color by default. Colored icons only for status indicators.

**Rules:**
- ✓ Every icon has a text label (except close/X, search magnifier)
- ✓ Icons are functional — they aid comprehension
- ✗ No filled/solid icons (keep it outlined for consistency)
- ✗ No icon inside a colored circle background
- ✗ No decorative icons that don't aid navigation or comprehension
- ✗ No emoji as icons
- ✗ No mixing icon libraries

### 8.2 Illustration Policy

**HaloMBG does not use illustrations** in the traditional sense. No character illustrations, no isometric scenes, no abstract blob art.

For visual moments (onboarding, empty states, error pages), use:
1. **The icon set** at larger sizes
2. **Simple geometric compositions** using the color palette
3. **Photography** (real food, real kitchens, real schools) where visual impact is needed

This is a civic platform. It should look like it was designed, not illustrated.

---

## 9. Anti-AI-Slop Rules

These patterns are **explicitly forbidden** in HaloMBG. If you see them in a design or code review, they must be removed.

### 9.1 Forbidden Structural Patterns

| Pattern | Why It's Forbidden |
|---------|-------------------|
| Cards inside cards inside cards | Creates visual matryoshka — confuses hierarchy |
| Every section wrapped in a bordered card | Turns pages into a grid of boxes — kills natural content flow |
| Border on every element | Creates cage-like feeling — the opposite of openness |
| Giant rounded corners (12px+) on containers | Signals "friendly startup" — inappropriate for civic platform (except for the scroll-based floating rounded navigation topbar/navbar) |
| Sidebar + top nav + breadcrumb + tab bar all visible | Navigation overload — pick a hierarchy |
| Metric cards in a 4-column colored grid | Dashboard cliché — communicate data, don't decorate it |

### 9.2 Forbidden Visual Patterns

| Pattern | Why It's Forbidden |
|---------|-------------------|
| Gradient backgrounds (any kind) | Faux-premium signal — solid colors communicate honesty |
| Box-shadow on everything | Fake depth — use spacing and contrast for hierarchy (shadow allowed ONLY on modals and scroll-based floating rounded navigation topbar/navbar) |
| Glassmorphism (frosted glass, backdrop-blur) | Trend-chasing — adds processing cost, no informational value |
| 4+ accent colors competing on one screen | Visual noise — overwhelms the user |
| Decorative SVG blobs or waves as section dividers | Empty decoration — adds nothing to comprehension |
| Background patterns or textures | Noise pretending to be design |
| Dark mode with neon accents | Wrong context entirely |
| Purple-to-blue gradient hero sections | The #1 AI slop signature — never |

### 9.3 Forbidden Interaction Patterns

| Pattern | Why It's Forbidden |
|---------|-------------------|
| Cards that "lift" with shadow on hover | Skeuomorphic trick — use subtle background change instead |
| Animated number counters | Performative — just show the number (allowed only for landing page statistics to highlight civic metrics) |
| Skeleton screens that shimmer dramatically | Loading state should be quiet, not theatrical |
| Tooltips on everything | If something needs a tooltip, the label is bad |
| Smooth-scroll anchoring on every navigation | Disorienting — let the browser jump |
| "Micro-interactions" on every button/icon | Noise — reserve motion for meaningful state changes |

### 9.4 The Litmus Test

Before shipping any component or page, ask:

1. **"Would this look at home on a government website?"** — If no, it's too flashy.
2. **"Would this look at home on Linear or Notion?"** — If no, it's too clunky.
3. **"Could I remove a visual element and lose nothing?"** — If yes, remove it.
4. **"Is this decoration or communication?"** — If decoration, remove it.
5. **"Would a busy SPPG operator find this helpful at 10am?"** — If no, redesign it.

---

## 10. Reference Mood

### Target Feeling

> "Modern public institution meets thoughtful startup product"

Imagine the intersection of:
- **Government trust** — the credibility of official public infrastructure
- **Notion simplicity** — clean workspace without visual ego
- **Linear restraint** — every element earns its place, nothing gratuitous
- **Editorial calm** — the measured confidence of a well-typeset magazine

### Tonal References (Feeling, Not Copying)

| Reference | What to Take From It |
|-----------|---------------------|
| GOV.UK Design System | Content-first, no decoration, radical clarity |
| Linear | Restraint, density, professional seriousness |
| Notion | Warmth, simplicity, tool-like feeling |
| Stripe Docs | Typography hierarchy, whitespace as structure |
| Cal.com | Open-source energy, clean without being sterile |

### What We Are Not

| Anti-Reference | What to Avoid |
|---------------|--------------|
| Generic Tailwind admin templates | Card grids, purple accents, glass effect sidebars |
| Dribbble "dashboard" shots | Designed to look good in screenshots, not to use |
| Enterprise SaaS (Salesforce, SAP) | Over-engineering, feature-cramming, visual heaviness |
| Startup landing pages | Gradient heroes, floating mockups, "trusted by" logos |
| Social media apps | Infinite scroll, engagement metrics, notification anxiety |

---

## 11. Implementation Notes

### 11.1 CSS Variables

All design tokens should be defined as CSS custom properties at the `:root` level and referenced throughout the application. No hardcoded hex values in components.

```css
:root {
  /* Colors */
  --color-primary: #071E49;
  --color-secondary: #92D05D;
  --color-accent: #B5E0EA;
  --color-highlight: #D1B06C;

  --surface-1: #FFFFFF;
  --surface-2: #F8F7F5;
  --surface-3: #F0EEEB;

  --text-primary: #1A1A18;
  --text-secondary: #5C5B57;
  --text-tertiary: #8E8D88;
  --text-inverse: #FFFFFF;

  --border-default: #E5E3DF;
  --border-strong: #C4C2BC;

  --status-success: #2E7D32;
  --status-warning: #E8A817;
  --status-error: #C62828;
  --status-info: #1565C0;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* Shadows (use sparingly) */
  --shadow-modal: 0 4px 24px rgba(0, 0, 0, 0.12);

  /* Typography */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;
}
```

### 11.2 Component Architecture

Build components as composable primitives, not page-specific blocks:
- `Text` component with variant prop (display, h1, h2, h3, body, body-sm, caption, overline)
- `Stack` / `Inline` for spacing (using space tokens)
- `Surface` for background containers (variant: 1, 2, 3)
- `Badge` for status indicators
- `Button` with variant and size props
- `Table` with built-in sorting, header styling, and density control

### 11.3 Decision Record

When deviating from this system (it will happen), document:
1. **What** was changed
2. **Why** the system's guidance didn't fit
3. **Whether** the system should be updated

No design system is perfect. But undocumented deviations are how systems die.

---

*This document is the source of truth for HaloMBG's visual design. When in doubt, re-read the philosophy section and the anti-slop rules. When still in doubt, choose the simpler option.*
