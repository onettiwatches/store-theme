# AGENTS.md — Onetti Watches Shopify Theme

Dawn-based Shopify theme for the `onetti-watches` store. Repo root is the theme root — all Shopify file paths are at the top level (no `src/`, no `package.json`).


## File layout (Shopify convention)

| Path | Purpose |
|---|---|
| `assets/base.css` | Global styles + design tokens (~line 3100+). Single CSS file for app-wide rules. |
| `assets/*.css` | Per-component CSS (Dawn convention, loaded by each section's `stylesheet_tag`). |
| `assets/*.js` | Per-section JS (Dawn's vanilla pattern, no bundler). |
| `sections/*.liquid` | Theme sections. Each is self-contained with its own `<style>`, schema, and optional `<script>`. |
| `snippets/*.liquid` | Reusable partials. |
| `templates/*.json` | Page templates, list section instances + order. |
| `config/settings_data.json` | **Merchant-owned, auto-generated. DO NOT EDIT.** Overwritten by theme editor. |
| `config/settings_schema.json` | Theme-level settings schema (1578 lines, i18n keys). |
| `layout/theme.liquid` | HTML shell, global `<style>` with CSS custom properties from `settings.*`. |

## Design tokens (defined in `assets/base.css` around line 3100)

Use these instead of literal values:
- Spacing: `--space-0` to `--space-9` (0.4rem increments)
- Radii: `--radius-xs` / `--radius-sm` / `--radius-md` / `--radius-lg` / `--radius-pill`
- Typography: `--text-xs` to `--text-4xl`, `--lh-tight` / `--lh-snug` / `--lh-normal` / `--lh-relaxed`
- Easing: `--ease-out-quart`, `--ease-in-out-quart`
- Colors: `rgb(var(--color-foreground))`, `rgb(var(--color-base-accent-2))` — never hardcode hex
- Fonts: `var(--font-heading-family)` (Cormorant Garamond) for headings, `var(--font-body-family)` (Inter) for body

CSS custom properties on cards/elements: prefer `--name` over literal values so they're tweakable from one place.

## Hard constraint: color schemes

The theme has **no `color_schemes` group** in `config/settings_schema.json` (it's a "Generated Data Theme"). Dawn-style `color_scheme` section settings trigger a permanent theme editor warning:

> "Esquema de color: No se pueden mostrar los esquemas de colores. Los esquemas deben definirse en settings_data y settings_schema."

**Rule for custom sections**: use a static class like `class="section color-background-1"` instead of `color-{{ section.settings.color_scheme }}`. Do NOT add a `color_scheme` setting type to custom section schemas.

## Custom sections (not stock Dawn)

| Section | Class prefix | Notes |
|---|---|---|
| `sections/main-philosophy.liquid` | `ph-` | 3-block grid (2 image+text blocks + 1 holo card). Holo card uses `::before` (leather texture) + `::after` (shine glow) pseudo-elements with `mix-blend-mode: overlay` and `soft-light` respectively. Mouse-tracking 3D rotation driven by CSS custom properties (`--glow-x`, `--glow-y`, `--glow-intensity`, `--glow-size`). |
| `sections/main-faq.liquid` | `faq-` | Accordion using native `<details>/<summary>`. Smooth open via `grid-template-rows: 0fr → 1fr` trick on `.faq-answer-wrap`. No JS needed. |
| `sections/collections-carousel.liquid` | `cc-` | Custom carousel with autoplay, drag, virtual scroll (`TARGET_SLIDES = 15`), 3D card hover. |
| `sections/products-carousel.liquid` | `pc-` | Same architecture as `cc-`, with price. |

### Holo card (main-philosophy) gotchas

The card's animation/visual breaks easily. Watch for these:

- **No `transform-style: preserve-3d` on the card** — it breaks z-index stacking, pseudo-elements disappear behind the image.
- **Image sizing**: `width: 44rem`, `max-width: 100%`, `height: auto`, `object-fit: contain`. The card uses `width: fit-content` so it hugs the image. Do NOT add `aspect-ratio` to the card or fixed `max-height` to the image — it breaks the "adapts to image" behavior.
- **Glow opacity follows the cursor**: JS sets `--glow-x` and `--glow-y` on every `mousemove`. Multiplier is `* 1.3` (not `* 2` like the React original — too much separation at corners).
- **HTML class names must match CSS exactly**. If you rename a class in CSS, rename it in the Liquid too — the JS targets these by string.

### Carousel patterns

Both carousels share the same architecture:
- `.viewport` is `overflow: hidden; height: 48rem`
- Cards are `position: absolute` inside the viewport
- Drag + autoplay + cooldown + dots + nav buttons
- Nav buttons live **below the title** on all viewports (column flex on `.cc-header`/`.pc-header`)
- `cc-` and `pc-` class prefixes are intentionally different — don't merge them

### Card ripple ring

`.card-wrapper`, `.product-card-wrapper`, `.collection-card-wrapper`, `.cc-card`, `.pc-card` all share a `::after` ripple ring (`border-ripple` keyframe, 1.4s infinite, `inset: 0 → -0.625rem`). Defined once in `assets/base.css` around line 4060. Don't override per card.

## sold-out / make-to-order policy

The merchant operates make-to-order. All sold-out / disabled state UI is hidden via CSS (`assets/base.css` line 4037):
```css
.card__badge, .badge--bottom-left.color-inverse, .sold-out-message,
.quick-add .sold-out-message, button.quick-add__submit[disabled],
.product-form__submit[disabled] { display: none !important; }
```
Do NOT add sold-out badges or disabled states to custom code.

## Code style

- **Minimum change**: only touch what solves the stated problem. Boy-scout only lines you touch.
- **Simplicity first**: no cleverness, no premature optimization.
- **No comments** unless intent is non-obvious. Never narrate what code does.
- **No tests** unless the user asks.
- **No emojis** in code or prose.
- **No hardcoded hex** — always via CSS custom properties.

## Verification commands (no test runner exists)

For each edit, verify before committing:
- Liquid: balanced `{}` and valid JSON in `{% schema %}` blocks
- CSS: extract `<style>` content, count `{` vs `}` must match
- JS: extract `<script>` content, run `node --check` on the temp file
- Templates (`templates/index.json`): JSON-valid after stripping leading `/* ... */` comment block (use `replace(/\/\*[\s\S]*?\*\//g, '')`)
- Use `mytree --f --e ...` for directory listing (not `ls`/`find`)

## Git

Linear history on `main`. Commits describe the user-visible change, not the implementation. Do not amend or force-push without explicit ask.
