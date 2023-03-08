import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import ManagementPage from './ManagementPage.js';

export default class AddPage extends AppContent {

  usernameInput        = `${htmlElements.input}[name=username]#username`;
  passwordInput        = `${htmlElements.input}[name=password]#password`;
  passwordConfirmInput = `${htmlElements.input}[name=passwordConfirm]#passwordConfirm`;
  profileTypeSelect    = `${htmlElements.select}[name=profileType].RenderSelectInput`;
  status               = `${htmlElements.fieldset}.common_UserForm_fieldset`;
  saveButton           = `${htmlElements.button}[type=submit].btn-primary`;
  otherButtons         = `${htmlElements.button}[type=button].UserForm__action-button`;

  static openPage(button) {
    super.loadPage(button, '/user/add');
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

  getProfileTypeSelect() {
    return this.getContents()
               .find(this.profileTypeSelect);
  }

  getStatus() {
    return this.getContents()
               .find(this.status);
  }

  getCancelButton() {
    return this.getContents()
               .find(this.otherButtons).eq(1);
  }

  getSaveAndEditButton() {
    return this.getContents()
               .find(this.otherButtons).eq(0);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  fillForm(username, password, profileType, passwordConfirm = password) {
    this.getUsernameInput().then(input => this.type(input, username));
    this.getPasswordInput().then(input => this.type(input, password));
    this.getPasswordConfirmInput().then(input => this.type(input, passwordConfirm));
    this.getProfileTypeSelect().then(input => this.select(input, profileType));
    return cy.get('@currentPage');
  }

  submitForm() {
    this.getSaveButton().then(button => ManagementPage.openPage(button));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

  addUser(username, password, profileType, passwordConfirm = password) {
    this.fillForm(username, password, profileType, passwordConfirm);
    return this.submitForm();
  }

}
