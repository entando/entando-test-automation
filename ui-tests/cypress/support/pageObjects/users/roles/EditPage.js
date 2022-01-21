import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content from '../../app/Content.js';

import AppPage from '../../app/AppPage.js';

import RolesPage from './RolesPage.js';

export default class EditPage extends Content {

  nameInput    = `#name`;
  codeInput    = `#code`;
  permissions  = `${htmlElements.form}.RoleForm`;
  cancelButton = `${htmlElements.button}.pull-right`;
  saveButton   = `${htmlElements.button}.RoleForm__saveButton`;

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
               .find(this.permissions)
               .children(htmlElements.div)
               .children(htmlElements.div);
  }

  getCancelButton() {
    return this.getContents()
               .find(this.permissions)
               .children().eq(2)
               .children()
               .children(htmlElements.button).eq(1)
               .find(htmlElements.span);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.permissions)
               .children().eq(2)
               .children()
               .children(htmlElements.button).eq(0)
               .find(htmlElements.span);
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
