/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                equi: {
                    olive: '#8C9E79', // Classic Sage Green from user image
                    sage: '#B5C4A9',  // Adjusted Lighter Sage
                    gold: '#E8C07D',
                    cream: '#FAF7F2',
                    paper: '#FDFBF7',
                    clay: '#8C867E',
                    border: '#E5E1DA',
                }
            }
        },
    },
    plugins: [],
}
