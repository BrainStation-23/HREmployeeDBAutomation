import { test as base, Page } from '@playwright/test';
import Utility from '../utils/Utility';
import CommonPage from '../pages/common.page';
import LoginPage from '../pages/login.page';
import DashboardPage from '../pages/dashboard.page';
import fs from 'fs';
import path from 'path';
import v8toIstanbul from 'v8-to-istanbul';
import MyProfilePage from '../pages/myProfile.page';
import MyTeamPage from '../pages/myTeam.page';
import SecurityPage from '../pages/security.page';
import PlatformFeedbackPage from '../pages/platformFeedback.page';
import CvDashboardPage from '../pages/cvDashbroard.page';
import CvSearchPage from '../pages/cvSearch.page';
import TrainingCertificatePage from '../pages/trainingCertification.page';
import CvCompletionPage from '../pages/cvCompletion.page';
import CvTemplatesPage from '../pages/cvTemplates.page';
import CvSettingPage from '../pages/cvSettings.page';
import ResourceDashboard from '../pages/resourceDashboard.page';
import Planning from '../pages/planningPage.page';
import ResourceSettingPage from '../pages/resourceSettings.page';
import CalendarViewPage from '../pages/calendarView.page';
import HrleaderboardPage from '../pages/hrLeaderboard.page';
import NonBilledDashboardPage from '../pages/nonBilledDashboard.page';
import NonBilledReportPage from '../pages/nonBilledReport.page';
import NonBilledSettingsPage from '../pages/nonBilledSettings.page';
import UserManagementPage from '../pages/userManagement.page';
import ProjectPage from '../pages/project.page';
import SystemsettingPage from '../pages/Systemsetting.page';
import RoleManagementPage from '../pages/roleManagement.page';
import ModuleManagementPage from '../pages/modulemanagement.page';
import AdmindashboardPage from '../pages/adminDashboard.page';
import EventFlagPage from '../pages/eventflag.page';
import SignOutPage from '../pages/singOut.page';
import ProfilePage from '../pages/profile.page';

type pages = {
    commonPage: CommonPage;
    utility: Utility;
    dashboardPage: DashboardPage;
    loginPage: LoginPage;
    myProfilePage: MyProfilePage;
    myTeamPage: MyTeamPage;
    securityPage: SecurityPage;
    platformFeedbackPage: PlatformFeedbackPage;
    cvDashboardPage: CvDashboardPage;
    cvSearchPage:CvSearchPage;
    trainingCertificatePage:TrainingCertificatePage;
    cvCompletionPage:CvCompletionPage;
    cvTemplatesPage:CvTemplatesPage;
    cvsettingPage:CvSettingPage;
    resourceDashboardPage:ResourceDashboard;
    //planningPage:PlanningPage;
    resourceSettingPage:ResourceSettingPage;
    calendarViewPage:CalendarViewPage;
    hrleaderbroadPage:HrleaderboardPage;
    nonBilledDashboardPage:NonBilledDashboardPage;
    nonBilledReportPage:NonBilledReportPage;
    nonBilledSettingPage:NonBilledSettingsPage;
    userManagementPage:UserManagementPage;
    projectPage:ProjectPage;
    systemsettingPage:SystemsettingPage;
    roleManagementPage:RoleManagementPage;
    moduleManagementPage:ModuleManagementPage;
    adminDashboardPage:AdmindashboardPage;
    eventflagPage:EventFlagPage;
    planningpage:Planning;
    signoutPage:SignOutPage
    profilePage:ProfilePage
}
    
