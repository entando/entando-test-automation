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

  //FIXME AdminConsole is not built on REST APIs
  static openDeleteContentTypePage(button, code) {
    cy.contentTypesAdminConsoleController().then(controller => controller.intercept({ method: 'GET' }, 'deleteContentTypePageLoadingGET', `/trashEntityType.action?entityManagerName=jacmsContentManager&entityTypeCode=${code}`));
    cy.get(button).click();
    cy.wait('@deleteContentTypePageLoadingGET');
  }

  //FIXME AdminConsole is not built on REST APIs
  static openDeleteAssetsPage(button){
    cy.assetsAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'deleteAssetsPageLoadingGET', `/trash.action?*`));
    cy.get(button).click();
    cy.wait('@deleteAssetsPageLoadingGET');
  }

  getForm() {
    return this.getContents()
               .children(`${htmlElements.div}.text-center`)
               .children(this.form);
  }

  setForm(formID) {
    this.form = `${htmlElements.form}#${formID}`;
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
