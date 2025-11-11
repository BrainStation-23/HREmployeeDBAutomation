import { Page, Locator } from "@playwright/test";

export default class Planning {
  readonly page: Page;
  readonly planningPageSidebar: Locator;
  readonly unauthorizedText: Locator;
  readonly updatecsvBtn: Locator;
  readonly exportcsvBtn: Locator;
  readonly textField: Locator

  constructor(page: Page) {
    this.page = page;
    this.planningPageSidebar = page.getByRole('link', { name: 'Planning' })
    this.updatecsvBtn = page.getByRole('button', { name: 'Update CSV' })
    this.exportcsvBtn = page.getByRole('button', { name: 'Export CSV' })
    this.textField = page.locator("(//button[@data-lov-name='Button'])[3]")
    this.unauthorizedText = page.getByRole('heading', { name: 'Unauthorized' })
  }
  async ClickplanningPageSidebar() {
     await this.planningPageSidebar.click();
  }
  async isClickplanningPageSidebarVisible() {
      return await this.planningPageSidebar.isVisible({ timeout: 5000 });
  }
  async isUpdateBtnVisible() {
      await this.updatecsvBtn.waitFor({ state: 'visible', timeout: 15000 });
      return await this.updatecsvBtn.isVisible({ timeout: 5000 });
  }
  async isExportBtnVisible() {
      return await this.exportcsvBtn.isVisible({ timeout: 5000 });
  }
  async isTextFieldBtnVisible() {
      return await this.textField.isVisible({ timeout: 5000 });
  }
  // #verify unauthorized text restiatcted url access
  async verifyUnauthorizedText() {
      return await this.unauthorizedText.isVisible({ timeout: 5000 });
  }

}