import { SendQueryAndVerifyResponseType } from "./interfaces";
import { expect, Page } from "@playwright/test";
/**
 * Sends a query to the AI chatbot and verifies the response contains expected texts
 * @param page - The Playwright Page object
 * @param query - Query text to send to the chatbot
 * @param expectedTexts - Array of texts that should be found in the response
 * @param requiredTexts - Optional array of texts that must be found in the response
 */

export const sendQueryAndVerifyResponse: SendQueryAndVerifyResponseType = async (
  page: Page,
  query: string,
  expectedTexts: string[]
) => {
  // Click chat button
  await page.getByRole("button").nth(2).click();

  // Send query
  const chatInput = await page.getByPlaceholder("Type your question here");
  await chatInput.click();
  await chatInput.fill(query);
  await chatInput.press("Enter");

  // Check why with await page.waitForLoadState("networkidle") tests are flaky
  await page.waitForTimeout(17000);

  // Extract and check response
  const chatWindow = await page.locator(".sg-support-popup__wrapper");
  const chatWindowText = await chatWindow.innerText();
  const chatWindowTextArray = chatWindowText.split("\n");

  // Check for patterns
  try {
    for (const text of expectedTexts) {
      const matches = chatWindowTextArray.filter(line => line.includes(text));
      expect(matches.length).toBeGreaterThan(0);
    }
  } catch (error) {
    console.error(`Failed to find expected text in response. Response was: ${chatWindowText}`);
    throw error;
  }

  // Screenshot of the chat response
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeQuery = query.substring(0, 20).replace(/[^a-zA-Z0-9-]/g, "-");
  await chatWindow.screenshot({
    path: `./screenshots/${timestamp}-${safeQuery}.png`,
  });
};
