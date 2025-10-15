import { Page, Locator } from "@playwright/test";

export default class MyTeamPage {
    readonly page: Page;
    readonly myTeamSidebar: Locator;
    readonly managerLabel: Locator;
    readonly peersLabel: Locator;
    readonly directReportsLabel: Locator;
    readonly teamGraphView: Locator;

    constructor(page: Page) {
        this.page = page;
        this.myTeamSidebar = page.getByRole('link', { name: 'My Team' });
        this.managerLabel = page.locator("//h3[normalize-space()='Manager']");
        //this.peersLabel = page.locator("(//div[@data-lov-name='CardContent'])[2]");
        this.peersLabel = page.locator("//div[h3[contains(., 'Peers')]]");
        this.directReportsLabel = page.locator("(//div[@data-lov-name='CardContent'])[3]");
        this.directReportsLabel = page.locator("//div[h3[contains(normalize-space(.), 'Direct Reports')]]");
        this.teamGraphView = page.locator('//button[normalize-space(.)="Graph View"]');

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
    async isTeamGraphViewVisible() {
        await this.teamGraphView.waitFor({ state: 'visible', timeout: 15000 });
        return await this.teamGraphView.isVisible({ timeout: 5000 });   
    }    


}
