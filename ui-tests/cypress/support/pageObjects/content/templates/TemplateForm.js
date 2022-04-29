import {htmlElements} from '../../WebElement';

import AdminContent  from '../../app/AdminContent';
import AdminPage     from '../../app/AdminPage';
import TemplatesPage from './TemplatesPage';

export default class TemplateForm extends AdminContent {

  idInput           = `${htmlElements.input}[name="modelId"]`;
  nameInput         = `${htmlElements.input}[name="description"]`;
  contentTypeInput  = `${htmlElements.select}[name="contentType"]`;
  assistButton      = `${htmlElements.a}[id="popover-inline-editing-assist"]`;
  contentShapeInput = `${htmlElements.div}[class="display-block"]`;
  htmlCode          = `${htmlElements.div}[class="CodeMirror-code"]`;
  aceTextInput      = `${htmlElements.div}.CodeMirror-lines`;
  stylesheetInput   = `${htmlElements.input}[name='stylesheet']`;
  submitButton      = `${htmlElements.button}[type='submit'][class="btn btn-primary pull-right"]`;
  cancelButton      = `${htmlElements.button}[type='button'].AddContentTypeFormBody__cancel--btn.btn-default`;

  //FIXME AdminConsole is not built on REST APIs
  static openPage(button) {
    cy.contentTemplatesAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'addContentTemplatePageLoadingGET', '/new.action'));
    cy.get(button).click();
    cy.wait('@addContentTemplatePageLoadingGET');
  }

  //FIXME AdminConsole is not built on REST APIs
  static openEdit(button, code) {
    cy.contentTemplatesAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'editContentTemplatePageLoadingGET', `/edit.action?modelId=${code}`));
    cy.get(button).click();
    cy.wait('@editContentTemplatePageLoadingGET');
  }

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

  clearHTMLModel(text) {
    this.getContentShapeInput().click();
    for (let i = 0; i < text.length; i++) {
      cy.realPress(['Shift', 'ArrowLeft']);
    }
    cy.realPress(['Backspace']);
    return cy.get('@currentPage');
  }

  fillFormFields(payload) {
    const fields = Object.keys(payload);
    fields.forEach((field) => {
      if (payload[field] === '') {
        return;
      }
      switch (field) {
        case 'id':
          this.getIDInput().then(input => this.type(input, payload[field]));
          break;
        case 'descr':
          this.getNameInput().then(input => this.type(input, payload[field]));
          break;
        case 'contentType':
          this.getContentTypeDropdown().then(input => this.select(input, payload[field]));
          break;
        case 'contentShape':
          this.getContentShapeInput().then(input => this.type(input, payload[field], true));
          break;
        case 'stylesheet':
          this.getStylesheetInput().then(input => this.type(input, payload[field]));
          break;
        default:
          break;
      }
    });
  }

  getSaveButton() {
    return this.getFormArea()
               .find(this.submitButton);
  }

  submitForm() {
    this.getSaveButton().then(button => this.click(button));
    return cy.wrap(new AdminPage(TemplatesPage)).as('currentPage');
  }

}
