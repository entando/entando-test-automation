import {htmlElements, WebElement} from '../WebElement';

import DashboardAppMenu      from '../dashboard/DashboardAppMenu';
import ComponentsAppMenu     from '../components/ComponentsAppMenu';
import UsersAppMenu          from '../users/UsersAppMenu';
import RepositoryAppMenu     from '../repository/RepositoryAppMenu';
import PagesAppMenu          from '../pages/PagesAppMenu';
import AdministrationAppMenu from '../administration/AdministrationAppMenu.';
import ContentAppMenu        from '../content/ContentAppMenu';

export default class AppMenu extends WebElement {

  get() {
    return this.parent.get()
               .children(`${htmlElements.div}.MfeMenuContainer__left-menu-container`)
               .children(htmlElements.div)
               .children('app-builder-menu').shadow()
               .find('[data-id=main-menu]');
  }

  getDashboard() {
    return new DashboardAppMenu(this);
  }

  getPages() {
    return new PagesAppMenu(this);
  }

  getComponents() {
    return new ComponentsAppMenu(this);
  }

  getContent() {
    return new ContentAppMenu(this);
  }

  getUsers() {
    return new UsersAppMenu(this);
  }

  getRepository() {
    return new RepositoryAppMenu(this);
  }

  getAdministration() {
    return new AdministrationAppMenu(this);
  }

}
