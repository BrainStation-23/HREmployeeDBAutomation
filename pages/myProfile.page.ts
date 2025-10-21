import { Locator, Page } from "@playwright/test";
import { time } from "console";


export default class MyProfilePage {

    //#region Locators
    readonly page: Page;
    readonly myProfileHeader: Locator;
    readonly myProfileSidebar: Locator;
    readonly generalInfoSection: Locator;
    readonly cvOptionDropdown: Locator;
    readonly previewCvButton: Locator;
    readonly exportPdfButton: Locator;
    readonly importButton: Locator;
    readonly auditLogButton: Locator;
    readonly auditLogModal: Locator;
    readonly closeButton: Locator;
    readonly uploadImageButton: Locator;
    readonly imageSection: Locator;
    readonly fullNameInput: Locator;
    readonly professionalBioInput: Locator;
    readonly skillsSection: Locator;
    readonly professionalSkillsAddSection: Locator;
    readonly technicalSkillsAddSection: Locator;
    readonly experienceSection: Locator;
    readonly addExperienceButton: Locator;
    readonly experienceSectionItem: Locator;
    readonly educationTab: Locator;
    readonly addEducationButton: Locator;
    readonly trainingTab: Locator;
    readonly addTrainingButton: Locator;
    readonly achievementsTab: Locator;
    readonly projectsTab: Locator;
    readonly educationListItem: Locator;
    readonly trainingListItem: Locator;
    readonly addAchievementButton: Locator;
    readonly achievementListItem: Locator;
    readonly projectListItem: Locator;
    readonly addProjectButton: Locator;
    readonly searchProjectInput: Locator;
    //#endregion
    

    constructor(page: Page) {
        this.page = page;
        this.myProfileHeader = page.getByRole('main').getByRole('heading', { name: 'My Profile' });
        this.myProfileSidebar = page.getByRole('navigation').getByRole('link', { name: 'My Profile' });
        this.generalInfoSection = page.getByRole('tab', { name: 'General' });
        this.cvOptionDropdown = page.getByText('Sidebar - Full (Default)');
        this.previewCvButton = page.getByRole('button', { name: 'Preview CV' });
        this.exportPdfButton = page.getByRole('button', { name: 'Export PDF' });
        this.importButton = page.getByText('Import');
        this.auditLogButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(2);
        this.auditLogModal = page.getByRole('dialog', { name: 'CV Data Audit Log' });
        this.closeButton = page.getByRole('button', { name: 'Close' });
        this.uploadImageButton = page.getByRole('button', { name: 'Upload Image' });
        //this.imageSection = page.locator("(//div[@data-component-file='ProfileImagePreview.tsx'])[3]");  //NC
        this.imageSection = page.locator("//div[@class='flex flex-col items-center space-y-6']");//C
        this.fullNameInput = page.getByRole('textbox', { name: 'Full Name' });
        this.professionalBioInput = page.getByRole('textbox', { name: 'Professional Biography' });
        this.skillsSection = page.getByRole('tab', { name: 'Skills' });
        this.professionalSkillsAddSection = page.getByText('Professional SkillsAdd');
        this.technicalSkillsAddSection = page.getByText('Technical SkillsAdd Technical');
        this.experienceSection = page.getByRole('tab', { name: 'Experience' });
        this.addExperienceButton = page.getByRole('button', { name: 'Add Experience' });
        //this.experienceSectionItem = page.locator("(//div[@data-component-file='ExperienceGroupedTab.tsx'])[1]");
        this.experienceSectionItem = page.locator("//span[normalize-space()='Experience']");
        this.educationTab = page.getByRole('tab', { name: 'Education' });
        this.addEducationButton = page.getByRole('button', { name: 'Add Education' });
        this.trainingTab = page.getByRole('tab', { name: 'Training' });
        this.achievementsTab = page.getByRole('tab', { name: 'Achievements' });
        this.projectsTab = page.getByRole('tab', { name: 'Projects' });
        this.educationListItem = page.locator("(//div[@data-component-file='EducationTab.tsx'])[1]");
        this.addTrainingButton = page.getByRole('button', { name: 'Add Training' });
        this.trainingListItem = page.locator("div[data-state='active']");
        this.addAchievementButton = page.getByRole('button', { name: 'Add Achievement' });
        this.achievementListItem = page.locator("//div[@class='space-y-4']");
        this.searchProjectInput = page.getByRole('textbox', { name: 'Search projects...' });
        this.addProjectButton = page.getByRole('button', { name: 'Add Project' });
        this.projectListItem = page.locator("//div[@class='space-y-4']//parent::div[@class='p-6 pt-0']");
    }
    //#endregion

    //#region My Profile Page Common Sections
    async isMyProfileSidebarVisible() {
        return await this.myProfileSidebar.isVisible();
    }

    async clickMyProfileSidebar() {
        await this.myProfileSidebar.click();
        
    }

    async isGeneralInfoSectionVisible() {
        await this.generalInfoSection.waitFor({ state: 'visible', timeout: 15000 });
        return await this.generalInfoSection.isVisible();
    }

    async clickGeneralInfoSection() {
        await this.generalInfoSection.waitFor({ state: 'visible', timeout: 15000 });
        await this.generalInfoSection.click();
    }

    async isCvOptionDropdownVisible() {
        await this.cvOptionDropdown.waitFor({ state: 'visible', timeout: 15000 });
        return await this.cvOptionDropdown.isVisible({ timeout: 5000 });
    }

