import {DATA_TESTID, htmlElements, WebElement} from '../WebElement.js';

export class Dialog extends WebElement {

  dialog      = `${htmlElements.div}[role=dialog]`;
  header      = `${htmlElements.div}.modal-header`;
  title       = `${htmlElements.h4}.modal-title`;
  closeButton = `${htmlElements.button}[${DATA_TESTID}=modal_GenericModal_button]`;
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
  }

  cancel() {
    this.getCancelButton().click();
    this.body = null;
  }

  confirm() {
    this.getConfirmButton().click();
    this.body = null;
  }

}

export class DialogContent extends WebElement {

  body = `${htmlElements.div}.modal-body`;

  get() {
    return this.parent.get()
               .find(this.body);
  }

}
