/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#080808',
        surface: {
          DEFAULT: '#111111',
          raised: '#161616',
        },
        ivory: '#F5F2EA',
        muted: '#A6A39B',
        champagne: {
          DEFAULT: '#C9A86A',
          light: '#D4BC8A',
          dark: '#A8884E',
        },
        primary: '#080808',
        secondary: '#F5F2EA',
        gold: {
          DEFAULT: '#C9A86A',
          light: '#D4BC8A',
          dark: '#A8884E',
        },
        charcoal: '#161616',
        dark: {
          50: '#161616',
          100: '#111111',
          200: '#080808',
          300: '#080808',
        },
        gray: {
          850: '#161616',
          900: '#111111',
          950: '#080808',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.35em',
        wide: '0.25em',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'marquee': 'marquee 40s linear infinite',
        'line-grow': 'lineGrow 1s ease-out forwards',
        'float-subtle': 'floatSubtle 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        lineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'gold': '0 4px 24px rgba(201, 168, 106, 0.2)',
        'gold-lg': '0 8px 32px rgba(201, 168, 106, 0.25)',
        'luxury': '0 24px 64px rgba(0,0,0,0.6)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
      },
      transitionDuration: {
        '400': '400ms',
        '500': '500ms',
      },
    },
  },
  plugins: [],
}
