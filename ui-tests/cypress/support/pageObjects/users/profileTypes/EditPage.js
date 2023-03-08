import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import ProfileTypesPage from './ProfileTypesPage';

export default class EditPage extends AppContent {

  codeInput  = `${htmlElements.input}[name=code]`;
  nameInput  = `${htmlElements.input}[name=name]`;
  saveButton = `${htmlElements.button}.ProfileTypeForm__save-btn`;

  static openPage(button, code) {
    super.loadPage(button, `/profiletype/edit/${code}`);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  save() {
    this.getSaveButton().then(button => ProfileTypesPage.openPage(button));
    return cy.wrap(new AppPage(ProfileTypesPage)).as('currentPage');
  }

}
