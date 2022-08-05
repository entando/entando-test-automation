import {htmlElements} from '../../WebElement';

import AppContent   from '../../app/AppContent';
import AppPage      from '../../app/AppPage';
import CategoriesPage from './CategoriesPage';

export default class CategoriesForm extends AppContent {

  titleItInput      = `${htmlElements.input}[name="titles.it"][id="titles.it"]`;
  titleEnInput      = `${htmlElements.input}[name="titles.en"][id="titles.en"]`;
  codeInput         = `${htmlElements.input}[name="code"]#code`;
  treePositionInput = `${htmlElements.table}.CategoryTreeSelector`;
  saveButton        = `${htmlElements.button}[type=submit].CategoryForm__save-btn`;

  static openAddPage(button) {
    cy.categoriesController().then(controller => controller.intercept({method: 'GET'}, 'categoriesLoadingGET', '/home'));
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesLoadingGET', '?*'));
    cy.get(button).click();
    cy.wait(['@categoriesLoadingGET', '@categoriesLoadingGET', '@languagesLoadingGET']);
  }

  static openEditPage(button, code) {
    cy.categoriesController().then(controller => controller.intercept({method: 'GET'}, 'categoryLoadingGET', `/${code}`))
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesLoadingGET', '?*'));
    cy.get(button).click();
    cy.wait(['@categoryLoadingGET', '@languagesLoadingGET']);
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
    return cy.wrap(new AppPage(CategoriesPage)).as('currentPage');
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
