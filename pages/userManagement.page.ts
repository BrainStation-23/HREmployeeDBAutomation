import { Page, Locator } from "@playwright/test";

export default class UserManagementPage {
  readonly page: Page;
  readonly userManagementSideBar:Locator;
  readonly unauthorizedText:Locator;


  constructor(page: Page) {
    this.page = page;
    this.userManagementSideBar=page.getByRole('link', { name: 'User Management' })
    this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }

  async isUserManagementVisible(){
    return await this.userManagementSideBar.isVisible({timeout:5000});
  }
  async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }

}