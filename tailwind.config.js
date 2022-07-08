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
      },
      typography: {
        quoteless: {
          css: {
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after': { content: 'none' },
          },
        }
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
