import {htmlElements} from '../../WebElement';

import Content       from '../../app/Content';
import AppPage       from '../../app/AppPage';
import TemplatesPage from './TemplatesPage';

export default class TemplateForm extends Content {
  idInput           = `${htmlElements.input}[name='id']`;
  nameInput         = `${htmlElements.input}[name='descr']`;
  contentTypeInput  = `${htmlElements.div}.DropdownTypeahead.form-group`;
  assistButton      = `${htmlElements.button}[type='button'].AddContentTemplateForm__editassistbtn`;
  contentShapeInput = `${htmlElements.div}#contentShape`;
  aceTextInput      = `${htmlElements.textarea}.ace_text-input`;
  stylesheetInput   = `${htmlElements.input}[name='stylesheet']`;
  submitButton      = `${htmlElements.button}[type='submit'].AddContentTypeFormBody__save--btn.btn-primary`;
  cancelButton      = `${htmlElements.button}[type='button'].AddContentTypeFormBody__cancel--btn.btn-default`;

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
               .find(this.aceTextInput)
               .first();
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
    this.getContentTypeDropdown().click()
        .contains(value).click();
  }

  typeHTMLModel(value) {
    this.getContentShapeInput().focus().type(value);
  }

  typeStylesheet(value) {
    this.getStylesheetInput().type(value);
  }

  editFormFields(payload) {
    const fields = Object.keys(payload);
    fields.forEach((field) => {
      if (payload[field] === '') {
        return;
      }
      switch (field) {
        case 'id':
          this.getIDInput().clear();
          this.typeId(payload[field]);
          break;
        case 'descr':
          this.getNameInput().clear();
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

  getFootArea() {
    return this.getFormArea()
               .children(`${htmlElements.div}.row`).eq(1);
  }

  getSaveButton() {
    return this.getFootArea()
               .find(this.submitButton);
  }

  submitForm() {
    this.getSaveButton().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(TemplatesPage);
  }
}
