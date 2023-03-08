import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import ManagementPage from './ManagementPage.js';

export default class EditPage extends AppContent {

  usernameInput        = `${htmlElements.input}[name=username]#username`;
  passwordInput        = `${htmlElements.input}[name=password]#password`;
  passwordConfirmInput = `${htmlElements.input}[name=passwordConfirm]#passwordConfirm`;
  status               = `${htmlElements.div}.bootstrap-switch`;
  saveButton           = `${htmlElements.button}[type=submit].btn-primary`;
  cancelButton         = `${htmlElements.button}[type=button].btn-default`;

  static openPage(button, code) {
    super.loadPage(button, `/user/edit/${code}`);
  }

  getUsernameInput() {
    return this.getContents()
               .find(this.usernameInput);
  }

  getPasswordInput() {
    return this.getContents()
               .find(this.passwordInput);
  }

  getPasswordConfirmInput() {
    return this.getContents()
               .find(this.passwordConfirmInput);
  }

  getStatus() {
    return this.getContents()
               .find(`${htmlElements.div}.form-group`).eq(7)
               .find(this.status);
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
    this.getSaveButton().then(button => ManagementPage.openPage(button, false));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

  editUser(password, changeStatus = false, passwordConfirm = password) {
    this.getPasswordInput().then(input => this.type(input, password));
    this.getPasswordConfirmInput().then(input => this.type(input, passwordConfirm));
    if (changeStatus) this.getStatus().children(htmlElements.div).then(button => this.click(button));
    return this.submitForm();
  }

}
