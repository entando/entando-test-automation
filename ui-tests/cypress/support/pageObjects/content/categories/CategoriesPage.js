import AddPage         from './AddPage';
import AppPage         from '../../app/AppPage';
import Content         from '../../app/Content.js';
import EditPage        from './EditPage';
import {htmlElements}  from '../../WebElement.js';

export default class CategoriesPage extends Content {

  modalDeleteButton = `${htmlElements.button}#DeleteCategoryModal__button-delete`;
  actionDelete      = `${htmlElements.li}.CategoryListMenuAction__menu-item-delete`;

  getCategoriesTree() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .children(htmlElements.div);
  }

  getAddButton() {
    return this.getContents()
               .children(htmlElements.div).eq(3)
               .children(htmlElements.div)
               .children(htmlElements.a)
               .children(htmlElements.button);
  }

  openAddCategoryPage() {
    this.getAddButton().click();
    cy.wait(1000);
    return new AppPage(AddPage);
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

    return new AppPage(EditPage);
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

    return new AppPage(CategoriesPage);
  }

}
