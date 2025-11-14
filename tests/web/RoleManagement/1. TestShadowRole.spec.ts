import { expect, test } from "../../../lib/base.fixture";
import ENV from '../../../utils/env';
import fs from 'node:fs';
import path from 'node:path';
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
            await page.waitForTimeout(1000)
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
            await page.waitForTimeout(3000);
            expect.soft(await myProfilePage.isMyProfileSidebarVisible()).toBeTruthy();
            await myProfilePage.clickMyProfileSidebar();
        });

        await test.step('Ensure My Profile page is loaded.', async () => {
            // My Profile page section verification
            //close profile creation video 
            await myProfilePage.closeProfileVideo();
            expect.soft(await myProfilePage.isCvOptionDropdownVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isPreviewCvButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isExportButtonVisible()).toBeTruthy();
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

    test('Test Shadow SBU Role General >> My Team Section.', async ({ page, myTeamPage }) => {
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
            expect.soft(await myTeamPage.isTeamGraphViewVisible()).toBeTruthy();
        });

        test.step('Navigate to the Graph View section.', async () => {
            // Already authenticated via storageState in this describe
            //await page.waitForLoadState('networkidle');
            await myTeamPage.ClickTeamGraph();
            //verify team structure is visible
            expect.soft(await myTeamPage.isTeamStructureViewVisible()).toBeTruthy();

        });

    });

    test('Test Shadow SBU Role General >> Security Section.', async ({ page, securityPage }) => {
        await test.step('Navigate to the Security section.', async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            // Navigate to Security page
            await page.waitForTimeout(3000);
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

    test("Test Shadow SBU Role General >> Platform Feedback Section.", async ({ page, platformFeedbackPage }) => {
        await test.step('Navigate to the Platform Feedback section.', async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            // Navigate to Platform Feedback page
            await page.waitForTimeout(3000);
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

    test('Test Shadow SBU Role Database >> CV Dashboard Section.', async ({ page, cvDashboardPage }) => {
        await test.step('Navigate to the CV Dashboard section.', async () => {
            await page.waitForLoadState('networkidle');
            // Navigate to CV Dashboard page
            await page.waitForTimeout(3000);
            expect.soft(await cvDashboardPage.isCvDashboardSidebarvisible()).toBeTruthy();
            await cvDashboardPage.clickCvDashboardSidebar();
        })

        await test.step("Ensure progress stats are visible", async () => {
            await page.waitForTimeout(1000);
            expect.soft(await cvDashboardPage.isProfileStatsVisible()).toBeTruthy();
            //employee data can't be 0
            const activeEmployeesText = await cvDashboardPage.profieStatsData.textContent()
            const activeEmployeesCount = parseInt(activeEmployeesText?.trim() || '0', 10);
            expect(activeEmployeesCount).toBeGreaterThan(0);
            await page.waitForTimeout(1000);
            expect.soft(await cvDashboardPage.isOveralProgressStatsVisible()).toBeTruthy();
            //progress data can't be 0
            const overallProgressText = await cvDashboardPage.overallProgressData.textContent()
            const overallProgressCount = parseInt(overallProgressText?.trim() || '0', 10);
            // Assert that it is not 0
            expect(overallProgressCount).toBeGreaterThan(0);
            await page.waitForTimeout(1000);
            expect.soft(await cvDashboardPage.isHighAchieversStatsVisible()).toBeTruthy();
            //High Achievers data can't be 0
            const highAchieverText = await cvDashboardPage.highAchieversData.textContent()
            const highAchieverCount = parseInt(highAchieverText?.trim() || '0', 10);
            // Assert that it is not 0
            expect(highAchieverCount).toBeGreaterThan(0);
            await page.waitForTimeout(1000);
            expect.soft(await cvDashboardPage.isSteadyProgressStatsVisible()).toBeTruthy();
            //Steady Progress data can't be 0
            const steadyProgressText = await cvDashboardPage.steadyProgressData.textContent()
            const steadyProgressCount = parseInt(steadyProgressText?.trim() || '0', 10);
            // Assert that it is not 0
            expect(steadyProgressCount).toBeGreaterThan(0);

        })

        await test.step("Ensure that progress resource are visbile for shawdow sbu role", async () => {
            await page.waitForTimeout(1000);
            expect.soft(await cvDashboardPage.isBillableFieldvisible()).toBeTruthy()
            await page.waitForTimeout(1000);
            expect.soft(await cvDashboardPage.isContractualFieldVisible()).toBeTruthy()
            await page.waitForTimeout(1000);
            expect.soft(await cvDashboardPage.isSupportFieldVisible()).toBeTruthy()
        })

        await test.step("Ensure that progress resource are not visbile for shawdow sbu role ", async () => {
            expect.soft(await cvDashboardPage.isGasmFieldVisible()).toBeFalsy()
            expect.soft(await cvDashboardPage.isExitFieldVisible()).toBeFalsy()
        })

    })

    test("Test Shadow SBU Role Database >> CV Search Section.", async ({ page, cvSearchPage }) => {
        await test.step('Navigate to the CV Search section.', async () => {
            await page.waitForLoadState('networkidle');
            // Navigate to CV Search page
            await page.waitForTimeout(3000);
            expect.soft(await cvSearchPage.isCvSearchSidebarvisible()).toBeTruthy();
            await cvSearchPage.clickCvSearchSidebar();
        })
        await test.step("Ensure cv search page is loaded and the permission options are visible.", async () => {
            expect.soft(await cvSearchPage.isSearchBtnVisible()).toBeTruthy();
            expect.soft(await cvSearchPage.isBulkImportDataVisible()).toBeTruthy();
            expect.soft(await cvSearchPage.isBulkImportImageVisible()).toBeTruthy();
        })
    })

    test("Test Shadow SBU Role Database >> traininng and certificate Section.", async ({ page, trainingCertificatePage }) => {
        await test.step('Navigate to the traininng and certificate section.', async () => {
            await page.waitForLoadState('networkidle');
            // Navigate to CV Traininng and certificate page
            expect.soft(await trainingCertificatePage.isTrainningCertificateSiderVisible()).toBeTruthy();
            await trainingCertificatePage.ClickTrainningCertificateSidebar();
        })
        await test.step("Ensure traininng and certificate  page is loaded and required options are visible.", async () => {
            expect.soft(await trainingCertificatePage.isRefreshBtnVisible()).toBeTruthy();
            expect.soft(await trainingCertificatePage.isBulkuploadBtnVisible()).toBeTruthy();
        })

        await test.step("Ensure traininng and certificate  page is loaded and required options are not visible.", async () => {
            await page.waitForTimeout(2000);
            expect.soft(await trainingCertificatePage.isExportBtnVisible()).toBeFalsy();
        })

    })

    test("Test Shadow SBU Role Database >> CV Completion.", async ({ page, cvCompletionPage }) => {
        await test.step("Navigate to  CV Completion", async () => {
            // Navigate to CV Completion and certificate page
            await page.waitForTimeout(3000);
            expect.soft(await cvCompletionPage.isCvCompletionSidebarVisible()).toBeTruthy();
            await cvCompletionPage.clickCvCompletionSidebarr();
        })
        await test.step("Ensure cv completion is loaded and required options are visible", async () => {
            expect.soft(await cvCompletionPage.isSearchBoxVisible()).toBeTruthy();
            expect.soft(await cvCompletionPage.isResourcesFieldVisible()).toBeTruthy();
            expect.soft(await cvCompletionPage.isEditBtnVisible()).toBeTruthy()
        })

    });

    test("Test Shadow SBU Role Database >> CV Templates.", async ({ page, cvTemplatesPage, utility }) => {
        await test.step("Not able to navigate CV Templates", async () => {
            // Not able navigate to CV Templates and certificate page
            expect.soft(await cvTemplatesPage.isCvTemplatesSidebar()).toBeFalsy();
        })
        await test.step("Not able to access CV Templates page via url", async () => {
            const cvTemplate = await utility.readJsonFile('test_data/urlExpectedData.json') as { cvtemplates: string };
            const cvTemplatesRestrictedUrl = `${ENV.BASE_URL}${cvTemplate.cvtemplates}`;
            await page.goto(cvTemplatesRestrictedUrl);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify unauthorized text for Cv Templates page ", async () => {
            await cvTemplatesPage.verifyUnauthorizedText();
        })
    });

    test("Test Shadow SBU Role Database >> CV Settings.", async ({ page, cvsettingPage, utility }) => {
        await test.step("Not able to navigate CV Settings", async () => {
            // Not able navigate to CV Settings and certificate page
            await page.waitForTimeout(3000);
            expect.soft(await cvsettingPage.isCvSettingSideBarVisible()).toBeFalsy();
        })

        await test.step("Not able to access CV Settings page via url", async () => {
            const cvsettingsURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { cvsettings: string };
            const cvSettingsRestrictedUrl = `${ENV.BASE_URL}${cvsettingsURL.cvsettings}`;
            await page.goto(cvSettingsRestrictedUrl);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("erify unauthorized text for Cv Settings page ", async () => {
            expect.soft(await cvsettingPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test('Test Shadow Sbu Role Resource Calendar >> Resource Dashbroard', async ({ page, resourceDashboardPage }) => {
        await test.step("Navigate to the Resource Dashbroard ", async () => {
            // Already authenticated via storageState in this describe
            await page.waitForTimeout(3000)
            expect.soft(await resourceDashboardPage.isResourceDashbroadVisible()).toBeTruthy();
            await resourceDashboardPage.clickResourceDashboardSidebar();

        })
        await test.step('Verify Resource Dashboard >>overview >> sections items are visible for the Shadow SBU role.', async () => {
            // Navigate to overview section
            expect.soft(await resourceDashboardPage.isOverviewInfoTabvisible()).toBeTruthy();
            const totalBillableText = await resourceDashboardPage.totalBillableCardData.textContent();
            const totalBillableCount = parseInt(totalBillableText?.trim() || '0', 10);
            expect(totalBillableCount).toBeGreaterThan(0);

            expect.soft(await resourceDashboardPage.isTotalBillCardVisible()).toBeTruthy();
            await page.waitForTimeout(1000)
            expect.soft(await resourceDashboardPage.isTotalBillableCardVisible()).toBeTruthy();
            const totalBillableResourceText = await resourceDashboardPage.totalBilledResourceData.textContent();
            const totalBillableResourceCount = parseInt(totalBillableResourceText?.trim() || '0', 10);
            expect(totalBillableResourceCount).toBeGreaterThan(0);

            expect.soft(await resourceDashboardPage.isTotalActualBillCardVisible()).toBeTruthy();
            const actualBilledText = await resourceDashboardPage.totalActuallBillCardData.textContent()
            const actualBilledCount = parseInt(actualBilledText?.trim() || '0', 10);
            expect(actualBilledCount).toBeGreaterThan(0);


        });

        await test.step('Verify Resource Dashboard >>pivot analysis>> sections items are visible for the Shadow SBU role.', async () => {
            // Navigate pivot analysis section
            expect.soft(await resourceDashboardPage.isPivotAnalysisInfoTabvisible()).toBeTruthy();
            await resourceDashboardPage.ClickPivotAnalysisInfoTab();
            //pivot analysis section items verification
            expect.soft(await resourceDashboardPage.isSbuFieldVisible()).toBeTruthy();
            expect.soft(await resourceDashboardPage.isResourceFieldVisible()).toBeTruthy();
            expect.soft(await resourceDashboardPage.isBillFieldVisible()).toBeTruthy();
            expect.soft(await resourceDashboardPage.isExprtiseFieldVisible()).toBeTruthy();

        })
        await test.step('Verify Resource Dashboard >>Weekly score card >> sections items are visible for the Shadow SBU role.', async () => {
            expect.soft(await resourceDashboardPage.isWeeklyScorecardVisible()).toBeTruthy();
            await resourceDashboardPage.ClickWeeklyScoreCardInfoTab()
            await resourceDashboardPage.ClickWeeklyCardFiltersdropwon();
            //weekly score card section items verification
            expect.soft(await resourceDashboardPage.isStartDateFieldVisible()).toBeTruthy();
            expect.soft(await resourceDashboardPage.isEndDateFieldVisible()).toBeTruthy();
            expect.soft(await resourceDashboardPage.isClearField()).toBeTruthy();
            expect.soft(await resourceDashboardPage.isCalculateField()).toBeTruthy();
        })

        await test.step('Verify Resource Dashboard >>Billing type >> sections items are visible for the Shadow SBU role.', async () => {
            expect.soft(await resourceDashboardPage.isClickBillTypeChangesInfoTabvisible()).toBeTruthy();
            await resourceDashboardPage.ClickBillTypeChangesInfoTab();
            await resourceDashboardPage.ClickBillTypeChangesdropwon();
             expect.soft(await resourceDashboardPage.isDataFieldVisible()).toBeTruthy();
             expect.soft(await resourceDashboardPage.isBillTypeChangesInfoTabVisible()).toBeTruthy();
             expect.soft(await resourceDashboardPage.isDateFieldVisible()).toBeTruthy();
             expect.soft(await resourceDashboardPage.isFromBillTypesFieldVisible()).toBeTruthy();
             expect.soft(await resourceDashboardPage.isBillSbuFieldVisible()).toBeTruthy();
             expect.soft(await resourceDashboardPage.isExportFieldVisible()).toBeTruthy(); 
        })

        await test.step('Verify Resource Dashboard >>SBU change  >> sections items are visible for the Shadow SBU role.', async () => {
            expect.soft(await resourceDashboardPage.isSbuchangesInfoTabVisible()).toBeTruthy();
            await resourceDashboardPage.ClickSbuchangesInfoTab();
            await resourceDashboardPage.Clicksbuchangedropdown();
             expect.soft(await resourceDashboardPage.issbuDateFieldVisible()).toBeTruthy();
             expect.soft( await resourceDashboardPage.isfromSbuFieldVisible()).toBeTruthy();
             expect.soft(await resourceDashboardPage.istoSbuFieldVisible()).toBeTruthy();
             expect.soft( await resourceDashboardPage.isprofileSbuVisible()).toBeTruthy();
             expect.soft(await resourceDashboardPage.isSbuChangeExportField()).toBeTruthy();
        })
    });

    test('Test Shadow Sbu Role Resource Calendar >> planningPage ', async ({ page, planningpage }) => {
        await test.step("Navigate to the planningPage ", async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            expect.soft(await planningpage.isClickplanningPageSidebarVisible()).toBeTruthy();
            await planningpage.ClickplanningPageSidebar();
        })
        await test.step("Ensure that required options are visible.", async () => {
            expect.soft(await planningpage.isUpdateBtnVisible()).toBeTruthy();
        })
        await test.step("Ensure that options are not visible.", async () => {
            await page.waitForTimeout(1000);
            expect.soft(await planningpage.isExportBtnVisible()).toBeFalsy();
            await page.waitForTimeout(1000);
            expect.soft(await planningpage.isTextFieldBtnVisible()).toBeFalsy();
        })
    })

    test('Test Shadow Sbu Role Resource Calendar >> Calendar view ', async ({ page, calendarViewPage }) => {
        await test.step("Navigate to the calendar view", async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            expect.soft(await calendarViewPage.isCalendarViewSidebarVisible()).toBeTruthy();
            await page.waitForTimeout(1000)
            await calendarViewPage.ClickCalendarViewSidebar();
        })
        await test.step("Ensure that required options are visible.", async () => {
            expect.soft(await calendarViewPage.isSearchEmplyeeFieldVisible()).toBeTruthy();
            expect.soft(await calendarViewPage.isFilterBySbuFieldVisible()).toBeTruthy();
            expect.soft(await calendarViewPage.isFilterByManagerFieldVisible()).toBeTruthy();
        })
    })

    test("Test Shadow SBU Role Resource Calendar>> Resource Settings.", async ({ resourceSettingPage, page, utility }) => {
        await test.step("Not able to navigate CV Settings", async () => {
            expect.soft(await resourceSettingPage.isResourceSettingSideBarVisible()).toBeFalsy();
        })
        await test.step("Not able to access Resource Setting via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { resourcesettingspage: string };
            const resourceSettingRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.resourcesettingspage}`;
            await page.goto(resourceSettingRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for Resource Setting ", async () => {
            expect.soft(await resourceSettingPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Shadow SBU Role Resource Calendar>> HR LeaderBoard.", async ({ utility, page, hrleaderbroadPage }) => {
        await test.step("Not able to navigate HR Leaderboard", async () => {
            expect.soft(await hrleaderbroadPage.isHrLeaderboardideBarVisible()).toBeFalsy();
        })
        await test.step("Not able to access RHr Leaderboard via url", async () => {
            const hrleaderbroadURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { hrleaderboard: string };
            const hrLeaderbroadRestrictedURL = `${ENV.BASE_URL}${hrleaderbroadURL.hrleaderboard}`;
            await page.goto(hrLeaderbroadRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify unauthorized Text for Hr Leaderboard ", async () => {
            expect.soft(await hrleaderbroadPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Shadow SBU Role Non Billed Management>>Non-Billed Dashboard", async ({ utility, page, nonBilledDashboardPage }) => {
        await test.step("Not able to navigate Non-Billed Dashboard", async () => {
            expect.soft(await nonBilledDashboardPage.isNonBilledDashboradSideBarVisible()).toBeFalsy();
        })
        await test.step("Not able to access Non-Billed Dashboard via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { nonbilledpage: string };
            const nonBilledDashboardRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.nonbilledpage}`;
            await page.goto(nonBilledDashboardRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for Non-Billed Dashboard", async () => {
            expect.soft(await nonBilledDashboardPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test('Test Shadow Sbu Role Non Billed Management >> Non Billed Report', async ({ page, nonBilledReportPage }) => {
        await test.step("Navigate to the non billed report page ", async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);
            expect.soft(await nonBilledReportPage.isNonBilledReportsidebarVisible()).toBeTruthy();
            await page.waitForTimeout(1000)
            await nonBilledReportPage.ClickNonBilledReportsidebar();
        })
        await test.step("Ensure that required options are visible.", async () => {
            expect.soft(await nonBilledReportPage.isSearchFieldVisible()).toBeTruthy();
            expect.soft(await nonBilledReportPage.isSbuFieldVisible()).toBeTruthy();
            expect.soft(await nonBilledReportPage.isExpertiseFieldVisible()).toBeTruthy();
            expect.soft(await nonBilledReportPage.isBillTypeFieldVisible()).toBeTruthy();
        })
        await test.step("Ensure that options are not visible.", async () => {
            await page.waitForTimeout(1000);
            expect.soft(await nonBilledReportPage.isSyncnowButtonVisible()).toBeFalsy();
            await page.waitForTimeout(1000);
            expect.soft(await nonBilledReportPage.isExportbuttonVisible()).toBeFalsy();
        })
    })

    test("Test Shadow SBU Role Non Billed Management>>Non-Billed Setting", async ({ utility, page, nonBilledSettingPage }) => {
        await test.step("Not able to navigate Non-Billed Setting", async () => {
            expect.soft(await nonBilledSettingPage.isNonBilledSettingsSidebarVisible()).toBeFalsy();
        })
        await test.step("Not able to access Non-Billed Setting via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { nonbilledsettingpage: string };
            const nonBilledSettingRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.nonbilledsettingpage}`;
            await page.goto(nonBilledSettingRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for Non-Billed Setting ", async () => {
            expect.soft(await nonBilledSettingPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Shadow SBU Role Admin Configuration >>User Management", async ({ utility, page, userManagementPage }) => {
        await test.step("Not able to navigate User Management", async () => {
            expect.soft(await userManagementPage.isUserManagementVisible()).toBeFalsy();
        })
        await test.step("Not able to access User Management via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { usermanagementpage: string };
            const userManagementRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.usermanagementpage}`;
            await page.goto(userManagementRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for User Management  ", async () => {
            expect.soft(await userManagementPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })
    test("Test Shadow SBU Role Admin Configuration >>Project", async ({ utility, page, projectPage }) => {
        await test.step("Not able to navigate Project", async () => {
            expect.soft(await projectPage.isProjectVisible()).toBeFalsy();
        })

        await test.step("Not able to access project page  via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { usermanagementpage: string };
            const projectRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.usermanagementpage}`;
            await page.goto(projectRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for project page   ", async () => {
            expect.soft(await projectPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Shadow SBU Role Admin Configuration >>System setting", async ({ utility, page, systemsettingPage }) => {
        await test.step("Not able to navigate System setting page", async () => {
            expect.soft(await systemsettingPage.isSystemSettingVisible()).toBeFalsy();
        })
        await test.step("Not able to access System setting page  via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { systemsettingpage: string };
            const systemSettingRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.systemsettingpage}`;
            await page.goto(systemSettingRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for System setting  page   ", async () => {
            expect.soft(await systemsettingPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Shadow SBU Role Admin Configuration >>Role Management", async ({ utility, page, roleManagementPage }) => {
        await test.step("Not able to navigate Role Management page", async () => {
            expect.soft(await roleManagementPage.isRoleManagementVisible()).toBeFalsy();
        })
        await test.step("Not able to access Role Management page  via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { rolemanagementpage: string };
            const roleManagementRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.rolemanagementpage}`;
            await page.goto(roleManagementRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for Role Management page   ", async () => {
            expect.soft(await roleManagementPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Shadow SBU Role Admin Configuration >>Module Management", async ({ utility, page, moduleManagementPage }) => {
        await test.step("Not able to navigate Module Management page", async () => {
            expect.soft(await moduleManagementPage.isModuleManagementVisible()).toBeFalsy();
        })
        await test.step("Not able to access Role Management page  via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { modulemanagementpage: string };
            const moduleManagementRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.modulemanagementpage}`;
            await page.goto(moduleManagementRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for Role Management page   ", async () => {
            expect.soft(await moduleManagementPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })
    test("Test Shadow SBU Role Audit >>Dashboard", async ({ utility, page, adminDashboardPage }) => {
        await test.step("Not able to navigate Dashboard page", async () => {
            expect.soft(await adminDashboardPage.isDashboardVisible()).toBeFalsy();
        })
        await test.step("Not able to access Aduit Dashboard page  via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { dashboardpage: string };
            const dashboardRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.dashboardpage}`;
            await page.goto(dashboardRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for  Dashboard page   ", async () => {
            expect.soft(await adminDashboardPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Shadow SBU Role Audit >>Flagged Events", async ({ utility, page, eventflagPage }) => {
        await test.step("Not able to navigate Flagged Events page", async () => {
            expect.soft(await eventflagPage.isEventFlagVisible()).toBeFalsy();
        })

        await test.step("Not able to access Aduit Event Flag page  via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { flageventpage: string };
            const eventFlagRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.flageventpage}`;
            await page.goto(eventFlagRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for  Event Flag page ", async () => {
            expect.soft(await eventflagPage.verifyUnauthorizedText()).toBeTruthy();
        })

    })
    
    test("Test Shadow SBU Role Audit >> Profile Image",async({utility, page,profilePage})=>{
        await test.step("Not able to navigate Event Flag page", async () => {
            expect.soft(await profilePage.isProfileImageSidebarVisible()).toBeFalsy();
        })
 
        await test.step("Not able to access Aduit Profile Image page  via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { profileimagepage: string };
            const profileImageRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.profileimagepage}`;
            console.log(profileImageRestrictedURL)
            await page.goto(profileImageRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);

        })
        await test.step("verify Error Text for profile image page ", async () => {
            expect.soft(await profilePage.verifyUnauthorizedText()).toBeTruthy();
        })
 
    })
    test("Test Manager Role Sign out >> Sign out", async ({ signoutPage, page }) => {
        await test.step("Navigate to CV Completion", async () => {
            await page.waitForTimeout(3000);
            // Check if Sign out button is visible
            expect.soft(await signoutPage.isSignoutVisible()).toBeTruthy();
            // Click on Sign out
            await signoutPage.clickSignOut();
        });
    });

});