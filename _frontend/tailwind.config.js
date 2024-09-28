/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Controls dark mode via a class
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                danger: 'var(--color-danger)',
                background: 'var(--color-background)',
                foreground: 'var(--color-foreground)',
                foreground2: 'var(--color-foreground2)',
                lightborder: 'var(--color-light-border)',
                lighth1: 'var(--color-light-h1)',
                lighth2: 'var(--color-light-h2)',
                dark1: 'var(--color-dark1)',
                dark2: 'var(--color-dark2)',


                light1: 'var(--color-light1)',
                light2: 'var(--color-light2)',
                // Add other semantic colors as needed
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'sans-serif'],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
        require('tailwindcss-filters'),
    ],
};
