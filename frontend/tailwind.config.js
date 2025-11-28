/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        penabur: {
          blue: '#004aad',   
          dark: '#00337a',   
          gold: '#f4c430',   
          light: '#f0f4f8', 
        }
      }
    },
  },
  plugins: [],
}