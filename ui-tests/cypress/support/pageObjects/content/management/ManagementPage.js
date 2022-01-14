import {htmlElements} from '../../WebElement.js';

import Content  from '../../app/Content.js';
import AddPage  from './AddPage';
import AppPage  from '../../app/AppPage';
import KebabMenu from '../../app/KebabMenu.js';
import DeleteDialog from '../../app/DeleteDialog.js';

export default class ManagementPage extends Content {

  contentTabs   = `${htmlElements.div}#secondary-tabs-1`;
  addButton     = `${htmlElements.button}#addContent`;
  actionOptions = `${htmlElements.ul}.dropdown-menu`;
  actionOption  = `${htmlElements.li}`;

  contentsTableDiv        = `${htmlElements.div}.Contents__table`;
  contentsKebabMenu       = `${htmlElements.div}.dropdown-kebab-pf`;
  contentsKebabMenuButton = `${htmlElements.button}`;
  contentsKebabMenuAction = `${htmlElements.li}`;

  modalDeleteButton = `${htmlElements.button}#DeleteContentModal__button-delete`;

  getAddButton() {
    return this.get()
               .find(this.addButton)
               .eq(0);
  }

  getAddContentDropdownList() {
    return this.getAddButton()
               .closest(htmlElements.div)
               .find(htmlElements.ul);
  }

  getTable() {
    return this.getContents()
               .find(htmlElements.table);
  }

  getTableRowAction(code) {
    return this.getTable()
               .find(`${htmlElements.button}#actionsKebab_${code}`);
  }

  getTableRow(code) {
    return this.getTableRowAction(code)
               .closest(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new ManagementKebabMenu(this, code);
  }

  openAddContentPage(contentType) {
    this.getAddButton().click();
    this.getAddContentDropdownList()
        .contains(contentType)
        .click();
    cy.wait(1000);
    return new AppPage(AddPage);
  }

  openEditContentPage() {
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenu).eq(0)
        .find(this.contentsKebabMenuButton).as('kebabButton')
    cy.get('@kebabButton').click();
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenuAction).eq(0)
        .click();
    return new AppPage(AddPage);
  }

  openKebabLastAddedContent() {
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenu).eq(0)
        .find(this.contentsKebabMenuButton)
        .click();
  }

  unpublishLastAddedContent() {
    this.openKebabLastAddedContent();
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenuAction).eq(4)
        .click();
    cy.wait(1500);

    this.parent.getDialog()
        .confirm();
    cy.wait(1000);

    return new AppPage(ManagementPage);
  }

  deleteLastAddedContent() {
    this.openKebabLastAddedContent();
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenuAction).eq(1)
        .click();
    cy.wait(1500);

    this.parent.getDialog()
        .confirm();
    cy.wait(1000);

    return new AppPage(ManagementPage);
  }

  unpublishContent(code) {
    this.getTableRowAction(code)
        .click();
    // TODO: find a way to avoid waiting for arbitrary time periods
    cy.wait(500);

    this.getTable()
        .find(htmlElements.li)
        .filter(':visible')
        .eq(4)
        .click();

    this.parent
        .getDialog()
        .getConfirmButton()
        .click();
  }
}

class ManagementKebabMenu extends KebabMenu {

  get() {
    return this.parent
               .getTableRowAction(this.code)
               .closest(htmlElements.div);
  }
  
  getEdit() {
    return this.get()
               .find(htmlElements.li)
               .eq(0);
  }

  getDelete() {
    return this.get()
               .find(htmlElements.li)
               .eq(1);
  }

  openEdit() {
    this.getEdit().click();
    cy.wait(1000);
    return new AppPage(AddPage);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
