import { Page, Locator } from "@playwright/test";

export default class RoleManagementPage {
  readonly page: Page;
  readonly roleManagementSideBar:Locator;
  readonly unauthorizedText:Locator;
  constructor(page: Page) {
    this.page = page;
    this.roleManagementSideBar=page.getByRole('link', { name: 'Role Management' })
    this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }
  async isRoleManagementVisible(){
    return await this.roleManagementSideBar.isVisible({timeout:5000});
  }
  // #verify unauthorized text restiatcted url access
  async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }

}