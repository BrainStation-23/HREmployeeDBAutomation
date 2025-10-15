import { Page, Locator } from "@playwright/test";

export default class PlatformFeedbackPage {
    readonly page: Page;
    readonly platformFeedbackSidebar: Locator;
    readonly reportBugButton: Locator;
    readonly requestFeatureButton: Locator;
    readonly viewAllFeedbackButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.platformFeedbackSidebar = page.getByRole('link', { name: 'Platform Feedback' });
        this.reportBugButton = page.getByRole('button', { name: 'Report a Bug' });
        this.requestFeatureButton = page.getByRole('button', { name: 'Request Feature' });
        this.viewAllFeedbackButton = page.getByRole('button', { name: 'View existing feedback and' });
    }

    async clickPlatformFeedbackSidebar() {
        await this.platformFeedbackSidebar.click();
    }   
    async isPlatformFeedbackSidebarVisible() {
        return await this.platformFeedbackSidebar.isVisible({ timeout: 5000 });
    }
    async isReportBugButtonVisible() {
        await this.reportBugButton.waitFor({ state: 'visible', timeout: 15000 });
        return await this.reportBugButton.isVisible({ timeout: 5000 });
    }
    async isRequestFeatureButtonVisible() {
        await this.requestFeatureButton.waitFor({ state: 'visible', timeout: 15000 });
        return await this.requestFeatureButton.isVisible({ timeout: 5000 });
    }
    async isViewAllFeedbackButtonVisible() {
        return await this.viewAllFeedbackButton.isVisible({ timeout: 5000 });
    }
}