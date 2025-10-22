import { Page, Locator } from "@playwright/test";

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

  async fillTheSearchInput(email:string){
    await this.userSearchInput.fill(email);
  }

  async clickSearchButton(){
    await this.userSearchButton.click();
  }

  async expandUserInfo(email: string){
    const xpath:string = `//div[text()='${email}']/../../../preceding-sibling::button`
    //div[text()='test.automation.user1@brainstation-23.com']/../../../preceding-sibling::button
    await this.page.locator(xpath).click();
  }

  async getUserName(email: string){
    const xpath = `//div[text()='${email}']/preceding-sibling::div`;
    return await this.page.locator(xpath).textContent();
    //div[text()='test.automation.user1@brainstation-23.com']/preceding-sibling::div
  }

  async getUserEmployeeID(email: string){
    const xpath = `//div[text()='${email}']/parent::div/following::div[1]`;
    return await this.page.locator(xpath).textContent();
    //div[text()='test.automation.user1@brainstation-23.com']/parent::div/following::div[1]
  }

  async getUserRole(email: string){
    const xpath = `//div[text()='${email}']/parent::div/following::div[2]`;
    return await this.page.locator(xpath).textContent();
  }

  async getUserSBU(email:string){
    const xpath = `//div[text()='${email}']/parent::div/following::div[3]`;
    return await this.page.locator(xpath).textContent();
  }

  async clickUSerRestPasswordButton(email: string){
    const xpath = `//div[text()='${email}']/parent::div/following::button[text()='Reset Password']`;
    await this.page.locator(xpath).click();
    //div[text()='test.automation.user1@brainstation-23.com']/parent::div/following::button[text()='Reset Password']
  }

  async clickUserEditButton(email:string){
    const xpath = `//div[text()='${email}']/parent::div/following::button[text()='Reset Password']/following-sibling::button[1]`;
    await this.page.locator(xpath).click();
    //div[text()='test.automation.user1@brainstation-23.com']/parent::div/following::button[text()='Reset Password']/following-sibling::button[1]
  }

  async clickUserDeleteButton(email:string){
    const xpath = `//div[text()='${email}']/parent::div/following::button[text()='Reset Password']/following-sibling::button[2]`;
    await this.page.locator(xpath).click();
    //div[text()='test.automation.user1@brainstation-23.com']/parent::div/following::button[text()='Reset Password']/following-sibling::button[2]
  }

  async clickConfirmDeleteButton(){
    await this.confirmDeleteButton.click();
  }

  async getUserExpertiseInfo(){
    return await this.expertiseInfo.textContent();
  }

  async getResourceTypeInfo(){
    return await this.resourceTypeInfo.textContent();
  }

  async isNoUserFound(){
    return await this.noUserFound.isVisible({timeout: 5000});
  }

  //User has been deleted successfully.

}