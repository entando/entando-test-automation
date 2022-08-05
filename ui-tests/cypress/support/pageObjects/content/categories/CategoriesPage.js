import {htmlElements}  from '../../WebElement.js';

import AppContent    from '../../app/AppContent';
import AppPage       from '../../app/AppPage';
import CategoriesForm  from './CategoriesForm';
import DeleteDialog from '../../app/DeleteDialog';
import KebabMenu       from '../../app/KebabMenu';

export default class CategoriesPage extends AppContent {

  categoriesTree = `${htmlElements.table}.CategoryTree__table`;

  static openPage(button) {
    cy.categoriesController().then(controller => controller.intercept({method: 'GET'}, 'categoriesLoadingGET', '/home'));
    cy.get(button).click();
    cy.wait(['@categoriesLoadingGET']);
  }

  getCategoriesTree() {
    return this.getContents()
               .find(this.categoriesTree);
  }

  getAddButton() {
    return this.getContents()
               .find(`${htmlElements.button}[type=button].btn-primary`);
  }

  openAddCategoryPage() {
    this.getAddButton().then(button => CategoriesForm.openAddPage(button));
    return cy.wrap(new AppPage(CategoriesForm)).as('currentPage');
  }

  getKebabMenu(category) {
    return new CategoriesKebabMenu(this, category.titleEn, category.categoryCode);
  }

}

class CategoriesKebabMenu extends KebabMenu {

  constructor(parent, title, code) {
    super(parent, title);
    this.categoryCode = code;
  }

  get() {
    return this.parent.getCategoriesTree()
               .contains(htmlElements.td, this.code)
               .closest(htmlElements.tr);
  }

  open(force = false) {
    this.get()
        .find(htmlElements.button)
        .click({force: force});
    return this;
  }

  getEdit() {
    return this.get()
               .find(`${htmlElements.li}[data-id=edit-${this.categoryCode}]`);
  }

  getDelete() {
    return this.get()
               .find(`${htmlElements.li}.CategoryListMenuAction__menu-item-delete`);
  }

  openEdit() {
    this.getEdit().then(button => CategoriesForm.openEditPage(button, this.categoryCode));
    return cy.wrap(new AppPage(CategoriesForm)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().then(button => this.parent.click(button));
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
