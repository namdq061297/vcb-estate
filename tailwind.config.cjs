/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
      './apps/my-app/src/**/*.{html,ts}',
      './src/**/*.{html,ts}',
      './libs/**/*.{html,ts}',
    ],
  },
  safelist: ['text-3xl', 'font-bold', 'underline'],
  theme: {
    extend: {},
  },
  plugins: [],
};