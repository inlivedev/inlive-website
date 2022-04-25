exports.config = {
  tests: './codeceptjs/ProofOfConcept/*_test.js',
  output: './codeceptjs/output',
  helpers: {
    Playwright: {
      url: 'http://localhost:1313',
      show: true,
      browser: 'chromium'
    }
  },
  include: {
    I: './codeceptjs/steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'inlive-website'
}