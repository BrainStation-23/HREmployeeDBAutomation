import { Locator, Page,expect } from "@playwright/test";
import urldata from '../test_data/urlExpectedData.json'

export default class CvCompletionPage {
  readonly page: Page;
  readonly CvCompletionSidebar: Locator;
  readonly SearchBox:Locator;
  readonly ResourcesField:Locator;
  readonly EditBtn:Locator;
  readonly unauthorizedText:Locator;


  constructor(page: Page) {
    this.page = page;
    this.CvCompletionSidebar = page.getByRole('link', { name: 'CV Completion' })
    this.SearchBox=page.locator("//input[@placeholder='Search employees...']")
    this.ResourcesField=page.locator("//button[@role='combobox']")
    this.EditBtn=page.locator("(//div[contains(@class, 'flex items-center gap-3')]//button[normalize-space(text())='Edit'])[1]")
    this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }
  async isCvCompletionSidebarVisible(){
     return await this.CvCompletionSidebar.isVisible({timeout:5000});
  }
  async clickCvCompletionSidebarr(){
    await this.CvCompletionSidebar.click();
  }
  async isSearchBoxVisible(){
    await this.SearchBox.waitFor({ state: 'visible', timeout: 15000 });
    return await this.SearchBox.isVisible();
  }
  async isResourcesFieldVisible(){
    await this.ResourcesField.waitFor({ state: 'visible', timeout: 15000 });
    return await this.ResourcesField.isVisible();

  }
  async isEditBtnVisible(){
    await this.EditBtn.waitFor({ state: 'visible', timeout: 15000 });
    return await this.EditBtn.isVisible();
  }
  // #verify unauthorized text restiatcted url access
 async verifyUnauthorizedText(){
   return await this.unauthorizedText.isVisible({timeout:5000});

 }

}
