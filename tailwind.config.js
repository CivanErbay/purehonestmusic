/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{html,js,vue}',
    './pages/**/*.{html,js,vue}',
    './index.html',
    'node_modules/preline/dist/*.js',
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
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        josefin: ['"Josefin Sans"', 'sans-serif'],
      },
    },
  },
};