import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'penn-blue': '#06023B',
        'smoky-black': '#191308',
        'erin': '#05f04b',
        'background': '#06023B',
        'surface': '#191308',
        'accent': '#05f04b',
        'on-primary': '#FFFFFF',
        'on-secondary': '#000000',
        'on-background': '#FFFFFF',
        'on-surface': '#FFFFFF',
        'error': '#FF5252',
      },
    },
  },
  plugins: [],
}
export default config
