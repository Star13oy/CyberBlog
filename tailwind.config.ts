import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 赛博朋克配色
        cyber: {
          primary: '#00d4ff',
          secondary: '#bf5af2',
          accent: '#ff3366',
          success: '#30d158',
          warning: '#ffd60a',
          dark: '#080c14',
          card: '#0d1423',
          elevated: '#121c30',
        },
      },
      fontFamily: {
        sans: ['var(--font-chinese)', 'var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 15s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 212, 255, 0.4)',
        'cyber-lg': '0 0 40px rgba(0, 212, 255, 0.6)',
        'neon-purple': '0 0 20px rgba(191, 90, 242, 0.4)',
      },
    },
  },
  plugins: [],
}
export default config