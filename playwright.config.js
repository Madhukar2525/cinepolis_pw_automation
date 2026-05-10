// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Root directory for tests
  testDir: './tests',

  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Use 2 workers on CI, 1 locally
  workers: 1,

  timeout: 60000,

  expect: {
    timeout: 10000,
  },


  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
  ],

  // Shared settings for all tests
  use: {
    // Base URL
    baseURL: 'https://www.cinepolisindia.com',

    headless: true,

    launchOptions: {
      slowMo: 1000
    },

    // Collect trace on first retry
    trace: 'on',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'on-first-retry',

    // Browser viewport
    viewport: { width: 1280, height: 720 },

    // Generous timeout for network-heavy pages
    navigationTimeout: 30000,
    actionTimeout: 15000,

    // Ignore HTTPS errors (some cinemas use mixed content)
    ignoreHTTPSErrors: true,

    // Locale
    locale: 'en-IN',
    permissions: ['geolocation'],
    geolocation: { latitude: 19.0760, longitude: 72.8777 },
  },

  // Output folder for test artifacts
  outputDir: 'reports/test-results',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // // Mobile viewport test
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
});
