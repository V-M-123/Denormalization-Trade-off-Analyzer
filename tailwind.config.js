/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border, 214.3 31.8% 91.4%))",
        input: "hsl(var(--input, 214.3 31.8% 91.4%))",
        ring: "hsl(var(--ring, 222.2 84% 4.9%))",
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 222.2 84% 4.9%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 222.2 47.4% 11.2%))",
          foreground: "hsl(var(--primary-foreground, 210 40% 98%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 210 40% 96.1%))",
          foreground: "hsl(var(--secondary-foreground, 222.2 47.4% 11.2%))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84.2% 60.2%))",
          foreground: "hsl(var(--destructive-foreground, 210 40% 98%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 210 40% 96.1%))",
          foreground: "hsl(var(--muted-foreground, 215.4 16.3% 46.9%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 210 40% 96.1%))",
          foreground: "hsl(var(--accent-foreground, 222.2 47.4% 11.2%))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 0 0% 100%))",
          foreground: "hsl(var(--popover-foreground, 222.2 84% 4.9%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 0 0% 100%))",
          foreground: "hsl(var(--card-foreground, 222.2 84% 4.9%))",
        },
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        aurora: {
          cyan: '#06b6d4',
          emerald: '#10b981',
          teal: '#14b8a6',
          ice: '#f0f9ff',
          fjord: '#0b1b26',
        }
      },
      boxShadow: {
        'glass-sm': '0 2px 10px 0 rgba(0, 0, 0, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
        'glass': '0 8px 32px 0 rgba(6, 182, 212, 0.06), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
        'glass-lg': '0 16px 48px 0 rgba(6, 182, 212, 0.10), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.55), inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
        'glass-glow': '0 0 20px 2px rgba(6, 182, 212, 0.28), 0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
