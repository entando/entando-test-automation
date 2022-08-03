import {htmlElements, WebElement} from '../WebElement.js';

import DashboardMenu       from '../dashboard/DashboardMenu.js';
import PagesMenu           from '../pages/PagesMenu';
import ComponentsAdminMenu from '../components/ComponentsAdminMenu';
import ContentMenu         from '../content/ContentMenu';
import UsersAdminMenu      from '../users/UsersAdminMenu.js';
import RepositoryMenu      from '../repository/RepositoryMenu';
import AdministrationMenu  from '../administration/AdministrationMenu';

export default class AdminMenu extends WebElement {

  collapseButton = `${htmlElements.button}.navbar-toggle`;

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
    return new ComponentsAdminMenu(this);
  }

  getContent() {
    return new ContentMenu(this);
  }

  getUsers() {
    return new UsersAdminMenu(this);
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
