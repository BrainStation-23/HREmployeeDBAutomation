import { Page, Locator } from "@playwright/test";

export default class MyTeamPage {
    readonly page: Page;
    readonly myTeamSidebar: Locator;
    readonly managerLabel: Locator;
    readonly peersLabel: Locator;
    readonly directReportsLabel: Locator;
    readonly teamStructureFlow: Locator;

    constructor(page: Page) {
        this.page = page;
        this.myTeamSidebar = page.getByRole('link', { name: 'My Team' });
        this.managerLabel = page.locator("(//div[@data-lov-name='CardContent'])[1]");
        this.peersLabel = page.locator("(//div[@data-lov-name='CardContent'])[2]");
        this.directReportsLabel = page.locator("(//div[@data-lov-name='CardContent'])[3]");
        this.teamStructureFlow = page.locator("//div[@class='react-flow__pane draggable']");
    }

    async clickMyTeamSidebar() {
        await this.myTeamSidebar.click();
    }

    async isMyTeamSidebarVisible() {
        return await this.myTeamSidebar.isVisible({ timeout: 5000 });
    }

    async isManagerLabelVisible() {
        await this.managerLabel.waitFor({ state: 'visible', timeout: 15000 });
        return await this.managerLabel.isVisible({ timeout: 5000 });
    }
    async isPeersLabelVisible() {
        await this.peersLabel.waitFor({ state: 'visible', timeout: 15000 });
        return await this.peersLabel.isVisible({ timeout: 5000 });
    }
    async isDirectReportsLabelVisible() {
        return await this.directReportsLabel.isVisible({ timeout: 5000 });
    }
    async isTeamStructureFlowVisible() {
        await this.teamStructureFlow.waitFor({ state: 'visible', timeout: 15000 });
        return await this.teamStructureFlow.isVisible({ timeout: 5000 });   
    }    


}
