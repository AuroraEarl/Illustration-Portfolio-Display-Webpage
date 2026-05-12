/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          50: '#F0FDF4',
          100: '#ECFDF5',
          200: '#D1FAE5',
          300: '#A7F3D0',
          400: '#6EE7B7',
          500: '#34D399',
          600: '#10B981',
          700: '#059669',
          800: '#047857',
          900: '#065F46',
        },
        gray: {
          700: '#1F2937',
          400: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card-hover': '0 10px 25px -5px rgba(16, 185, 129, 0.1)',
      }
    },
  },
  plugins: [],
}