const testPages = base.extend<pages>({

    utility: async ({}, use) => {
        await use(new Utility);
    },
    commonPage: async ({ page }, use) => {
        await use(new CommonPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    myProfilePage: async({page},use)=>{
        await use(new MyProfilePage(page));
    },
    myTeamPage: async({page},use)=>{
        await use(new MyTeamPage(page));
    },
    securityPage: async({page},use)=>{
        await use(new SecurityPage(page));
    },
    platformFeedbackPage: async({page},use)=>{
        await use(new PlatformFeedbackPage(page));
    },
    cvDashboardPage:async({page},use)=>{
        await use(new CvDashboardPage(page));
    },
    cvSearchPage:async({page},use)=>{
        await use(new CvSearchPage(page))
    },
    trainingCertificatePage:async({page},use)=>{
        await use(new TrainingCertificatePage(page))
    },
    cvCompletionPage:async({page},use)=>{
      await use(new CvCompletionPage(page))
    },
    cvTemplatesPage:async({page},use)=>{
        await use(new CvTemplatesPage(page))
    },
    cvsettingPage:async({page},use)=>{
        await use(new CvSettingPage(page))
    },
    resourceDashboardPage:async({page},use)=>{
        await use(new ResourceDashboard(page))
    },
    planningpage:async({page},use)=>{
        await use(new Planning(page))
    },
    resourceSettingPage:async({page},use)=>{
        await use(new ResourceSettingPage(page))
    },
    calendarViewPage:async({page},use)=>{
        await use(new CalendarViewPage(page))
    },
    hrleaderbroadPage:async({page},use)=>{
        await use(new HrleaderboardPage(page))
    },
    nonBilledDashboardPage:async({page},use)=>{
        await use(new NonBilledDashboardPage(page))
    },
    nonBilledReportPage:async({page},use)=>{
        await use(new NonBilledReportPage(page))
    },
    nonBilledSettingPage:async({page},use)=>{
        await use(new NonBilledSettingsPage(page))
    },
    userManagementPage:async({page},use)=>{
        await use(new UserManagementPage(page))
    },
    projectPage:async({page},use)=>{
        await use(new ProjectPage(page))
    },
    systemsettingPage:async({page},use)=>{
        await use(new SystemsettingPage(page))
    },
    roleManagementPage:async({page},use)=>{
        await use(new RoleManagementPage(page))
    },
    moduleManagementPage:async({page},use)=>{
        await use(new ModuleManagementPage(page))
    },
    adminDashboardPage:async({page},use)=>{
        await use(new AdmindashboardPage(page))
    },
    eventflagPage:async({page},use)=>{
        await use(new EventFlagPage(page))
    },
    signoutPage:async({page},use)=>{
         await use(new SignOutPage(page))
    },
    profilePage:async({page},use)=>{
        await use(new ProfilePage(page))
    }
})

export const test = testPages;
export const expect = testPages.expect;

// Centralized Coverage Hooks (Chromium only)
const COVERAGE_ENABLED = process.env.ENABLE_COVERAGE === 'true';
const COVERAGE_DIR = path.resolve('coverage');

testPages.beforeAll(async () => {
    if (COVERAGE_ENABLED && !fs.existsSync(COVERAGE_DIR)) {
        fs.mkdirSync(COVERAGE_DIR, { recursive: true });
    }
});

testPages.beforeEach(async ({ page, utility }) => {
    if (COVERAGE_ENABLED) {
        await page.coverage.startJSCoverage();
        // await page.coverage.startCSSCoverage();
    }
    // Always start from the environment base URL so each test has a clean landing point
    await utility.navigateToBaseUrl(page);
});

testPages.afterEach(async ({ page }, testInfo) => {
    if (!COVERAGE_ENABLED) return;

    const entries = await page.coverage.stopJSCoverage();
    // const cssEntries = await page.coverage.stopCSSCoverage();

    const toSlug = (s: string) => s.replace(/[^a-z0-9\-]+/gi, '_').toLowerCase();
    const fileName = `${toSlug(testInfo.project.name)}__${toSlug(testInfo.title)}.json`;
    const outPath = path.join(COVERAGE_DIR, fileName);

    const istanbulChunks: any[] = [];
    for (const entry of entries) {
        // Use inline source with an empty path for v8-to-istanbul; robust for inline/anonymous scripts
        const converter = v8toIstanbul('', 0, { source: entry.source ?? '' });
        await converter.load();
        converter.applyCoverage(entry.functions);
        istanbulChunks.push(converter.toIstanbul());
    }

    fs.writeFileSync(outPath, JSON.stringify(istanbulChunks, null, 2), 'utf-8');
});
