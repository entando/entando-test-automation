import {SubMenu} from '../app/MenuElement.js';
import AppPage   from '../app/AppPage.js';

import DatabasePage            from './database/DatabasePage';
import BrowserPage             from './fileBrowser/BrowserPage';
import LanguagesAndLabelsPage  from './languagesAndLabels/LanguagesAndLabelsPage';
import LanguagesPage           from './languagesAndLabels/LanguagesPage';
import ReloadConfigurationPage from './reloadConfiguration/ReloadConfigurationPage';
import SMTPServerPage          from './emailConfiguration/SMTPServerPage';

export default class AdministrationAppMenu extends SubMenu {

  open() {
    this.click();
    cy.wait(1000);
    return this;
  }

  get() {
    return this.parent.get().find('[data-id="admin"]');
  }

  getSubmenu() {
    return this.get().find('[data-id="menu"]');
  }

  getDatabase() {
    return this.getSubmenu().find('[data-id="admin-database"]');
  }

  getFileBrowser() {
    return this.getSubmenu().find('[data-id="admin-file-browser"]');
  }

  getLanguagesAndLabels() {
    return this.getSubmenu().find('[data-id="admin-languages-and-labels"]');
  }

  getEmailConfiguration() {
    return this.getSubmenu().find('[data-id="admin-email-configuration"]');
  }

  getReloadConfiguration() {
    return this.getSubmenu().find('[data-id="admin-reload-configuration"]');
  }

  getCollapseButton() {
    return this.getSubmenu().find('[data-back="back"]');
  }

  openDatabase() {
    this.getDatabase().then(button => DatabasePage.openPage(button));
    return cy.wrap(new AppPage(DatabasePage)).as('currentPage');
  }

  openFileBrowser() {
    this.getFileBrowser().then(button => BrowserPage.openPage(button));
    return cy.wrap(new AppPage(BrowserPage)).as('currentPage');
  }

  openLanguagesAndLabels() {
    this.getLanguagesAndLabels().then(button => LanguagesAndLabelsPage.openPage(button));
    return cy.wrap(new AppPage(LanguagesPage)).as('currentPage');
  }

  openEmailConfiguration() {
    this.getEmailConfiguration().then(button => SMTPServerPage.openPage(button));
    return cy.wrap(new AppPage(SMTPServerPage)).as('currentPage');
  }

  openReloadConfiguration() {
    this.getReloadConfiguration().click();
    return cy.wrap(new AppPage(ReloadConfigurationPage)).as('currentPage');
  }

}
