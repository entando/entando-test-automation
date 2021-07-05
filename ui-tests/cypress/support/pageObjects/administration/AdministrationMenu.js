import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

import {SubMenu} from "../app/MenuElement.js";

import AppPage from "../app/AppPage.js";

import DatabasePage from "./database/DatabasePage";
import FileBrowserPage from "./fileBrowser/FileBrowserPage";
import Languages_LabelsPage from "./languages_Labels/Languages_LabelsPage";
import EmailConfigurationPage from "./emailConfiguration/EmailConfigurationPage";
import ReloadConfigurationPage from "./reloadConfiguration/ReloadConfigurationPage";

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

  getLanguages_Labels() {
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
    this.getDatabase().click();
    return new AppPage(DatabasePage);
  }

  openFileBrowser() {
    this.getFileBrowser().click();
    return new AppPage(FileBrowserPage);
  }

  openLanguages_Labels() {
    this.getLanguages_Labels().click();
    return new AppPage(Languages_LabelsPage);
  }

  openEmailConfiguration() {
    this.getEmailConfiguration().click();
    return new AppPage(EmailConfigurationPage);
  }

  openReloadConfiguration() {
    this.getReloadConfiguration().click();
    return new AppPage(ReloadConfigurationPage);
  }

}