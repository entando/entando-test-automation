import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

import {SubMenu} from "../app/MenuElement.js";

import AppPage from "../app/AppPage.js";

import ManagementPage from "./management/ManagementPage";
import DesignerPage from "./designer/DesignerPage";
import TemplatesPage from "./templates/TemplatesPage";
import SettingsPage from "./settings/SettingsPage";

export default class PagesMenu extends SubMenu {

  get() {
    return this.parent.get()
               .children(htmlElements.ul)
               .children(htmlElements.li).eq(1);
  }

  getManagement() {
    return this.getElements()
               .children(htmlElements.li).eq(0);
  }

  getDesigner() {
    return this.getElements()
               .children(htmlElements.li).eq(1);
  }

  getTemplates() {
    return this.getElements()
               .children(htmlElements.li).eq(2);
  }

  getSettings() {
    return this.getElements()
               .children(htmlElements.li).eq(3);
  }

  openManagement() {
    this.getManagement().click();
    return new AppPage(ManagementPage);
  }

  openDesigner() {
    this.getDesigner().click();
    return new AppPage(DesignerPage);
  }

  openTemplates() {
    this.getTemplates().click();
    return new AppPage(TemplatesPage);
  }

  openSettings() {
    this.getSettings().click();
    return new AppPage(SettingsPage);
  }

}