    async isPreviewCvButtonVisible() {
        return await this.previewCvButton.isVisible({ timeout: 5000 });
    }

    async isExportPdfButtonVisible() {
        return await this.exportPdfButton.isVisible({ timeout: 5000 });
    }

    async isImportButtonVisible() {
        return await this.importButton.isVisible({ timeout: 5000 });
    }
    async isAuditLogButtonVisible() {
        return await this.auditLogButton.isVisible({ timeout: 5000 });
    }

    async clickAuditLogButton() {
        await this.auditLogButton.click();
    }

    async isAuditLogModalVisible() {
        return await this.auditLogModal.isVisible({ timeout: 5000 });
    }

    async clickCloseButton() {
        await this.closeButton.click({ timeout: 5000 });
    }
    //#endregion

    //#region General Section Items
    async isUploadImageButtonVisible() {
        return await this.uploadImageButton.isVisible({ timeout: 5000 });
    }

    async isImageSectionVisible() {
        return await this.imageSection.isVisible({ timeout: 5000 });
    }

    async isFullNameInputVisible() {
        return await this.fullNameInput.isVisible({ timeout: 5000 });
    }

    async isProfessionalBioInputVisible() {
        return await this.professionalBioInput.isVisible({ timeout: 5000 });
    }
    //#endregion

    //#region Skills Section Items
    async isSkillsSectionVisible() {
        return await this.skillsSection.isVisible({ timeout: 5000 });
    }
    async clickSkillsSection() {
        await this.skillsSection.click();
    }
    async isProfessionalSkillsAddSectionVisible() {
        await this.professionalSkillsAddSection.waitFor({ state: 'visible', timeout: 15000 });
        return await this.professionalSkillsAddSection.isVisible({ timeout: 5000 });
    }
    async isTechnicalSkillsAddSectionVisible() {
        return await this.technicalSkillsAddSection.isVisible({ timeout: 5000 });
    }
    //#endregion

    //#region Experience Section Items
    async isExperienceSectionVisible() {
        await this.experienceSection.waitFor({ state: 'visible', timeout: 15000 });
        return await this.experienceSection.isVisible({ timeout: 5000 });
    }
    async clickExperienceSection() {
        await this.experienceSection.click();
    }
    async isAddExperienceButtonVisible() {
        await this.addExperienceButton.waitFor({ state: 'visible', timeout: 15000 });
        return await this.addExperienceButton.isVisible({ timeout: 5000 });
    }

    async isExperienceSectionItemVisible() {
        await this.experienceSectionItem.waitFor({ state: 'visible', timeout: 15000 });
        return await this.experienceSectionItem.isVisible({ timeout: 5000 });
    }
    //#endregion

    //#region Education Section Items
    async isEducationTabVisible() {
        await this.educationTab.waitFor({ state: 'visible', timeout: 15000 });
        return await this.educationTab.isVisible({ timeout: 5000 });
    }
    async clickEducationTab() {
        await this.educationTab.click();
    }
    async isAddEducationButtonVisible() {
        await this.addEducationButton.waitFor({ state: 'visible', timeout: 15000 });
        return await this.addEducationButton.isVisible({ timeout: 5000 });
    }
    async isEducationListItemVisible() {
        await this.educationListItem.waitFor({ state: 'visible', timeout: 15000 });
        return await this.educationListItem.isVisible({ timeout: 5000 });
    }
    //#endregion

    //#region Training Section Items
    async isTrainingTabVisible() {
        await this.trainingTab.waitFor({ state: 'visible', timeout: 15000 });
        return await this.trainingTab.isVisible({ timeout: 5000 });
    }
    async clickTrainingTab() {
        await this.trainingTab.click();
    }
    async isAddTrainingButtonVisible() {
        await this.addTrainingButton.waitFor({ state: 'visible', timeout: 15000 });
        return await this.addTrainingButton.isVisible({ timeout: 5000 });
    }
    async isTrainingListItemVisible() {
        return await this.trainingListItem.isVisible({ timeout: 5000 });
    }
    //#endregion

    //#region Achievements Section Items
    async isAchievementsTabVisible() {
        await this.achievementsTab.waitFor({ state: 'visible', timeout: 15000 });
        return await this.achievementsTab.isVisible({ timeout: 5000 });
    }
    async clickAchievementsTab() {
        await this.achievementsTab.click();
    }
    async isAddAchievementButtonVisible() {
        await this.addAchievementButton.waitFor({ state: 'visible', timeout: 15000 });
        return await this.addAchievementButton.isVisible({ timeout: 5000 });
    }
    async isAchievementListItemVisible() {
        return await this.achievementListItem.isVisible({ timeout: 5000 });
    }
    //#endregion

    //#region Projects Section Items
    async isProjectsTabVisible() {
        await this.projectsTab.waitFor({ state: 'visible', timeout: 15000 });
        return await this.projectsTab.isVisible({ timeout: 5000 });
    }
    async clickProjectsTab() {
        await this.projectsTab.click();
    }
    async isProjectSearchInputVisible() {
        await this.searchProjectInput.waitFor({ state: 'visible', timeout: 15000 });
        return await this.searchProjectInput.isVisible({ timeout: 5000 });
    }
    async isAddProjectButtonVisible() {
        await this.addProjectButton.waitFor({ state: 'visible', timeout: 15000 });
        return await this.addProjectButton.isVisible({ timeout: 5000 });
    } 
    async isProjectListItemVisible() {
        return await this.projectListItem.isVisible({ timeout: 5000 });
    }
    //#endregion

}