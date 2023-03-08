import WidgetConfigPage from '../WidgetConfigPage';

export default class ContentListWidgetConfigPage extends WidgetConfigPage {

  static openPage(code, page, pos) {
    super.loadPage(null, `/widget/config/${code}/page/${page}/frame/${pos}`, false, true);
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

  clickAddButtonFromTableRowWithTitle(title) {
    this.getAddButtonFromTableRowWithTitle(title).then(button => cy.get(button).click());
    cy.waitForStableDOM();
    return cy.get('@currentPage');
  }

  getModelIdDropdownByIndex(idx) {
    return this.getMainContainer().find(`[name="contents[${idx}].modelId"]`);
  }
}
