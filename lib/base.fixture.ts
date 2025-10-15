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
