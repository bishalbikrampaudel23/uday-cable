/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f8ff',
          500: '#0f6fff',
          700: '#0947a3'
        }
      }
    }
  },
  plugins: []
};
