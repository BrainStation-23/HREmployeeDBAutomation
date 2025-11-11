import { Locator, Page } from "@playwright/test";

export default class CommonPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async getPageTitle() {
        return await this.page.title();
    }
}