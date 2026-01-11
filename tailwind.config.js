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
                    olive: '#4A5D4A',
                    sage: '#7A8D76',
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
