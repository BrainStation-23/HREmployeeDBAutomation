import { Locator, Page } from "@playwright/test";

export default class UserManagementNewUserPage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly firstDateSelectButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly employeeIdInput: Locator;
    readonly roleDropdown: Locator;
    readonly roleDropdownEmployeeSearch: Locator;
    readonly managerDropdown: Locator;
    readonly managerDropdownSearchOption: Locator;
    readonly dropdownSearchOptionSelectLast: Locator;
    readonly sbuDropdown: Locator;
    readonly sbuDropdownSearchOption: Locator;
    readonly expertiseDropdown: Locator;
    readonly expertiseDropdownSearchOption: Locator;
    readonly resourceTypeDropdown: Locator;
    readonly resourceTypeDropdownSearchOption: Locator;
    readonly dateOfJoiningInput: Locator;
    readonly careerStartDateInput: Locator;
    readonly userSubmitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator("#firstName");
        this.dateOfBirthInput = page.locator("//button[contains(.,'Select date of birth')]");
        this.firstDateSelectButton = page.locator("//button[normalize-space(text())='1']");
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.employeeIdInput = page.locator("#employeeId");
        this.roleDropdown = page.locator("//button[contains(text(),'Select role')]");
        this.roleDropdownEmployeeSearch = page.locator("//input[contains(@placeholder,'Search role')]");
        this.managerDropdown = page.locator("//button[contains(text(),'Select manager')]");
        this.managerDropdownSearchOption = page.locator("//input[contains(@placeholder,'Search manager')]");
        this.dropdownSearchOptionSelectLast = page.locator("//div[@role='option'][last()]");
        this.sbuDropdown = page.locator("//label[text()='SBU *']/following-sibling::button");
        this.sbuDropdownSearchOption = page.locator("//input[contains(@placeholder,'Search SBU')]");
        this.expertiseDropdown = page.locator("//button[contains(text(),'Select expertise')]");
        this.expertiseDropdownSearchOption = page.locator("//input[contains(@placeholder,'Search expertise')]");
        this.resourceTypeDropdown = page.locator("//button[contains(text(),'Select resource type')]");
        this.resourceTypeDropdownSearchOption = page.locator("//input[contains(@placeholder,'Search resource type')]");
        this.dateOfJoiningInput = page.locator("//button[contains(.,'Select joining date')]");
        this.careerStartDateInput = page.locator("//button[contains(.,'Select career start date')]");
        this.userSubmitButton = page.locator("//button[@type='submit']");
    }

    async enterName(name: string) {
        await this.nameInput.clear();
        await this.nameInput.fill(name);
    }

    async selectDateOfBirthSpecific(date: string) {
        await this.dateOfBirthInput.click();
        const specificDateButton = this.page.locator(`//button[normalize-space(text())='${date}']`);
        await specificDateButton.click();
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async enterEmployeeId(employeeId: string) {
        await this.employeeIdInput.clear();
        await this.employeeIdInput.fill(employeeId);
    }

    async selectRole(roleName: string) {
        await this.roleDropdown.click();
        await this.roleDropdownEmployeeSearch.fill(roleName);
        await this.dropdownSearchOptionSelectLast.click();
    }

    async selectManager(managerNameorID: string) {
        await this.managerDropdown.click();
        await this.managerDropdownSearchOption.fill(managerNameorID);
        await this.dropdownSearchOptionSelectLast.click();
    }

    async selectSBU(sbuName: string) {
        await this.sbuDropdown.click();
        await this.sbuDropdownSearchOption.fill(sbuName);
        await this.page.waitForTimeout(1000);
        await this.dropdownSearchOptionSelectLast.click();
    }

    async selectExpertise(expertiseType: string) {
        await this.expertiseDropdown.click();
        await this.expertiseDropdownSearchOption.fill(expertiseType);
        await this.page.waitForTimeout(1000);
        await this.dropdownSearchOptionSelectLast.click();
    }

    async selectResourceType(resourceType: string) {
        await this.resourceTypeDropdown.click();
        await this.resourceTypeDropdownSearchOption.fill(resourceType);
        await this.page.waitForTimeout(1000);
        await this.dropdownSearchOptionSelectLast.click();
    }

    async selectDateOfJoiningSpecific(date: string) {
        await this.dateOfJoiningInput.click();
        const specificDateButton = this.page.locator(`//button[normalize-space(text())='${date}']`);
        await specificDateButton.click();
    }

    async selectCareerStartDateSpecific(date: string) {
        await this.careerStartDateInput.click();
        const specificDateButton = this.page.locator(`//button[normalize-space(text())='${date}']`);
        await specificDateButton.click();
    }

    async clickUserSubmitButton() {
        await this.userSubmitButton.click();
    }

    async waitForSuccessMessage() {
        const successMessage = this.page.locator("text=User created successfully");
        await successMessage.waitFor({ state: 'visible', timeout: 5000 });
    }
}