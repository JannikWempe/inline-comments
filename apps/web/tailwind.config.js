module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  // safelist: ["!bg-red-500/50", "bg-red-500/50"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'),],
}
