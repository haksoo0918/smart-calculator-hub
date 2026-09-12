/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ghost: {
          lime: '#d1ff19',
          'lime-soft': '#bef264',
          canvas: '#ffffff',
          ink: '#112220',
          'ink-base': '#15171a',
          'ink-soft': '#334155',
          'ink-mute': '#64748b',
          'ink-stone': '#94a3b8',
          hairline: '#e5e7eb',
          'hairline-soft': '#cbd5e1',
          'hairline-dark': '#1f2937',
          'surface-deep': '#0f172a',
          'surface-olive': '#1a2e05',
        },
      },
      borderRadius: {
        'ghost-xs': '4px',
        'ghost-sm': '6px',
        'ghost-md': '8px',
        'ghost-lg': '16px',
        'ghost-xl': '24px',
      },
      letterSpacing: {
        'ghost-tight': '-0.025em',
        'ghost-eyebrow': '0.1em',
      },
      fontFamily: {
        sans: [
          '"Pretendard Variable"',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          '"Helvetica Neue"',
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
        mono: [
          '"Pretendard Variable"',
          'Pretendard',
          'sans-serif',
        ],
      },
      keyframes: {
        'drawer-in': {
          '0%': { transform: 'translate3d(-100%, 0, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
        'drawer-out': {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-100%, 0, 0)' },
        },
        'overlay-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'overlay-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'page-fade': {
          '0%': { opacity: '0', transform: 'translate3d(0, 4px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
      },
      animation: {
        'drawer-in': 'drawer-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'drawer-out': 'drawer-out 0.22s ease-in forwards',
        'overlay-in': 'overlay-in 0.28s ease-out forwards',
        'overlay-out': 'overlay-out 0.22s ease-in forwards',
        'page-fade': 'page-fade 0.2s ease-out forwards',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/container-queries")],
}
