/**
 * Tailwind CSS v4 is wired through its PostCSS plugin (the v4-recommended setup
 * for Next.js). All theme configuration is CSS-first, in
 * `src/app/(frontend)/globals.css` — there is deliberately no tailwind.config.js.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
