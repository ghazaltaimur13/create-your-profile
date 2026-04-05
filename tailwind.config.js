/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 45px -25px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
}

export default tailwindConfig

