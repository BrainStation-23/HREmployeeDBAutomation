import { Page, Locator } from "@playwright/test";

export default class ResourceDashboard{
    readonly page: Page;
    readonly resourceDashboardSidebar:Locator;
    readonly overviewInfoTab:Locator;
    readonly pivotAnalysisInfoTab:Locator;
    readonly weeklyScoreCardInfoTab:Locator;
    readonly billTypeChangesInfoTab:Locator;
    readonly sbuchangesInfoTab:Locator;
    //overview field data
    readonly totalBillableCard:Locator;
    readonly totalBilledCard:Locator;
    readonly totalActualBillCard:Locator;
    //pivotanalysis field data
    readonly sbuField:Locator;
    readonly resourceField:Locator
    readonly billField:Locator;
    readonly exprtiseField:Locator;
    //card filter
    readonly weeklycardFilterdropdown:Locator;
    //weekly card field area
    readonly startdateField:Locator;
    readonly enddateField:Locator;
    readonly clearField:Locator;
    readonly calculateField:Locator
    //billing type card area
    readonly BillTypeChangesdropwon:Locator;
    readonly dateField:Locator;
    readonly frombillTypesField:Locator
    readonly tobillTypeField:Locator;
    readonly billsbuField:Locator;
    readonly profileField:Locator;
    readonly exportField:Locator;

    //sbu changes area

    readonly sbuchangeexportField:Locator;
    




    constructor(page:Page){
        this.page=page;
        this.resourceDashboardSidebar=page.getByRole('link', { name: 'Resource Dashboard' })
        //overview field
        this.overviewInfoTab=page.getByRole('tab', { name: 'Overview' });
        this.totalBillableCard=page.locator("(//div[contains(@class, 'grid grid-cols-1')]/div)[1]")
        this.totalBilledCard=page.locator("(//div[contains(@class, 'grid grid-cols-1')]/div)[2]")
        this.totalActualBillCard=page.locator("(//div[contains(@class, 'grid grid-cols-1')]/div)[3]")
        //pivotanalysis
        this.pivotAnalysisInfoTab=page.getByRole('tab', { name: 'Pivot Analysis' })
        //pivotanalysis field
        this.sbuField=page.locator('label').filter({ hasText: 'SBU' })
        this.resourceField=page.getByText('Resource Type')
        this.billField=page.locator('label').filter({ hasText: 'Bill Type' })
        this.exprtiseField=page.getByText('Expertise', { exact: true })
        this.weeklyScoreCardInfoTab=page.getByRole('tab', { name: 'Weekly Score Card' })
        //weekly field
        this.weeklycardFilterdropdown=page.locator("//h3[@class='font-semibold tracking-tight flex items-center justify-between text-base']//*[name()='svg']").nth(1)
        this.startdateField=page.getByRole('button', { name: 'Select start date' })
        this.enddateField=page.getByRole('button', { name: 'Select end date' })
        this.clearField=page.getByRole('button', { name: 'Clear Filters' })
        this.calculateField=page.getByRole('button', { name: 'Calculate New' })
        //billing type
        this.BillTypeChangesdropwon = page.getByRole('heading', { name: 'Bill Type Changes Filters' }).getByRole('img').nth(2);
        this.billTypeChangesInfoTab=page.getByRole('tab', { name: 'Bill Type Changes' });
        this.dateField=page.getByText('Date Range');
        this.frombillTypesField=page.getByText('From Bill Type', { exact: true });
        this.tobillTypeField=page.getByText('To Bill Type', { exact: true })
        this.billsbuField=page.getByText('SBUs', { exact: true });
        this.profileField=page.getByText('Profile', { exact: true });
        this.exportField=page.getByRole('button', { name: 'Export' });
         //sbu change
        this.sbuchangesInfoTab=page.getByRole('tab', { name: 'SBU Changes' })
        this.sbuchangeexportField=page.getByRole('button', { name: 'Export' })
        

    }
    async clickResourceDashboardSidebar(){
        await this.resourceDashboardSidebar.click();
    }
    async isResourceDashbroadVisible(){
        return await this.resourceDashboardSidebar.isVisible({timeout:5000})
    }
    async isOverviewInfoTabvisible(){
        return await this.overviewInfoTab.isVisible({timeout:5000})
    }
     async ClickOverviewInfoTab(){
        await this.overviewInfoTab.click();
    }
    async isTotalBillableCardVisible(){
        await this.totalBillableCard.waitFor({ state: 'visible', timeout: 15000 });
        return await this.totalBillableCard.isVisible({ timeout: 5000 });
    }

