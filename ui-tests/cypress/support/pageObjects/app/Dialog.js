import {htmlElements, WebElement} from '../WebElement.js';

import AppPage from './AppPage';

export class Dialog extends WebElement {

  dialog      = `${htmlElements.div}[role=dialog]`;
  header      = `${htmlElements.div}.modal-header`;
  title       = `${htmlElements.h4}.modal-title`;
  closeButton = `${htmlElements.button}[type=button].close`;
  footer      = `${htmlElements.div}.modal-footer`;

  get() {
    return this.parent.get()
               .children(htmlElements.body)
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

  getCancelButton() {
    return this.getFooter()
               .children(htmlElements.button).eq(0);
  }

  getConfirmButton() {
    return this.getFooter()
               .children(htmlElements.button).eq(1);
  }

  close() {
    this.getCloseButton().click();
    this.body = null;
    return cy.get('@currentPage');
  }

  cancel() {
    this.getCancelButton().click();
    this.body = null;
    return cy.get('@currentPage');
  }

  confirm() {
    const body = {...this.body};
    this.body = null;
    this.getConfirmButton().then(button => {
      if (body.loadOnConfirm) {
        !body.code ? body.loadOnConfirm.openPage(button) : body.loadOnConfirm.openPage(button, body.code);
        return cy.wrap(new body.appOrAdmin(body.loadOnConfirm)).as('currentPage');
      } else {
        cy.get(button).click();
        return cy.get('@currentPage');
      }
    });
  }

}

export class DialogContent extends WebElement {

  body = `${htmlElements.div}.modal-body`;
  loadOnConfirm = null;
  appOrAdmin = null;
  code = null;

  get() {
    return this.parent.get()
               .find(this.body);
  }

  setLoadOnConfirm(loadOnConfirm, appOrAdmin = AppPage, code = null) {
    this.loadOnConfirm = loadOnConfirm;
    this.appOrAdmin = appOrAdmin;
    this.code = code;
  }

}
