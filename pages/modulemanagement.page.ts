import { Page, Locator } from "@playwright/test";

export default class ModuleManagementPage {
  readonly page: Page;
  readonly moduleManagementSideBar: Locator;
  readonly unauthorizedText: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.moduleManagementSideBar = page.getByRole('link', { name: 'User Management' })
    this.unauthorizedText = page.getByRole('heading', { name: 'Unauthorized' })
  }

  async isModuleManagementVisible() {
    return await this.moduleManagementSideBar.isVisible({ timeout: 5000 });
  }
  async verifyUnauthorizedText() {
    return await this.unauthorizedText.isVisible({ timeout: 5000 });
  }

}