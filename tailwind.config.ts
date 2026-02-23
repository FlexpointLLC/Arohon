import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
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
