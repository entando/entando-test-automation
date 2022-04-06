import AddPage         from './AddPage';
import Content         from '../../app/Content.js';
import EditPage        from './EditPage';
import {htmlElements}  from '../../WebElement.js';
import AdminPage       from '../../app/AdminPage';
import DeleteAdminPage from '../../app/DeleteAdminPage';

export default class CategoriesPage extends Content {

  modalDeleteButton = `${htmlElements.button}#DeleteCategoryModal__button-delete`;
  actionDelete      = `${htmlElements.li}.CategoryListMenuAction__menu-item-delete`;
  categoriesTree    = `${htmlElements.table}[id="categoryTree"]`;
  dropDown          = `${htmlElements.ul}.dropdown-menu`;

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

  openDropdownMenu(code){
    return this.getCategoriesTree()
        .contains(htmlElements.tr, code)
        .children(htmlElements.td).eq(1)
        .find(`${htmlElements.button}#dropdownKebabRight1`)
        .click()
        .wait(500);
  }
  getDropdownMenu(){
    return this.getCategoriesTree()
               .find(`${htmlElements.ul}[aria-labelledby="dropdownKebabRight1"]`)
  }

  openEditCategoryPage(code) {
    this.openDropdownMenu(code);
    this.getDropdownMenu()
        .contains(htmlElements.button, 'Edit')
        .click({force:true})
                .wait(1000);
    return new AdminPage(EditPage);
  }

  deleteCategory(code) {
    this.openDropdownMenu(code);
    this.getDropdownMenu()
        .contains(htmlElements.button, 'Delete')
        .click({force:true})
        .wait(1000);
    return new AdminPage(DeleteAdminPage);
  }


}
