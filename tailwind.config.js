const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './archetypes/**/*.md',
    './content/**/*.md',
    './themes/inlive/archetypes/**/*.md',
    './themes/inlive/layouts/**/*.html',
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
