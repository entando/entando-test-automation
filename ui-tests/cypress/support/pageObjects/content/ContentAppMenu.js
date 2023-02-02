import {SubMenu} from '../app/MenuElement.js';

import AdminPage      from '../app/AdminPage.js';
import ManagementPage from './management/ManagementPage';
import AssetsPage     from './assets/AssetsPage';
import TemplatesPage  from './templates/TemplatesPage';
import CategoriesPage from './categories/CategoriesPage';
import VersioningPage from './versioning/VersioningPage';
import TypesPage      from './types/TypesPage';
import SettingsPage   from './settings/SettingsPage';

export default class ContentAppMenu extends SubMenu {

  open() {
    this.click();
    return this;
  }

  get() {
    return this.parent.get().find('[data-id="content"]');
  }

  getSubmenu() {
    return this.get().find('[data-id="menu"]');
  }

  getManagement() {
    return this.getSubmenu().find('[data-id="content-management"]');
  }

  getAssets() {
    return this.getSubmenu().find('[data-id="content-assets"]');
  }

  getTemplates() {
    return this.getSubmenu().find('[data-id="content-templates"]');
  }

  getCategories() {
    return this.getSubmenu().find('[data-id="content-categories"]');
  }

  getVersioning() {
    return this.getSubmenu().find('[data-id="content-versioning"]');
  }

  getTypes() {
    return this.getSubmenu().find('[data-id="content-types"]');
  }

  getSettings() {
    return this.getSubmenu().find('[data-id="content-settings"]');
  }

  getCollapseButton() {
    return this.getSubmenu().find('[data-back="back"]');
  }

  openManagement() {
    this.getManagement().then(button => ManagementPage.openPage(button));
    return cy.wrap(new AdminPage(ManagementPage)).as('currentPage');
  }

  openAssets() {
    this.getAssets().then(button => AssetsPage.openPage(button));
    return cy.wrap(new AdminPage(AssetsPage)).as('currentPage');
  }

  openTemplates() {
    this.getTemplates().then(button => TemplatesPage.openPage(button));
    return cy.wrap(new AdminPage(TemplatesPage)).as('currentPage');
  }

  openCategories() {
    this.getCategories().then(button => CategoriesPage.openPage(button));
    return cy.wrap(new AdminPage(CategoriesPage)).as('currentPage');
  }

  openVersioning() {
    this.getVersioning().then(button => VersioningPage.openPage(button));
    return cy.wrap(new AdminPage(VersioningPage)).as('currentPage');
  }

  openTypes() {
    this.getTypes().then(button => TypesPage.openPage(button));
    return cy.wrap(new AdminPage(TypesPage)).as('currentPage');
  }

  openSettings() {
    this.getSettings().click();
    return new AdminPage(SettingsPage);
  }

}
