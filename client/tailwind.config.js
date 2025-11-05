/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Add this line to enable dark mode
    theme: {
        extend: {
            animation: {
                'gradient-pulse': 'gradient-pulse 6s ease-in-out infinite',
            },
            keyframes: {
                'gradient-pulse': {
                    '0%, 100%': {
                        'background-position': '0% 50%',
                        'background-size': '200% 200%',
                    },
                    '50%': {
                        'background-position': '100% 50%',
                        'background-size': '200% 200%',
                    },
                },
            },
        },
    },
    plugins: [],
}