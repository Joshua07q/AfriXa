/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/store/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        'error': '#B00020',
      },
    },
  },
  plugins: [],
} 