/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Palette
        bg: {
          primary: '#020203',
          secondary: '#0a0a0c',
          tertiary: '#121216',
          card: 'rgba(20, 20, 25, 0.4)',
          glass: 'rgba(5, 5, 7, 0.7)', 
        },
        // Accents
        accent: {
          primary: '#6366f1',
          secondary: '#ec4899',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          glow: 'rgba(99, 102, 241, 0.5)',
        },
        // Text
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        // Status
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgba(30, 30, 35, 0.6) 0%, rgba(20, 20, 25, 0.6) 100%)',
      }
    },
  },
  plugins: [],
}
