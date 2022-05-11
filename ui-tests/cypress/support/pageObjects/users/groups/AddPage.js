import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import GroupsPage from './GroupsPage.js';

export default class AddPage extends AppContent {

  nameInput    = `${htmlElements.input}[name="name"]#name`;
  codeInput    = `${htmlElements.input}[name="code"]#code`;
  cancelButton = `${htmlElements.button}[type=button].btn-default`;
  saveButton   = `${htmlElements.button}[type=submit].btn-primary`;

  static openPage(button) {
    cy.get(button).click();
    cy.validateUrlPathname('/group/add');
  }

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

  submitForm() {
    this.getSaveButton().then(button => GroupsPage.openPage(button));
    return cy.wrap(new AppPage(GroupsPage)).as('currentPage');
  }

  addGroup(name, code, append = false) {
    this.getNameInput().then(input => this.type(input, name));
    this.getCodeInput().then(input => this.type(input, code, append));
    return this.submitForm();
  }

}
