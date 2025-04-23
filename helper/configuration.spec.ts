import { test as base, Page, Browser } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
dotenv.config();

const devUrl = process.env.DEV_URL || "https://devUrlAddress.example.com";
const testEmail = process.env.TEST_EMAIL || "email@IsMissing.com";
const password = process.env.TEST_PASSWORD || "PasswordIsMissing";
const authenticationFile = process.env.AUTH_FILE || "auth_json_file_created_in_env.json";
const authFile = path.join(__dirname, authenticationFile); // Path & name of the auth file
const websiteDomain = process.env.WEBSITE_DOMAIN; // website domain to select in the test

// Validation for .env variables
if (!testEmail || !password || !websiteDomain) {
  throw new Error("Required environment variables are missing (TEST_EMAIL, TEST_PASSWORD, or WEBSITE_DOMAIN)");
}

// Setup login and save in storage for tests to reuse
async function globalSetup(browser: Browser) {
  // Create a new auth file if it doesn't exist or older
  if (!shouldReuseAuthState()) {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Log in
    await page.goto(devUrl);
    const email = await page.getByRole("textbox", { name: "Username or Email" });
    const pass = await page.getByRole("textbox", { name: "Password show password" });
    const loginButton = await page.getByRole("button", { name: "Login" });

    await email.fill(testEmail);
    await pass.fill(password);
    await loginButton.click();
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("text=Hello, Anton!", { state: "visible" });

    // Save the authenticated state to file
    await context.storageState({ path: authFile });
    await context.close();
    console.log("New authentication state saved");
  } else {
    console.log("Reusing existing authentication state");
  }
}

// Reuse the existing auth file
function shouldReuseAuthState() {
  try {
    if (!fs.existsSync(authFile)) return false;

    // Check if file is less than 1 hour old
    const fileStats = fs.statSync(authFile);
    const fileAgeMs = Date.now() - fileStats.mtime.getTime();
    return fileAgeMs < 60 * 60 * 1000; // 1 hour
  } catch (error) {
    console.error("Error checking auth file:", error);
    return false;
  }
}

// Create a custom fixture with stored authentication
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ browser }, use) => {
    // Ensure we have a valid authentication state
    await globalSetup(browser);

    // Create a context with the saved authentication
    const context = await browser.newContext({
      storageState: authFile,
    });

    const page = await context.newPage();

    // Go to the starting URL - with authentication
    await page.goto(devUrl);

    // Set up the website selection
    await page.getByRole("button", { name: "Change" }).click();
    await page.getByRole("option", { name: websiteDomain }).getByRole("paragraph").click();
    await page.waitForLoadState("networkidle");

    // Use the page in the test
    await use(page);

    // Clean up
    await context.close();
  },
});
