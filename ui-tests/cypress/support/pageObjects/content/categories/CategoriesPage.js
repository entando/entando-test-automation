import AddPage        from './AddPage';
import Content        from '../../app/Content.js';
import EditPage       from './EditPage';
import {htmlElements} from '../../WebElement.js';
import AdminPage      from '../../app/AdminPage';

export default class CategoriesPage extends Content {

  modalDeleteButton = `${htmlElements.button}#DeleteCategoryModal__button-delete`;
  actionDelete      = `${htmlElements.li}.CategoryListMenuAction__menu-item-delete`;
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

  openEditCategoryPage(code) {
    this.getCategoriesTree()
        .find(`${htmlElements.button}#${code}-actions`)
        .click();
    cy.wait(500);
    this.getCategoriesTree()
        .find(`${htmlElements.li}[data-id=edit-${code}]`)
        .click();
    cy.wait(1000);

    return new AdminPage(EditPage);
  }

  deleteCategory(code) {
    this.getCategoriesTree()
        .find(`button#${code}-actions`)
        .click();
    cy.wait(500);

    this.getCategoriesTree()
        .find(this.actionDelete)
        .filter(':visible')
        .click();
    cy.wait(1500);

    this.parent.getDialog().confirm();
    cy.wait(1000);

    return new AdminPage(CategoriesPage);
  }

}
