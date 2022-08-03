import {htmlElements, WebElement} from '../WebElement';

import DashboardMenu      from '../dashboard/DashboardMenu';
import ComponentsAppMenu  from '../components/ComponentsAppMenu';
import ContentMenu        from '../content/ContentMenu';
import UsersAppMenu       from '../users/UsersAppMenu';
import RepositoryMenu     from '../repository/RepositoryMenu';
import AdministrationMenu from '../administration/AdministrationMenu';
import PagesAppMenu       from '../pages/PagesAppMenu';

export default class AppMenu extends WebElement {

  get() {
    return this.parent.get()
               .children(`${htmlElements.div}.MfeMenuContainer__left-menu-container`)
               .children(htmlElements.div)
               .children('app-builder-menu').shadow()
               .find('[data-id=main-menu]');
  }

  getDashboard() {
    return new DashboardMenu(this);
  }

  getPages() {
    cy.wait(1000);
    return new PagesAppMenu(this);
  }

  getComponents() {
    cy.wait(1000);
    return new ComponentsAppMenu(this);
  }

  getContent() {
    return new ContentMenu(this);
  }

  getUsers() {
    cy.wait(1000);
    return new UsersAppMenu(this);
  }

  getRepository() {
    return new RepositoryMenu(this);
  }

  getAdministration() {
    return new AdministrationMenu(this);
  }

}
