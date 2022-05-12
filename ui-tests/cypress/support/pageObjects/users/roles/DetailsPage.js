import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

export default class DetailsPage extends AppContent {

  description = `${htmlElements.dl}.DetailRole__detail-list`;

  static openPage(button, code) {
    cy.rolesController().then(controller => controller.intercept({method: 'GET'}, 'detailsPageLoadingGET', `/${code}`));
    cy.rolesController().then(controller => controller.intercept({method: 'GET'}, 'rolesReferencesLoadingGET', `/${code}/userreferences?page=1&pageSize=10`));
    cy.permissionsController().then(controller => controller.intercept({method: 'GET'}, 'permissionsLoadingGET', '?page=1&pageSize=0'));
    cy.get(button).click();
    cy.wait(['@detailsPageLoadingGET', '@rolesReferencesLoadingGET', '@permissionsLoadingGET']);
  }

  getDetailsDescription() {
    return this.getContents()
               .find(this.description);
  }

  getCodeLabel() {
    return this.getDetailsDescription()
               .children(htmlElements.dt).eq(0);
  }

  getCodeValue() {
    return this.getDetailsDescription()
               .children(htmlElements.dd).eq(0);
  }

  getNameLabel() {
    return this.getDetailsDescription()
               .children(htmlElements.dt).eq(1);
  }

  getNameValue() {
    return this.getDetailsDescription()
               .children(htmlElements.dd).eq(1);
  }

  getPermissionsLabel() {
    return this.getDetailsDescription()
               .children(htmlElements.dt).eq(2);
  }

  getPermissionsValue() {
    return this.getDetailsDescription()
               .children(htmlElements.dd).eq(2);
  }

  getReferencedUsersLabel() {
    return this.getDetailsDescription()
               .children(htmlElements.dt).eq(3);
  }

  getReferencedUsersValue() {
    return this.getDetailsDescription()
               .children(htmlElements.dd).eq(3);
  }

}
