import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f4',
          100: '#dbf0e3',
          200: '#bbe1cc',
          300: '#90cab0',
          400: '#63ac8f',
          500: '#409072',
          600: '#2f745a',
          700: '#275d49',
          800: '#214a3b',
          900: '#1d3e33',
        },
        earth: {
          50: '#f6f5f3',
          100: '#e8e5df',
          200: '#d1cdc3',
          300: '#b3ada0',
          400: '#948d7c',
          500: '#7c7462',
          600: '#645d4e',
          700: '#544d41',
        },
        sage: {
          50: '#f4f6f5',
          100: '#e5e9e7',
          200: '#cdd5d2',
          300: '#abb7b2',
          400: '#84948e',
          500: '#64746e',
          600: '#4f5c57',
          700: '#424d49',
        },
        cream: {
          50: '#fdfcfb',
          100: '#f8f6f2',
          200: '#eeeae1',
          300: '#e2dccc',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
        }
      },
      fontFamily: {
        sans: ["var(--font-outfit)"],
        outfit: ["var(--font-outfit)"],
        playfair: ["var(--font-outfit)"],
        serif: ["var(--font-outfit)"],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1d3e33 0%, #2f745a 100%)',
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(64, 144, 114, 0.39)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 40px -4px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};
export default config;
