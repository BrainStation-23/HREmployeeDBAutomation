import { Page, Locator } from "@playwright/test";
export default class EventFlagPage {
  readonly page: Page;
  readonly eventFlagSideBar: Locator;
  readonly unauthorizedText: Locator;
  constructor(page: Page) {
    this.page = page;
    this.eventFlagSideBar = page.getByRole('link', { name: 'Flagged Events' })
    this.unauthorizedText = page.getByRole('heading', { name: 'Unauthorized' })
  }
  async isEventFlagVisible() {
    return await this.eventFlagSideBar.isVisible({ timeout: 5000 });
  }
  // #verify unauthorized text restiatcted url access
  async verifyUnauthorizedText() {
    return await this.unauthorizedText.isVisible({ timeout: 5000 });
  }
}