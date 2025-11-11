import { Page, Locator } from "@playwright/test";

export default class systemsettingPage {
  readonly page: Page;
  readonly systemSettingSideBar:Locator;
  readonly unauthorizedText:Locator;
  constructor(page: Page) {
    this.page = page;
    this.systemSettingSideBar=page.getByRole('link', { name: 'System Settings' })
    this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }
  async isSystemSettingVisible(){
    return await this.systemSettingSideBar.isVisible({timeout:5000});
  }
  async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }

}