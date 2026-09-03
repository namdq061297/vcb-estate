/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/my-app/src/**/*.{html,ts}'],
  safelist: ['text-3xl', 'font-bold', 'underline', 'text-center'],
  theme: {
    extend: {},
  },
  plugins: [],
};