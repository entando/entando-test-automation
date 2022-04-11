import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';
import KebabMenu  from '../../app/KebabMenu.js';

import AppPage      from '../../app/AppPage.js';
import Pagination   from '../../app/Pagination.js';
import DeleteDialog from '../../app/DeleteDialog';
import AddPage      from './AddPage.js';

export default class TemplatesPage extends Content {
  filterRow = `${htmlElements.div}.row`;

  static openPage(button) {
    cy.pageTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'templatesPageLoadingGET', '?*'));
    if (button) cy.get(button).click();
    else cy.realType('{enter}');
    cy.wait('@templatesPageLoadingGET');
  }

  getTable() {
    return this.get()
               .find(htmlElements.table);
  }

  getTableRows() {
    return this.getTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getKebabMenuByCode(code) {
    return new TemplatesKebabMenu(this, code);
  }

  getTableRow(code) {
    const menu = this.getKebabMenuByCode(code);
    return menu.get().closest(htmlElements.tr);
  }

  getPagination() {
    return new Pagination(this);
  }

  getFootArea() {
    return this.get()
               .find(this.filterRow).eq(3);
  }

  getAddButton() {
    return this.getFootArea().find(htmlElements.button);
  }

  openAddPage() {
    this.getAddButton().click({ force: true });
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }
}

class TemplatesKebabMenu extends KebabMenu {
  static MENU_OPTIONS = {
    EDIT: 'editTemplate',
    CLONE: 'cloneTemplate',
    DETAILS: 'detailsTemplate',
    DELETE: 'detailsDelete'
  };

  get() {
    return this.getKebabButton()
               .closest(`${htmlElements.div}.PageTemplateListMenuActions`);
  }

  getKebabButton() {
    return this.parent.getTableRows()
               .find(`button#${this.code}-actions`);
  }

  getMenu() {
    return this.get()
               .children(`ul[role=menu]`);
  }

  getMenuList() {
    return this.getMenu()
               .children(`li`);
  }

  getListItemByOption(option) {
    const options = Object.values(TemplatesKebabMenu.MENU_OPTIONS);
    const idx     = options.indexOf(option);
    return this.getMenuList().eq(idx > -1 ? idx : 0);
  }

  getEditButton() {
    return this.getListItemByOption(TemplatesKebabMenu.MENU_OPTIONS.EDIT).children(htmlElements.a);
  }

  getCloneButton() {
    return this.getListItemByOption(TemplatesKebabMenu.MENU_OPTIONS.CLONE).children(htmlElements.a);
  }

  getDetailsButton() {
    return this.getListItemByOption(TemplatesKebabMenu.MENU_OPTIONS.DETAILS).children(htmlElements.a);
  }

  getDeleteButton() {
    return this.getListItemByOption(TemplatesKebabMenu.MENU_OPTIONS.DELETE).children(htmlElements.a);
  }

  openEdit() {
    this.getEditButton().click();
    return new AppPage(AddPage);
  }

  openClone() {
    this.getCloneButton().click();
    return new AppPage(AddPage);
  }

  clickDetails() {
    this.getDetailsButton().click();
  }

  clickDelete() {
    this.getDeleteButton().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }
}
