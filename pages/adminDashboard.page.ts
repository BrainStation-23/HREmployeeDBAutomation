import { Page, Locator } from "@playwright/test";

export default class AdmindashboardPage {
  readonly page: Page;
  readonly dashboardSideBar:Locator;
  readonly unauthorizedText:Locator;
  constructor(page: Page) {
    this.page = page;
    this.dashboardSideBar=page.getByRole('link', { name: 'Dashboard', exact: true }).nth(1)
    this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }

  async isDashboardVisible(){
    return await this.dashboardSideBar.isVisible({timeout:5000});
  }
  // #verify unauthorized text restiatcted url access
  async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }

}