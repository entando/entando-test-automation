import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import RolesPage from './RolesPage.js';

export default class AddPage extends AppContent {

  nameInput    = `${htmlElements.input}[name="name"]#name`;
  codeInput    = `${htmlElements.input}[name="code"]#code`;
  permissions  = `${htmlElements.div}.PermissionGrid`;
  cancelButton = `${htmlElements.button}[type=button].btn-default`;
  saveButton   = `${htmlElements.button}[type=submit].btn-primary`;

  static openPage(button) {
    super.loadPage(button, '/role/add');
  }

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
               .find(this.permissions)
               .parent();
  }

  getPermissionsTitle() {
    return this.getContents()
               .find(this.permissions)
               .parent()
               .children(htmlElements.legend);
  }

  getPermissionsGrid() {
    return this.getContents()
               .find(this.permissions)
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

  submitForm() {
    this.getSaveButton().then(button => RolesPage.openPage(button));
    return cy.wrap(new AppPage(RolesPage)).as('currentPage');
  }

  addRole(name, code, append = false) {
    this.getNameInput().then(input => this.type(input, name));
    this.getCodeInput().then(input => this.type(input, code, append));
    return this.submitForm();
  }

}
