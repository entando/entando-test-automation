import AppPage from './app/AppPage';

import Dashboard from './dashboard/Dashboard.js';

export default class HomePage extends AppPage {

  constructor() {
    super(Dashboard);
  }

  static openPage() {
    // FIXME/TODO it is not clear which call are performed on dashboard loading
    /*cy.contentsController().then(controller => controller.intercept({method: 'GET'}, 'contentsPageLoadingGET', '?sort=lastModified&direction=DESC&mode=list&page=1&pageSize=5'));
    cy.contentTypesController().then(controller => controller.intercept({method: 'GET'}, 'contentTypesPageLoadingGET', '?page=1&pageSize=0'));
    cy.groupsController().then(controller => controller.intercept({method: 'GET'}, 'groupsPageLoadingGET', '?page=1&pageSize=1'));
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesPageLoadingGET', '?page=1&pageSize=0'));
    cy.pageTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'pageTemplatesPageLoadingGET', '?page=1&pageSize=1'));
    // TODO http://entando7-0-2.apps.ent64azure.com/entando-de-app/api/dashboard/pageStatus
    cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'pageSearchPageLoadingGET', '/search?sort=lastModified&direction=DESC&page=1&pageSize=5'));
    cy.contentsController().then(controller => controller.intercept({method: 'GET'}, 'contentsStatusPageLoadingGET', '/status'));
    cy.usersController().then(controller => controller.intercept({method: 'GET'}, 'usersPageLoadingGET', '?page=1&pageSize=1'));
    cy.widgetsController().then(controller => controller.intercept({method: 'GET'}, 'widgetsPageLoadingGET', '?page=1&pageSize=1'));
    cy.wait(['@contentsPageLoadingGET', '@contentTypesPageLoadingGET', '@groupsPageLoadingGET', '@languagesPageLoadingGET', '@pageTemplatesPageLoadingGET', '@pageSearchPageLoadingGET', '@contentsStatusPageLoadingGET', '@usersPageLoadingGET', '@widgetsPageLoadingGET']);*/
    cy.wait(3000);
  }

}
