import {htmlElements} from '../WebElement.js';
import AdminContent   from './AdminContent';

export default class DeleteAdminPage extends AdminContent {

  form         = `${htmlElements.form}[id="delete"]`;
  closeButton  = `${htmlElements.a}`;
  cancelButton = `${htmlElements.button}[type="submit"]`;

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
    this.getCancelButton().click();
    return cy.wrap(this.origin).as('currentPage');
  }

  submitCancel() {
    this.getCancelButton().click();
    return this.origin;
  }


}
