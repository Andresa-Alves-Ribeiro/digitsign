/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        'background-light': 'var(--background-light)',
        'background-dark': 'var(--background-dark)',
        'text-light': 'var(--text-light)',
        'text-dark': 'var(--text-dark)',
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'primary': 'var(--primary)',
        'component-bg-light': 'var(--component-bg-light)',
        'component-bg-dark': 'var(--component-bg-dark)',
        'component-bg-hover-light': 'var(--component-bg-hover-light)',
        'component-bg-hover-dark': 'var(--component-bg-hover-dark)',
      },
    },
  },
  plugins: [],
} 