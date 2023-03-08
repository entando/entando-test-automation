import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';
import KebabMenu  from '../../app/KebabMenu';

import AppPage      from '../../app/AppPage';
import DeleteDialog from '../../app/DeleteDialog';

import AddPage           from './AddPage';
import EditPage          from './EditPage';
import AuthorizationPage from './AuthorizationPage';
import EditProfilePage   from './EditProfilePage';
import ViewProfilePage   from './ViewProfilePage';

export default class ManagementPage extends AppContent {

  tableDiv     = `${htmlElements.div}.UserListTable`;
  tableCol     = `${htmlElements.div}.col-xs-12`;
  searchForm   = `${htmlElements.form}.UserSearchForm`;
  searchInput  = `${htmlElements.input}[name=username]#username`;
  searchButton = `${htmlElements.button}[type=submit].btn-primary`;
  table        = `${htmlElements.table}.UserListTable__table`;
  tableAlert   = `${htmlElements.div}.alert`;

  static openPage(button, waitDOM = true) {
    super.loadPage(button, '/user', false, waitDOM);
  }

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

  submitSearch() {
    this.getSearchButton().then(button => ManagementPage.openPage(button));
    return cy.get('@currentPage');
  }

  searchUser(username, append = false) {
    this.getSearchInput().then(input => this.type(input, username, append));
    return this.submitSearch();
  }

  openAddUserPage() {
    this.getAddButton().then(button => AddPage.openPage(button));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
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
    this.getEdit().then(button => EditPage.openPage(button, this.code));
    return cy.wrap(new AppPage(EditPage)).as('currentPage');
  }

  openManageAuth() {
    this.getManageAuth().then(button => AuthorizationPage.openPage(button, this.code));
    return cy.wrap(new AppPage(AuthorizationPage)).as('currentPage');
  }

  openEditProfile() {
    this.getEditProfile().then(button => EditProfilePage.openPage(button, this.code));
    return cy.wrap(new AppPage(EditProfilePage)).as('currentPage');
  }

  openViewProfile() {
    this.getViewProfile().then(button => ViewProfilePage.openPage(button, this.code));
    return cy.wrap(new AppPage(ViewProfilePage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().then(button => this.parent.click(button));
    this.parent.parent.getDialog().setBody(DeleteDialog);
    this.parent.parent.getDialog().getBody().setLoadOnConfirm(ManagementPage);
    return cy.get('@currentPage');
  }

}
