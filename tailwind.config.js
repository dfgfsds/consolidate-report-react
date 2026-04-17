/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: "#1a1c23",
        "sidebar-hover": "#24262d",
        "sidebar-active": "#3a3d4a",
      }
    },
  },
  plugins: [],
}
