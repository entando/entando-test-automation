import {TEST_ID_KEY, htmlElements, WebElement} from "../../WebElement.js";
import Content from "../../app/Content.js";
import AddPage from "./AddPage";
import EditPage from "./EditPage";
import AppPage from "../../app/AppPage";

export default class CategoriesPage extends Content {

  categoryTreeCol = `${htmlElements.div}[${TEST_ID_KEY}=list_CategoryTree_Col]`;
  pageCol = `${htmlElements.div}[${TEST_ID_KEY}=list_ListCategoryPage_Col]`;
  pageLink = `${htmlElements.a}[${TEST_ID_KEY}=list_ListCategoryPage_Link]`;
  modalDeleteButton = `${htmlElements.button}#DeleteCategoryModal__button-delete`;
  actionDelete= `${htmlElements.li}.CategoryListMenuAction__menu-item-delete`;

  getCategoriesTree() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .children(this.categoryTreeCol);
  }

  getAddButton() {
    return this.getContents()
               .children(htmlElements.div).eq(3)
               .children(this.pageCol)
               .children(this.pageLink)
               .children(htmlElements.button);
  }

  openAddCategoryPage() {
    this.getAddButton().click();
    cy.wait(1000);
    return new AppPage(AddPage);
  }

  openEditCategoryPage(code)
  {
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

  deleteCategory(code)
  {
    this.getCategoriesTree()
        .find(`button#${code}-actions`)
        .click();
    cy.wait(500);

    this.getCategoriesTree()
        .find(this.actionDelete)
        .filter(':visible')
        .click();
    cy.wait(1500);

    this.parent.getDialog()
        .find(this.modalDeleteButton)
        .click();
    cy.wait(1000);

    return new AppPage(CategoriesPage);
  }

}
