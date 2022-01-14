import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content from '../../app/Content.js';

import AppPage from '../../app/AppPage.js';

import RolesPage from './RolesPage.js';

export default class EditPage extends Content {

  nameInput    = `${htmlElements.input}[name="name"]`;
  codeInput    = `${htmlElements.input}[name="code"]`;
  permissions  = `${htmlElements.fieldset}.no-padding`;
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

  getPermissions() {
    return this.getContents()
               .find(this.permissions);
  }

  getPermissionsTitle() {
    return this.getContents()
               .find(this.permissions)
               .children(htmlElements.legend);
  }

  getPermissionsGrid() {
    return this.getContents()
               .children(`${htmlElements.div}.container-fluid`)
               .children(htmlElements.div).eq(2)
               .find(`${htmlElements.div}.row`).eq(1)
               .find(this.permissions)
               .children(htmlElements.div)
               .children(htmlElements.div);
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

  editRole(name, append = false) {
    if (!append) {
      this.clearName();
    }
    this.typeName(name);
    this.submitForm();
    cy.wait(1000);
    return new AppPage(RolesPage);
  }

}
