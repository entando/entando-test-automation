import { htmlElements } from '../../WebElement';

import Content from '../../app/Content.js';

import AppPage from '../../app/AppPage.js';

import EditPage from './EditPage';

export default class AddPage extends Content {

  codeInput  = `${htmlElements.input}[name=code]`;
  nameInput  = `${htmlElements.input}[name=name]`;
  saveButton = `${htmlElements.button}.ProfileTypeForm__save-btn`;

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
    this.getNameInput().type(value);
  }

  typeCode(value) {
    this.getCodeInput().type(value);
  }

  save() {
    this.getSaveButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AppPage(EditPage);
  }

  addAndSaveProfileType(code, name) {
    this.typeName(name);
    this.typeCode(code);
    return this.save();
  }

}
