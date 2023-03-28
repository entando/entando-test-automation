import {htmlElements} from '../WebElement.js';

import {MenuElement}  from '../app/MenuElement.js';
import RepositoryPage from './hub/RepositoryPage';
import AppPage        from '../app/AppPage';

export default class RepositoryAdminMenu extends MenuElement {

  get() {
    return this.parent.get()
               .children(htmlElements.ul)
               .children(htmlElements.li).eq(5);
  }

  openRepository() {
    this.get().then(button => RepositoryPage.openPage(button));
    return cy.wrap(new AppPage(RepositoryPage)).as('currentPage');
  }

}
