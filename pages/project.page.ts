import { Page, Locator } from "@playwright/test";

export default class ProjectPage {
  readonly page: Page;
  readonly projectSideBar:Locator;
  readonly unauthorizedText:Locator;


  constructor(page: Page) {
    this.page = page;
    this.projectSideBar=page.getByRole('link', { name: 'Projects' })
    this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }

  async isProjectVisible(){
    return await this.projectSideBar.isVisible({timeout:5000});
  }
  async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }

}