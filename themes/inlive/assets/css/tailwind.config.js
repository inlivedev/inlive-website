const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './themes/inlive/**/*.{html,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          ...defaultTheme.fontFamily.sans,
        ]
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
