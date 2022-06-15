import AppContent from '../../app/AppContent';

export default class DetailsPage extends AppContent {
  static openPage(button) {
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesPageLoadingGET', '?*'));
    cy.get(button).click();
    cy.wait('@languagesPageLoadingGET');
  }
}
