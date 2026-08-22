export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tadra: {
          wine: '#5D2A2A',
          bgDeep: '#f6f1e8',
          bgSoft: '#fffaf2',
          textStrong: '#201a15',
          textSoft: '#6b5b4d',
          beam: '#a47551',
          goldLight: '#d2b08f',
          goldDark: '#7a5335'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
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
