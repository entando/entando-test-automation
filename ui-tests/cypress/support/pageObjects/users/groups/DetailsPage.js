import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

export default class DetailsPage extends AppContent {

  static openPage(button, code) {
    cy.groupsController().then(controller => controller.intercept({method: 'GET'}, 'groupDetailsLoadingGET', `/${code}`));
    cy.groupsController().then(controller => controller.intercept({method: 'GET'}, 'groupDetailsReferencesGET', `/${code}/references/PageManager`));
    cy.get(button).click();
    cy.wait('@groupDetailsLoadingGET')
    cy.wait('@groupDetailsReferencesGET');
  }

  getDetailsTable() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .children(htmlElements.div)
               .children(htmlElements.div);
  }

  getDetailsInfo() {
    return this.getDetailsTable()
               .children(htmlElements.div).eq(0);
  }

  getDetailsRows() {
    return this.getDetailsInfo()
               .children(htmlElements.div);
  }

  getDetailsTabs() {
    return this.getDetailsTable()
               .children(htmlElements.div).eq(1);
  }

}
