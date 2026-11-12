// Testene serverer repoet direkte fra disk via page.route, så ingen webserver eller port trengs.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: '*.spec.js',
  timeout: 60000,
  outputDir: 'tmp/test-results', // tmp/ er i .gitignore
  reporter: [['list']],
  use: { ...devices['Desktop Chrome'], acceptDownloads: true, locale: 'nb-NO' },
});
