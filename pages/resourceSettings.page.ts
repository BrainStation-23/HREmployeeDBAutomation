import { Page, Locator } from "@playwright/test";

export default class ResourceSettingPage {
  readonly page: Page;
  readonly resourcesettingSideBar:Locator;
  readonly unauthorizedText:Locator;


  constructor(page: Page) {
    this.page = page;
    this.resourcesettingSideBar=page.getByRole('link', { name: 'Resource Settings' })
     this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }

  async isResourceSettingSideBarNotVisible(){
    return await this.resourcesettingSideBar.isVisible({timeout:5000});
  }
  async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }

}
