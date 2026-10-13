/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0d14',
          card: '#121826',
          cardHover: '#182135',
          border: '#222f49',
          accent: '#38bdf8',
          accentGlow: '#0284c7',
          gold: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(56, 189, 248, 0.45)',
        'glow-gold': '0 0 25px rgba(245, 158, 11, 0.45)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.45)',
        'board-3d': '0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 18px 36px -18px rgba(56, 189, 248, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
