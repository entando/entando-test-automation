import AddPage         from './AddPage';
import AdminContent         from '../../app/AdminContent.js';
import EditPage        from './EditPage';
import {htmlElements}  from '../../WebElement.js';
import AdminPage       from '../../app/AdminPage';
import DeleteAdminPage from '../../app/DeleteAdminPage';
import KebabMenu       from '../../app/KebabMenu';

export default class CategoriesPage extends AdminContent {

  categoriesTree    = `${htmlElements.table}[id="categoryTree"]`;

  static openPage(button) {
    cy.get(button).click();
    cy.wait(1000);
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
    this.getAddButton().then(button => AddPage.openPage(button));
    return cy.wrap(new AdminPage(AddPage)).as('currentPage');
  }

  getKebabMenu(code) {
    return new CategoriesKebabMenu(this, code);
  }

}

class CategoriesKebabMenu extends KebabMenu {


  get() {
    return this.parent.getCategoriesTree()
               .contains(htmlElements.td, this.code)
               .closest(htmlElements.tr)
  }

  getDropdownMenu(){
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
    this.getEdit().click();
    return cy.wrap(new AdminPage(EditPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    cy.wait(1000);
    return cy.wrap( new AdminPage(DeleteAdminPage)).as('currentPage');
  }

}
