import AppPage from '../../app/AppPage.js';
import Content from '../../app/Content.js';
import KebabMenu from '../../app/KebabMenu.js';
import Pagination from '../../app/Pagination.js';
import { DATA_TESTID, htmlElements } from '../../WebElement.js';
import AddPage from './AddPage.js';

class TemplatesKebabMenu extends KebabMenu {
  static MENU_OPTIONS = {
    EDIT: 'editTemplate',
    CLONE: 'cloneTemplate',
    DETAILS: 'detailsTemplate',
    DELETE: 'detailsDelete',
  };
  filterRow = `[${DATA_TESTID}=list_PageTemplateListPage_Row].row`;

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
    const idx = options.indexOf(option);
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
}

export default class TemplatesPage extends Content {
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

  openEdit(code) {
    const menu = this.getKebabMenuByCode(code);
    menu.getEditButton().click();
    return new AppPage(AddPage);
  }

  openClone(code) {
    const menu = this.getKebabMenuByCode(code);
    menu.getCloneButton().click();
  }

  openDetails(code) {
    const menu = this.getKebabMenuByCode(code);
    menu.getDetailsButton().click();
  }

  openDelete(code) {
    const menu = this.getKebabMenuByCode(code);
    menu.getDeleteButton().click();
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
    this.getAddButton().click();
    return new AppPage(AddPage);
  }
}
