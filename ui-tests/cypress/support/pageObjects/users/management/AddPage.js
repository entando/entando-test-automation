import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content from '../../app/Content.js';

import AppPage from '../../app/AppPage.js';

import ManagementPage from './ManagementPage.js';

export default class AddPage extends Content {

  usernameInput        = `${htmlElements.input}[name=username]`;
  passwordInput        = `${htmlElements.input}[name=password]`;
  passwordConfirmInput = `${htmlElements.input}[name=passwordConfirm]`;
  profileTypeSelect    = `${htmlElements.select}[name=profileType]`;
  status               = `${htmlElements.fieldset}[${DATA_TESTID}=common_UserForm_fieldset]`;
  saveButton           = `${htmlElements.button}.btn-primary`;
  otherButtons         = `${htmlElements.button}[${DATA_TESTID}=common_UserForm_Button]`;

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

  typeUsername(input) {
    this.getUsernameInput().type(input);
  }

  typePassword(input) {
    this.getPasswordInput().type(input);
  }

  typePasswordConfirm(input) {
    this.getPasswordConfirmInput().type(input);
  }

  selectProfileType(value) {
    this.getProfileTypeSelect().select(value);
  }

  submitForm() {
    this.getSaveButton().click();
  }

  addUser(username, password, profileType, passwordConfirm = password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.typePasswordConfirm(passwordConfirm);
    this.selectProfileType(profileType);
    this.submitForm();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(ManagementPage);
  }

}
