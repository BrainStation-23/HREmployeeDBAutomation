import { Page, Locator } from "@playwright/test";

export default class SignOutPage {
    readonly page: Page;
    readonly signOutSidebar: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signOutSidebar = page.locator("//button[.//span[normalize-space()='Sign Out']]"); 
    }

    async isSignoutVisible(){
        return await this.signOutSidebar.isVisible();
    }

    async clickSignOut() {
        await this.signOutSidebar.click();
    }
}
