import AppContent from '../../app/AppContent';

export default class DetailsPage extends AppContent {
  static openPage(button) {
    cy.widgetsController().then(controller => controller.intercept({method: 'GET'}, 'detailsPageLoadingGET', '/content_viewer/info'));
    cy.get(button).click();
    cy.wait('@detailsPageLoadingGET');
  }
}
