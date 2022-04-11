import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import ProfileTypesPage from './ProfileTypesPage';

export default class EditPage extends AppContent {

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

  clearName() {
    this.getNameInput().clear();
  }

  save() {
    this.getSaveButton().click();
    return new AppPage(ProfileTypesPage);
  }

}
