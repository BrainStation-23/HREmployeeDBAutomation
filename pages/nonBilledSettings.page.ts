import { Page, Locator } from "@playwright/test";

export default class NonBilledSettingsPage {
    readonly page: Page;
    readonly nonbilledSettingSidebar: Locator;
    readonly unauthorizedText: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.nonbilledSettingSidebar = page.getByRole('link', { name: 'Non-Billed Settings' })
        this.unauthorizedText = page.getByRole('heading', { name: 'Unauthorized' })

    }

    async isNonBilledSettingsSidebarVisible() {
        return await this.nonbilledSettingSidebar.isVisible({ timeout: 5000 });
    }
    async verifyUnauthorizedText() {
        return await this.unauthorizedText.isVisible({ timeout: 5000 });
    }



}




