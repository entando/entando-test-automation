import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

import {SubMenu} from "../app/MenuElement.js";

import AppPage from "../app/AppPage.js";

import MFEWidgetsPage from "./mfeWidgets/MFEWidgetsPage";
import UXFragmentsPage from "./uxFragments/UXFragments";

export default class ComponentsMenu extends SubMenu {

  get() {
    return this.parent.get()
               .children(htmlElements.ul)
               .children(htmlElements.li).eq(2);
  }

  getMFE_Widgets() {
    return this.getElements()
               .children(htmlElements.li).eq(0);
  }

  getUXFragments() {
    return this.getElements()
               .children(htmlElements.li).eq(1);
  }

  openMFE_Widgets() {
    this.getMFE_Widgets().click();
    return new AppPage(MFEWidgetsPage);
  }

  openUXFragments() {
    this.getUXFragments().click();
    return new AppPage(UXFragmentsPage);
  }

}