import {SubMenu} from '../app/MenuElement.js';

import AppPage from '../app/AppPage.js';

import ManagementPage from './management/ManagementPage';
import DesignerPage   from './designer/DesignerPage';
import TemplatesPage  from './templates/TemplatesPage';
import SettingsPage   from './settings/SettingsPage';

export default class PagesAppMenu extends SubMenu {

  open() {
    this.click();
    return this;
  }

  get() {
    return this.parent.get().find('[data-id="pages"]');
  }

  getSubmenu() {
    return this.get().find('[data-id="menu"]');
  }

  getManagement() {
    return this.getSubmenu().find('[data-id="pages-management"]');
  }

  getDesigner() {
    return this.getSubmenu().find('[data-id="pages-designer"]');
  }

  getTemplates() {
    return this.getSubmenu().find('[data-id="pages-templates"]');
  }

  getSettings() {
    return this.getSubmenu().find('[data-id="pages-settings"]');
  }

  getCollapseButton() {
    return this.getSubmenu().find('[data-back="back"]');
  }

  openManagement() {
    this.getManagement().then(button => ManagementPage.openPage(button));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

  openDesigner(blind = false) {
    if (blind) this.getDesigner().click();
    else this.getDesigner().then(button => DesignerPage.openPage(button));
    return cy.wrap(new AppPage(DesignerPage)).as('currentPage');
  }

  openTemplates() {
    this.getTemplates().then(button => TemplatesPage.openPage(button, false));
    return cy.wrap(new AppPage(TemplatesPage)).as('currentPage');
  }

  openSettings() {
    this.getSettings().click();
    return cy.wrap(new AppPage(SettingsPage)).as('currentPage');
  }

}
