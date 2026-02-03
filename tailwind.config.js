/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enables toggling dark mode with a "dark" class
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#9333ea',
              '&:hover': {
                color: '#7e22ce',
              },
            },
          },
        },
      },
      colors: {
        background: {
          light: 'var(--background-light, #f8fafc)',
          dark: 'var(--background-dark, #1a202c)',
        },
        text: {
          light: 'var(--text-light, #000000)',
          dark: 'var(--text-dark, #ffffff)',
        },
        button: {
          light: '#9333ea',
          dark: '#7e22ce',
        },
        border: {
          light: 'var(--border-light, #e5e7eb)',
          dark: 'var(--border-dark, #374151)',
        },
        purple: {
          100: 'rgba(128, 90, 213, 0.3)', // Darker purple for both light and dark modes
        },
      },
      borderRadius: {
        small: '4px',
        medium: '8px',
        large: '12px',
      },
    },
  },
  plugins: [typography],
};
