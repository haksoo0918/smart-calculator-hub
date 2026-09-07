/** @type {import('tailwindcss').Config} */
export default {
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
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
