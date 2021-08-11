import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content from '../../app/Content.js';

import AppPage from '../../app/AppPage.js';

import CategoriesPage from './CategoriesPage';

export default class AddPage extends Content {

  titleItInput      = `${htmlElements.input}[name="titles.it"][${DATA_TESTID}=form_RenderTextInput_input]`;
  titleEnInput      = `${htmlElements.input}[name="titles.en"][${DATA_TESTID}=form_RenderTextInput_input]`;
  codeInput         = `${htmlElements.input}[name="code"][${DATA_TESTID}=form_RenderTextInput_input]`;
  treePositionInput = `${htmlElements.table}[${DATA_TESTID}=common_CategoryTreeSelector_table]`;
  saveButton        = `${htmlElements.button}[${DATA_TESTID}=common_CategoryForm_Button]`;

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
