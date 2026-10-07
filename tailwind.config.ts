import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        bangla: ['var(--font-bangla)', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { DEFAULT: '#06100C', 2: '#0B1A14', 3: '#12241C' },
        paper: '#F4F6F1',
        brand: {
          green: '#0ABF8B',
          'green-dark': '#019157',
          'green-light': 'rgba(10, 191, 139, 0.15)',
          'green-muted': 'rgba(10, 191, 139, 0.4)',
        },
      },
    },
  },
  plugins: [],
};
export default config;
