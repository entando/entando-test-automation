import {htmlElements} from '../../WebElement.js';

import AdminContent    from '../../app/AdminContent';
import KebabMenu       from '../../app/KebabMenu.js';
import AdminPage       from '../../app/AdminPage';
import AddPage         from './AddPage';
import EditPage        from './EditPage';
import DeletePage      from './DeletePage';
import DeleteAdminPage from '../../app/DeleteAdminPage';

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
    cy.assetsAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'assetsPageLoadingGet', '/list.action?*'));
    cy.get(button).click();
    cy.wait('@assetsPageLoadingGet');
  }

  getAddButton() {
    return this.get()
               .find(this.addButton);
  }

  openAddAssets() {
    this.getAddButton().then(button => AddPage.openPage(button));
    return cy.wrap(new AdminPage(AddPage)).as('currentPage');
  }

  getAssetsFilter() {
    return this.get()
               .find(this.assetsFilter)
               .children(htmlElements.a);
  }

  openAdvancedFilter() {
    return this.getAssetsFilter()
               .then(button =>
                   this.click(button));
  }

  getCollapsePanel() {
    return this.get()
               .find(this.collapsePanel);
  }

  getSearchTextfield() {
    return this.getCollapsePanel()
               .find(this.assetsSearchText);
  }

  getSearchButton() {
    return this.get()
               .find(this.assetsFilterSearchButton);
  }

  submitSearch() {
    return this.getSearchButton()
               .then(button => {
                 cy.assetsAdminConsoleController()
                   .then(controller =>
                       controller.intercept({method: 'POST'}, 'submitSearch', '/search.action'));
                 this.click(button);
                 cy.wait('@submitSearch');
               });
  }

  getAssetsView() {
    return this.get()
               .find(this.assetsView);
  }

  getAssetsBody() {
    return this.getAssetsView()
               .find(this.assetsBody);
  }

  getFilterResultInfo() {
    return this.get()
               .find(this.resultInfo);
  }

  getFilterResultItemCount() {
    return this.getFilterResultInfo()
               .find(`#search > .pager`)
               .find(this.resultInfoItemCount);
  }

  getTableRows() {
    return this.getAssetsBody();
  }

  getKebabMenu(code) {
    return new AssetsKebabMenu(this, code);
  }

}

class AssetsKebabMenu extends KebabMenu {

  get() {
    return this.parent.get()
               .children()
               .find(`${htmlElements.div}.tab-content`)
               .find(`#list-view > #search`)
               .find(`${htmlElements.div}.list-group-item`);

  }

  getActionsButtons() {
    return this.get()
               .children(`${htmlElements.div}.list-view-pf-actions`);
  }

  getDropdown() {
    return this.getActionsButtons()
               .children(`${htmlElements.div}.dropdown`)
               .children(htmlElements.ul)
               .children(htmlElements.li)
               .find(`${htmlElements.a}[title="Edit: image1.JPG"]`)
               .closest(htmlElements.div);
  }

  openDropdown() {
    this.getDropdown()
        .children(`${htmlElements.button}#dropdownKebabRight2`)
        .click();
    return this;
  }

  getEdit() {
    return this.getDropdown()
               .find(htmlElements.li)
               .eq(0);
  }

  getDelete() {
    return this.getDropdown()
               .find(htmlElements.li)
               .eq(1);
  }

  openEdit() {
    this.getEdit().then(button => EditPage.openPage(button));
    return cy.wrap(new AdminPage(EditPage)).as('currentPage');
  }

  clickDelete(isForbidden = null) {
    if (isForbidden) {
      this.getDelete().then(button => DeletePage.openPage(button));
      return cy.wrap(new AdminPage(DeletePage)).as('currentPage');
    } else {
      this.getDelete().then(button => DeleteAdminPage.openDeleteAssetsPage(button));
      const deletePage = new AdminPage(DeleteAdminPage);
      deletePage.getContent().setOrigin(this.parent.parent);
      return cy.wrap(deletePage).as('currentPage');
    }
  }

}


