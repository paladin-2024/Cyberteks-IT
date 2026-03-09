/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          red: '#E11D48',
          blue: '#102a83'
        }
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        scroll: 'scroll 40s linear infinite'
      }
    }
  },
  plugins: []
};
