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
        primary: {
          DEFAULT: "#db2d2e",
          dark: "#a81c1d",
          light: "#fbe0e0",
        },
        muted: "#64748b",
        border: "#e2e8f0",
        surface: "#f8fafc",
        foreground: "#0f172a",
        dark: "#4e4e4e",
        "section-blue": "#eef6ff",
        "section-cream": "#fef9e7",
        "section-grey": "#f1f5f9",
        "section-warm": "#faf7f2",
        "section-navy": "#1e293b",
      },
    },
  },
  plugins: [],
};
