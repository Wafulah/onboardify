/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyan-primary': '#1de8da',
        'teal-accent': '#0a8080',
        'slate-bg': '#f0f4f8',
        'slate-text': '#334155',
      },
      boxShadow: {
        '3xl': '0 15px 35px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
