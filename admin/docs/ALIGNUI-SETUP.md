# AlignUI-style UI + Phosphor Icons

The admin app is styled to align with [AlignUI’s Next.js guide](https://www.alignui.com/docs/v1.2/installation/next).

## What’s in place

- **Tailwind CSS v4** – `@import "tailwindcss"` in `app/globals.css`, `@tailwindcss/postcss` in PostCSS.
- **AlignUI-style theme** – Slate neutrals, primary green (`#0abf8b`), dark-by-default. `--primary` and `--primary-foreground` in `:root` and `.dark`.
- **Inter font** – From `next/font/google`, CSS variable `--font-inter`, applied via layout.
- **Dark mode** – `dark` class on `<html>` so the app is dark by default.
- **Utils** – `cn()` and `selectClassName` in `lib/utils.ts` (class merging; native `<select>` uses `input-sleek`).
- **Phosphor Icons** – `@phosphor-icons/react` in the dashboard sidebar and elsewhere.

## Component classes (globals.css @layer components)

- **Buttons** – `.btn-primary`, `.btn-ghost`
- **Inputs** – `.input-sleek` (inputs and selects; selects get `pr-8` for chevron)
- **Cards** – `.card`, `.card-hover`
- **Tables** – `.table-sleek` (with `th`/`td` styling)
- **Badges** – `.badge-success`, `.badge-warning`, `.badge-danger`

Use these classes for a consistent AlignUI look. No shadcn components are required for the main dashboard UI.
