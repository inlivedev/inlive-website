exports.config = {
  tests: './proof_of_concept/*_test.js',
  output: './output',
  helpers: {
    Playwright: {
      url: 'http://localhost:1313',
      show: true,
      browser: 'chromium'
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'inlive-website'
}