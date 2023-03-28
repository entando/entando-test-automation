import {MenuElement}  from '../app/MenuElement.js';
import AppPage        from '../app/AppPage';
import RepositoryPage from './hub/RepositoryPage';

export default class RepositoryAppMenu extends MenuElement {

  get() {
    return this.parent.get().find('[data-id="repository"]');
  }

  openRepository() {
    this.get().then(button => RepositoryPage.openPage(button));
    return cy.wrap(new AppPage(RepositoryPage)).as('currentPage');
  }

}
