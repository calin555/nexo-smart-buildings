import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07151d",
        slate: "#46606c",
        cloud: "#f3f7f8",
        mint: "#3dd3b0",
        electric: "#57b8ff",
      },
      boxShadow: { panel: "0 12px 40px rgba(7, 21, 29, 0.10)" },
    },
  },
  plugins: [],
};

export default config;