    async isTotalBillCardVisible(){
        await this.totalBilledCard.waitFor({ state: 'visible', timeout: 15000 });
        return await this.totalBilledCard.isVisible({ timeout: 5000 });
    }

    async isTotalActualBillCardVisible(){
        await this.totalActualBillCard.waitFor({ state: 'visible', timeout: 15000 });
        return await this.totalActualBillCard.isVisible({ timeout: 5000 });
    }

    async ClickPivotAnalysisInfoTab(){
        await this.pivotAnalysisInfoTab.click();
    }

    async isPivotAnalysisInfoTabvisible(){
        return await this.pivotAnalysisInfoTab.isVisible({timeout:5000})
    }
    async isSbuFieldVisible(){
        await this.sbuField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.sbuField.isVisible({ timeout: 5000 });

    }
    async isResourceFieldVisible(){
        await this.resourceField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.resourceField.isVisible({ timeout: 5000 });
    }

    async isBillFieldVisible(){
        await this.billField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.billField.isVisible({ timeout: 5000 });
    }
    async isExprtiseFieldVisible(){
        await this.exprtiseField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.exprtiseField.isVisible({ timeout: 5000 });
    }
    async ClickWeeklyScoreCardInfoTab(){
        await this.weeklyScoreCardInfoTab.click();
    }
    async isWeeklyScorecardVisible(){
        return await this.weeklyScoreCardInfoTab.isVisible({timeout:5000})
    }
    async ClickWeeklyCardFilters(){
        await this.weeklycardFilterdropdown.click();
    }
    async isStartDateFieldVisible(){
        await this.startdateField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.startdateField.isVisible({ timeout: 5000 });
    }
    async isEndDateFieldVisible(){
       await this.enddateField.waitFor({ state: 'visible', timeout: 15000 });
       return await this.enddateField.isVisible({ timeout: 5000 });

    }

    async isClearField(){
        await this.clearField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.clearField.isVisible({ timeout: 5000 });  

    }
    async isCalculateField(){
        await this.calculateField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.calculateField.isVisible({ timeout: 5000 }); 

    }

    async ClickBillTypeChangesInfoTab(){
        await this.billTypeChangesInfoTab.click();
    }
    async isClickBillTypeChangesInfoTabvisible(){
        await this.billTypeChangesInfoTab.waitFor({ state: 'visible', timeout: 15000 });
        return await this.billTypeChangesInfoTab.isVisible({ timeout: 5000 });
    }

    async ClickBillTypeChangesdropwon(){
        await this.BillTypeChangesdropwon.click();
    }
    async isDataFieldVisible(){
        await this.dateField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.dateField.isVisible({ timeout: 5000 });
    }
    async isBillTypeChangesInfoTabVisible(){
        await this.billTypeChangesInfoTab.waitFor({ state: 'visible', timeout: 15000 });
        return await this.billTypeChangesInfoTab.isVisible({ timeout: 5000 });
    }
    async isDateFieldVisible(){
        await this.dateField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.dateField.isVisible({ timeout: 5000 });
    }
    async isFromBillTypesFieldVisible(){
        await this.frombillTypesField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.frombillTypesField.isVisible({ timeout: 5000 });
    }
    async isBillSbuFieldVisible(){
        await this.billsbuField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.billsbuField.isVisible({ timeout: 5000 });

    }
    async isExportFieldVisible(){
        await this.exportField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.exportField.isVisible({ timeout: 5000 });
    }
    async ClickSbuchangesInfoTab(){
        await this.sbuchangesInfoTab.click();
    }

    async isSbuchangesInfoTabVisible(){
        return await this.weeklyScoreCardInfoTab.isVisible({timeout:5000})
    }

    async isSbuChangeExportField(){
         await this.sbuchangeexportField.waitFor({ state: 'visible', timeout: 15000 });
        return await this.sbuField.isVisible({ timeout: 5000 });
    }
}