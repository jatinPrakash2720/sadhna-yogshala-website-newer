import type { TailwindConfig } from "@react-email/components";

/**
 * Tailwind theme extension for React Email templates.
 * Mirrors Yogshala brand colors from tailwind.config.ts.
 */
export const emailTailwindConfig: TailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9f4",
          100: "#dbf0e3",
          500: "#409072",
          600: "#2f745a",
          700: "#275d49",
          800: "#214a3b",
          900: "#1d3e33",
        },
        cream: {
          50: "#fdfcfb",
          100: "#f8f6f2",
        },
        earth: {
          500: "#7c7462",
          600: "#645d4e",
        },
      },
    },
  },
};
