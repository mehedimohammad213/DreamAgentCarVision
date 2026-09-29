/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      colors: {
        // ONLY logo colors — Black, Blue, Maroon, White
        primary: {
          DEFAULT: "#ed1c24", // Maroon
          dark: "#ed1c24",
          light: "#f7b4b7", // Light maroon
        },
        brand: {
          DEFAULT: "#2e3192", // Blue
          dark: "#1a1c5c", // Deep blue
          light: "#c5c6e3", // Light blue
        },
        muted: "#231f20", // Black
        border: "#c5c6e3", // Light blue
        surface: "#ffffff", // White
        foreground: "#231f20", // Black
        dark: "#231f20", // Black
        "section-blue": "#ffffff",
        "section-cream": "#ffffff",
        "section-grey": "#ffffff",
        "section-warm": "#ffffff",
        "section-navy": "#2e3192",
      },
    },
  },
  plugins: [],
};
