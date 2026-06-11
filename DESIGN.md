# DESIGN.md — HaloMBG Design System

> **Version:** 2.0
> **Last Updated:** June 2026
> **Status:** Source of Truth
> **Platform:** ReactJS Web Application (Desktop-first, responsive)
> **Context:** Civic monitoring platform for Indonesia's Program Makan Bergizi Gratis (MBG)

---

## 1. Design Philosophy

HaloMBG serves parents checking if their children received meals, kitchen operators logging menus under time pressure, teachers moderating student reviews between classes, and administrators overseeing distribution across hundreds of kitchens.

This is not a SaaS product. This is public infrastructure.

The interface must feel like a trustworthy institution that happens to be digital. Not a startup wearing a government costume. Not a government portal pretending to be modern.

### Emotional Goals

**Confident clarity.** Pitch.com's approach: every element knows exactly what it is and why it exists. No hedging, no over-explanation, no filler decoration.

**Warm authority.** Professional without being cold. The feeling of a well-run school administration office. Organized, approachable, competent.

**Depth without drama.** Pitch earns its visual richness through considered use of shadow, surface layering, and spacing. Not gradients or glass effects. Real depth comes from how surfaces stack and breathe.

**Transparency as structure.** Information should feel open and navigable. No dark patterns, no ambiguous states, no hidden affordances.

### Interaction Feeling

Using HaloMBG should feel like:
- Working in a tool that was designed for the actual job
- Reading a well-produced report, not a marketing page
- Talking to someone who respects your time

It should never feel like:
- A generic admin template someone configured
- A design system demo
- A startup pitch deck turned into an app

---

## 2. Visual Principles

### 2.1 Spacing System

8px base grid. All spacing from multiples of 8.

| Token | Value | Usage |
|---|---|---|
| `space-xs` | 4px | Icon gaps, tight label pairs |
| `space-sm` | 8px | Related element spacing |
| `space-md` | 16px | Default component padding |
| `space-lg` | 24px | Section gaps within content |
| `space-xl` | 32px | Between distinct content groups |
| `space-2xl` | 48px | Major section separators |
| `space-3xl` | 64px | Page-level breathing room |

### 2.2 Elevation System

Pitch uses controlled surface layering to create depth. Shadow is a tool, not decoration. Use it deliberately.

| Level | Shadow | Context |
|---|---|---|
| 0 | none | Flat elements, table rows, inline content |
| 1 | `0 1px 3px rgba(0,0,0,0.08)` | Cards, inputs, default surfaces |
| 2 | `0 4px 12px rgba(0,0,0,0.10)` | Dropdowns, hover cards, floating panels |
| 3 | `0 8px 24px rgba(0,0,0,0.12)` | Modals, dialogs, popovers |
| 4 | `0 16px 40px rgba(0,0,0,0.14)` | Command palettes, full-screen overlays |

Use consecutive levels only. Level 3 should never appear adjacent to another Level 3. Jumping from Level 0 to Level 4 is always wrong.

### 2.3 Surface Layering

Build depth through stacked surfaces, not color blocks.

```
Page background (surface-1: white)
  Card on page (surface-2: warm off-white, shadow-1)
    Input inside card (surface-1: white, shadow-1)
      Dropdown from input (surface-1: white, shadow-2)
```

Never invert this: a white card on a white background is invisible. A white card on off-white background with a light shadow is readable.

### 2.4 Hierarchy

Establish hierarchy through typography size and weight first, spatial grouping second, color contrast third.

Never use borders and dividers as primary hierarchy tools. They flatten content into a grid. Use spacing.

### 2.5 Density

**Default:** Comfortable. Enough whitespace to scan, tight enough to work.

**Data views** (tables, monitoring, admin panels): increase density. Reduce padding, tighten line-height. Users here are working, not browsing.

**Public views** (kitchen profiles, menu display, landing page): decrease density. Users here are reading and assessing.

---

## 3. Typography

### 3.1 Font Stack

