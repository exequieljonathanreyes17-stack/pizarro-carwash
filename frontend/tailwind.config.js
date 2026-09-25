/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Negro profundo de fondo (igual al del logo/flyers)
        carbon: {
          950: "#050608",
          900: "#0a0d12",
          800: "#12161d",
          700: "#1b2029",
        },
        // Azul eléctrico de "CARWASH" y los acentos neón
        electric: {
          400: "#5fb8ff",
          500: "#2f8ff5",
          600: "#1666d6",
          700: "#0d4aa8",
        },
        // Plateado/cromado de "PIZARRO"
        chrome: {
          100: "#f5f7fa",
          200: "#dfe4ea",
          300: "#b9c2cc",
          400: "#8e97a1",
        },
      },
      fontFamily: {
        display: ["'Rajdhani'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 25px rgba(47, 143, 245, 0.45)",
        "neon-lg": "0 0 60px rgba(47, 143, 245, 0.35)",
      },
      backgroundImage: {
        "chrome-text": "linear-gradient(180deg, #ffffff 0%, #c7cdd6 45%, #8e97a1 55%, #ffffff 100%)",
        "electric-text": "linear-gradient(180deg, #7fc4ff 0%, #2f8ff5 50%, #0d4aa8 100%)",
      },
    },
  },
  plugins: [],
};
