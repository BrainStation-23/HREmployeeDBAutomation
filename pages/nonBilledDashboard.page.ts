import { Page, Locator } from "@playwright/test";
export default class NonBilledDashboardPage{
    readonly page: Page;
    readonly nonbilleddashboardSidebar:Locator;
    readonly unauthorizedText:Locator;

    constructor(page: Page) {
        this.page = page;
        this.nonbilleddashboardSidebar=page.getByRole('link', { name: 'Non-Billed Dashboard' });     
        this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }
  async isNonBilledDashboradSideBarVisible(){
    return await this.nonbilleddashboardSidebar.isVisible({timeout:5000});
  }
  // #verify unauthorized text restiatcted url access
  async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }


}