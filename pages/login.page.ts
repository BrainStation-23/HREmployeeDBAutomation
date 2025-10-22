import { Page, Locator } from "@playwright/test"
import ENV from "../utils/env";

export default class LoginPage {
    readonly page: Page;
    readonly signInHeader: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly userProfileName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInHeader = page.locator("//h3[@data-lov-name='CardTitle']");
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.signInButton = page.locator("//button[@type='submit']");
        this.userProfileName = page.locator("(//div[contains(@class,'flex items-center')]//span)[2]");

    }

    async navigateToLoginPage() {
        await this.page.goto(`${ENV.BASE_URL}/login`);
    }

    async getSignInHeaderText() {
        return await this.signInHeader.textContent();
    }

    async loginToCvSite(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        await this.userProfileName.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.waitForLoadState('networkidle');
    }
    //await page.getByText('Md. Taskinur Rahman', { exact: true }).click();


}