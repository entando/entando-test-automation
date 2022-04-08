import AddPage         from './AddPage';
import AdminContent         from '../../app/AdminContent.js';
import EditPage        from './EditPage';
import {htmlElements}  from '../../WebElement.js';
import AdminPage       from '../../app/AdminPage';
import DeleteAdminPage from '../../app/DeleteAdminPage';
import KebabMenu       from '../../app/KebabMenu';

export default class CategoriesPage extends AdminContent {

  categoriesTree    = `${htmlElements.table}[id="categoryTree"]`;

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
    this.getAddButton().click();
    cy.wait(1000);
    return new AdminPage(AddPage);
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
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AdminPage(EditPage);
  }

  clickDelete() {
    this.getDelete().click();
    cy.wait(1000);
    return new AdminPage(DeleteAdminPage);
  }

}

