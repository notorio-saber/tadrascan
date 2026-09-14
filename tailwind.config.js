export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: 'hsl(340, 80%, 95%)',
          200: 'hsl(340, 80%, 85%)',
          300: 'hsl(340, 80%, 75%)',
          400: 'hsl(340, 80%, 65%)',
          500: 'hsl(340, 80%, 55%)',
          600: 'hsl(340, 80%, 45%)',
          700: 'hsl(340, 80%, 35%)',
        },
        secondary: {
          800: 'hsl(20, 80%, 65%)', // Rose Gold accent
        },
        darkGray: {
          50: 'hsl(225, 20%, 10%)',
          100: 'hsl(225, 15%, 15%)',
        },
        tadra: {
          wine: '#4A0E17',
          wineLight: '#8A1C2B',
          gold: '#C5A880',
          goldLight: '#E8DCC8',
          goldDark: '#967951'
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
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(40px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(40px) rotate(-360deg)' },
        },
        orbitReverse: {
          '0%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
          '100%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        }
      },
      animation: {
        scan: 'scan 2s ease-in-out infinite',
        orbit: 'orbit 3s linear infinite',
        orbitReverse: 'orbitReverse 4s linear infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
