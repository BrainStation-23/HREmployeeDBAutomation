import { Locator, Page } from "@playwright/test";

export default class CvDashboardPage {
    readonly page: Page;
    // progress statistics
    readonly cvDashboardSidebar: Locator
    readonly profileStats: Locator
    readonly overalProgressStats: Locator
    readonly highAchieversStats: Locator
    readonly steadyProgressStats: Locator
    //progress card
    readonly profileCompletionCard: Locator
    readonly overallProgressCard: Locator
    readonly highAchieversCard: Locator
    constructor(page: Page) {
        this.page = page;
        this.cvDashboardSidebar = page.getByRole('link', { name: 'CV Dashboard' })
        this.profileStats=page.locator('div').filter({ hasText: /^Profiles Created68Active employees$/ }).nth(1)
        this.overalProgressStats=page.locator('div').filter({ hasText: /^Overall Progress73\.53%$/ }).nth(1)
        this.highAchieversStats=page.locator('div').filter({ hasText: /^High Achievers3551% of total$/ }).nth(1)
        this.steadyProgressStats=page.locator('div').filter({ hasText: /^Steady Progress2435% of total$/ }).nth(1)
        this.profileCompletionCard=page.locator("(//div[@class='grid grid-cols-1 md:grid-cols-3 gap-6']/div[1])")
        this.overallProgressCard=page.locator("(//div[@class='grid grid-cols-1 md:grid-cols-3 gap-6']/div[2])")
        this.highAchieversCard=page.locator("(//div[@class='grid grid-cols-1 md:grid-cols-3 gap-6']/div[3])")
    }

    //#region CV Dashbroad Page Common Sections
    async isCvDashboardSidebarvisible() {    
    await this.cvDashboardSidebar.waitFor({ state: 'visible', timeout: 15000 });
    return await this.cvDashboardSidebar.isVisible();


    }

    async clickCvDashboardSidebar() {
        await this.cvDashboardSidebar.click();
    }

    async isProfileStatsVisible(){
        await this.profileStats.waitFor({ state: 'visible', timeout: 15000 });
        return await this.profileStats.isVisible();
    }
    async isOveralProgressStatsVisible(){
        await this.overalProgressStats.waitFor({ state: 'visible', timeout: 15000 });
        return await this.overalProgressStats.isVisible();
    }
    async isHighAchieversStatsVisible(){
        await this.highAchieversStats.waitFor({ state: 'visible', timeout: 15000 });
        return await this.highAchieversStats.isVisible();
    }
    async isSteadyProgressStatsVisible(){
        await this.steadyProgressStats.waitFor({ state: 'visible', timeout: 15000 });
        return await this.steadyProgressStats.isVisible();
    }
    async isProfileCompletionCardVisible(){
        await this.profileCompletionCard.waitFor({ state: 'visible', timeout: 15000 });
        return await this.profileCompletionCard.isVisible();
    }
    async isOverallProgressCardVisible(){
        await this.overallProgressCard.waitFor({ state: 'visible', timeout: 15000 });
        return await this.overallProgressCard.isVisible();
    }
    async isHighAchieversCardVisible(){
        await this.highAchieversCard.waitFor({ state: 'visible', timeout: 15000 });
        return await this.highAchieversCard.isVisible();
    }


}