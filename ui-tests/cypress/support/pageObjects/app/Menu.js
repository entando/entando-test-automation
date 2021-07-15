import {DATA_TESTID, htmlElements, WebElement} from "../WebElement.js";

import DashboardMenu from "../dashboard/DashboardMenu.js"
import PagesMenu from "../pages/PagesMenu";
import ComponentsMenu from "../components/ComponentsMenu";
import ContentMenu from "../content/ContentMenu";
import UsersMenu from "../users/UsersMenu.js";
import RepositoryMenu from "../repository/RepositoryMenu";
import AdministrationMenu from "../administration/AdministrationMenu";

export default class Menu extends WebElement {

  collapseButton = `${htmlElements.button}[${DATA_TESTID}=internal-page_VerticalMenuContainer_Button]`;

  get() {
    return this.parent.get()
               .children(htmlElements.div);
  }

  getDashboard() {
    return new DashboardMenu(this);
  }

  getPages() {
    return new PagesMenu(this);
  }

  getComponents() {
    return new ComponentsMenu(this);
  }

  getContent() {
    return new ContentMenu(this);
  }

  getUsers() {
    return new UsersMenu(this);
  }

  getRepository() {
    return new RepositoryMenu(this);
  }

  getAdministration() {
    return new AdministrationMenu(this);
  }

  getCollapseButton() {
    return this.parent.get()
               .children(this.collapseButton);
  }

  collapseMenu() {
    this.getCollapseButton().click();
  }

}