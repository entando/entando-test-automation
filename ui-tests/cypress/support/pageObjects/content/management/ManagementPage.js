import {DATA_TESTID, htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent';

import AddPage      from './AddPage';
import AdminPage    from '../../app/AdminPage';
import KebabMenu    from '../../app/KebabMenu.js';
import Pagination   from '../../app/Pagination.js';
import DeleteDialog from '../../app/DeleteDialog.js';

export default class ManagementPage extends AdminContent {

  contentTabs   = `${htmlElements.div}#secondary-tabs-1`;
  addButton     = `${htmlElements.button}[data-toggle="dropdown"].btn.btn-primary.dropdown-toggle`;
  actionOptions = `${htmlElements.ul}.dropdown-menu`;
  actionOption  = `${htmlElements.li}`;

  contentsTableDiv         = `${htmlElements.div}.Contents__table`;
  contentsKebabMenu        = `${htmlElements.div}.dropdown-kebab-pf`;
  contentsKebabMenuButton  = `${htmlElements.button}`;
  contentsKebabMenuAction  = `${htmlElements.li}`;
  contentsFilter           = `${htmlElements.div}.ContentsFilter[${DATA_TESTID}=contents_ContentsFilter_div]`;
  searchFilterTextfield    = `${htmlElements.input}[type=text]`;
  searchFilterSubmitButton = `${htmlElements.button}.ContentsFilter__search-button`;

  listPagination         = `${htmlElements.form}.table-view-pf-pagination`;
  paginationItemsCurrent = `${htmlElements.span}.pagination-pf-items-current`;
  paginationItemsTotal   = `${htmlElements.span}.pagination-pf-items-total`;

  modalDeleteButton = `${htmlElements.button}#DeleteContentModal__button-delete`;

  getAddButton() {
    return this.get()
               .find(this.addButton);
  }

  getAddContentDropdownList() {
    return this.getAddButton()
               .closest(htmlElements.div)
               .find(htmlElements.ul);
  }

  getSearchPanel() {
    return this.getContents()
               .find(this.contentsFilter);
  }

  getSearchTextField() {
    return this.getSearchPanel()
               .find(this.searchFilterTextfield);
  }

  getSearchSubmitButton() {
    return this.getSearchPanel()
               .find(this.searchFilterSubmitButton);
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

  getPagination() {
    return new Pagination(this);
  }

  doSearch(text = '') {
    this.getSearchTextField().clear();
    if (text !== '') {
      this.getSearchTextField().type(text);
    }
    this.getSearchSubmitButton().click();
  }

  openAddContentPage(contentType) {
    this.getAddButton().click();
    this.getAddContentDropdownList()
        .contains(contentType)
        .click();
    cy.wait(1000);
    return new AdminPage(AddPage);
  }

  openEditContentPage() {
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenu).eq(0)
        .find(this.contentsKebabMenuButton)
        .click();
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenuAction).eq(0)
        .click();
    return new AdminPage(AddPage);
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

    return new AdminPage(ManagementPage);
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

    return new AdminPage(ManagementPage);
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
    return new AdminPage(AddPage);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
