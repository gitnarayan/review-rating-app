export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",   // purple from Figma
        dark: "#111827",
        muted: "#6B7280"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
