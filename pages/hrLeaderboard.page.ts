import { Locator, Page } from "@playwright/test";

export default class HrleaderboardPage{
     readonly page: Page;
     readonly hrleaderboardSideBar:Locator;
     readonly unauthorizedText:Locator;


  constructor(page: Page) {
    this.page = page;
    this.hrleaderboardSideBar=page.getByRole('link', { name: 'HR Leaderboard' })
    this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
  }

  async isHrLeaderboardideBarNotVisible(){
    return await this.hrleaderboardSideBar.isVisible({timeout:5000});
  }
  async verifyUnauthorizedText(){
    return await this.unauthorizedText.isVisible({timeout:5000});
  }
}