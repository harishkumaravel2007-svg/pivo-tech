/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4FA',
          100: '#DCE4F3',
          200: '#B8CBE6',
          300: '#8AA9D3',
          400: '#5481BC',
          500: '#2A5EA2',
          600: '#1C457D',
          700: '#15325C',
          800: '#101B33', // Primary Deep Navy
          900: '#0C1426',
          950: '#070C17',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF4E8',
          200: '#F4E7C8',
          300: '#EBD5A0',
          400: '#DFC076',
          500: '#C6A15B', // Primary Accent Gold
          600: '#B08B45',
          700: '#8F6F33',
          800: '#6E5527',
          900: '#4D3B1C',
        },
        surface: {
          50: '#FFFFFF',
          100: '#F7F8FA', // Background
          200: '#F1F3F6',
          300: '#E5E7EB', // Border
          400: '#D1D5DB',
          500: '#9CA3AF',
          600: '#6B7280',
          700: '#4B5563',
          800: '#202938', // Dark text
          900: '#111827',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 27, 51, 0.05), 0 1px 2px 0 rgba(16, 27, 51, 0.03)',
        'premium': '0 10px 30px -10px rgba(16, 27, 51, 0.08), 0 4px 6px -2px rgba(16, 27, 51, 0.03)',
        'gold-glow': '0 0 25px -5px rgba(198, 161, 91, 0.25)',
      }
    },
  },
  plugins: [],
}
