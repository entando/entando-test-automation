import {htmlElements} from '../WebElement.js';

import {SubMenu} from '../app/MenuElement.js';

import AppPage        from '../app/AppPage.js';
import ManagementPage from './management/ManagementPage';
import AssetsPage     from './assets/AssetsPage';
import TemplatesPage  from './templates/TemplatesPage';
import CategoriesPage from './categories/CategoriesPage';
import VersioningPage from './versioning/VersioningPage';
import TypesPage      from './types/TypesPage';
import SettingsPage   from './settings/SettingsPage';

export default class ContentMenu extends SubMenu {

  get() {
    return this.parent.get()
               .children(htmlElements.ul)
               .children(htmlElements.li).eq(3);
  }

  getManagement() {
    return this.getElements()
               .children(htmlElements.li).eq(0);
  }

  getAssets() {
    return this.getElements()
               .children(htmlElements.li).eq(1);
  }

  getTemplates() {
    return this.getElements()
               .children(htmlElements.li).eq(2);
  }

  getCategories() {
    return this.getElements()
               .children(htmlElements.li).eq(3);
  }

  getVersioning() {
    return this.getElements()
               .children(htmlElements.li).eq(4);
  }

  getTypes() {
    return this.getElements()
               .children(htmlElements.li).eq(5);
  }

  getSettings() {
    return this.getElements()
               .children(htmlElements.li).eq(6);
  }

  openManagement() {
    this.getManagement().then(button => ManagementPage.openPage(button));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

  openAssets() {
    this.getAssets().then(button => AssetsPage.openPage(button));
    return cy.wrap(new AppPage(AssetsPage)).as('currentPage');
  }

  openTemplates() {
    this.getTemplates().then(button => TemplatesPage.openPage(button));
    return cy.wrap(new AppPage(TemplatesPage)).as('currentPage');
  }

  openCategories() {
    this.getCategories().then(button => CategoriesPage.openPage(button));
    return cy.wrap(new AppPage(CategoriesPage)).as('currentPage');
  }

  openVersioning() {
    this.getVersioning().then(button => VersioningPage.openPage(button));
    return cy.wrap(new AppPage(VersioningPage)).as('currentPage');
  }

  openTypes() {
    this.getTypes().then(button => TypesPage.openPage(button));
    return cy.wrap(new AppPage(TypesPage)).as('currentPage');
  }

  openSettings() {
    this.getSettings().click();
    return new AppPage(SettingsPage);
  }

}
