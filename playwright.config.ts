import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  expect: {
    timeout: 7500,
  },

  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  projects: [
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
