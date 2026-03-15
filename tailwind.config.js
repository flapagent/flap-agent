/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#ff007f",
        "accent-light": "#ff66b2",
        "bg-base": "#050505",
        "bg-card": "rgba(15,15,15,0.8)",
        "green-term": "#00ff41",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        pink: "0 0 30px rgba(255,0,127,0.35)",
        "pink-sm": "0 0 12px rgba(255,0,127,0.25)",
      },
      animation: {
        "pulse-pink": "pulse-pink 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        "pulse-pink": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(255,0,127,0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(255,0,127,0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "pink-gradient": "linear-gradient(135deg,#ff007f,#ff66b2)",
        "dark-gradient": "linear-gradient(180deg,#0a0a0a,#050505)",
      },
      zIndex: {
        "-10": "-10",
        "-20": "-20",
        "-30": "-30",
      },
    },
  },
  plugins: [],
};
