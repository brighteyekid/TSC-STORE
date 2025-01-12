/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A0A0B',
          50: '#f6f6f7',
          100: '#e3e3e6',
          200: '#c7c7cd',
          300: '#a4a4ae',
          400: '#81818e',
          500: '#656571',
          600: '#4e4e58',
          700: '#3d3d44',
          800: '#232326',
          900: '#0A0A0B',
        },
        secondary: {
          DEFAULT: '#171718',
          light: '#1f1f21',
          dark: '#111112',
        },
        accent: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Inter var', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'ripple': 'ripple 1s linear infinite',
        'shine': 'shine 1.5s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: 1 },
          '100%': { transform: 'scale(4)', opacity: 0 },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glow': '0 0 20px rgb(99 102 241 / 0.2)',
        'glow-lg': '0 0 30px rgb(99 102 241 / 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#fff',
            a: {
              color: '#6366f1',
              '&:hover': {
                color: '#818cf8',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
    // Custom plugin for aspect ratios
    function({ addUtilities }) {
      const newUtilities = {
        '.aspect-square': {
          aspectRatio: '1 / 1',
        },
        '.aspect-video': {
          aspectRatio: '16 / 9',
        },
        '.aspect-portrait': {
          aspectRatio: '3 / 4',
        },
      };
      addUtilities(newUtilities);
    },
    // Custom plugin for scrollbar styling
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-default': {
          '-ms-overflow-style': 'auto',
          'scrollbar-width': 'auto',
        },
      };
      addUtilities(newUtilities);
    },
  ],
}; 