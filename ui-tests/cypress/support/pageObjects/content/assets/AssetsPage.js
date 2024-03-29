import {htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent';

import KebabMenu from '../../app/KebabMenu.js';

import AdminPage          from '../../app/AdminPage';
import AddPage            from './AddPage';
import EditPage           from './EditPage';
import CrossReferencePage from './CrossReferencePage';
import DeleteAdminPage    from '../../app/DeleteAdminPage';

export default class AssetsPage extends AdminContent {

  addButton                = `${htmlElements.a}[title="Add"]`;
  assetsFilter             = `${htmlElements.p}.panel-title`;
  collapsePanel            = `${htmlElements.div}#collapseOne`;
  assetsSearchText         = `${htmlElements.input}#fileName`;
  assetsFilterSearchButton = `${htmlElements.button}[type=submit]`;
  assetsView               = `${htmlElements.div}#list-view`;
  assetsBody               = `${htmlElements.form}#search`;
  resultInfo               = `${htmlElements.div}#list-view`;
  resultInfoItemCount      = `${htmlElements.span}`;

  static openPage(button) {
    super.loadPage(button, '/jacms/Resource/list.action');
  }

  static search(button) {
    super.loadPage(button, '/jacms/Resource/search.action');
  }

  getAddButton() {
    return this.getContents().find(this.addButton);
  }

  openAddAssets() {
    this.getAddButton().then(button => AddPage.openPage(button));
    return cy.wrap(new AdminPage(AddPage)).as('currentPage');
  }

  getAssetsFilter() {
    return this.getContents()
               .find(this.assetsFilter)
               .children(htmlElements.a);
  }

  openAdvancedFilter() {
    this.getAssetsFilter().click();
    return cy.get('@currentPage');
  }

  getCollapsePanel() {
    return this.getContents().find(this.collapsePanel);
  }

  getSearchTextfield() {
    return this.getCollapsePanel().find(this.assetsSearchText);
  }

  getSearchButton() {
    return this.getContents().find(this.assetsFilterSearchButton);
  }

  submitSearch() {
    this.getSearchButton().then(button => AssetsPage.search(button));
    return cy.get('@currentPage');
  }

  getAssetsView() {
    return this.getContents()
               .find(this.assetsView);
  }

  getAssetsBody() {
    return this.getAssetsView()
               .find(this.assetsBody);
  }

  getFilterResultInfo() {
    return this.getContents().find(this.resultInfo);
  }

  getFilterResultItemCount() {
    return this.getFilterResultInfo()
               .find(`#search > .pager`)
               .find(this.resultInfoItemCount);
  }

  getKebabMenu(code) {
    return new AssetsKebabMenu(this, code);
  }

}

class AssetsKebabMenu extends KebabMenu {

  get() {
    return this.parent.getAssetsBody()
               .find(`${htmlElements.div}.list-group-item`)
               .children(`${htmlElements.div}.list-view-pf-actions`)
               .children(htmlElements.div);
  }

  getActionsButton() {
    return this.getDropdown()
               .children(htmlElements.li)
               .find(`${htmlElements.a}[title="Edit: ${this.code}"]`)
               .closest(htmlElements.div);
  }

  openDropdown() {
    this.getActionsButton()
        .children(`${htmlElements.button}#dropdownKebabRight2`)
        .click();
    return this;
  }

  getEdit() {
    return this.getActionsButton()
               .find(htmlElements.li)
               .eq(0);
  }

  getDelete() {
    return this.getActionsButton()
               .find(htmlElements.li)
               .eq(1);
  }

  openEdit() {
    this.getEdit().then(button => EditPage.openPage(button));
    return cy.wrap(new AdminPage(EditPage)).as('currentPage');
  }

  clickDelete(isForbidden = null) {
    if (isForbidden) {
      this.getDelete().then(button => CrossReferencePage.openPage(button));
      return cy.wrap(new AdminPage(CrossReferencePage)).as('currentPage');
    } else {
      this.getDelete().then(button => DeleteAdminPage.openDeleteAssetsPage(button));
      const deletePage = new AdminPage(DeleteAdminPage);
      deletePage.getContent().setOrigin(this.parent.parent);
      return cy.wrap(deletePage).as('currentPage');
    }
  }

}
