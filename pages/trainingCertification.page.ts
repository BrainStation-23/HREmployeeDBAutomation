 import { Page, Locator } from "@playwright/test";

 export default class TrainingCertificatePage{
     readonly page: Page;
     readonly trainningCertificateSidebar:Locator;
     readonly refreshBtn:Locator;
     readonly bulkuploadBtn:Locator;
     readonly exportBtn:Locator;
    readonly unauthorizedText:Locator;

     constructor(page:Page){
        this.page = page;
        this.trainningCertificateSidebar=page.getByRole('link', { name: 'Training and Certification' })
        this.refreshBtn=page.locator("(//div[@class='flex items-center gap-3']/button[1])")
        this.bulkuploadBtn=page.locator("(//div[@class='flex items-center gap-3']/button[2])")
        this.exportBtn=page.locator("(//div[@class='flex items-center gap-3']/button[3])")
        this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
     }

    async isTrainningCertificateSiderVisible(){
         await this.trainningCertificateSidebar.waitFor({ state: 'visible', timeout: 15000 });
       return await this.trainningCertificateSidebar.isVisible({ timeout: 5000 });
    }
    async isTrainningCertificateSiderVisibleForEmployee(){
        return await this.trainningCertificateSidebar.isVisible({ timeout: 5000 });
    }
    async ClickTrainningCertificateSidebar(){
        await this.trainningCertificateSidebar.click()
    }
    async isRefreshBtnVisible(){
        await this.refreshBtn.waitFor({ state: 'visible', timeout: 15000 });
       return await this.refreshBtn.isVisible({ timeout: 5000 });
    }
    async isBulkuploadBtnVisible(){
        await this.bulkuploadBtn.waitFor({state:'visible',timeout:15000});
        return await this.bulkuploadBtn.isVisible();
    }
    async isExportBtnVisible(){
        return await this.exportBtn.isVisible({timeout:10000});
    }
    // #verify unauthorized text restiatcted url access
    async verifyUnauthorizedText(){
      return await this.unauthorizedText.isVisible({timeout:5000});
   }

 }