| Role | Family | Weights |
|---|---|---|
| Everything | **Montserrat** | 400, 500, 600, 700 |
| Data / Code | **JetBrains Mono** or **IBM Plex Mono** | 400 |

Load Montserrat from Google Fonts. Always include the variable font where possible.

### 3.2 Type Scale

| Token | Size | Weight | Line-Height | Usage |
|---|---|---|---|---|
| `display` | 32px | 700 | 40px | Page titles, one per page |
| `h1` | 24px | 700 | 32px | Primary section headings |
| `h2` | 20px | 600 | 28px | Subsection headings |
| `h3` | 16px | 600 | 24px | Card titles, group labels |
| `body` | 14px | 400 | 22px | Default paragraph text |
| `body-sm` | 13px | 400 | 20px | Secondary content, table cells |
| `caption` | 12px | 500 | 16px | Labels, timestamps, metadata |
| `overline` | 11px | 600 | 16px | Category labels, uppercase only here |
| `footer-display` | 80-120px | 700 | 1.0 | Footer brand wordmark only |

### 3.3 Typography Rules

**Line length:** 60 to 75 characters for body text. Never span full container width in reading contexts.

**Letter-spacing:** Only adjust `overline` (+0.5px) and `display` (-0.3px). Leave everything else at default.

**Emphasis:** Use `font-weight: 500` for inline emphasis, not bold. Reserve 600/700 for headings. Use color for semantic emphasis. No italic for generic emphasis. Underline only for links.

**Uppercase:** Only for `overline` category labels. Never for buttons, headings, or body text.

---

## 4. Color System

### 4.1 Palette

```
PRIMARY         #071E49   Deep Navy        Trust, authority, stability
SECONDARY       #92D05D   Fresh Green      Positive status, success
ACCENT          #B5E0EA   Soft Pastel Blue Info states, selection
HIGHLIGHT       #D1B06C   Warm Gold        Achievement, validated badges

SURFACE-1       #FFFFFF   White            Primary background
SURFACE-2       #F8F7F5   Warm Off-white   Cards, secondary background
SURFACE-3       #F0EEEB   Light Warm Gray  Sidebar, tertiary areas

TEXT-PRIMARY    #1A1A18   Near Black       Headings, primary content
TEXT-SECONDARY  #5C5B57   Warm Gray        Descriptions, secondary info
TEXT-TERTIARY   #8E8D88   Light Warm Gray  Placeholders, disabled
TEXT-INVERSE    #FFFFFF   White            Text on dark backgrounds

BORDER-DEFAULT  #E5E3DF   Warm Light Gray  Subtle borders
BORDER-STRONG   #C4C2BC   Medium Warm Gray Emphasized borders

STATUS-SUCCESS  #2E7D32   Deep Green       Complete, verified
STATUS-WARNING  #E8A817   Amber            Pending, needs attention
STATUS-ERROR    #C62828   Deep Red         Error, critical
STATUS-INFO     #1565C0   Blue             Informational
```

### 4.2 Usage Proportions

| Color | Proportion | Context |
|---|---|---|
| Surfaces (whites/off-whites) | 70% | Backgrounds, content areas |
| Text colors | 15% | All text |
| Primary #071E49 | 8% | Sidebar, primary buttons, active states |
| Secondary #92D05D | 3-5% | Success indicators, positive metrics, CTA buttons |
| Accent #B5E0EA | 2% | Selection backgrounds, info callouts |
| Highlight #D1B06C | 1% | Achievement badges, validated icons |
| Status colors | 1% | Contextual only |

### 4.3 Color Restrictions

| Color | Never use for |
|---|---|
| Secondary green | Large fills, text color, borders |
| Accent blue | Buttons, text, headings |
| Highlight gold | Backgrounds, borders, large areas |
| Status colors | Decoration or branding |
| Primary navy | More than 2 large surfaces per screen |

### 4.4 Accessibility

WCAG 2.1 AA minimum:

