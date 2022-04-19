import {htmlElements} from '../WebElement.js';

import {SubMenu} from '../app/MenuElement.js';

import AppPage from '../app/AppPage.js';

import MFEWidgetsPage  from './mfeWidgets/MFEWidgetsPage';
import UXFragmentsPage from './uxFragments/UXFragments';

export default class ComponentsMenu extends SubMenu {

  get() {
    return this.parent.get()
               .children(htmlElements.ul)
               .children(htmlElements.li).eq(2);
  }

  getMFEAndWidgets() {
    return this.getElements()
               .children(htmlElements.li).eq(0);
  }

  getUXFragments() {
    return this.getElements()
               .children(htmlElements.li).eq(1);
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
