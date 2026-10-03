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
        void: '#08090a',
        carbon: '#0f1011',
        obsidian: '#161718',
        slate: '#23252a',
        graphite: '#23252a',
        smoke: '#383b3f',
        paper: '#ffffff',
        bone: '#e5e5e6',
        mist: '#d0d6e0',
        fog: '#8a8f98',
        ash: '#62666d',
        'acid-lime': '#e4f222',
        'pulse-green': '#27a644',
        'coral-red': '#eb5757',
        // Also keep dark/light mappings for backwards compatibility if needed
        dark: {
          canvas: '#08090a',
          surface: '#0f1011',
          surfaceHover: '#161718',
          border: '#23252a',
        },
        light: {
          canvas: '#08090a',
          surface: '#0f1011',
          border: '#23252a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Inter Variable', 'ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        btn: '6px',
        input: '6px',
        card: '12px',
        pill: '9999px',
      },
      boxShadow: {
        'hairline': 'inset 0 0 0 1px #23252a',
        'linear-card': '0 0 0 1px #23252a, 0 8px 24px -4px rgba(0, 0, 0, 0.6)',
        'lime-glow': '0 0 20px rgba(228, 242, 34, 0.2)',
      }
    },
  },
  plugins: [],
}
