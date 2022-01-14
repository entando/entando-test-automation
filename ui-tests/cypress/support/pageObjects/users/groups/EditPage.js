import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content from '../../app/Content.js';

import AppPage from '../../app/AppPage.js';

import GroupsPage from './GroupsPage.js';

export default class EditPage extends Content {

  nameInput    = `${htmlElements.input}[name="name"]`;
  codeInput    = `${htmlElements.input}[name="code"]`;
  cancelButton = `${htmlElements.button}.btn-default`;
  saveButton   = `${htmlElements.button}.btn-primary`;

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
    cy.wait(1000);
    return new AppPage(GroupsPage);
  }

}
