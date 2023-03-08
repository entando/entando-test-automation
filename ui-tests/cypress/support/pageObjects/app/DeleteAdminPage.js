import {htmlElements} from '../WebElement.js';
import AdminContent   from './AdminContent';

export default class DeleteAdminPage extends AdminContent {

  form         = `${htmlElements.form}[id="delete"]`;
  closeButton  = `${htmlElements.a}`;
  cancelButton = `${htmlElements.button}[type="submit"]`;

  static openDeleteContentTemplatePage(button) {
    super.loadPage(button, '/jacms/ContentModel/trash.action');
  }

  static openDeleteCategoryPage(button) {
    super.loadPage(button, '/Category/viewTree.action', false, true);
  }

  static openDeleteContentTypePage(button) {
    super.loadPage(button, '/Entity/trashEntityType.action');
  }

  static openDeleteAssetsPage(button){
    super.loadPage(button, '/jacms/Resource/trash.action');
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

  getDeleteButton() {
    return this.getForm()
               .find(`${htmlElements.button}[type="submit"]`);
  }

  setOrigin(originPage) {
    this.origin = originPage;
  }

  submit() {
    this.getDeleteButton().then(button => this.click(button));
    return cy.wrap(this.origin).as('currentPage');
  }

}
