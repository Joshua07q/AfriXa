@@ .. @@
 /** @type {import('tailwindcss').Config} */
 module.exports = {
   content: [
     "./src/**/*.{js,ts,jsx,tsx,mdx}",
-    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
-    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
-    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
-    "./src/store/**/*.{js,ts,jsx,tsx,mdx}",
-    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
-    "./src/types/**/*.{js,ts,jsx,tsx,mdx}",
   ],
+  darkMode: 'class',
   theme: {
     extend: {
       colors: {
         'penn-blue': '#06023B',
         'smoky-black': '#191308',
         'erin': '#05f04b',
         'background': '#06023B',
         'surface': '#191308',
+        'primary': '#05f04b',
+        'primary-dark': '#04d142',
         'accent': '#05f04b',
         'on-primary': '#FFFFFF',
         'on-secondary': '#000000',
         'on-background': '#FFFFFF',
         'on-surface': '#FFFFFF',
         'error': '#B00020',
       },
+      fontFamily: {
+        'sans': ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
+        'mono': ['var(--font-geist-mono)', 'monospace'],
+      },
+      animation: {
+        'fadeIn': 'fadeIn 0.3s ease-in-out',
+        'slideIn': 'slideIn 0.3s ease-out',
+      },
+      keyframes: {
+        fadeIn: {
+          '0%': { opacity: '0' },
+          '100%': { opacity: '1' },
+        },
+        slideIn: {
+          '0%': { transform: 'translateX(-100%)' },
+          '100%': { transform: 'translateX(0)' },
+        },
+      },
     },
   },
   plugins: [],
 }