# Launch Nexus — Color Palette

Reference for all hex and rgba values used across the frontend.

---

## Core Backgrounds

| Code | Name | Usage |
|------|------|-------|
| `#EBECE7` | Warm off-white | Global page background (Home, Services, Opportunities, Hackathons); Discover card fill; inactive category pills |
| `#D08380` | Salmon pink | Discover page background; StartupCard accent color |
| `#1A1A1D` | Near-black | Card borders; card offset shadow; active category pills |

---

## Text Colors

| Code | Name | Usage |
|------|------|-------|
| `#111827` | Dark gray | Card titles; meta values (Compensation, Team Size, Pageviews, Duration) |
| `#FFFFFF` | White | Text on Discover header / filter panel; active pill text; voted button text |
| `#6B7280` | Medium gray | Tagline descriptions; location meta |
| `#9CA3AF` | Light gray | Uppercase labels (COMPENSATION, APPLICANTS, PRIZE POOL, etc.); ID reference text |
| `#4B5563` | Gray | Tag text; unvoted upvote button text |

---

## Accent & Status Colors

| Code | Name | Usage |
|------|------|-------|
| `#7C3AED` | Violet | Apply / Register button (Opportunities, Hackathons) |
| `#2A8A4A` | Green | Full-Time status label |
| `#0891B2` | Cyan | Contract status; Upcoming hackathon status |
| `#DC2626` | Red | Closed status label |

---

## Borders & Dividers

| Code | Name | Usage |
|------|------|-------|
| `#E5E5E5` | Light gray | Tag borders (light cards); fallback card borders |
| `rgba(0,0,0,0.06)` | Black 6% | Mid / bottom divider rules on light cards |
| `rgba(0,0,0,0.08)` | Black 8% | Top / bottom flush rules on light cards |
| `rgba(0,0,0,0.04)` | Black 4% | Tag pill backgrounds on light cards |

---

## Discover Page (Salmon Theme) Specific

| Code | Name | Usage |
|------|------|-------|
| `#D08380` | Salmon pink | Page background; StartupCard accent (verified check, trending, raised value, upvote button, stage tag text) |
| `rgba(208,131,128,0.12)` | Salmon tint 12% | Stage tag background on StartupCard |
| `rgba(208,131,128,0.25)` | Salmon tint 25% | Stage tag border on StartupCard |
| `rgba(255,255,255,0.65)` | White 65% | Discover subtitle / result status text |
| `rgba(255,255,255,0.5)` | White 50% | "Filter by Technology Vector" label |
| `rgba(255,255,255,0.1)` | White 10% | Discover filter panel border; translucent card rules (legacy) |
| `rgba(255,255,255,0.06)` | White 6% | Discover filter panel background (legacy) |

---

## CSS Variables (index.css)

| Token | Typical Value | Role |
|-------|---------------|------|
| `--salmon` | `#D08380` | Primary salmon accent |
| `--salmon-light` | `#FBA39B` | Lighter salmon tint |
| `--tx0` | `#111827` | Primary heading text |
| `--tx1` | `#4B5563` | Body / secondary text |
| `--tx2` | `#9CA3AF` | Muted / tertiary text |
| `--tx3` | `#6B7280` | Labels, captions |
| `--border` | `#E5E5E5` | Default borders |
| `--bg0` | `#1A1A1D` | Dark background / shadow offset |
| `--ra-lg` | `16px` | Large border radius (filter panel) |
| `--ra-xl` | `24px` | Extra large border radius |
| `--ease-smooth` | `all 0.3s ease` | Default transition |
| `--ease-bounce` | `all 0.3s cubic-bezier(...)` | Bouncy hover transition |
