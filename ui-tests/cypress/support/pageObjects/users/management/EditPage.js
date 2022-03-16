import {htmlElements} from '../../WebElement';

import Content from '../../app/Content.js';

import AppPage from '../../app/AppPage.js';

import ManagementPage from './ManagementPage.js';

export default class EditPage extends Content {

  usernameInput        = `${htmlElements.input}[name=username]#username`;
  passwordInput        = `${htmlElements.input}[name=password]#password`;
  passwordConfirmInput = `${htmlElements.input}[name=passwordConfirm]#passwordConfirm`;
  status               = `${htmlElements.div}.bootstrap-switch`;
  saveButton           = `${htmlElements.button}[type=submit].btn-primary`;
  cancelButton         = `${htmlElements.button}[type=button].btn-default`;

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

  typePassword(input) {
    this.getPasswordInput().type(input);
  }

  typePasswordConfirm(input) {
    this.getPasswordConfirmInput().type(input);
  }

  changeStatus() {
    this.getStatus()
        .children(htmlElements.div)
        .click();
  }

  submitForm() {
    this.getSaveButton().click();
  }

  editUser(password, changeStatus = false, passwordConfirm = password) {
    this.typePassword(password);
    this.typePasswordConfirm(passwordConfirm);
    if (changeStatus) {
      this.changeStatus();
    }
    this.submitForm();
    return new AppPage(ManagementPage);
  }

}
