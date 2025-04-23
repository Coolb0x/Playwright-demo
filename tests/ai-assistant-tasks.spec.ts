import { test } from "../helper/configuration.spec.ts"; //Configuration is here
import { sendQueryAndVerifyResponse } from "../helper/helper-methods.spec.ts"; // Helper methods are here
import * as fs from "fs";
import { testCases } from "../test-scenarios/test-cases.ts"; // Test scenarios should be added here

// Generate tests from test added test scenarios
test.describe("Site Tools features for AI Agents", () => {
  // Create directory for screenshots
  test.beforeAll(async () => {
    if (!fs.existsSync("./screenshots")) {
      fs.mkdirSync("./screenshots");
    }
  });

  for (const testCase of testCases) {
    test(testCase.name, async ({ authenticatedPage }) => {
      await sendQueryAndVerifyResponse(authenticatedPage, testCase.query, testCase.expectedTexts);
    });
  }
});
