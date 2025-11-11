import { Page, Locator } from "@playwright/test";
import path from "path";
import * as fs from "fs";
import ENV from "../utils/env";
import { promises } from "dns";

export default class UserManagementPage {
  readonly page: Page;
  readonly userManagementSideBar: Locator;
  readonly unauthorizedText: Locator;
  readonly addUserButton: Locator;
  readonly toasterMessageConfirmation: Locator;
  readonly toasterCrossButton: Locator;
  readonly userSearchInput: Locator;
  readonly userSearchButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly expertiseInfo: Locator;
  readonly resourceTypeInfo: Locator;
  readonly noUserFound: Locator;
  readonly bulkCreateButton: Locator;
  readonly bulkUpdateButton: Locator;
  readonly bulkDeleteButton: Locator
  readonly csvFileUploadBox: Locator;
  readonly validUserNumberForFileUpload: Locator;
  readonly errorFoundsForFileUpload: Locator;
  readonly bulkCreateUpdateSubmitButton: Locator;
  readonly deleteListedRadioButton: Locator;
  readonly generatePreviewForBulkDeleteButton: Locator;
  readonly bulkDeleteWarningMessage: Locator;
  readonly bulkDeletedUserCount: Locator;
  readonly downloadExcelReportButton: Locator;
  readonly bulkDeleteConfirmButton: Locator;
  readonly closeBulkPopupButton: Locator;
  readonly roleFilterDropdownEmployeeSearch: Locator;
  readonly managerFilterDropdownSearchOption: Locator;
  readonly sbuFilterDropdownSearchOption: Locator;
  readonly expertiseFilterDropdownSearchOption: Locator;
  readonly resourceTypeFilterDropdownSearchOption: Locator;
  readonly dropdownSearchOptionSelectLast: Locator;
  readonly resetAllFilterButton: Locator;
  readonly resetAdvanceButton: Locator;
  readonly advanceFiltersButton: Locator;
  readonly applyFilterButton: Locator;
  readonly searchResultCount: Locator;
  readonly roleDropdown: Locator;
  readonly sbuDropdown: Locator;
  readonly managerDropdown: Locator;
  readonly expertiseDropdown: Locator;
  readonly resourceTypeDropdown: Locator;
  readonly totalUserCountXpath: Locator;
  readonly exportAllButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.userManagementSideBar = page.getByRole('link', { name: 'User Management' });
    this.unauthorizedText = page.getByRole('heading', { name: 'Unauthorized' });
    this.addUserButton = page.locator("//button[contains(.,'Add User')]");
    this.toasterMessageConfirmation = page.locator("//div[@class='text-sm font-semibold']/following-sibling::div[1]");
    this.userSearchInput = page.locator("//input[contains(@placeholder,'Search by name or email')]");
    this.userSearchButton = page.locator("//button[@type='submit']");
    this.confirmDeleteButton = page.locator("//button[normalize-space(text())='Delete']");
    this.expertiseInfo = page.locator("(//span[text()='Expertise:']/following-sibling::span)[1]");
    this.resourceTypeInfo = page.locator("(//span[text()='Resource Type:']/following-sibling::span)[1]");
    this.noUserFound = page.locator("//div[normalize-space(text())='No users found']");
    this.toasterCrossButton = page.locator("//li[@data-swipe-direction='right']//button");
    this.bulkCreateButton = page.locator("//button[contains(.,'Bulk Create')]");
    this.bulkUpdateButton = page.locator("//button[contains(.,'Bulk Update')]")
    this.bulkDeleteButton = page.locator("//button[contains(.,'Bulk Delete')]");
    this.csvFileUploadBox = page.locator("//input[@type='file']");
    this.validUserNumberForFileUpload = page.locator("//div[text()='Valid Users']/following-sibling::div");
    this.errorFoundsForFileUpload = page.locator("//div[text()='Errors Found']/following-sibling::div");
    this.bulkCreateUpdateSubmitButton = page.locator("//button[text()='Cancel']/following-sibling::button");
    this.deleteListedRadioButton = page.locator("#delete_listed");
    this.generatePreviewForBulkDeleteButton = page.locator("//button[contains(.,'Generate Preview')]");
    this.bulkDeleteWarningMessage = page.locator("//*[@role='alert']//div");
    this.bulkDeletedUserCount = page.locator("//div[@role='alert']/following-sibling::div/h4");
    this.downloadExcelReportButton = page.locator("//button[text()='Download Excel Report']");
    this.bulkDeleteConfirmButton = page.locator("//button[contains(text(),'Delete')]");
    this.closeBulkPopupButton = page.locator("//button[contains(.,'Close')]");
    this.roleFilterDropdownEmployeeSearch = page.locator("//input[contains(@placeholder,'Search role')]");
    this.managerFilterDropdownSearchOption = page.locator("//input[contains(@placeholder,'Search manager')]");
    this.sbuFilterDropdownSearchOption = page.locator("//input[contains(@placeholder,'Search SBU')]");
    this.expertiseFilterDropdownSearchOption = page.locator("//input[contains(@placeholder,'Search expertise')]");
    this.resourceTypeFilterDropdownSearchOption = page.locator("//input[contains(@placeholder,'Search resource type')]");
    this.dropdownSearchOptionSelectLast = page.locator("//div[@role='option'][last()]");
    this.resetAllFilterButton = page.locator("//button[text()='Reset All Filters']");
    this.resetAdvanceButton = page.locator("//button[text()='Reset Advanced']");
    this.advanceFiltersButton = page.locator("//button[contains(.,'Advanced Filters')]");
    this.applyFilterButton = page.locator("//button[text()='Apply Filters']");
    this.searchResultCount = page.locator("//nav[@role='navigation']/../../div[1]");
    this.roleDropdown = page.locator("//button[contains(text(),'All Roles')]");
    this.sbuDropdown = page.locator("//label[text()='SBU']/following-sibling::button");
    this.managerDropdown = page.locator("//button[contains(text(),'Select manager')]");
    this.expertiseDropdown = page.locator("//button[contains(text(),'Select expertise')]");
    this.resourceTypeDropdown = page.locator("//button[contains(text(),'Select resource type')]");
    this.totalUserCountXpath = page.locator("//div[@class='space-y-3']/div");
    this.exportAllButton = page.locator("//span[text()='Export All']");
  }

  async isUserManagementVisible() {
    return await this.userManagementSideBar.isVisible({ timeout: 5000 });
  }
  async verifyUnauthorizedText() {
    return await this.unauthorizedText.isVisible({ timeout: 5000 });
  }

  async navigateToUserManagement() {
    await this.userManagementSideBar.click();
  }

  async navigateToUserManagementByURL() {
    await this.page.goto(`${ENV.BASE_URL}/users`);
  }

  async clickOnAddUserButton() {
    await this.addUserButton.waitFor({ state: 'visible', timeout: 3000 });
    await this.addUserButton.click();
  }

  async getToasterMessageConfirmation() {
    await this.toasterMessageConfirmation.waitFor({ state: 'visible', timeout: 15000 });
    const message = await this.toasterMessageConfirmation.textContent();
    await this.toasterMessageConfirmation.hover();
    await this.toasterCrossButton.click();
    return message;
  }

  async clickToasterCrossButton() {
    await this.toasterMessageConfirmation.hover();
    await this.toasterCrossButton.click();
  }

  async fillTheSearchInput(email: string) {
    await this.userSearchInput.clear();
    await this.userSearchInput.fill(email);
  }

  async blankSearch() {
    await this.userSearchInput.clear();
    await this.userSearchInput.fill(" ");
    await this.userSearchInput.click();
  }

  async clickSearchButton() {
    await this.userSearchButton.click();
  }

  async expandUserInfo(email: string) {
    const xpath: string = `//div[text()='${email}']/../../../preceding-sibling::button`;
    const locatorX: Locator = this.page.locator(xpath);
    await locatorX.waitFor({ state: "visible" });
    await locatorX.click();
  }

  async getUserName(email: string) {
    const xpath = `//div[text()='${email}']/preceding-sibling::div`;
    return await this.page.locator(xpath).textContent();
  }

  async getUserEmployeeID(email: string) {
    const xpath = `//div[text()='${email}']/parent::div/following::div[1]`;
    return await this.page.locator(xpath).textContent();
  }

  async getUserRole(email: string) {
    const xpath = `//div[text()='${email}']/parent::div/following::div[2]`;
    return await this.page.locator(xpath).textContent();
  }

  async getUserSBU(email: string) {
    const xpath = `//div[text()='${email}']/parent::div/following::div[3]`;
    return await this.page.locator(xpath).textContent();
  }

  async clickUSerRestPasswordButton(email: string) {
    const xpath = `//div[text()='${email}']/parent::div/following::button[text()='Reset Password']`;
    await this.page.locator(xpath).click();
  }

  async clickUserEditButton(email: string) {
    const xpath = `//div[text()='${email}']/parent::div/following::button[text()='Reset Password']/following-sibling::button[1]`;
    await this.page.locator(xpath).click();
  }

  async clickUserDeleteButton(email: string) {
    const xpath = `//div[text()='${email}']/parent::div/following::button[text()='Reset Password']/following-sibling::button[2]`;
    await this.page.locator(xpath).click();
  }

  async clickConfirmDeleteButton() {
    await this.confirmDeleteButton.click();
  }

  async getUserExpertiseInfo() {
    return await this.expertiseInfo.textContent();
  }

  async getResourceTypeInfo() {
    return await this.resourceTypeInfo.textContent();
  }

  async isNoUserFound() {
    return await this.noUserFound.isVisible({ timeout: 5000 });
  }

  async clickBulkCreateButton() {
    await this.bulkCreateButton.click();
  }

  async clickBulkUpdateButton() {
    await this.bulkUpdateButton.click();
  }

  async uploadFile(filePath: string) {
    await this.csvFileUploadBox.waitFor({ state: "visible", timeout: 5000 });
    await this.csvFileUploadBox.setInputFiles(filePath);
  }

  async getValidUserNumberForFileUpload() {
    return await this.validUserNumberForFileUpload.textContent();
  }

  async getErrorNumberForFileUpload() {
    return await this.errorFoundsForFileUpload.textContent();
  }

  async getCreateUpdateUserNumberFromSubmitButton() {
    return await this.bulkCreateUpdateSubmitButton.textContent();
  }

  async clickTheBulkSubmitButton() {
    await this.bulkCreateUpdateSubmitButton.click();
  }

  async clickBulkDeleteButton() {
    await this.bulkDeleteButton.click();
  }

  async clickDeleteListedRadioButton() {
    await this.deleteListedRadioButton.click();
  }

  async clickGeneratePreviewButtonForBulkDelete() {
    await this.generatePreviewForBulkDeleteButton.click();
  }

  async getBulkDeleteWarningMessage() {
    return await this.bulkDeleteWarningMessage.textContent();
  }

  async getBulkDeletedUserCount() {
    return await this.bulkDeletedUserCount.textContent();
  }

  async getBulkDeletedUserNameFromConfirmList(email: string) {
    return await this.page.locator(`(//div[text()='${email}']/preceding-sibling::div)[1]`).textContent();
  }

  async getBulkDeletedUserEmployeeIdFromConfirmList(email: string) {
    return await this.page.locator(`//div[text()='${email}']/parent::div//following-sibling::div[contains(@class,'inline-flex')]`).textContent();
  }

  async downloadTheDeletedExcelReport(targetFilePath: string) {
    const filePath = path.resolve(targetFilePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    /* Delete the existing file if it exists */
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old file: ${filePath}`);
    }

    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.downloadExcelReportButton.click()
    ]);

    await download.saveAs(targetFilePath);
  }

  async downloadExportAllUserData(targetFolderPath: string, fileName: string) {

    const folderPath = path.resolve(targetFolderPath);

    // Create folder if it doesn't exist
    fs.mkdirSync(folderPath, { recursive: true });

    // Remove all files inside the folder
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      fs.unlinkSync(fullPath);
    }
    console.log(`Cleared all files in: ${folderPath}`);

    // Wait for download after clicking export button
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.exportAllButton.click(),
    ]);

    const savePath = path.join(folderPath, fileName);
    await download.saveAs(savePath);

    console.log(`Downloaded new file: ${savePath}`);
  }

  async clickBulkDeleteConfirmButton() {
    await this.bulkDeleteConfirmButton.click();
  }

  async clickCloseBulkPopupButton() {
    await this.closeBulkPopupButton.click();
  }

  async clickResetAllFilter() {
    if (await this.resetAllFilterButton.isVisible() && await this.resetAdvanceButton.isEnabled()) {
      await this.resetAllFilterButton.clear();
    }
  }

  async selectFilterByRole(role: string) {
    await this.roleDropdown.click();
    await this.roleFilterDropdownEmployeeSearch.fill(role);
    await this.dropdownSearchOptionSelectLast.click();
  }

  async clickAdvanceFiltersButton() {
    await this.advanceFiltersButton.click();
  }

  async selectFilterBySBU(sbu: string) {
    await this.sbuDropdown.click();
    await this.sbuFilterDropdownSearchOption.fill(sbu);
    await this.dropdownSearchOptionSelectLast.click();
  }

  async selectFilterByManager(manager: string) {
    await this.managerDropdown.click();
    await this.managerFilterDropdownSearchOption.fill(manager);
    await this.dropdownSearchOptionSelectLast.click();
  }

  async selectFilterByResourceType(resourceType: string) {
    await this.resourceTypeDropdown.click();
    await this.resourceTypeFilterDropdownSearchOption.fill(resourceType);
    await this.dropdownSearchOptionSelectLast.click();
  }

  async selectFilterByExpertise(expertise: string) {
    await this.expertiseDropdown.click();
    await this.expertiseFilterDropdownSearchOption.fill(expertise);
    await this.dropdownSearchOptionSelectLast.click();
  }

  async clickApplyFilterButton() {
    await this.applyFilterButton.click();
  }

  async getSearchResultCount() {
    if (await this.searchResultCount.isVisible({ timeout: 5000 })) {
      let mainCount = await this.searchResultCount.textContent() ?? '';
      let replaceFirstPart = mainCount.replace(/Showing\s*\d+-\d+\s*of\s*(?=\d+)/i, "")
      let finalCount = replaceFirstPart.replace(/\s*users/i, "").trim();
      return parseInt(finalCount);
    }
    else {
      return await this.totalUserCountXpath.count();
    }
  }
}