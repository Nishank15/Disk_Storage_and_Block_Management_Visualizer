/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          canvas: '#0A0D17',
          surface: '#141B2D',
          surfaceHover: '#182038',
          border: 'rgba(99, 102, 241, 0.2)', // indigo-500/20
        },
        light: {
          canvas: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
        },
        brand: {
          violet: '#6366F1',
          cyan: '#06B6D4',
          emerald: '#10B981',
          warning: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'elevated': '0 25px 50px -12px rgba(30, 27, 75, 0.4)', // shadow-indigo-950/40
      }
    },
  },
  plugins: [],
}
