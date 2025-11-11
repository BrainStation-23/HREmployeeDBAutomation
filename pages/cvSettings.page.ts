import { Locator, Page } from "@playwright/test";

export default class CvSettingPage {
  readonly page: Page;
  readonly cvSettingSideBar:Locator;
  readonly unauthorizedText:Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.cvSettingSideBar=page.getByRole('link', { name: 'CV Settings' })
     this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }
  async isCvSettingSideBarVisible(){
    return await this.cvSettingSideBar.isVisible();
  }
  // #verify unauthorized text restiatcted url access
  async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }
}
