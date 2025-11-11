import { Locator, Page } from "@playwright/test";

export default class CalendarViewPage {
    readonly page: Page;
    readonly calendarViewSidebar:Locator;
    readonly searchemployeeBox:Locator;
    readonly filterbySbu:Locator;
    readonly fillterbyManager:Locator;
     readonly unauthorizedText:Locator;

    constructor(page: Page) {
        this.page = page;
        this.calendarViewSidebar=page.getByRole('link', { name: 'Calendar View' })
        this.searchemployeeBox=page.getByRole('textbox', { name: 'Search' })
        this.filterbySbu=page.getByText('Select SBU...')
        this.fillterbyManager=page.getByText('Select manager...')
        this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
    }
    async isCalendarViewSidebarVisible(){
         //await this.calendarViewSidebar.waitFor({ state: 'visible', timeout: 15000 });
         return await this.calendarViewSidebar.isVisible({timeout:5000});
    }
    async ClickCalendarViewSidebar(){
        await this.calendarViewSidebar.click();
    }
    async isSearchEmplyeeFieldVisible(){
        await this.searchemployeeBox.waitFor({ state: 'visible', timeout: 15000 });
         return await this.searchemployeeBox.isVisible();
    }
    async isFilterBySbuFieldVisible(){
        await this.filterbySbu.waitFor({ state: 'visible', timeout: 15000 });
        return await this.filterbySbu.isVisible();
    }
    async isFilterByManagerFieldVisible(){
        await this.fillterbyManager.waitFor({ state: 'visible', timeout: 15000 });
        return await this.fillterbyManager.isVisible();
    }
      // #verify unauthorized text restiatcted url access
    async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }

}