import {htmlElements} from '../../WebElement';

import Content from '../../app/Content.js';

import AdminPage from '../../app/AdminPage.js';

import EditPage from './EditPage';

export default class AddPage extends Content {

  codeInput  = `${htmlElements.input}[name=code]`;
  nameInput  = `${htmlElements.input}[name=name]`;
  saveButton = `${htmlElements.button}.AddContentTypeFormBody__save--btn`;

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  typeName(value) {
   return this.getNameInput().type(value);
  }

  typeCode(value) {
    return this.getCodeInput().type(value);
  }

  save() {
    this.getSaveButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AdminPage(EditPage);
  }

  addAndSaveContentType(code, name) {
    this.typeCode(code);
    this.typeName(name);
    return this.save();
  }

}
