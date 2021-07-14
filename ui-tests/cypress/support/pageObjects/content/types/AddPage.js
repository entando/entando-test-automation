import {TEST_ID_KEY, htmlElements, WebElement} from '../../WebElement';
import Content from '../../app/Content.js';
import AppPage from '../../app/AppPage.js';
import TypesPage from './TypesPage.js';
import EditPage from './EditPage';

export default class AddPage extends Content {

  nameInput = `${htmlElements.input}[name=name]`;
  codeInput = `${htmlElements.input}[name=code]`;

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getSaveButton() {
    return this.getContents()
               .find(htmlElements.button)
               .contains('Save');
  }

  typeName(value) {
    this.getNameInput().type(value);
  }

  typeCode(value) {
    this.getCodeInput().type(value);
  }

  save() {
    this.getSaveButton().click();
    cy.wait(1000);
    return new AppPage(EditPage);
  }

  addAndSaveContentType(code, name) {
    this.typeName(name);
    this.typeCode(code);
    return this.save();
  }
}