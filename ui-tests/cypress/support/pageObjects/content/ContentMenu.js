import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

import {SubMenu} from "../app/MenuElement.js";

import AppPage from "../app/AppPage.js";

import ManagementPage from "./management/ManagementPage";
import AssetsPage from "./assets/AssetsPage";
import TemplatesPage from "./templates/TemplatesPage";
import CategoriesPage from "./categories/CategoriesPage";
import VersioningPage from "./versioning/VersioningPage";
import TypesPage from "./types/TypesPage";
import SettingsPage from "./settings/SettingsPage";

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
    this.getManagement().click();
    return new AppPage(ManagementPage);
  }

  openAssets() {
    this.getAssets().click();
    return new AppPage(AssetsPage);
  }

  openTemplates() {
    this.getTemplates().click();
    return new AppPage(TemplatesPage);
  }

  openCategories() {
    this.getCategories().click();
    cy.wait(1000);
    return new AppPage(CategoriesPage);
  }

  openVersioning() {
    this.getVersioning().click();
    return new AppPage(VersioningPage);
  }

  openTypes() {
    this.getTypes().click();
    return new AppPage(TypesPage);
  }

  openSettings() {
    this.getSettings().click();
    return new AppPage(SettingsPage);
  }

}