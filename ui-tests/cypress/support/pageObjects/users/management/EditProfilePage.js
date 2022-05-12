import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import ManagementPage from './ManagementPage.js';

export default class EditProfilePage extends AppContent {

  profileTypeSelect   = `${htmlElements.select}[name=typeCode].RenderSelectInput`;
  usernameInput       = `${htmlElements.input}[name=id]#id`;
  fullNameInput       = `${htmlElements.input}[name=fullname]#fullname`;
  emailInput          = `${htmlElements.input}[name=email]#email`;
  profilePictureInput = `${htmlElements.input}[name=profilepicture]#profilepicture`;
  saveButton          = `${htmlElements.button}[type=submit].btn-primary`;

  static openPage(button, profileType) {
    cy.profileTypesController().then(controller => controller.intercept({method: 'GET'}, 'editProfilePageLoadingGET', `/${profileType}`));
    cy.get(button).click();
    cy.wait('@editProfilePageLoadingGET');
  }

  getProfileTypeSelect() {
    return this.getContents()
               .find(this.profileTypeSelect);
  }

  getUsernameInput() {
    return this.getContents()
               .find(this.usernameInput);
  }

  getFullNameInput() {
    return this.getContents()
               .find(this.fullNameInput);
  }

  getEmailInput() {
    return this.getContents()
               .find(this.emailInput);
  }

  getProfilePictureInput() {
    return this.getContents()
               .find(this.profilePictureInput);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  selectProfileType(value) {
    cy.profileTypesController().then(controller => controller.intercept({method: 'GET'}, 'selectProfileTypeLoadingGET', `/${value}`));
    this.getProfileTypeSelect().then(input => this.select(input, value));
    cy.wait('@selectProfileTypeLoadingGET');
    return cy.get('@currentPage');
  }

  submitForm() {
    this.getSaveButton().then(button => ManagementPage.openPage(button));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

  editUser(profileType, fullName, email, profilePicture) {
    if (profileType) this.selectProfileType(profileType);
    this.getFullNameInput().then(input => this.type(input, fullName));
    this.getEmailInput().then(input => this.type(input, email));
    if (profilePicture) this.getProfilePictureInput().then(input => this.type(input, profilePicture));
    return this.submitForm();
  }

}
