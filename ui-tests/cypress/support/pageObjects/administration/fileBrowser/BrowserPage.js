import {htmlElements} from '../../WebElement';

import FilesBrowserPage from './FilesBrowserPage';
import KebabMenu        from '../../app/KebabMenu';

import DeleteDialog       from '../../app/DeleteDialog';
import UploadFilesPage    from './UploadFilesPage';
import CreateFolderPage   from './CreateFolderPage';
import CreateTextFilePage from './CreateTextFilePage';

export default class BrowserPage extends FilesBrowserPage {

  static openPage(button, isProtected = null, path = null) {
    cy.fileBrowserController().then(controller => {
      let queryParams = '?';
      if (isProtected !== null) queryParams += `protectedFolder=${isProtected}`;
      if (path) queryParams += `&currentPath=${path}`;
      controller.intercept({method: 'GET'}, 'fileBrowserPageLoadingGET', queryParams);
    });
    cy.get(button).click();
    cy.wait('@fileBrowserPageLoadingGET');
  }

  constructor(parent) {
    super(parent, BrowserPage, UploadFilesPage, CreateFolderPage, CreateTextFilePage);
  }

  getEmptyFolderAlert() {
    return this.getContents().find(`${htmlElements.div}.alert-warning`);
  }

  getFilesTable() {
    return this.getContents().find(`${htmlElements.table}.FilesListTable__table`);
  }

  getTableHeaders() {
    return this.getFilesTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getUpButton() {
    return this.getTableHeaders().find(`${htmlElements.a}.FilesListTable__up-link`);
  }

  getTableRows() {
    return this.getFilesTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  //FIXME element selection should not be string dependent; they should have a unique id
  getTableRow(name) {
    return this.getTableRows()
               .contains(htmlElements.td, name)
               .parent();
  }

  getRowLink(name) {
    return this.getTableRow(name)
               .children(htmlElements.td).eq(0)
               .children(htmlElements.a);
  }

  getKebabMenu(name) {
    return new FilesBrowserKebabMenu(this, name);
  }

  openPublicFolder() {
    this.getTableRow('public')
        .children(htmlElements.td).eq(0)
        .children(htmlElements.a)
        .then(button => BrowserPage.openPage(button, false));
    return cy.get('@currentPage');
  }

  openProtectedFolder() {
    this.getTableRow('protected')
        .children(htmlElements.td).eq(0)
        .children(htmlElements.a)
        .then(button => BrowserPage.openPage(button, true));
    return cy.get('@currentPage');
  }

  goUpFolder() {
    this.getUpButton()
        .then(button => this.getBreadCrumbsFirstLevelFolder().then(firstLevelFolder =>
            this.getBreadCrumbsElement(-2).then(upperLevelFolder =>
                BrowserPage.openPage(button, firstLevelFolder.text() === 'protected', upperLevelFolder))));
    return cy.get('@currentPage');
  }

  openFolder(path) {
    this.getTableRow(path)
        .children(htmlElements.td).eq(0)
        .children(htmlElements.a)
        .then(button => this.getBreadCrumbsFirstLevelFolder().then(firstLevelFolder =>
            BrowserPage.openPage(button, firstLevelFolder.text() === 'protected', path)));
    return cy.get('@currentPage');
  }

  downloadFile(name) {
    this.getRowLink(name).click();
    return cy.get('@currentPage');
  }

}

class FilesBrowserKebabMenu extends KebabMenu {

  get() {
    return this.parent.getTableRow(this.code)
               .children(htmlElements.td).eq(3)
               .children(htmlElements.div);
  }

  getDownload() {
    return this.getDropdown().children(`${htmlElements.li}.FilesListMenuAction__download`);
  }

  getDelete() {
    return this.getDropdown().children(`${htmlElements.li}.FilesListMenuAction__delete`);
  }

  clickDownload() {
    this.getDownload().click();
    return cy.get('@currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    this.parent.parent.getDialog().getBody().setLoadOnConfirm(BrowserPage);
    return cy.get('@currentPage');
  }

}
