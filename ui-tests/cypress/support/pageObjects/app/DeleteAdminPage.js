import {htmlElements} from '../WebElement.js';
import AdminContent   from './AdminContent';
import AdminPage      from './AdminPage';

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

  submitCancel(pageObject) {
    this.getCancelButton().click();
    return cy.wrap(new AdminPage(pageObject)).as('currentPage');
  }


}
