import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import EditPage from './EditPage';

export default class AddPage extends AppContent {

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
    return new AppPage(EditPage);
  }

  addAndSaveProfileType(code, name) {
    this.typeName(name);
    this.typeCode(code);
    return this.save();
  }

}
