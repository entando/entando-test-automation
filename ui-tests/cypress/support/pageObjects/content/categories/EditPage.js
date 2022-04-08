import AdminPage        from '../../app/AdminPage.js';
import CategoriesPage from './CategoriesPage';
import AdminContent        from '../../app/AdminContent.js';
import {htmlElements} from '../../WebElement';

export default class EditPage extends AdminContent {

  titleItInput      = `${htmlElements.input}#langit`;
  titleEnInput      = `${htmlElements.input}#langen`;
  codeInput         = `${htmlElements.input}#categoryCode`;
  saveButton        = `${htmlElements.button}[type="submit"]`;

  getTitleItInput() {
    return this.getContents()
               .find(this.titleItInput);
  }

  getTitleEnInput() {
    return this.getContents()
               .find(this.titleEnInput);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  typeTitleIt(input) {
    this.getTitleItInput().type(input);
  }

  typeTitleEn(input) {
    this.getTitleEnInput().type(input);
  }

  clearTitleIt() {
    this.getTitleItInput().clear();
  }

  clearTitleEn() {
    this.getTitleEnInput().clear();
  }

  typeCode(input) {
    this.getCodeInput().type(input);
  }

  submitForm() {
    this.getSaveButton().click();
  }

  editCategory(titleEn, titleIt, append = false) {
    if (!append) {
      this.clearTitleEn();
      this.clearTitleIt();
    }
    this.typeTitleIt(titleIt);
    this.typeTitleEn(titleEn);
    this.submitForm();
    cy.wait(1000);
    return new AdminPage(CategoriesPage);
  }

}
