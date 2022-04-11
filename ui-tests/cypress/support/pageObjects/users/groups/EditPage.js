import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import GroupsPage from './GroupsPage.js';

export default class EditPage extends AppContent {

  nameInput    = `${htmlElements.input}[name="name"]#name`;
  codeInput    = `${htmlElements.input}[name="code"]#code`;
  cancelButton = `${htmlElements.button}[type=button].btn-default`;
  saveButton   = `${htmlElements.button}[type=submit].btn-primary`;

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getCancelButton() {
    return this.getContents()
               .find(this.cancelButton);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  typeName(input) {
    this.getNameInput().type(input);
  }

  clearName() {
    this.getNameInput().clear();
  }

  submitForm() {
    this.getSaveButton().click();
  }

  editGroup(name, append = false) {
    if (!append) {
      this.clearName();
    }
    this.typeName(name);
    this.submitForm();
    return new AppPage(GroupsPage);
  }

}
