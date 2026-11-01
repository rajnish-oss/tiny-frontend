import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172B4D",
        muted: "#5E6C84",
        brand: "#0A66C2",
        canvas: "#F5F7FA"
      },
      boxShadow: {
        card: "0 1px 3px rgba(23, 43, 77, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
