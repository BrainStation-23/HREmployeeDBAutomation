import { Locator, Page } from "@playwright/test";

export default class CvSearchPage {
  readonly page: Page;
  readonly cvSearchSidebar: Locator;
  readonly bulkImportData:Locator;
  readonly bulkImportImage:Locator;
  readonly searchBtn:Locator;
  readonly unauthorizedText:Locator;
  constructor(page: Page) {
    this.page = page;
    this.cvSearchSidebar = page.getByRole('link', { name: 'CV Search' });
    this.bulkImportData=page.getByRole('button', { name: 'Bulk Import Data' })
    this.bulkImportImage=page.getByRole('button', { name: 'Bulk Import Images' })
    this.searchBtn=page.getByRole('button', { name: 'Search' })
    this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }
  //#region CV Search Page Common Sections
  async isCvSearchSidebarvisible() {
     return await this.cvSearchSidebar.isVisible();
  }
  async clickCvSearchSidebar() {
    await this.cvSearchSidebar.click()
  }
  async isSearchBtnVisible(){
   return await this.cvSearchSidebar.isVisible({timeout:5000});
  }
  async isBulkImportDataVisible(){
    await this.bulkImportData.waitFor({ state: 'visible', timeout: 15000 });
    return await this.bulkImportData.isVisible();
  }
  async isBulkImportImageVisible(){
    await this.bulkImportImage.waitFor({state:'visible',timeout:15000});
    return await this.bulkImportImage.isVisible();
  }
  // #verify unauthorized text restiatcted url access
 async verifyUnauthorizedText(){
   return await this.unauthorizedText.isVisible({timeout:5000});

 }

}
