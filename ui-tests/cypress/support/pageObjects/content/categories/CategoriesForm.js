import {htmlElements} from '../../WebElement';

import AdminContent   from '../../app/AdminContent';
import AdminPage      from '../../app/AdminPage';
import CategoriesPage from './CategoriesPage';

export default class CategoriesForm extends AdminContent {

  titleItInput      = `${htmlElements.input}#langit`;
  titleEnInput      = `${htmlElements.input}#langen`;
  codeInput         = `${htmlElements.input}#categoryCode`;
  treePositionInput = `${htmlElements.table}#categoryTree`;
  saveButton        = `${htmlElements.button}[type="submit"]`;

  static openAddPage(button) {
    super.loadPage(button, '/Category/new.action');
  }

  static openEditPage(button) {
    super.loadPage(button, '/Category/viewTree.action', false, true);
  }

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

  setTreePosition(treePosition) {
    return this.getTreePositionInput().contains(treePosition).then(input => this.click(input));
  }

  submitForm() {
    this.getSaveButton().then(button => CategoriesPage.openPage(button));
    return cy.wrap(new AdminPage(CategoriesPage)).as('currentPage');
  }

  fillFields(titleEn, titleIt, code, treePosition, append = false, edit = false) {
    this.getTitleItInput().then(input => this.type(input, titleIt, append));
    this.getTitleEnInput().then(input => this.type(input, titleEn, append));
    if (!edit) {
      this.getCodeInput().then(input => this.type(input, code, append));
      this.setTreePosition(treePosition);
    }
    return cy.get('@currentPage');
  }

  addCategory(titleEn, titleIt, code, treePosition, append = false) {
    this.fillFields(titleEn, titleIt, code, treePosition, append);
    return this.submitForm();
  }

  editCategory(titleEn, titleIt, append = false) {
    this.fillFields(titleEn, titleIt, '', '', append, true);
    return this.submitForm();
  }

}
