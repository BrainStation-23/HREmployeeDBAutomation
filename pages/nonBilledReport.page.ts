import { Page, Locator } from "@playwright/test";

export default class NonBilledReportPage{
    readonly page: Page;
    readonly nonbilledReportSidebar:Locator;
    readonly searchField:Locator;
    readonly sbuField:Locator;
    readonly expertiseField:Locator
    readonly billTypeField:Locator;
    readonly syncnowButton:Locator;
    readonly exportcsvButton:Locator
    readonly unauthorizedText:Locator;
    constructor(page:Page){
        this.page = page;
        this.nonbilledReportSidebar=page.getByRole('link', { name: 'Non-Billed Report' });
        this.searchField=page.getByRole('textbox', { name: 'Search' });
        this.sbuField=page.getByText('Filter by SBU');
        this.expertiseField=page.getByText('Filter by Expertise');
        this.billTypeField= page.getByText('Filter by Bill Type');
        this.syncnowButton=page.getByRole('button', { name: 'Sync Now' });
        this.exportcsvButton=page.getByRole('button', { name: 'Export CSV' });
        this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
    }
    async isNonBilledReportsidebarVisible(){
        return await this.nonbilledReportSidebar.isVisible({ timeout: 5000 });
    }
    async ClickNonBilledReportsidebar(){
        await this.nonbilledReportSidebar.click();
    }

    async isSearchFieldVisible(){
        await this.searchField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.searchField.isVisible({ timeout: 5000 });
    }
    async isSbuFieldVisible(){
        await this.sbuField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.sbuField.isVisible({ timeout: 5000 });

    }
    async isExpertiseFieldVisible(){
        await this.expertiseField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.expertiseField.isVisible({ timeout: 5000 });

    }
    async isBillTypeFieldVisible(){
        await this.billTypeField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.billTypeField.isVisible({ timeout: 5000 });

    }
    async isSyncnowButtonVisible(){
        return await this.syncnowButton.isVisible({ timeout: 5000 });
    }
    async isExportbuttonVisible(){
        return await this.exportcsvButton.isVisible({ timeout: 5000 });
    }
    // #verify unauthorized text restiatcted url access
    async verifyUnauthorizedText(){
         return await this.unauthorizedText.isVisible({timeout:5000});
   }
}