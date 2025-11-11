import { Page, Locator } from "@playwright/test";

export default class ProfilePage {
  readonly page: Page;
  readonly  ProfileImageSideBar:Locator;
  readonly unauthorizedText:Locator;


  constructor(page: Page) {
    this.page = page;
    this.ProfileImageSideBar=page.getByRole('link', { name: 'Profile Image' })
    this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }
  async isProfileImageSidebarVisible(){
    return await this.ProfileImageSideBar.isVisible({timeout:5000});
  }
  async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }

}