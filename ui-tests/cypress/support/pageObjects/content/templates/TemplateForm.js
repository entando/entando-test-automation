import {htmlElements} from '../../WebElement';

import Content       from '../../app/Content';
import AdminPage       from '../../app/AdminPage';
import TemplatesPage from './TemplatesPage';

export default class TemplateForm extends Content {
  idInput           = `${htmlElements.input}[name="modelId"]`;
  nameInput         = `${htmlElements.input}[name="description"]`;
  contentTypeInput  = `${htmlElements.select}[name="contentType"]`;
  assistButton      = `${htmlElements.a}[id="popover-inline-editing-assist"]`;
  contentShapeInput = `${htmlElements.div}[class="display-block"]`;
  htmlCode = `${htmlElements.div}[class="CodeMirror-code"]`;
  aceTextInput      = `${htmlElements.div}.CodeMirror-lines`;
  stylesheetInput   = `${htmlElements.input}[name='stylesheet']`;
  submitButton      = `${htmlElements.button}[type='submit'][class="btn btn-primary pull-right"]`;
  cancelButton      = `${htmlElements.button}[type='button'].AddContentTypeFormBody__cancel--btn.btn-default`;
  alert             = `${htmlElements.div}[class="alert alert-danger alert-dismissable"]`;
  getFormArea() {
    return this.get()
               .find(htmlElements.form);
  }

  getIDInput() {
    return this.getFormArea()
               .find(this.idInput);
  }

  getNameInput() {
    return this.getFormArea()
               .find(this.nameInput);
  }

  getContentTypeDropdown() {
    return this.getFormArea()
               .find(this.contentTypeInput);

  }

  getAssistButton() {
    return this.getFormArea()
               .find(this.assistButton);
  }

  getContentShapeInput() {
    return this.getFormArea()
               .find(this.contentShapeInput)
               .find(this.aceTextInput);
  }


  getStylesheetInput() {
    return this.getFormArea()
               .find(this.stylesheetInput);
  }

  typeId(value) {
    this.getIDInput().type(value);
  }

  typeName(value) {
    this.getNameInput().type(value);
  }

  selectContentType(value) {
    this.getContentTypeDropdown().select(value);
  }

  typeHTMLModel(value) {
    this.getContentShapeInput().click().type(value);
  }

  typeStylesheet(value) {
    this.getStylesheetInput().type(value);
  }

  clearId() {
    this.getIDInput().clear();
  }

  clearName() {
    this.getNameInput().clear();
  }

  clearHTMLModel(text) {
    this.getContentShapeInput().click();
    for (let i = 0; i < text.length; i++) {
      cy.realPress(['Shift', 'ArrowLeft']);
    }
    cy.realPress(['Backspace']);

  }

  editFormFields(payload) {
    const fields = Object.keys(payload);
    fields.forEach((field) => {
      if (payload[field] === '') {
        return;
      }
      switch (field) {
        case 'id':
          this.clearId();
          this.typeId(payload[field]);
          break;
        case 'descr':
          this.clearName();
          this.typeName(payload[field]);
          break;
        case 'contentType':
          this.selectContentType(payload[field]);
          break;
        case 'contentShape':
          this.typeHTMLModel(payload[field]);
          break;
        case 'stylesheet':
          this.getStylesheetInput().clear();
          this.typeStylesheet(payload[field]);
          break;
        default:
          break;
      }
    });
  }
  getAlert(){
    return this.getFormArea()
               .find(this.alert);
  }


  getSaveButton() {
    return this.getFormArea()
               .find(this.submitButton);
  }

  submitForm() {
    this.getSaveButton().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AdminPage(TemplatesPage);
  }
}
