import WidgetConfigPage from '../WidgetConfigPage';

export default class ContentListWidgetConfigPage extends WidgetConfigPage {

  static openPage(code) {
    //cy.categoriesController().then(controller => controller.intercept({method: 'GET'}, 'categoriesPageLoadingGET', '?parentCode=home'));
    cy.contentTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'contentModelsPageLoadingGET', '?*'));
    cy.contentsController().then(controller => controller.intercept({method: 'GET'}, 'contentsPageLoadingGET', '?*'));
    cy.contentTypesController().then(controller => controller.intercept({method: 'GET'}, 'contentTypesPageLoadingGET', '?*'));
    //cy.categoriesController().then(controller => controller.intercept({method: 'GET'}, 'homeCategoriesPageLoadingGET', '/home'));
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesPageLoadingGET', '?*'));
    //cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'searchPagesPageLoadingGET', '/search?*'));
    cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'pagePageLoadingGET', `/${code}?status=draft`));
    //cy.usersController().then(controller => controller.intercept({method: 'GET'}, 'usersPageLoadingGET', '?*'));
    cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'pageDraftWidgetsPageLoadingGET', `/${code}/widgets?status=draft`));
    // cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'pagePublishedWidgetsPageLoadingGET', `/${code}/widgets?status=published`));
    cy.wait([/*'@categoriesPageLoadingGET',*/ '@contentModelsPageLoadingGET', '@contentsPageLoadingGET', '@contentTypesPageLoadingGET', /*'@homeCategoriesPageLoadingGET',*/ '@languagesPageLoadingGET', /*'@searchPagesPageLoadingGET',*/ '@pagePageLoadingGET', /*'@usersPageLoadingGET',*/ '@pageDraftWidgetsPageLoadingGET'/*, '@pagePublishedWidgetsPageLoadingGET'*/]);
  }
  //TODO find a way to remove arbitrary wait
  static addContent(button){
    cy.contentTypesController().then(controller => controller.intercept({method: 'GET'}, 'contentLoadingGET', `/?*`));
    cy.get(button).click();
    cy.wait('@contentLoadingGET');
    cy.wait(500);
  }
  static settings(){
    cy.contentTypesController().then(controller => controller.intercept({method: 'GET'}, 'contentLoadingGET', `/?*`));
    cy.wait('@contentLoadingGET');
  }

  getContentListTableBody() {
    return this.getMainContainer().find('.Contents__body');
  }

  getContentListTableRowWithTitle(title) {
    return this.getContentListTableBody().find('td').contains(title).siblings();
  }

  getAddButtonFromTableRowWithTitle(title) {
    // FIXME - amend test id attributes for the buttons in appbuilder to avoid using `contains` method
    return this.getContentListTableRowWithTitle(title)
               .find('button.btn.btn-default')//.contains(/^Add$/);
  }
  clickAddButtonFromTableRowWithTitle(title, alreadyAddedContentType = false) {
    this.getAddButtonFromTableRowWithTitle(title).then(button => {
      if (alreadyAddedContentType) button.click();
      else ContentListWidgetConfigPage.addContent(button);
    })
    return cy.get('@currentPage');
  }


  getModelIdDropdownByIndex(idx) {
    return this.getMainContainer().find(`[name="contents[${idx}].modelId"]`);
  }
}
