import CategoriesPage from './CategoriesPage';
import AdminContent        from '../../app/AdminContent.js';
import {htmlElements} from '../../WebElement';
import AdminPage      from '../../app/AdminPage';

export default class AddPage extends AdminContent {

  titleItInput      = `${htmlElements.input}#langit`;
  titleEnInput      = `${htmlElements.input}#langen`;
  codeInput         = `${htmlElements.input}#categoryCode`;
  treePositionInput = `${htmlElements.table}#categoryTree`;
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

  getTreePositionInput() {
    return this.getContents()
               .find(this.treePositionInput);
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

  typeCode(input) {
    this.getCodeInput().type(input);
  }

  setTreePosition(treePosition) {
    this.getTreePositionInput().contains(treePosition).click();
  }

  clearCode() {
    this.getCodeInput().clear();
  }

  submitForm() {
    this.getSaveButton().click();
  }

  addCategory(titleEn, titleIt, code, treePosition, append = false) {
    this.typeTitleIt(titleIt);
    this.typeTitleEn(titleEn);
    if (!append) {
      this.clearCode();
    }
    this.typeCode(code);
    this.setTreePosition(treePosition);

    this.submitForm();
    cy.wait(1000);
    return new AdminPage(CategoriesPage);

  }

}
