/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container : {
      // center : true,
      padding : "0.7rem",
      screens : {
        "2xl" : "1360px"
      }
    },
    extend: {
      colors: {
      },
      width: {
        150: "150px",
        180: "180px",
        190: "190px",
        225: "225px",
        275: "275px",
        300: "300px",
        340: "340px",
        350: "350px",
        375: "375px",
        460: "460px",
        656: "656px",
        880: "880px",
        508: "508px",
      },
      height: {
        80: "80px",
        150: "150px",
        225: "225px",
        300: "300px",
        340: "340px",
        370: "370px",
        420: "420px",
        510: "510px",
        600: "600px",
        650: "650px",
        685: "685px",
        800: "800px",
        "90vh": "90vh",
      },
      minWidth: {
        280: "280px",
        350: "350px",
        620: "620px",
      },
      maxWidth: {
        280: "280px",
      },
      fontSize: {
        clamp2Xs: "clamp(0.7rem, 0.85vw, 0.85rem)",
        clampXs: "clamp(0.9rem, 1vw, 1rem)",
        clampSm: "clamp(1.1rem, 1.2vw, 1.2rem)",
        clampMd: "clamp(1.2rem, 1.7vw, 1.7rem)",
        clampBase: "clamp(1.3rem, 2.1vw, 2.1rem)",
        clampLg: "clamp(1.5rem, 2.6vw, 2.6rem)",
        clampXl: "clamp(1.8rem, 3.1vw, 3.1rem)",
        clamp2Xl: "clamp(2.1rem, 3.6vw, 3.6rem)",
        clamp3Xl: "clamp(3.1rem, 5.8vw, 5.8rem)",
      },
      screens: {
        // min-width
        xs: { min: "460px" },
        sm: { min: "567px" },
        md: { min: "767px" },
        lg: { min: "992px" },
        xl: { min: "1200px" },
        "2xl": { min: "1600px" },

        // max-width breakpoints
        "max-xs": { max: "460px" },
        "max-sm": { max: "567px" },
        "max-md": { max: "767px" },
        "max-lg": { max: "992px" },
        "max-xl": { max: "1200px" },
        "max-2xl": { max: "1600px" },
      },
    },
  },
  plugins: [],
}
