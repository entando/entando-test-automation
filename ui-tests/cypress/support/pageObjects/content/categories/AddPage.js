import AppPage        from '../../app/AppPage.js';
import CategoriesPage from './CategoriesPage';
import Content        from '../../app/Content.js';
import {htmlElements} from '../../WebElement';

export default class AddPage extends Content {

  titleItInput      = `${htmlElements.input}[name="titles.it"][id="titles.it"]`;
  titleEnInput      = `${htmlElements.input}[name="titles.en"][id="titles.en"]`;
  codeInput         = `${htmlElements.input}[name="code"]#code`;
  treePositionInput = `${htmlElements.table}.CategoryTreeSelector`;
  saveButton        = `${htmlElements.button}[type=submit].CategoryForm__save-btn`;

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
    return new AppPage(CategoriesPage);

  }

}
