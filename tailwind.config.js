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
        // Logo palette: black, white, maroon (#ed1c24), blue (#2e3192)
        primary: {
          DEFAULT: "#ed1c24",
          dark: "#c4161c",
          light: "#fde8e9",
        },
        brand: {
          DEFAULT: "#2e3192",
          dark: "#232575",
          light: "#e8e9f4",
        },
        muted: "#5c5c66",
        border: "#e4e4ea",
        surface: "#f7f7fa",
        foreground: "#231f20",
        dark: "#231f20",
        "section-blue": "#e8e9f4",
        "section-cream": "#f7f7fa",
        "section-grey": "#f0f0f4",
        "section-warm": "#f7f7fa",
        "section-navy": "#2e3192",
      },
    },
  },
  plugins: [],
};
