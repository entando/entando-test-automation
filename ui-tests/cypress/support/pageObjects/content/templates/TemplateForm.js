import {htmlElements} from '../../WebElement';

import AppContent    from '../../app/AppContent';
import AppPage       from '../../app/AppPage';
import TemplatesPage from './TemplatesPage';

export default class TemplateForm extends AppContent {

  idInput           = `${htmlElements.input}[name='id']`;
  nameInput         = `${htmlElements.input}[name='descr']`;
  contentTypeInput  = `${htmlElements.div}.DropdownTypeahead.form-group`;
  assistButton      = `${htmlElements.button}[type='button'].AddContentTemplateForm__editassistbtn`;
  contentShapeInput = `${htmlElements.div}#contentShape`;
  aceTextInput      = `${htmlElements.textarea}.ace_text-input`;
  stylesheetInput   = `${htmlElements.input}[name='stylesheet']`;
  submitButton      = `${htmlElements.button}[type='submit'].AddContentTypeFormBody__save--btn.btn-primary`;
  cancelButton      = `${htmlElements.button}[type='button'].AddContentTypeFormBody__cancel--btn.btn-default`;

  static openPage(button) {
    cy.contentTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'addContentTemplatePageLoadingGET', '/dictionary'));
    cy.contentTypesController().then(controller => controller.intercept({method: 'GET'}, 'contentTypesLoadingGET', '?pageSize=0'));
    cy.get(button).click();
    cy.wait(['@addContentTemplatePageLoadingGET', '@contentTypesLoadingGET']);
  }

  static openEdit(button, code) {
    cy.contentTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'editContentTemplatePageLoadingGET', `/${code}`));
    cy.contentTypesController().then(controller => controller.intercept({method: 'GET'}, 'contentTypesLoadingGET', '?pageSize=0'));
    cy.contentTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'contentTemplateDictionaryGET', '/dictionary'));
    cy.get(button).click();
    cy.wait(['@editContentTemplatePageLoadingGET', '@contentTypesLoadingGET', '@contentTemplateDictionaryGET']);
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

  clearHTMLModel() {
    return this.getContentShapeInput().focus().then(input => this.clear(input));
  }

  selectContentType(value) {
    this.getContentTypeDropdown().click()
        .contains(value).click();
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
        case 'contentTypeText':
          this.selectContentType(payload[field]);
          break;
        case 'contentShape':
          this.getContentShapeInput().focus().then(input => this.type(input, payload[field], true));
          break;
        case 'stylesheet':
          this.getStylesheetInput().then(input => this.type(input, payload[field]));
          break;
        default:
          break;
      }
    });
    return cy.get('@currentPage');
  }

  getSaveButton() {
    return this.getFormArea()
               .find(this.submitButton);
  }

  submitForm() {
    this.getSaveButton().then(button => TemplatesPage.openPage(button));
    return cy.wrap(new AppPage(TemplatesPage)).as('currentPage');
  }

}
