import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import AppPage         from '../../app/AppPage';
import FragmentsPage   from './FragmentsPage';
import UXFragmentsPage from './UXFragmentsPage';

export default class DetailsPage extends AppContent {

  static openPage(button, code) {
    cy.fragmentsController().then(controller => controller.intercept({method: 'GET'}, 'actionsPageLoadingGET', `/${code}`));
    cy.get(button).click();
    cy.wait('@actionsPageLoadingGET');
  }

  getMain() {
    return this.get().find(`.col-xs-12`);
  }

  getFragmentTable() {
    return this.getMain().find(`${htmlElements.table}.table`);
  }

  getEditButton() {
    return this.getMain().find(`${htmlElements.button}[class="pull-right btn btn-primary"]`);
  }

  getReferencedSection() {
    return this.getMain().children(`${htmlElements.div}[class="row"]`);
  }

  getReferencedUxFragments() {
    return this.getReferencedSection().eq(0);
  }

  getReferencedPageTemplates() {
    return this.getReferencedSection().eq(1);

  }

  getReferencedWidgetTypes() {
    return this.getReferencedSection().eq(2);
  }

  goToFragmentsViaBreadCrumb() {
    this.getBreadCrumb().children(htmlElements.li).eq(1).then(button => UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

  openEdit(code) {
    this.getEditButton().then(button => FragmentsPage.openPage(button, `${code}`));
    return cy.wrap(new AppPage(FragmentsPage)).as('currentPage');
  }

}
