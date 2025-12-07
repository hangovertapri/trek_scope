Design Tokens — TrekMapper

Purpose
- Centralize color, spacing, typography and radius tokens for consistency between code and design (Figma).
- Provide a single source of truth that can be exported to a Figma token library and used by Tailwind and application code.

Files added
- `src/styles/tokens.json` — machine-readable token file (colors, fonts, spacing, radii, font sizes).
- `src/styles/tokens.ts` — TypeScript export to import tokens into app code when needed.

Token highlights
- Colors: semantic color tokens (`brand-500`, `accent-500`, `muted-500`, `bg`, `fg`). Core colors in CSS variables remain authoritative for runtime theming and dark mode.
- Spacing: named spacing scale (`1`, `2`, `3`, `4`, `6`, `8`, `10`, `12`) matching Tailwind spacing tokens.
- Font: `body` and `headline` family strings.
- Radius: `sm`, `md`, `lg`.
- Font sizes: `sm`, `base`, `lg`, `xl`, `2xl`, `3xl` with [size, lineHeight].

How this maps to Tailwind
- `tailwind.config.ts` now imports `src/styles/tokens.json` and maps `fontFamily`, `spacing`, and `fontSize` to the Tailwind theme extend values so utility classes align with tokens.
- Runtime colors are still driven by CSS variables in `src/app/globals.css` to enable dynamic theming.

Figma token export
- Recommended workflow:
  1. Create a Figma file named "TrekMapper — Tokens".
  2. Add color styles matching the `tokens.json` color keys.
  3. Add text styles for `font-size` tokens and font families.
  4. Add spacing and radius tokens as variables or components.
  5. (Optional) Use a plugin like "Figma Tokens" to import/export JSON.

Next steps
- If you want, I can generate a Figma Tokens import-ready JSON (requires confirming exact color hex/HSL formats for Figma). I can also expand the token set (accessibility-focused contrast variants, CTA color palette, and gradient tokens) if you'd like a richer design system for marketing and global audience appeal.
