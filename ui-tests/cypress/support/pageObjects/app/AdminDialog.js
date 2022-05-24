import {htmlElements, WebElement} from '../WebElement.js';

export class AdminDialog extends WebElement {

  dialog      = `${htmlElements.div}[role=dialog]`;
  header      = `${htmlElements.div}.modal-header`;
  title       = `${htmlElements.h4}.modal-title`;
  closeButton = `${htmlElements.button}[type=button].close`;
  footer      = `${htmlElements.div}.modal-footer`;

  get() {
    return this.parent.get()
               .children(htmlElements.body)
               .find('.form-horizontal')
               .children(this.dialog);
  }

  setBody(content) {
    this.body = new content(this);
  }

  getHeader() {
    return this.get()
               .find(this.header);
  }

  getBody() {
    return this.body;
  }

  getFooter() {
    return this.get()
               .find(this.footer);
  }

  getTitle() {
    return this.getHeader()
               .children(this.title);
  }

  getCloseButton() {
    return this.getHeader()
               .children(this.closeButton);
  }

  close() {
    this.getCloseButton().click();
    this.body = null;
    return cy.get('@currentPage');
  }

}

export class DialogAdminContent extends WebElement {

  body = `${htmlElements.div}.modal-content`;

  get() {
    return this.parent.get()
               .find(this.body);
  }

}
