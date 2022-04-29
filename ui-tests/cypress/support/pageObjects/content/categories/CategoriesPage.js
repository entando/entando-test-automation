import {htmlElements}  from '../../WebElement.js';

import AdminContent    from '../../app/AdminContent';
import AdminPage       from '../../app/AdminPage';
import CategoriesForm  from './CategoriesForm';
import DeleteAdminPage from '../../app/DeleteAdminPage';
import KebabMenu       from '../../app/KebabMenu';

export default class CategoriesPage extends AdminContent {

  categoriesTree = `${htmlElements.table}[id="categoryTree"]`;

  //FIXME AdminConsole is not built on REST APIs
  static openPage(button) {
    cy.categoriesAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'categoriesPageLoadingGET', '/viewTree.action*'));
    cy.get(button).click();
    cy.wait('@categoriesPageLoadingGET');
  }

  getCategoriesTree() {
    return this.getContents()
               .find(this.categoriesTree);
  }

  getAddButton() {
    return this.getContents()
               .children(htmlElements.div)
               .children(htmlElements.a);
  }

  openAddCategoryPage() {
    this.getAddButton().then(button => CategoriesForm.openAddPage(button));
    return cy.wrap(new AdminPage(CategoriesForm)).as('currentPage');
  }

  getKebabMenu(code) {
    return new CategoriesKebabMenu(this, code);
  }

}

class CategoriesKebabMenu extends KebabMenu {


  get() {
    return this.parent.getCategoriesTree()
               .contains(htmlElements.td, this.code)
               .closest(htmlElements.tr);
  }

  getDropdownMenu() {
    return this.get()
               .find(`${htmlElements.button}[id="dropdownKebabRight1"]`);
  }

  open() {
    this.getDropdownMenu()
        .click();
    return this;
  }


  getEdit() {
    return this.get()
               .contains(htmlElements.button, 'Edit');
  }

  getDelete() {
    return this.get()
               .contains(htmlElements.button, 'Delete');

  }

  openEdit() {
    this.getEdit().then(button => CategoriesForm.openEditPage(button));
    return cy.wrap(new AdminPage(CategoriesForm)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().then(button => DeleteAdminPage.openDeleteCategoryPage(button));
    const deletePage = new AdminPage(DeleteAdminPage);
    deletePage.getContent().setOrigin(this.parent.parent);
    return cy.wrap(deletePage).as('currentPage');
  }

}
