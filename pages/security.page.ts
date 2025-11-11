import { Page, Locator } from "@playwright/test";

export default class SecurityPage {
    readonly page: Page;
    readonly securitySidebar: Locator;
    readonly currentPasswordInput: Locator;
    readonly newPasswordInput: Locator;
    readonly confirmNewPasswordInput: Locator;
    readonly updatePasswordButton: Locator;
    constructor(page: Page) {
        this.page = page;
        this.securitySidebar = page.getByRole('link', { name: 'Security' });
        this.currentPasswordInput = page.getByRole('textbox', { name: 'Current Password' })
        this.newPasswordInput = page.locator("#new-password");
        this.confirmNewPasswordInput = page.locator("#confirm-password");
        this.updatePasswordButton = page.getByRole('button', { name: 'Update Password' });
    }

    async clickSecuritySidebar() {
        await this.securitySidebar.click();
    }
    async isSecuritySidebarVisible() {
        return await this.securitySidebar.isVisible({ timeout: 5000 });
    }
    async isCurrentPasswordInputVisible() {
        await this.currentPasswordInput.waitFor({ state: 'visible', timeout: 15000 });
        return await this.currentPasswordInput.isVisible({ timeout: 5000 });
    }
    async isNewPasswordInputVisible() {
        await this.newPasswordInput.waitFor({ state: 'visible', timeout: 15000 });
        return await this.newPasswordInput.isVisible({ timeout: 5000 });
    }
    async isConfirmNewPasswordInputVisible() {
        return await this.confirmNewPasswordInput.isVisible({ timeout: 5000 });
    }
    async isUpdatePasswordButtonVisible() {
        return await this.updatePasswordButton.isVisible({ timeout: 5000 });
    }
}