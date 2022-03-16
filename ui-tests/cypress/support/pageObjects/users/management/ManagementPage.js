import {htmlElements} from '../../WebElement.js';

import Content   from '../../app/Content.js';
import KebabMenu from '../../app/KebabMenu';

import AppPage      from '../../app/AppPage';
import DeleteDialog from '../../app/DeleteDialog';

import AddPage           from './AddPage';
import EditPage          from './EditPage';
import AuthorizationPage from './AuthorizationPage';
import EditProfilePage   from './EditProfilePage';
import ViewProfilePage   from './ViewProfilePage';

export default class ManagementPage extends Content {

  tableDiv     = `${htmlElements.div}.UserListTable`;
  tableCol     = `${htmlElements.div}.col-xs-12`;
  searchForm   = `${htmlElements.form}.UserSearchForm`;
  searchInput  = `${htmlElements.input}[name=username]#username`;
  searchButton = `${htmlElements.button}[type=submit].btn-primary`;
  table        = `${htmlElements.table}.UserListTable__table`;
  tableAlert   = `${htmlElements.div}.alert`;

  getSearchForm() {
    return this.getContents()
               .find(this.searchForm);
  }

  getSearchInput() {
    return this.getSearchForm()
               .find(this.searchInput);
  }

  getSearchButton() {
    return this.getSearchForm()
               .find(this.searchButton);
  }

  getUsersTable() {
    return this.getContents()
               .find(this.table);
  }

  getTableHeaders() {
    return this.getUsersTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getTableRows() {
    return this.getUsersTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableRow(code) {
    return this.getUsersTable()
               .find(`#${code}-actions`)
               .parents(htmlElements.tr);
  }

  getTableAlert() {
    return this.getContents()
               .find(this.tableAlert);
  }

  getKebabMenu(code) {
    return new UsersKebabMenu(this, code);
  }

  getTablePagination() {
    return this.getContents()
               .children(htmlElements.div).eq(3)
               .children(this.tableDiv)
               .children(this.tableCol)
               .children(htmlElements.form);
  }

  getAddButton() {
    return this.getContents()
               .children(htmlElements.div).eq(4)
               .children(this.pageCol)
               .children(this.pageLink)
               .children(htmlElements.button);
  }

  typeSearch(input) {
    this.getSearchInput().type(input);
  }

  clearSearch() {
    this.getSearchInput().clear();
  }

  submitSearch() {
    this.getSearchButton().click();
  }

  searchUser(username, append = false) {
    if (!append) {
      this.clearSearch();
    }
    this.typeSearch(username);
    this.submitSearch();
    return new AppPage(ManagementPage);
  }

  openAddUserPage() {
    this.getAddButton().click();
    return new AppPage(AddPage);
  }

}

class UsersKebabMenu extends KebabMenu {

  getEdit() {
    return this.get()
               .find(`${htmlElements.li}.UserListMenuAction__menu-item-edit`);
  }

  getManageAuth() {
    return this.get()
               .find(`${htmlElements.li}.UserListMenuAction__menu-item-auth`);
  }

  getEditProfile() {
    return this.get()
               .find(`${htmlElements.li}.UserListMenuAction__menu-item-edit-profile`);
  }

  getViewProfile() {
    return this.get()
               .find(`${htmlElements.li}.UserListMenuAction__menu-item-view-profile`);
  }

  getDelete() {
    return this.get()
               .find(`${htmlElements.li}.UserListMenuAction__menu-item-delete`);
  }

  openEdit() {
    this.getEdit().click();
    return new AppPage(EditPage);
  }

  openManageAuth() {
    this.getManageAuth().click();
    return new AppPage(AuthorizationPage);
  }

  openEditProfile() {
    this.getEditProfile().click();
    return new AppPage(EditProfilePage);
  }

  openViewProfile() {
    this.getViewProfile().click();
    return new AppPage(ViewProfilePage);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
