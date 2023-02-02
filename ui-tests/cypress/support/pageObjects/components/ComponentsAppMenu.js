import {SubMenu} from '../app/MenuElement.js';

import AppPage from '../app/AppPage.js';

import MFEWidgetsPage  from './mfeWidgets/MFEWidgetsPage';
import UXFragmentsPage from './uxFragments/UXFragmentsPage';

export default class ComponentsAppMenu extends SubMenu {

  open() {
    this.click();
    return this;
  }

  get() {
    return this.parent.get().find('[data-id="components"]');
  }

  getSubmenu() {
    return this.get().find('[data-id="menu"]');
  }

  getMFEAndWidgets() {
    return this.getSubmenu().find('[data-id="components-widgets"]');
  }

  getUXFragments() {
    return this.getSubmenu().find('[data-id="components-fragments"]');
  }

  getCollapseButton() {
    return this.getSubmenu().find('[data-back="back"]');
  }

  openMFEAndWidgets() {
    this.getMFEAndWidgets().then(button => MFEWidgetsPage.openPage(button));
    return cy.wrap(new AppPage(MFEWidgetsPage)).as('currentPage');
  }

  openUXFragments() {
    this.getUXFragments().then(button => UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

}
