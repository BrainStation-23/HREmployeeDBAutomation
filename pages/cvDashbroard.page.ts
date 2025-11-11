import { Locator, Page } from "@playwright/test";

export default class CvDashboardPage {
    readonly page: Page;
    // progress statistics
    readonly cvDashboardSidebar: Locator;
    readonly profileStats: Locator;
    readonly profieStatsData:Locator;
    readonly overallProgressStats: Locator;
    readonly overallProgressData:Locator;
    readonly highAchieversStats: Locator;
    readonly highAchieversData:Locator
    readonly steadyProgressStats: Locator;
    readonly steadyProgressData:Locator;
    readonly gasmField: Locator;
    readonly billableField: Locator;
    readonly supportField: Locator;
    readonly exitField: Locator;
    readonly contractualField: Locator;
    readonly unauthorizedText: Locator;


    constructor(page: Page) {
        this.page = page;
        this.cvDashboardSidebar = page.getByRole('link', { name: 'CV Dashboard' })
        this.profileStats = page.locator("(//div[@class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6']//div[@class='rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden'])[1]")
        this.profieStatsData=page.locator("//div[@class='flex items-center justify-between']//p[2]").nth(0)
        this.overallProgressStats = page.locator("(//div[@class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6']//div[@class='rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden'])[2]")
        this.overallProgressData=page.locator("//div[@class='flex items-center justify-between']//p[2]").nth(1);
        this.highAchieversStats = page.locator("(//div[@class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6']//div[@class='rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden'])[3]")
        this.highAchieversData=page.locator("//div[@class='flex items-center justify-between']//p[2]").nth(3);
        
        this.steadyProgressStats = page.locator("(//div[@class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6']//div[@class='rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden'])[4]")
        this.steadyProgressData=page.locator("//div[@class='flex items-center justify-between']//p[2]").nth(3);
        //this.traineefield = page.locator("//h4[normalize-space()='Trainee']")

        this.gasmField = page.locator(" //h4[normalize-space()='GA & SM']")
        this.billableField = page.locator("//h4[normalize-space()='Billable']")
        this.supportField = page.locator("//h4[normalize-space()='Support']")
        this.exitField = page.locator("//h4[normalize-space()='Exit']")
        this.contractualField = page.locator("//h4[normalize-space()='Contractual(Hourly)']")
        this.unauthorizedText = page.getByRole('heading', { name: 'Unauthorized' })

    }

    //#region CV Dashbroad Page Common Sections
    async isCvDashboardSidebarvisible() {
        return await this.cvDashboardSidebar.isVisible();
    }
    async clickCvDashboardSidebar() {
        await this.cvDashboardSidebar.click();
    }

    async isProfileStatsVisible() {
        await this.profileStats.waitFor({ state: 'visible', timeout: 15000 });
        return await this.profileStats.isVisible();
    }
    async isOveralProgressStatsVisible() {
        await this.overallProgressStats.waitFor({ state: 'visible', timeout: 15000 });
        return await this.overallProgressStats.isVisible();
    }
    async isHighAchieversStatsVisible() {
        await this.highAchieversStats.waitFor({ state: 'visible', timeout: 15000 });
        return await this.highAchieversStats.isVisible();
    }
    async isSteadyProgressStatsVisible() {
        await this.steadyProgressStats.waitFor({ state: 'visible', timeout: 15000 });
        return await this.steadyProgressStats.isVisible();
    }
    async isGasmFieldVisible() {
        return await this.gasmField.isVisible({ timeout: 5000 });
    }
    async isBillableFieldvisible() {
        await this.billableField.waitFor({ state: 'visible', timeout: 15000 })
        return await this.billableField.isVisible();
    }
    async isSupportFieldVisible() {
        await this.supportField.waitFor({ state: 'visible', timeout: 15000 })
        return await this.supportField.isVisible();
    }
    async isExitFieldVisible() {
        return await this.exitField.isVisible({ timeout: 5000 });
    }
    async isContractualFieldVisible() {
        await this.contractualField.waitFor({ state: 'visible', timeout: 15000 })
        return await this.contractualField.isVisible();
    }
    // #verify unauthorized text restiatcted url access
    async verifyUnauthorizedText() {
        return await this.unauthorizedText.isVisible({ timeout: 5000 });
    }
}