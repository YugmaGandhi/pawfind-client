/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#fef3f2',
                    100: '#fee5e2',
                    200: '#fccfc9',
                    300: '#f9aba3',
                    400: '#f47a6d',
                    500: '#ea5140',
                    600: '#d73526',
                    700: '#b3291d',
                    800: '#94261c',
                    900: '#7b261e',
                    950: '#430f0a',
                },
                secondary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
            },
        },
    },
    plugins: [],
}
