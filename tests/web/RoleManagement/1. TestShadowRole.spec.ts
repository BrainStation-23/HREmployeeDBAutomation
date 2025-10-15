import { expect, test } from "../../../lib/base.fixture";
import ENV from '../../../utils/env';
import fs from 'fs';
import path from 'path';
import LoginPage from '../../../pages/login.page';

test.describe('Role Management - Test Shadow SBU Role.', () => {

    const loginEmail = ENV.TEST_SHADOW_SBU_EMAIL as string;
    const loginPassword = ENV.TEST_SHADOW_SBU_PASSWORD as string;

    // Prepare and apply Playwright authentication storage for all tests in this describe
    const authDir = path.resolve('playwright/.auth');
    const envName = (ENV.ENVIRONMENT_NAME || 'default').toLowerCase();
    const storageStatePath = path.join(authDir, `shadow-sbu.${envName}.json`);

    //#region Login Authentication Storage Setup
    test.use({ storageState: storageStatePath });

    test.beforeAll(async ({ browser }) => {
        if (!fs.existsSync(authDir)) {
            fs.mkdirSync(authDir, { recursive: true });
        }
        if (fs.existsSync(storageStatePath)) return;

        const context = await browser.newContext({ storageState: undefined });
        const page = await context.newPage();
        const login = new LoginPage(page);
        await login.navigateToLoginPage();
        await login.loginToCvSite(loginEmail, loginPassword);
        // Ensure post-login is fully settled before persisting storage
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');
        // Optional: if expected profile name is available in env, wait until it appears somewhere on the page
        try {
            if ((ENV as any).TEST_SHADOW_SBU_NAME) {
                await page.getByText((ENV as any).TEST_SHADOW_SBU_NAME as string, { exact: false }).first().waitFor({ state: 'visible', timeout: 5000 });
            }
        } catch { /* ignore if not found; storage will still be saved */ }
        await context.storageState({ path: storageStatePath });
        await context.close();
    });
    //#endregion

    test('Test Shadow SBU Role General >> Dashboard Section.', async ({ dashboardPage, page, utility }) => {
        const dashboardTestData = await utility.readJsonFile('test_data/dashboardExpectedData.json') as { HeaderText: string };
        
        // Already authenticated via storageState in this describe
        await test.step('Ensure dashboard is loaded.', async () => {
            await page.waitForLoadState('networkidle');
        });

        await test.step('Verify Dashboard page sections for Shadow SBU role.', async () => {
            // Dashboard page section user name verification
            const profileName = (await dashboardPage.getUserProfileNameText()) ?? '';
            expect.soft(profileName.trim()).toContain(ENV.TEST_SHADOW_SBU_NAME as string);

            // Dashboard page section verification
            expect.soft(await dashboardPage.getDashboardHeaderText()).toBe(dashboardTestData.HeaderText);
            expect.soft(await dashboardPage.isDashboardAreaVisible()).toBeTruthy();
        });
    });

    test('Test Shadow SBU Role General >> My Profile Section.', async ({ page, myProfilePage }) => {
        
        await test.step('Navigate to the My profile section.', async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            // Navigate to My Profile page
            expect.soft(await myProfilePage.isMyProfileSidebarVisible()).toBeTruthy();
            await myProfilePage.clickMyProfileSidebar();
        });

        await test.step('Ensure My Profile page is loaded.', async () => {
            // My Profile page section verification
            expect.soft(await myProfilePage.isCvOptionDropdownVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isPreviewCvButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isPreviewCvButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isImportButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isAuditLogButtonVisible()).toBeTruthy();
            await myProfilePage.clickAuditLogButton();
            expect.soft(await myProfilePage.isAuditLogModalVisible()).toBeTruthy();
            await myProfilePage.clickCloseButton();
        });

        await test.step('Verify My Profile>>General sections items are visible for the Shadow SBU role.', async () => {
            // Navigate to General section
            expect.soft(await myProfilePage.isGeneralInfoSectionVisible()).toBeTruthy();
            await myProfilePage.clickGeneralInfoSection();
            // General section items verification
            expect.soft(await myProfilePage.isUploadImageButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isImageSectionVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isProfessionalBioInputVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isFullNameInputVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Skills sections items are visible for the Shadow SBU role.', async () => {
            // Navigate to Skills section
            expect.soft(await myProfilePage.isSkillsSectionVisible()).toBeTruthy();
            await myProfilePage.clickSkillsSection();
            // Skills section items verification
            expect.soft(await myProfilePage.isProfessionalSkillsAddSectionVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isTechnicalSkillsAddSectionVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Experience sections items are visible for the Shadow SBU role.', async () => {
            // Navigate to Experience section
            expect.soft(await myProfilePage.isExperienceSectionVisible()).toBeTruthy();
            await myProfilePage.clickExperienceSection();
            // Experience section items verification
            expect.soft(await myProfilePage.isAddExperienceButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isExperienceSectionItemVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Education sections items are visible for the Shadow SBU role.', async () => {
            // Navigate to Education section
            expect.soft(await myProfilePage.isEducationTabVisible()).toBeTruthy();
            await myProfilePage.clickEducationTab();
            // Education section items verification
            expect.soft(await myProfilePage.isAddEducationButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isEducationListItemVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Training sections items are visible for the Shadow SBU role.', async () => {
            // Navigate to Training section
            expect.soft(await myProfilePage.isTrainingTabVisible()).toBeTruthy();
            await myProfilePage.clickTrainingTab();
            // Training section items verification
            expect.soft(await myProfilePage.isAddTrainingButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isTrainingListItemVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Achievements sections items are visible for the Shadow SBU role.', async () => {
            // Navigate to Achievements section
            expect.soft(await myProfilePage.isAchievementsTabVisible()).toBeTruthy();
            await myProfilePage.clickAchievementsTab();
            // Achievements section items verification
            expect.soft(await myProfilePage.isAddAchievementButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isAchievementListItemVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Projects sections items are visible for the Shadow SBU role.', async () => {
            // Navigate to Projects section
            expect.soft(await myProfilePage.isProjectsTabVisible()).toBeTruthy();
            await myProfilePage.clickProjectsTab();
            // Projects section items verification
            // No Add Project button for Shadow SBU role
            expect.soft(await myProfilePage.isProjectSearchInputVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isProjectListItemVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isAddProjectButtonVisible()).toBeTruthy();
        });
            
    });

    test('Test Shadow SBU Role General >> My Team Section.', async ({page, myTeamPage}) => {
        test.step('Navigate to the My Team section.', async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            // Navigate to My Team page
            expect.soft(await myTeamPage.isMyTeamSidebarVisible()).toBeTruthy();
            await myTeamPage.clickMyTeamSidebar();
        });

        await test.step('Ensure My Team page is loaded.', async () => {
            // My Team page section verification
            expect.soft(await myTeamPage.isManagerLabelVisible()).toBeTruthy();
            expect.soft(await myTeamPage.isPeersLabelVisible()).toBeTruthy();
            expect.soft(await myTeamPage.isDirectReportsLabelVisible()).toBeTruthy();
            expect.soft(await myTeamPage.isTeamStructureFlowVisible()).toBeTruthy();
        });
    });

    test('Test Shadow SBU Role General >> Security Section.', async ({page, securityPage}) => {
        await test.step('Navigate to the Security section.', async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            // Navigate to Security page
            expect.soft(await securityPage.isSecuritySidebarVisible()).toBeTruthy();
            await securityPage.clickSecuritySidebar();
        });
        await test.step('Ensure Security page is loaded and the permission options are visible.', async () => {
            // Security page section verification
            expect.soft(await securityPage.isCurrentPasswordInputVisible()).toBeTruthy();
            expect.soft(await securityPage.isNewPasswordInputVisible()).toBeTruthy();
            expect.soft(await securityPage.isConfirmNewPasswordInputVisible()).toBeTruthy();
            expect.soft(await securityPage.isUpdatePasswordButtonVisible()).toBeTruthy();
        });
    });

    test("Test Shadow SBU Role General >> Platform Feedback Section.", async ({page, platformFeedbackPage}) => {
        await test.step('Navigate to the Platform Feedback section.', async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            // Navigate to Platform Feedback page
            expect.soft(await platformFeedbackPage.isPlatformFeedbackSidebarVisible()).toBeTruthy();
            await platformFeedbackPage.clickPlatformFeedbackSidebar();
        });

        await test.step('Ensure Platform Feedback page is loaded and the permission options are visible.', async () => {
            // Platform Feedback page section verification
            expect.soft(await platformFeedbackPage.isReportBugButtonVisible()).toBeTruthy();
            expect.soft(await platformFeedbackPage.isRequestFeatureButtonVisible()).toBeTruthy();
            expect.soft(await platformFeedbackPage.isViewAllFeedbackButtonVisible()).toBeTruthy();
        });
    });
});