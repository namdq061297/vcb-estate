/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/my-app/src/**/*.{html,ts}'],
  safelist: ['text-3xl', 'font-bold', 'underline', 'text-center'],
  theme: {
    extend: {
      colors: {
        // #006b3b == rgb(0 107 59), matches --color-border-primary in _colors.scss;
        // written as an rgb triplet so Tailwind's opacity modifiers (e.g. bg-primary/10) work.
        primary: 'rgb(0 107 59 / <alpha-value>)',
      },
    },
  },
  plugins: [],
};