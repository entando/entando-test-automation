import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import ManagementPage from './ManagementPage.js';

export default class AddPage extends AppContent {

  static openPage(button, code = null) {
    cy.groupsController().then(controller => controller.intercept({method: 'GET'}, 'groupsPageLoadingGET', '?*'));
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesPageLoadingGET', '?*'));
    cy.usersController().then(controller => controller.intercept({method: 'GET'}, 'myGroupsPageLoadingGET', '/myGroups'));
    cy.pageTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'pageModelsPageLoadingGET', '?*'));
    if (code) {
      cy.seoPagesController().then(controller => controller.intercept({method: 'GET'}, 'pagePageLoadingGET', `/${code}`));
    } else {
      cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'homepagePageLoadingGET', '/homepage?status=draft'));
      cy.usersController().then(controller => controller.intercept({method: 'GET'}, 'myGroupPermissionsPageLoadingGET', '/myGroupPermissions'));
      cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'homepageChildrenPageLoadingGET', '?parentCode=homepage'));
    }
    cy.get(button).click();
    if (code) {
      cy.wait(['@groupsPageLoadingGET', '@languagesPageLoadingGET',/* '@myGroupsPageLoadingGET',*/ '@pageModelsPageLoadingGET' /*'@pagePageLoadingGET'*/]);
    } else {
      cy.wait(['@groupsPageLoadingGET', '@homepagePageLoadingGET', '@homepagePageLoadingGET', '@languagesPageLoadingGET', /*'@myGroupPermissionsPageLoadingGET',*/ /*'@myGroupsPageLoadingGET',*/ '@pageModelsPageLoadingGET', '@homepageChildrenPageLoadingGET']);
    }
  }

  getSeoContainer() {
    return this.getContents().find(`${htmlElements.div}.SeoInfo`);
  }

  getSeoTabs() {
    return this.getSeoContainer().children(`${htmlElements.ul}[role="tablist"]`);
  }

  getTitleInput(lang) {
    return this.getSeoContainer().find(`${htmlElements.input}[name="titles.${lang}"]`);
  }

  getSeoDescriptionInput(lang) {
    return this.getSeoContainer().find(`${htmlElements.input}[name="seoData.seoDataByLang.${lang}.description"]`);
  }

  getSeoKeywordsInput(lang) {
    return this.getSeoContainer().find(`${htmlElements.input}[name="seoData.seoDataByLang.${lang}.keywords"]`);
  }

  getSeoFriendlyCodeInput(lang) {
    return this.getSeoContainer().find(`${htmlElements.input}[name="seoData.seoDataByLang.${lang}.friendlyCode"]`);
  }

  getMetadataFormDiv() {
    return this.getSeoContainer().find(`${htmlElements.div}.SeoInfo__addmetadata`);
  }

  getMetaKeyInput() {
    return this.getMetadataFormDiv().find(`${htmlElements.input}[name="metakey"]`);
  }

  getMetaTypeSelect() {
    return this.getMetadataFormDiv().find(`${htmlElements.select}[name=metatype]`);
  }

  getMetaValueInput() {
    return this.getMetadataFormDiv().find(`${htmlElements.input}[name=metavalue]`);
  }

  getMetaTagAddButton() {
    return this.getMetadataFormDiv().find(`${htmlElements.button}[type="submit"]`);
  }

  getCodeInput() {
    return this.getContents().find(`${htmlElements.input}[name=code]`);
  }

  getPageTreeTable() {
    return this.getContents().find(`${htmlElements.table}.PageTreeSelector`);
  }

  getOwnerGroup() {
    return this.getContents().find(`${htmlElements.div}[class="DropdownTypeahead form-group"]`).eq(0);
  }

  getOwnerGroupButton() {
    return this.getOwnerGroup()
               .find(`${htmlElements.div}.rbt.app-tour-step-9`)
               .find(`${htmlElements.button}.DropdownTypeahead__toggle-button`);
  }

  getOwnerGroupDropdown() {
    return this.getOwnerGroup()
               .find(`${htmlElements.div}[tabindex="-1"]`)
               .children(htmlElements.ul);
  }

  getPageTemplateSelect() {
    return this.getContents()
               .find(`${htmlElements.div}.form-group`)
               .find(`${htmlElements.select}.form-control.RenderSelectInput[name=pageModel]`);
  }

  getSaveAndDesignButton() {
    return this.getContents().find(`${htmlElements.button}.PageForm__save-and-configure-btn`);
  }

  getSaveButton() {
    return this.getContents().find(`${htmlElements.button}.PageForm__save-btn`);
  }

  clickSaveButton() {
    this.getSaveButton().then(button => ManagementPage.openPage(button));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

  clickMetaTagAddButton() {
    this.getMetaTagAddButton().click();
    return cy.get('@currentPage');
  }

  openOwnerGroupMenu() {
    this.getOwnerGroupButton().click();
    return cy.get('@currentPage');
  }

  selectOwnerGroup(value) {
    this.openOwnerGroupMenu();
    this.getOwnerGroupDropdown()
        .find(`${htmlElements.li}[aria-label=${value}]`)
        .click();
    return cy.get('@currentPage');
  }

  selectPageOnPageTreeTable(pageOrder) {
    this.getPageTreeTable()
        .children(htmlElements.tbody)
        .children(htmlElements.tr).eq(pageOrder)
        .click();
    return cy.get('@currentPage');
  }

  selectSeoLanguage(langOrder) {
    this.getSeoTabs()
        .find(htmlElements.a).eq(langOrder)
        .click();
    cy.wait(1000); //ToDo find a better way to wait input languages name.
    return cy.get('@currentPage');
  }

}
