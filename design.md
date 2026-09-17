# Design — Denormalization Trade-off Analyzer

A locked design system for the Denormalization Trade-off Analyzer application, implementing the Hallmark **Aurora** theme specification across both dark and light modes.

## Genre
atmospheric

## Theme
Aurora (Atmospheric Cluster: cool cyan / borealis emerald blooms, polar ice / nocturnal fjord surfaces)

## Macrostructure Family
- Marketing & Educational: Long Document / Explanatory Studio (`LearnSection`, `HelpSection`, `DevelopedBy`)
- App & Analytical Core: Workbench with Tabbed Visualizers (`Workbench`, `AnomalyLab`, `RecommendationEngine`, `TestSuite`)
- Nav Archetype: N1b / N5 Floating Pill
- Footer Archetype: Ft5 Statement Footer

## Visual Language: Aurora Polar Glassmorphism
The design unites Hallmark's atmospheric discipline with translucent optical depth:
- Multi-layered frosted glass surfaces (`backdrop-filter: blur(16px) saturate(160%)`)
- Subtle specular top/inner highlights simulating physical cold frosted glass edges
- Living WebGL DarkVeil layer tuned to Aurora spectral ribbons (`hueShift={165}`)
- Restrained ambient borealis radial mesh underneath (cyan & emerald ribbons < 25% canvas footprint)
- High-contrast typography: deep obsidian slate on light polar ice glass, luminous frosted white on nocturnal fjord dark glass

## Theme Palette (OKLCH Specification)

### Dark Mode — Night Aurora (Canonical Default)
- **Base Canvas (`--color-paper`)**: `oklch(13.5% 0.022 205)` — nocturnal arctic fjord
- **Elevated Card (`--color-paper-2`)**: `oklch(17.5% 0.025 205)` — elevated aurora glass card
- **Interactive Surface (`--color-paper-3`)**: `oklch(22.0% 0.028 205)`
- **Primary Ink (`--color-ink`)**: `oklch(96.5% 0.008 200)` — luminous frosted polar white
- **Secondary Ink (`--color-ink-2`)**: `oklch(74.0% 0.020 205)` — readable arctic slate
- **Hairline Rule (`--color-rule`)**: `oklch(26.0% 0.025 205)`
- **Primary Accent (`--color-accent`)**: `oklch(74.0% 0.170 195)` — luminous Aurora Cyan (WCAG AA pass on dark)
- **Secondary Chord (`--color-accent-2`)**: `oklch(72.0% 0.160 160)` — Aurora Emerald
- **Glass Panel Fill**: `rgba(11, 27, 38, 0.72)`
- **Glass Border**: `rgba(56, 189, 248, 0.14)`

### Light Mode — Day Aurora (Borealis Day)
- **Base Canvas (`--color-paper`)**: `oklch(97.8% 0.008 200)` — luminous polar ice bone
- **Elevated Card (`--color-paper-2`)**: `oklch(95.2% 0.012 200)` — elevated ice glass card
- **Interactive Surface (`--color-paper-3`)**: `oklch(92.0% 0.016 200)`
- **Primary Ink (`--color-ink`)**: `oklch(18.0% 0.025 210)` — deep arctic obsidian slate
- **Secondary Ink (`--color-ink-2`)**: `oklch(42.0% 0.022 210)` — high-contrast cool slate
- **Hairline Rule (`--color-rule`)**: `oklch(88.0% 0.014 200)`
- **Primary Accent (`--color-accent`)**: `oklch(48.0% 0.180 198)` — deep vivid arctic cyan (WCAG AAA pass on light)
- **Secondary Chord (`--color-accent-2`)**: `oklch(46.0% 0.160 160)` — deep borealis emerald
- **Glass Panel Fill**: `rgba(240, 250, 255, 0.75)`
- **Glass Border**: `rgba(255, 255, 255, 0.80)`

### Domain Status Tokens
- **Fast / Speedup**: Aurora Emerald (`oklch(72% 0.16 160)` dark / `oklch(46% 0.16 160)` light)
- **Penalty / Write Risk**: Vivid Crimson (`#f43f5e`)
- **Storage Bloat**: Polar Indigo (`#6366f1`)
- **Lock / Contention Warning**: Polar Amber (`#f59e0b`)

## Typography
- **Display**: System UI Sans (`Inter` / system-ui), weight 700/800, roman (strictly no italic in headers)
- **Body**: System UI Sans, weight 400/500
- **Numbers & Metrics**: Bold numerals with tabular alignment (`font-black`, `tracking-tight`)
- **Code & SQL**: High-contrast Monospace (`ui-monospace, Menlo, Monaco, Consolas`)

## Motion & Microinteractions
- **Motion stance**: Motion-cut / tactile (150ms–200ms opacity and translateY only)
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)`
- **Hover behavior**: Subtle lift (`translateY(-1px)` to `-2px`) with soft polar cyan glow shadow

## Token Definitions
Full design tokens are maintained in `tokens.css`.
