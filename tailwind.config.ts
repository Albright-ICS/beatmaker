import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        panel: '#111827',
        accent: '#38bdf8',
        soft: '#94a3b8'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(56, 189, 248, 0.35)' },
          '50%': { boxShadow: '0 0 20px rgba(56, 189, 248, 0.45)' }
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 3s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
