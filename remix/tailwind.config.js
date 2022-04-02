module.exports = {
  purge: ['./app/**/*.tsx', './app/**/*.jsx', './app/**/*.js', './app/**/*.ts'],
  mode: 'jit',
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        loader: 'shimmer 2s infinite',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
