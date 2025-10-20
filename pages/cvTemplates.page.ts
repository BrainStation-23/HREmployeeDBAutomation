import { Locator, Page} from "@playwright/test";
export default class CvTemplatesPage {
 readonly page: Page;
 readonly cvTemplatesSidebar: Locator;
 readonly unauthorizedText:Locator;

 constructor(page: Page) {
    this.page=page;
    this.cvTemplatesSidebar=page.getByRole('link', { name: 'CV Templates' })
    this.unauthorizedText=page.getByRole('heading', { name: 'Unauthorized' })
 }
 async isCvTemplatesSidebar(){
    return await this.cvTemplatesSidebar.isVisible({timeout:5000});
 }
 // #verify unauthorized text restiatcted url access
 async verifyUnauthorizedText(){
   return await this.unauthorizedText.isVisible({timeout:5000});

 }



}

