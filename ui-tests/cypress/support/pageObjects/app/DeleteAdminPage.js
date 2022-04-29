import {htmlElements} from '../WebElement.js';
import AdminContent   from './AdminContent';

export default class DeleteAdminPage extends AdminContent {

  form         = `${htmlElements.form}[id="delete"]`;
  closeButton  = `${htmlElements.a}`;
  cancelButton = `${htmlElements.button}[type="submit"]`;

  //FIXME AdminConsole is not built on REST APIs
  static openDeleteContentTemplatePage(button, code) {
    cy.contentTemplatesAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'deleteContentTemplatePageLoadingGET', `/trash.action?modelId=${code}`));
    cy.get(button).click();
    cy.wait('@deleteContentTemplatePageLoadingGET');
  }

  //FIXME AdminConsole is not built on REST APIs
  static openDeleteCategoryPage(button) {
    cy.categoriesAdminConsoleController().then(controller => controller.intercept({method: 'POST'}, 'deleteCategoryPageLoadingPOST', `/viewTree.action`));
    cy.get(button).click();
    cy.wait('@deleteCategoryPageLoadingPOST');
  }

  getForm() {
    return this.getContents()
               .children(this.form);
  }

  getCloseButton() {
    return this.getForm()
               .children(htmlElements.a);
  }

  getCancelButton() {
    return this.getForm()
               .find(`${htmlElements.button}[type="submit"]`);
  }

  setOrigin(originPage) {
    this.origin = originPage;
  }

  submit() {
    this.getCancelButton().then(button => this.click(button));
    return cy.wrap(this.origin).as('currentPage');
  }

}
