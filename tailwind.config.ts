import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: "#FFF5E6",
                    alt: "#FFE4CC",
                },
                primary: {
                    DEFAULT: "#FF6B35",
                    hover: "#E85D2A",
                },
                text: {
                    DEFAULT: "#2C2C2C",
                    muted: "#4A4A4A",
                },
                card: "#FFFFFF",
            },
            fontFamily: {
                sans: ['Inter', 'Satoshi', 'sans-serif'],
                display: ['Satoshi', 'Inter', 'sans-serif'],
            },
            animation: {
                blob: "blob 7s infinite",
                drift: "drift 4s ease-in-out infinite",
                float: "float 6s ease-in-out infinite",
            },
            keyframes: {
                drift: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(8px)" },
                },
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
