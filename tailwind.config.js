export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'hsl(260, 95%, 63%)',
          600: 'hsl(250, 95%, 58%)',
          700: 'hsl(270, 95%, 68%)',
        },
        secondary: {
          800: 'hsl(280, 90%, 80%)',
        },
        darkGray: {
          50: 'hsl(225, 20%, 10%)',
          100: 'hsl(225, 15%, 15%)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        geist: ['Geist', 'sans-serif']
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(400px)' },
        }
      },
      animation: {
        scan: 'scan 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
