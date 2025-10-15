import { Locator, Page } from "@playwright/test";

export default class DashboardPage {
    readonly page: Page;
    readonly userProfileName: Locator;
    readonly dashboardHeader: Locator;
    readonly dashboardArea: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userProfileName = page.locator("(//div[contains(@class,'flex items-center')]//span)[2]");
        this.dashboardHeader = page.locator("//h1[normalize-space(text())='Dashboard']");
        this.dashboardArea = page.getByRole('main');
    }

    async isUserProfileNameVisible(name: string) {
        return await this.page.locator(`//span[normalize-space(text())='${name}']`).isVisible();
    }
    
    async getUserProfileNameText() {
        return await this.userProfileName.textContent();
    }

    async getDashboardHeaderText() {
        return await this.dashboardHeader.textContent();
    }

    async isDashboardAreaVisible() {
        return await this.dashboardArea.isVisible();
    }
}