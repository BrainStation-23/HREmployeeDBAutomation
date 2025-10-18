import { Locator, Page } from "@playwright/test";

export default class CvSearchPage {
  readonly page: Page;
  readonly cvSearchSidebar: Locator;
  readonly bulkImportData:Locator;
  readonly bulkImportImage:Locator;
  readonly searchBtn:Locator;
  constructor(page: Page) {
    this.page = page;
    this.cvSearchSidebar = page.getByRole('link', { name: 'CV Search' });
    this.bulkImportData=page.getByRole('button', { name: 'Bulk Import Data' })
    this.bulkImportImage=page.getByRole('button', { name: 'Bulk Import Images' })
    this.searchBtn=page.getByRole('button', { name: 'Search' })
  }
  async isCvSearchSidebarvisible() {
    await this.cvSearchSidebar.waitFor({ state: 'visible', timeout: 15000 });
    return await this.cvSearchSidebar.isVisible();
  }

  async clickCvSearchSidebar() {
    await this.cvSearchSidebar.click()
  }
  async isSearchBtnVisible(){
    await this.searchBtn.waitFor({state:'visible',timeout:15000});
    return await this.searchBtn.isVisible();
  }
  async isBulkImportDataVisible(){
    await this.bulkImportData.waitFor({ state: 'visible', timeout: 15000 });
    return await this.bulkImportData.isVisible();
  }
  async isBulkImportImageVisible(){
    await this.bulkImportImage.waitFor({state:'visible',timeout:15000});
    return await this.bulkImportImage.isVisible();
  }

}
