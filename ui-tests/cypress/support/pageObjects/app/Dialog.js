import {DATA_TESTID, htmlElements, WebElement} from "../WebElement.js";

export default class Dialog extends WebElement {

  dialog = `${htmlElements.div}[role=dialog]`;
  header = `${htmlElements.div}.modal-header`;
  title = `${htmlElements.button}[${DATA_TESTID}=modal-title]`;
  closeButton = `${htmlElements.button}[${DATA_TESTID}=modal_GenericModal_button]`;
  body = `${htmlElements.div}.modal-body`;
  footer = `${htmlElements.div}.modal-footer`;

  get() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(this.dialog);
  }

  getHeader() {
    return this.get()
               .find(this.header);
  }

  getBody() {
    return this.get()
               .find(this.body);
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

  getState() {
    return this.getBody()
               .children(htmlElements.div);
  }

  getStateTitle() {
    return this.getBody()
               .children(htmlElements.div)
               .children(htmlElements.h4);
  }

  getStateInfo() {
    return this.getBody()
               .children(htmlElements.div)
               .children(htmlElements.p);
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
  }

  cancel() {
    this.getCancelButton().click();
  }

  confirm() {
    this.getConfirmButton().click();
  }

}