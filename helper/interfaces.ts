import { Page } from "@playwright/test";

export interface SendQueryAndVerifyResponseType {
  (page: Page, query: string, expectedTexts: string[]): Promise<void>;
}