| Context | Minimum Ratio |
|---|---|
| Body text on white/off-white | 4.5:1 |
| Large text (18px+) | 3:1 |
| Interactive elements | 3:1 |
| Text on primary navy | White (#FFFFFF) only |
| Text on secondary green | Primary navy (#071E49) only |
| Text on accent blue | Primary navy (#071E49) only |

Status indicators must always pair color with an icon or text label. Never color-only.

### 4.5 Dark Backgrounds

Primary navy (#071E49) is the only dark background allowed. It appears in:
- Login panel left-side branding area
- Sidebar navigation
- Footer (public pages only)

No gradients. No dark-to-light fades. Solid color only.

---

## 5. Component Guidelines

### 5.1 Buttons

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| Primary | `#071E49` | White | None | One per view, main action |
| Secondary | Transparent | `#071E49` | 1px `#071E49` | Supporting actions |
| Tertiary | Transparent | `#5C5B57` | None | Cancel, low-priority |
| Destructive | `#C62828` | White | None | Delete, requires confirmation |

| Size | Height | Padding | Font |
|---|---|---|---|
| Default | 40px | 16px 20px | 14px / 500 |
| Small | 32px | 8px 12px | 13px / 500 |

**Corner radius:** 6px. Consistent everywhere.

Rules:
- One primary button per visible viewport area
- Button labels are verbs: "Simpan Menu", "Kirim Ulasan"
- Loading state shows spinner with "Menyimpan..." text
- No gradient backgrounds on buttons
- No shadow on buttons
- No pill-shaped buttons
- No uppercase button labels
- No icon-only buttons without tooltip

### 5.2 Cards

Cards group related content and sit on the page as distinct surfaces. They use Level 1 elevation.

**Default card:**
```css
background: var(--surface-2);
border-radius: 8px;
padding: 20px;
border: none;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
```

**Interactive card (clickable):**
```css
cursor: pointer;
transition: box-shadow 150ms ease-out, background 150ms ease-out;

&:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
  background: var(--surface-1);
}
```

When to add a border: Only when cards share a grid and shadow alone is insufficient for separation. Use `border: 1px solid var(--border-default)`.

Rules:
- Cards on surface-1 backgrounds use surface-2 fill
- Cards on surface-2 backgrounds use surface-1 fill
- No cards inside cards
- No colored left-border accents on cards
- No header stripes or colored top edges
- No clickable cards without an explicit button or link affordance inside

### 5.3 Navigation

**Sidebar:**
- Width: 240px
- Background: `#071E49`
- Inactive nav text: white at 70% opacity
- Active nav text: white at 100% opacity
- Active indicator: 3px left border in `#92D05D`, not a background fill
- Icons: 20px outlined, white
- Item spacing: 8px between items, 24px between groups
- Logo area: 64px height, top
- Profile: bottom-anchored

**Top bar:**
- Height: 56px
- Background: surface-1
- Bottom border: `1px solid var(--border-default)`
- Contains: breadcrumb, search input, notification icon, user avatar
- Scroll behavior: On scroll, the top bar can transition to a floating rounded card with shadow-2 and side margins, giving the content area more breathing room

Rules:
- Sidebar always visible on desktop. No hamburger menu.
- Text labels always visible alongside icons in sidebar
- No mega-menus or dropdown navigation trees
- Current page shown in both sidebar active state and breadcrumb

### 5.4 Tables

Tables are primary data displays. Style them well.

```css
/* Header row */
background: var(--surface-2);
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.3px;
color: var(--text-secondary);
padding: 10px 16px;
border-bottom: 1px solid var(--border-default);

/* Body rows */
padding: 12px 16px;
font-size: 14px;
border-bottom: 1px solid var(--border-default);

/* Row hover */
background: var(--surface-2);
transition: background 150ms ease-out;
```

Rules:
- Right-align numeric columns
- Truncate long text with ellipsis and tooltip on hover
- Sticky header on scroll
- Sortable columns use a subtle caret icon
- No rounded corners on tables
- No card wrapping around tables
- No colored row backgrounds for status (use a badge column instead)
- No vertical borders between columns
- Zebra striping only on tables with more than 10 rows and more than 5 columns

### 5.5 Forms

```css
/* Input */
height: 40px;
padding: 8px 12px;
border: 1px solid var(--border-default);
border-radius: 6px;
font-size: 14px;
background: white;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

/* Focus */
border-color: var(--primary);
outline: 2px solid rgba(7, 30, 73, 0.12);
outline-offset: 1px;

/* Error */
border-color: var(--status-error);
```

Labels always above the input. Never inside (no floating labels). Required fields marked with `*` in error color. Optional fields say "(opsional)" in tertiary color.

Helper text below field at caption size.

Rules:
- Validate on blur or submit. No keystroke validation.
- No placeholder as the only label
- Single-column forms for data entry
- Two-column only for short admin settings
- No multi-step wizards for forms under 8 fields

### 5.6 Badges

| Size | Height | Padding | Font |
|---|---|---|---|
| Default | 24px | 4px 10px | 12px / 500 |
| Small | 20px | 2px 8px | 11px / 500 |

**Corner radius:** 4px. Not pill-shaped.

| Status | Background | Text |
|---|---|---|
| Tervalidasi | `#E8F5E9` | `#2E7D32` |
| Menunggu | `#FFF8E1` | `#E8A817` |
| Ditolak | `#FFEBEE` | `#C62828` |
| Info | `#E3F2FD` | `#1565C0` |
| Netral | `#F0EEEB` | `#5C5B57` |

Rules:
- Badges are functional, not decorative
- Always include a text label
- Maximum 2 badges per card or table row
- No animated or pulsing badges

### 5.7 Modals

| Type | Width | Usage |
|---|---|---|
| Small | 400px | Confirmations, simple alerts |
| Default | 520px | Form submissions, detail views |
| Large | 680px | Complex content, data review |

```css
background: white;
border-radius: 8px;
padding: 24px;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```

Overlay: `rgba(0, 0, 0, 0.4)`.

Rules:
- Close button top-right, always
- ESC closes non-critical modals
- Destructive actions require explicit confirmation text
- Modal title is always present
- No nested modals
- No full-screen modals on desktop
- No auto-opening modals on page load

### 5.8 Empty States

Structure:
1. Simple outlined icon at 48px in text-tertiary color
2. Heading: "Belum ada menu hari ini"
3. Supporting sentence: "Menu akan muncul setelah SPPG menginput data harian."
4. One action button if applicable

Rules:
- Center-aligned within the content area
- Tone is forward-looking, never blaming
- No large illustrations, no mascots
- No decorative scenes
- No "Oops!" or cutesy language

### 5.9 Footer

Footer appears on public-facing pages only. Authenticated dashboard views have no footer.

**Structure (top to bottom):**
1. CTA + navigation columns row
2. Oversized brand wordmark
3. Bottom bar with copyright and legal links

```css
background: var(--color-primary);
color: var(--text-inverse);
padding: var(--space-3xl) var(--space-2xl) var(--space-lg);
```

CTA tagline: 32px or larger, weight 700, white, no period at end.

Navigation columns: 2 to 3 columns, 14px weight 400, white at 70% opacity default, 100% on hover, underline on hover only.

Brand wordmark: 80 to 120px, weight 700, white, tight letter-spacing. Decorative only, use `<span>` not a heading tag.

Bottom bar: separated by `1px rgba(255, 255, 255, 0.1)` border, 12px caption, white at 45% opacity.

Rules:
- No social media icons
- No newsletter signup
- No background images or patterns
- No gradient backgrounds

---

## 6. Layout Rules

### 6.1 Page Structure

Every authenticated page:

```
Sidebar (240px) | Top Bar (56px)
                |---------------------------
                | Page Title + Actions
                |
                | Content
                | (max-width: 1120px)
                |
```

Content max-width: 1120px, centered in the content area. Admin and monitoring tables may stretch to 1280px.

### 6.2 Content Grouping

Use spacing to group. Not boxes, not borders, not background fills.

```
Section Title        (h2, space-2xl above)
Content here...      (body, space-sm below title)
                     (space-xl before next group)
```

Borders and horizontal rules are a last resort. Use a 1px `border-default` line only when:
- Spacing alone cannot distinguish same-level content groups
- Separating fixed header from scrollable content
- Between table rows (convention)

### 6.3 Asymmetry

Not everything is a grid. Consider:
- Wide content column (2/3) beside a narrow detail panel (1/3) for kitchen profiles
- Full-width tables with no card wrapping
- Text blocks at 65ch in a wider container
- Left-aligned content that does not center in the page

Break the grid when content calls for it.

### 6.4 Dashboard Balance

The dashboard should feel like a morning briefing, not a cockpit.

Do:
- Show 3 to 4 key metrics at the top as plain text with labels
- One primary chart telling today's most important story
- A list of items needing attention as a simple table

Do not:
- More than 2 charts visible without scrolling
- Colored metric cards (green card for good, red for bad)
- Sparklines, donuts, gauges, and rings all competing on one screen
- A 4-column card grid as the primary layout

---

## 7. Motion

### 7.1 Rules

Motion provides feedback, not entertainment.

| Property | Duration | Easing |
|---|---|---|
| Color, opacity | 150ms | ease-out |
| Transform (small) | 200ms | ease-out |
| Layout shifts | 250ms | ease-in-out |
| Modal entrance | 200ms | ease-out |

### 7.2 Allowed

- Hover color and shadow changes on interactive elements
- Focus ring appearance
- Accordion open and close
- Modal fade in/out with slight scale (0.98 to 1.0)
- Toast slide in from top-right
- Loading spinner (simple rotation)
- Skeleton loading with subtle pulse
- Number count-up on landing page statistics only

### 7.3 Forbidden

- Staggered card entrance animations
- Parallax scrolling
- Bouncing, elastic, or spring physics
- Confetti or particle effects
- Page transition slides or morphs
- Elements that "lift" or translate on hover
- Animated gradients
- Typing or typewriter effects
- Lottie animations for loading states

---

## 8. Iconography

**Icon set:** Lucide (default) or Phosphor Icons (outlined weight). One library, consistently.

| Context | Size | Stroke |
|---|---|---|
| Navigation | 20px | 1.5px |
| Inline with text | 16px | 1.5px |
| Empty states | 48px | 1.5px |
| Feature highlights | 32px | 1.5px |

Rules:
- Every icon has a text label except close (X) and search (magnifier)
- Outlined only. No filled/solid variants
- No icon inside a colored circle background
- No decorative icons that do not aid navigation or comprehension
- No mixing icon libraries

**Illustrations:** HaloMBG does not use character illustrations, isometric scenes, or abstract blob art. For visual moments use the icon set at larger sizes, simple geometric compositions using the color palette, or real photography where available.

---

## 9. Images and Placeholders

**Real images:** When photography is needed (food, kitchens, schools), use real photos. Never AI-generated imagery.

**Placeholder images:** When building components or layouts before real content exists, always use a proper placeholder service rather than broken image states or colored blocks.

Recommended placeholder sources:
- `https://picsum.photos/{width}/{height}` for general photography placeholders
- `https://picsum.photos/seed/{seed}/{width}/{height}` for consistent per-item placeholders (same seed = same image)
- `https://placehold.co/{width}x{height}/{bg-hex}/{text-hex}` for labeled placeholders with custom colors

Example usage in JSX:
```jsx
// Kitchen profile cover photo placeholder
<img src="https://picsum.photos/seed/kitchen-1/800/400" alt="Dapur MBG" />

// Menu photo placeholder
<img src="https://picsum.photos/seed/menu-001/400/300" alt="Foto menu" />

// Labeled placeholder with brand color
<img src="https://placehold.co/400x300/F8F7F5/8E8D88?text=Foto+Menu" alt="Foto menu" />
```

Rules:
- Never use empty `src` attributes
- Never render broken image icons as placeholder states
- Use the `seed` variant of picsum for list items so each item gets a distinct but stable image
- Placeholder images must have descriptive `alt` text

---

## 10. Writing and Copy

**Language:** Bahasa Indonesia for all UI copy. Labels, buttons, placeholders, error messages, empty states.

**Tone:** Helpful, direct, neutral. The tone of a capable civil servant who respects your time.

**Rules:**
- No emoji anywhere in the UI. Labels, empty states, buttons, notifications, error messages: no emoji.
- No em dash (--) in copy. Use a comma, period, or rewrite the sentence.
- No exclamation marks except in explicit success confirmations ("Menu berhasil disimpan."). One maximum.
- No passive voice in action labels. "Simpan" not "Tersimpan oleh".
- No marketing language in operational UI.

---

## 11. Explicit Prohibitions

### 11.1 Structural Patterns to Avoid

| Pattern | Why |
|---|---|
| Cards nested inside cards | Kills hierarchy, creates visual depth debt |
| Every section in a bordered card | Turns the page into a cage grid |
| Border on every element | Opposite of openness |
| Giant rounded corners (12px+) on containers | Signals toy, not tool |
| Sidebar + top nav + breadcrumb + tab bar all visible | Navigation overload |
| 4-column colored metric card grid | Dashboard cliche |

### 11.2 Visual Patterns to Avoid

| Pattern | Why |
|---|---|
| Gradient backgrounds | Faux-premium, signals style over substance |
| Glassmorphism, backdrop-blur | Trend-chasing, no informational value |
| 4+ accent colors competing on one screen | Visual noise |
| Decorative SVG blobs or waves as dividers | Empty decoration |
| Background patterns or textures | Noise pretending to be design |
| Dark mode with neon accents | Wrong context entirely |
| Purple-to-blue gradient hero sections | The clearest AI slop signature in existence |
| Box-shadow on every single element | Shadow loses meaning if used everywhere |

### 11.3 Copy and Content to Avoid

| Pattern | Why |
|---|---|
| Emoji in UI labels or messages | Unprofessional, inconsistent across platforms |
| Em dash (--) in copy | Use a comma or restructure the sentence |
| "Oops!" or cute error messages | Disrespects the user's situation |
| Animated number counters (except landing page statistics) | Performative |
| Tooltips on everything | If it needs a tooltip, the label is wrong |
| Skeleton screens that shimmer dramatically | Loading should be quiet |

### 11.4 AI Slop Checklist

Before shipping any component, check:

1. Would this look at home on a credible government platform? If not, it is too flashy.
2. Would this look at home in Linear or Pitch? If not, it is too clunky.
3. Can any visual element be removed without losing information? If yes, remove it.
4. Is this decoration or communication? If decoration, remove it.
5. Would a busy SPPG operator find this helpful at 10am when they are behind on entries? If not, redesign it.
6. Does this contain an emoji? Remove it.
7. Does this contain an em dash? Rewrite it.
8. Does this use a placeholder image URL or a broken image state? Fix it with picsum or placehold.co.

---

## 12. CSS Variables Reference

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

  /* Shadows */
  --shadow-1: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-2: 0 4px 12px rgba(0, 0, 0, 0.10);
  --shadow-3: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-4: 0 16px 40px rgba(0, 0, 0, 0.14);

  /* Typography */
  --font-sans: 'Montserrat', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;
}
```

### Component Architecture

Build as composable primitives:
- `Text` with variant prop (display, h1, h2, h3, body, body-sm, caption, overline)
- `Stack` and `Inline` for spacing using space tokens
- `Surface` for background containers (variant 1, 2, 3)
- `Badge` for status indicators
- `Button` with variant and size props
- `Table` with built-in header styling and density control

When deviating from this system, document what changed, why the system did not fit, and whether the system should be updated. Undocumented deviations are how design systems die.

---

*When in doubt, re-read the philosophy section and the AI slop checklist. When still in doubt, choose the simpler option.*
