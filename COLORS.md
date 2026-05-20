# Arrivio B2B - Color System

This document defines the official color palette for the Arrivio B2B application. All new components and pages **must** use these colors. Do not introduce new hex values without updating this doc.

---

## Tailwind @theme Tokens

Defined in `src/index.css` under the `@theme` block:

| Token              | Hex       | Usage                       |
| ------------------ | --------- | --------------------------- |
| `arrivio-green`    | `#0f4c3a` | Primary brand green         |
| `arrivio-beige`    | `#f2f2f2` | Global page background      |
| `arrivio-accent`   | `#186b53` | Mid-tone green (hover, CTA) |
| `arrivio-dark`     | `#0a3a2b` | Darkest green (pressed)     |

Use these as `bg-arrivio-green`, `text-arrivio-accent`, etc.

---

## 1. Brand Greens

| Hex       | Role             | Tailwind Class Example      |
| --------- | ---------------- | --------------------------- |
| `#0f4c3a` | Primary green    | `bg-arrivio-green`          |
| `#186b53` | Hover / accent   | `bg-arrivio-accent`         |
| `#0a3a2b` | Active / pressed | `bg-arrivio-dark`           |
| `#1A2E22` | Dark overlay     | `bg-[#1A2E22]`              |

**When to use:**
- `#0f4c3a` — Buttons, borders, icons, links, spinners, badges
- `#186b53` — Hover states on buttons, secondary highlights, pricing accents
- `#0a3a2b` — Active/pressed states, deep accents on dark panels
- `#1A2E22` — Navbar/footer dark overlays, modal backdrops

---

## 2. Gold Accent

| Hex       | Role              | Where Used                        |
| --------- | ----------------- | --------------------------------- |
| `#D4A017` | Primary gold      | Stars, badges, highlights, icons  |
| `#F7E6B0` | Light gold (text) | Hero/banner heading accents       |
| `#E2D5B2` | Muted gold        | Subtle accent tints               |

**When to use:**
- `#D4A017` — Star ratings, featured/premium badges, gold accents, shield icons
- `#F7E6B0` — Light gold text on dark backgrounds (hero, banners)
- `#E2D5B2` — Subtle gold tints on search bar / hero elements

---

## 3. Text Colors

Uses the standard Tailwind gray scale. Keep this hierarchy consistent.

| Hex       | Tailwind   | Role                              |
| --------- | ---------- | --------------------------------- |
| `#111827` | `gray-900` | Primary headings & body text      |
| `#1A1A1A` | —          | Landing/legal page headings only  |
| `#1f2937` | `gray-800` | Sub-headings, secondary text      |
| `#374151` | `gray-700` | Labels, stats, tertiary headings  |
| `#4b5563` | `gray-600` | Body descriptions, meta text      |
| `#5C5C50` | —          | Landing/legal page body text      |
| `#6b7280` | `gray-500` | Placeholders, secondary metadata  |
| `#9ca3af` | `gray-400` | Disabled text, timestamps, muted  |

**Rules:**
- App-wide primary text: `#111827`
- Landing/legal sections: `#1A1A1A` for headings, `#5C5C50` for body
- Never use pure `#000000` for text

---

## 4. Backgrounds

| Hex       | Role                          | Tailwind                  |
| --------- | ----------------------------- | ------------------------- |
| `#f2f2f2` | Global page background        | `bg-arrivio-beige`        |
| `#f0f0f0` | Input fields, skeleton loaders| `bg-[#f0f0f0]`           |
| `#f7f7f7` | Card backgrounds, panels      | `bg-[#f7f7f7]`           |
| `#FFFFFF` | White (cards on gray bg)      | `bg-white`                |

**Rules:**
- Page background is always `#f2f2f2`
- Cards sit on `white` or `#f7f7f7`
- Input fields use `#f0f0f0`

---

## 5. Borders & Dividers

| Hex       | Tailwind     | Role                          |
| --------- | ------------ | ----------------------------- |
| `#e5e7eb` | `gray-200`   | Standard card/section borders |
| `#d1d5db` | `gray-300`   | Heavier dividers              |
| `#e8e8e8` | —            | Navbar pill backgrounds       |
| `#9ca3af` | `gray-400`   | Subtle input borders          |

---

## 6. Status / Semantic Colors

| Hex       | Role                  | Usage                              |
| --------- | --------------------- | ---------------------------------- |
| `#22C55E` | Success / available   | Available badges, confirmed states |
| `#16a34a` | Success dark          | Active booking, payment success    |
| `#EA4335` | Error / destructive   | Form errors, cancel, delete        |
| `#d33426` | Error dark            | Cancellation labels                |

**Rules:**
- Green dot (available): `#22C55E`
- Red dot (occupied): `#EA4335`
- Do not use brand green (`#0f4c3a`) for success states — use `#22C55E`

---

## 7. Tier Badges

| Tier      | Style                                    |
| --------- | ---------------------------------------- |
| Standard  | Beige background, dark text              |
| Premium   | Gold gradient, `#D4A017` accent          |
| Executive | Dark green `#0f4c3a` bg, gold `#D4A017` |

---

## Fonts (for reference)

| Token          | Font Family       | Usage              |
| -------------- | ----------------- | ------------------ |
| `font-sans`    | Inter             | Body text, UI      |
| `font-serif`   | Playfair Display  | Display headings   |
| `font-heading` | IBM Plex Sans     | Section headings   |

---

## Do's and Don'ts

**Do:**
- Use Tailwind tokens (`bg-arrivio-green`) over inline hex where possible
- Use the gray scale hierarchy for text (900 > 800 > 700 > 600 > 500 > 400)
- Use `lining-nums` for numeric displays (prices, stats, counts)

**Don't:**
- Introduce new off-white/cream hex codes — use `#f2f2f2`, `#f0f0f0`, `#f7f7f7`, or `white`
- Use `#000000` for text — use `#111827`
- Mix brand green (`#0f4c3a`) with semantic green (`#22C55E`) for status indicators
- Add new gold variants — use `#D4A017` as the single gold accent
