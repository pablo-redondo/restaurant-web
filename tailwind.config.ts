import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lime: '#C8DC2E',
        forest: {
          DEFAULT: '#172E22',
          light: '#1A3D2D',
          50:  '#F0F4F0',
          100: '#E2ECE6',
          200: '#C4D5CA',
          300: '#A8CCBA',
          400: '#7AAD94',
          500: '#5A6B60',
          600: '#4A6A58',
          700: '#2A4A38',
          800: '#1A3D2D',
          900: '#172E22',
        },
        ok:   '#1A8A50',
        warn: '#D97706',
        err:  '#DC2626',
        'amber-dark':   '#C07810',
        'amber-darker': '#B07010',
      },
      fontFamily: {
        hero:    ['var(--font-barlow)', 'Impact', 'sans-serif'],
        heading: ['var(--font-syne)',   'Georgia', 'serif'],
        body:    ['var(--font-jakarta)','system-ui', 'sans-serif'],
      },
      borderRadius: {
        btn:      '3px',
        card:     '4px',
        'card-lg':'6px',
      },
    },
  },
  plugins: [],
};

export default config;
