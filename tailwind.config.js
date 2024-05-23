/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "pulse-slow": 'low 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        "translate": "right 1s ease-out"
      },
      keyframes: {
        "low": {
          "10%": {
            opacity: 0.1
          }
        },
        "right": {
          "0%": {
            transform: "translateX(0)",
            opacity: 0
          },
          "100%": {
            transform: "translateX(10rem)",
            opacity:1
          }
        }
      }
    },
  },
  plugins: [],
}
