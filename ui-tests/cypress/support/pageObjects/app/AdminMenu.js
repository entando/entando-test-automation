import {htmlElements, WebElement} from '../WebElement.js';

import DashboardMenu           from '../dashboard/DashboardMenu.js';
import ComponentsAdminMenu     from '../components/ComponentsAdminMenu';
import ContentMenu             from '../content/ContentMenu';
import UsersAdminMenu          from '../users/UsersAdminMenu.js';
import RepositoryMenu          from '../repository/RepositoryMenu';
import AdministrationAdminMenu from '../administration/AdministrationAdminMenu';
import PagesAdminMenu          from '../pages/PagesAdminMenu';

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
    return new PagesAdminMenu(this);
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
