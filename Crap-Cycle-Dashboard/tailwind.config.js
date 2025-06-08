/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customTeal: '#2f9989',
      },
      fontSize: {
        'xxl': '1rem',  // Example size, adjust as needed
        '3xxl': '2rem', // Example size, adjust as needed
      },
      screens: {
        'lg-custom': '1290px',
      },
    },
  },
  plugins: [],
}