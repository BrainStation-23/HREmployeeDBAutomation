import { expect, test } from "../../../lib/base.fixture";
import ENV from '../../../utils/env';
import fs from 'fs';
import path from 'path';
import LoginPage from '../../../pages/login.page';

test.describe('Role Management - Test Employee Role.', () => {

    const loginEmail = ENV.TEST_EMPLOYEE_EMAIL as string;
    const loginPassword = ENV.TEST_EMPLOYEE_PASSWORD as string;

    // Prepare and apply Playwright authentication storage for all tests in this describe
    const authDir = path.resolve('playwright/.auth');
    const envName = (ENV.ENVIRONMENT_NAME || 'default').toLowerCase();
    const storageStatePath = path.join(authDir, `employee.${envName}.json`);

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
            if ((ENV as any).TEST_EMPLOYEE_NAME) {
                await page.getByText((ENV as any).TEST_EMPLOYEE_NAME as string, { exact: false }).first().waitFor({ state: 'visible', timeout: 5000 });
            }
        } catch { /* ignore if not found; storage will still be saved */ }
        await context.storageState({ path: storageStatePath });
        await context.close();
    });

    test('Test Employee Role General >> Dashboard Section.', async ({ dashboardPage, page, utility }) => {
        const dashboardTestData = await utility.readJsonFile('test_data/dashboardExpectedData.json') as { HeaderText: string };

        // Already authenticated via storageState in this describe
        await test.step('Ensure dashboard is loaded.', async () => {
            await page.waitForLoadState('networkidle');
        });

        await test.step('Verify Dashboard page sections for Employee role.', async () => {
            // Dashboard page section user name verification
            const profileName = (await dashboardPage.getUserProfileNameText()) ?? '';
            expect.soft(profileName.trim()).toContain(ENV.TEST_EMPLOYEE_NAME as string);

            // Dashboard page section verification
            expect.soft(await dashboardPage.getDashboardHeaderText()).toBe(dashboardTestData.HeaderText);
            expect.soft(await dashboardPage.isDashboardAreaVisible()).toBeTruthy();
        });
    });

    test('Test Employee Role General >> My Profile Section.', async ({ page, myProfilePage }) => {

        await test.step('Navigate to the My profile section.', async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            // Navigate to My Profile page
            await page.waitForTimeout(3000);
            expect.soft(await myProfilePage.isMyProfileSidebarVisible()).toBeTruthy();
            await myProfilePage.clickMyProfileSidebar();

        });

        await test.step('Ensure My Profile page is loaded.', async () => {
            //close profile creation video 
            await myProfilePage.closeProfileVideo();
            // My Profile page section verification
            expect.soft(await myProfilePage.isCvOptionDropdownVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isPreviewCvButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isExportButtonVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>General sections items are visible for the Employee role.', async () => {
            // Navigate to General section
            expect.soft(await myProfilePage.isGeneralInfoSectionVisible()).toBeTruthy();
            await myProfilePage.clickGeneralInfoSection();
            // General section items verification
            expect.soft(await myProfilePage.isUploadImageButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isImageSectionVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isProfessionalBioInputVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isFullNameInputVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Skills sections items are visible for the Employee role.', async () => {
            // Navigate to Skills section
            expect.soft(await myProfilePage.isSkillsSectionVisible()).toBeTruthy();
            await myProfilePage.clickSkillsSection();
            // Skills section items verification
            expect.soft(await myProfilePage.isProfessionalSkillsAddSectionVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isTechnicalSkillsAddSectionVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Experience sections items are visible for the Employee role.', async () => {
            // Navigate to Experience section
            expect.soft(await myProfilePage.isExperienceSectionVisible()).toBeTruthy();
            await myProfilePage.clickExperienceSection();
            // Experience section items verification
            expect.soft(await myProfilePage.isAddExperienceButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isExperienceSectionItemVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Education sections items are visible for the Employee role.', async () => {
            // Navigate to Education section
            expect.soft(await myProfilePage.isEducationTabVisible()).toBeTruthy();
            await myProfilePage.clickEducationTab();
            // Education section items verification
            expect.soft(await myProfilePage.isAddEducationButtonVisible()).toBeTruthy();
            //expect.soft(await myProfilePage.isEducationListItemVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Training sections items are visible for the Employee role role.', async () => {
            // Navigate to Training section
            expect.soft(await myProfilePage.isTrainingTabVisible()).toBeTruthy();
            await myProfilePage.clickTrainingTab();
            // Training section items verification
            expect.soft(await myProfilePage.isAddTrainingButtonVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isTrainingListItemVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Achievements sections items are visible for the Employee  role.', async () => {
            // Navigate to Achievements section
            expect.soft(await myProfilePage.isAchievementsTabVisible()).toBeTruthy();
            await myProfilePage.clickAchievementsTab();
            // Achievements section items verification
            expect.soft(await myProfilePage.isAddAchievementButtonVisible()).toBeTruthy();
        });

        await test.step('Verify My Profile>>Projects sections items are visible for the Employee role.', async () => {
            // Navigate to Projects section
            expect.soft(await myProfilePage.isProjectsTabVisible()).toBeTruthy();
            await myProfilePage.clickProjectsTab();
            // Projects section items verification
            expect.soft(await myProfilePage.isProjectSearchInputVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isProjectListItemVisible()).toBeTruthy();
            expect.soft(await myProfilePage.isAddProjectButtonVisible()).toBeTruthy();
        });

    });

    test('Test Employee Role General >> My Team Section.', async ({ page, myTeamPage }) => {
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
            await page.waitForLoadState('networkidle');
            await myTeamPage.ClickTeamGraph();
            expect.soft(await myTeamPage.isTeamStructureViewVisible()).toBeTruthy();

        });

    });

    test('Test Employee Role General >> Security Section.', async ({ page, securityPage }) => {
        await test.step('Navigate to the Security section.', async () => {
            // Already authenticated via storageState in this describe
            await page.waitForLoadState('networkidle');
            // Navigate to Security page
            await page.waitForTimeout(2000);
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

    test("Test Employee Role General >> Platform Feedback Section.", async ({ page, platformFeedbackPage }) => {
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

    test("Test Employee Role Database >> CV Dashboard", async ({ page, cvDashboardPage, utility }) => {
        await test.step("Not able to navigate CV Dashboard", async () => {
            expect.soft(await cvDashboardPage.isCvDashboardSidebarvisible()).toBeFalsy();
        })

        await test.step("Not able to access CV Search page via url", async () => {
            const cvTemplate = await utility.readJsonFile('test_data/urlExpectedData.json') as { cvsearchpage: string };
            const cvDashboardRestrictedUrl = `${ENV.BASE_URL}${cvTemplate.cvsearchpage}`;
            await page.goto(cvDashboardRestrictedUrl);
            await expect(page).toHaveURL(/unauthorized/);
        })

        await test.step("verify unauthorized text for Training and Certificate page ", async () => {
            await cvDashboardPage.verifyUnauthorizedText();
        })
    });

    test("Test Employee Role Database >> CV Search.", async ({ page, cvSearchPage, utility }) => {
        await test.step("Not able to navigate CV Search", async () => {
            expect.soft(await cvSearchPage.isCvSearchSidebarvisible()).toBeFalsy();
        })

        await test.step("Not able to access CV Search page via url", async () => {
            const cvTemplate = await utility.readJsonFile('test_data/urlExpectedData.json') as { cvsearchpage: string };
            const cvSearchRestrictedUrl = `${ENV.BASE_URL}${cvTemplate.cvsearchpage}`;
            await page.goto(cvSearchRestrictedUrl);
            await expect(page).toHaveURL(/unauthorized/);
        })

        await test.step("verify unauthorized text for Training and Certificate page ", async () => {
            await cvSearchPage.verifyUnauthorizedText();
        })
    });

    test("Test Employee Role Database >> Training and certificate.", async ({ page, trainingCertificatePage, utility }) => {
        await test.step("Not able to navigate training and certificate", async () => {
            expect.soft(await trainingCertificatePage.isTrainningCertificateSiderVisibleForEmployee()).toBeFalsy();
        })

        await test.step("Not able to access Training and Certificate page via url", async () => {
            const cvTemplate = await utility.readJsonFile('test_data/urlExpectedData.json') as { traininngandcertificatepage: string };
            const trainingAndCertificateRestrictedUrl = `${ENV.BASE_URL}${cvTemplate.traininngandcertificatepage}`;
            await page.goto(trainingAndCertificateRestrictedUrl);
            await expect(page).toHaveURL(/unauthorized/);
        })

        await test.step("verify unauthorized text for Training and Certificate page ", async () => {
            await trainingCertificatePage.verifyUnauthorizedText();
        })
    });

    test("Test Employee Role Database >> CV Completion.", async ({ page, cvCompletionPage, utility }) => {
        await test.step("Not able to navigate CV Completion", async () => {
            // Not able navigate to CV Templates and certificate page
            expect.soft(await cvCompletionPage.isCvCompletionSidebarVisible()).toBeFalsy();
        })

        await test.step("Not able to access CV Completion page via url", async () => {
            const cvTemplate = await utility.readJsonFile('test_data/urlExpectedData.json') as { cvcompletionpage: string };
            const cvCompletionRestrictedUrl = `${ENV.BASE_URL}${cvTemplate.cvcompletionpage}`;
            await page.goto(cvCompletionRestrictedUrl);
            await expect(page).toHaveURL(/unauthorized/);
        })

        await test.step("verify unauthorized text for CV Completion page ", async () => {
            await cvCompletionPage.verifyUnauthorizedText();
        })
    });

    test("Test Empolyee Role Database >> CV Templates.", async ({ page, cvTemplatesPage, utility }) => {
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

    test("Test Employee Role Database >> CV Settings.", async ({ page, cvsettingPage, utility }) => {
        await test.step("Not able to navigate CV Settings", async () => {
            expect.soft(await cvsettingPage.isCvSettingSideBarVisible()).toBeFalsy();
        })

        await test.step("Not able to access CV Settings page via url", async () => {
            const cvsettingsURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { cvsettings: string };
            const cvSettingsRestrictedUrl = `${ENV.BASE_URL}${cvsettingsURL.cvsettings}`;
            await page.goto(cvSettingsRestrictedUrl);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify unauthorized text for Cv Settings page ", async () => {
            expect.soft(await cvsettingPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Employee Role Resource Calendar >> Resource Dashboard.", async ({ page, resourceDashboardPage, utility }) => {
        await test.step("Not able to navigate Resource Dashboard", async () => {
            await page.waitForTimeout(3000);
            expect.soft(await resourceDashboardPage.isResourceDashbroadVisible()).toBeFalsy();
        })

        await test.step("Not able to access Resource Dashboard page via url", async () => {
            const cvsettingsURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { resourcedashboard: string };
            const resourceRestrictedSettingsUrl = `${ENV.BASE_URL}${cvsettingsURL.resourcedashboard}`;
            await page.goto(resourceRestrictedSettingsUrl);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify unauthorized text for Resource Dashboard page ", async () => {
            expect.soft(await resourceDashboardPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Employee Role Planning >> planning page.", async ({ page, planningpage, utility }) => {
        await test.step("Not able to navigate planning page", async () => {
            expect.soft(await planningpage.isClickplanningPageSidebarVisible()).toBeFalsy();
        })

        await test.step("Not able to access Planning page via url", async () => {
            const cvsettingsURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { planningpage: string };
            const PlanningRestrictedUrl = `${ENV.BASE_URL}${cvsettingsURL.planningpage}`;
            await page.goto(PlanningRestrictedUrl);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("Verify unauthorized text for Planning page ", async () => {
            expect.soft(await planningpage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Employee Role Calendar View >> Calendar View.", async ({ page, calendarViewPage, utility }) => {
        await test.step("Not able to navigate Calender View", async () => {
            expect.soft(await calendarViewPage.isCalendarViewSidebarVisible()).toBeFalsy();
        })

        await test.step("Not able to access Calendar View page via url", async () => {
            const cvsettingsURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { calendarviewpage: string };
            const calendarViewRestrictedUrl = `${ENV.BASE_URL}${cvsettingsURL.calendarviewpage}`;
            await page.goto(calendarViewRestrictedUrl);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("Verify unauthorized text for Calendar View page ", async () => {
            expect.soft(await calendarViewPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Employee Role Resource Settings>> Resource Settings", async ({ page, resourceSettingPage, utility }) => {
        await test.step("Not able to navigate Resource Settings page", async () => {
            expect.soft(await resourceSettingPage.isResourceSettingSideBarVisible()).toBeFalsy();
        })

        await test.step("Not able to access Resource Settings page via url", async () => {
            const cvsettingsURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { resourcesettingspage: string };
            const resourceSettingRestrictedURL = `${ENV.BASE_URL}${cvsettingsURL.resourcesettingspage}`;
            await page.goto(resourceSettingRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("Verify unauthorized text for Resource Settings page ", async () => {
            expect.soft(await resourceSettingPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Employee Role Hr Leaderboard >> Hr Leaderboard", async ({ page, hrleaderbroadPage, utility }) => {
        await test.step("Not able to navigate Hr Leaderboard page", async () => {
            expect.soft(await hrleaderbroadPage.isHrLeaderboardideBarVisible()).toBeFalsy();
        })

        await test.step("Not able to access Hr Leaderboard page via url", async () => {
            const cvsettingsURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { resourcesettingspage: string };
            const hrLeaderbroadRestrictedURL = `${ENV.BASE_URL}${cvsettingsURL.resourcesettingspage}`;
            await page.goto(hrLeaderbroadRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("Verify unauthorized text for Hr Leaderboard page ", async () => {
            expect.soft(await hrleaderbroadPage.verifyUnauthorizedText()).toBeTruthy();
        })
    })

    test("Test Employee Role Non Billed Management>>Non-Billed Dashboard", async ({ utility, page, nonBilledDashboardPage }) => {
        await test.step("Not able to navigate Non-Billed Dashboard", async () => {
            expect.soft(await nonBilledDashboardPage.isNonBilledDashboradSideBarVisible()).toBeFalsy();
        })

        await test.step("Not able to access Non-Billed Dashboard via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { nonbilledpage: string };
            const restrictedNonBilledDashboardURL = `${ENV.BASE_URL}${resourcesettingURL.nonbilledpage}`;
            await page.goto(restrictedNonBilledDashboardURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for Non-Billed Dashboard", async () => {
            expect.soft(await nonBilledDashboardPage.verifyUnauthorizedText()).toBeTruthy();
        })

    })

    test("Test Employee Role Non Billed Report>>Non-Billed Report page", async ({ utility, page, nonBilledReportPage }) => {
        await test.step("Not able to navigate Non-Billed Report page", async () => {
            expect.soft(await nonBilledReportPage.isNonBilledReportsidebarVisible()).toBeFalsy();
        })

        await test.step("Not able to access Non-Billed Report page via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { nonbilledpage: string };
            const nonBilledDashboardRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.nonbilledpage}`;
            await page.goto(nonBilledDashboardRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for Non-Billed Report page", async () => {
            expect.soft(await nonBilledReportPage.verifyUnauthorizedText()).toBeTruthy();
        })

    })

    test("Test Employee Role Non Billed Management>>Non-Billed Setting", async ({ utility, page, nonBilledSettingPage }) => {
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

    test("Test Employee Role Admin Configuration >>User Management", async ({ utility, page, userManagementPage }) => {
        await test.step("Not able to navigate User Management", async () => {
            expect.soft(await userManagementPage.isUserManagementVisible()).toBeFalsy();
        })

        await test.step("Not able to access User Management via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { usermanagementpage: string };
            const userManagementRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.usermanagementpage}`;
            await page.goto(userManagementRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for User Management Page  ", async () => {
            expect.soft(await userManagementPage.verifyUnauthorizedText()).toBeTruthy();
        })

    })

    test("Test Employee Role Admin Configuration >>Project", async ({ utility, page, projectPage }) => {
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

    test("Test Employee Role Admin Configuration >>System setting", async ({ utility, page, systemsettingPage }) => {
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

    test("Test Employee RoleAdmin Configuration >>Role Management", async ({ utility, page, roleManagementPage }) => {
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

    test("Test Employee Role Admin Configuration >>Module Management", async ({ utility, page, moduleManagementPage }) => {
        await test.step("Not able to navigate Module Management page", async () => {
            expect.soft(await moduleManagementPage.isModuleManagementVisible()).toBeFalsy();
        })

        await test.step("Not able to access Role Management page  via url", async () => {
            const resourcesettingURL = await utility.readJsonFile('test_data/urlExpectedData.json') as { modulemanagementpage: string };
            const moduleManagementRestrictedURL = `${ENV.BASE_URL}${resourcesettingURL.modulemanagementpage}`;
            await page.goto(moduleManagementRestrictedURL);
            await expect(page).toHaveURL(/unauthorized/);
        })
        await test.step("verify Error Text for Role Management page ", async () => {
            expect.soft(await moduleManagementPage.verifyUnauthorizedText()).toBeTruthy();
        })

    })

    test("Test Employee Role Audit >>Dashboard", async ({ utility, page, adminDashboardPage }) => {
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

    test("Test Employee Role Audit >>Event Flag", async ({ utility, page, eventflagPage }) => {
        await test.step("Not able to navigate Event Flag page", async () => {
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

       test("Test Empolyee Role  Audit >> Profile Image",async({utility, page,profilePage})=>{
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
    

});
