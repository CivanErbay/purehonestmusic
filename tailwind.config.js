/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // './src/**/*.{html,js}',
    'node_modules/preline/dist/*.js',
  ],
  plugins: [
    // require('@tailwindcss/forms'),
    require('preline/plugin'),
  ],
  theme: {
    extend: {
      colors: {
        bg: '#131313',
        'bg-light': '#2F2F2F',
        primary: '#E77000',
        text: '#D3D3D3',
        faded: '#777777',
      },
    },
  },
}
