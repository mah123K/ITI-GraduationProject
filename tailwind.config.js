/** @type {import('tailwindcss').Config} */
export default {
  // Add this line
  darkMode: 'class',
  
  content: [
    // ...your other content paths
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'), require('@tailwindcss/forms')],
}