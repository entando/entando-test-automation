import {htmlElements} from '../../WebElement';

import Content from '../../app/Content.js';

import AppPage from '../../app/AppPage.js';

import ProfileTypesPage from './ProfileTypesPage';

export default class EditPage extends Content {

  codeInput  = `${htmlElements.input}[name=code]`;
  nameInput  = `${htmlElements.input}[name=name]`;
  saveButton = `${htmlElements.button}.ProfileTypeForm__save-btn`;

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

  typeName(value) {
    this.getNameInput().type(value);
  }

  clearName() {
    this.getNameInput().clear();
  }

  save() {
    this.getSaveButton().click();
    //cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods -> fixed with cy.location checking the URL)
    cy.location('pathname').should('not.include', '/edit');
    return new AppPage(ProfileTypesPage);
  }

}
