import {htmlElements} from '../WebElement.js';

import {SubMenu} from '../app/MenuElement.js';

import AppPage from '../app/AppPage.js';

import DatabasePage           from './database/DatabasePage';
import BrowserPage            from './fileBrowser/BrowserPage';
import LanguagesAndLabelsPage from './languagesAndLabels/LanguagesAndLabelsPage';
import LanguagesPage           from './languagesAndLabels/LanguagesPage';
import ReloadConfigurationPage from './reloadConfiguration/ReloadConfigurationPage';
import SMTPServerPage          from './emailConfiguration/SMTPServerPage';

export default class AdministrationMenu extends SubMenu {

  get() {
    return this.parent.get()
               .children(htmlElements.ul)
               .children(htmlElements.li).eq(6);
  }

  getDatabase() {
    return this.getElements()
               .children(htmlElements.li).eq(0);
  }

  getFileBrowser() {
    return this.getElements()
               .children(htmlElements.li).eq(1);
  }

  getLanguagesAndLabels() {
    return this.getElements()
               .children(htmlElements.li).eq(2);
  }

  getEmailConfiguration() {
    return this.getElements()
               .children(htmlElements.li).eq(3);
  }

  getReloadConfiguration() {
    return this.getElements()
               .children(htmlElements.li).eq(4);
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
