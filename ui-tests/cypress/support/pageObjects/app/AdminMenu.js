import {htmlElements, WebElement} from '../WebElement.js';

import DashboardAdminMenu      from '../dashboard/DashboardAdminMenu.js';
import ComponentsAdminMenu     from '../components/ComponentsAdminMenu';
import UsersAdminMenu          from '../users/UsersAdminMenu.js';
import RepositoryAdminMenu     from '../repository/RepositoryAdminMenu';
import AdministrationAdminMenu from '../administration/AdministrationAdminMenu';
import PagesAdminMenu          from '../pages/PagesAdminMenu';
import ContentAdminMenu        from '../content/ContentAdminMenu';

export default class AdminMenu extends WebElement {

  collapseButton = `${htmlElements.button}.navbar-toggle`;

  get() {
    return this.parent.get()
               .children(htmlElements.div);
  }

  getDashboard() {
    return new DashboardAdminMenu(this);
  }

  getPages() {
    return new PagesAdminMenu(this);
  }

  getComponents() {
    return new ComponentsAdminMenu(this);
  }

  getContent() {
    return new ContentAdminMenu(this);
  }

  getUsers() {
    return new UsersAdminMenu(this);
  }

  getRepository() {
    return new RepositoryAdminMenu(this);
  }

  getAdministration() {
    return new AdministrationAdminMenu(this);
  }

  getCollapseButton() {
    return this.parent.get()
               .children(this.collapseButton);
  }

  collapseMenu() {
    this.getCollapseButton().click();
  }

}
