import AdminContent from '../../app/AdminContent';
import AdminPage    from '../../app/AdminPage';

export default class ResultsPage extends AdminContent {

  //FIXME AdminConsole is not built on REST APIs
  static openConfirmActionPage(button) {
    cy.contentsAdminConsoleController().then(controller => controller.intercept({method: 'POST'}, 'viewActionPOST', '/search.action'));
    cy.get(button).click();
    cy.wait('@viewActionPOST');
  }

  //FIXME AdminConsole is not built on REST APIs
  static openViewResultsPage(button) {
    cy.contentsAdminConsoleController().then(controller => controller.intercept({method: 'POST'}, 'resultsLoadingPOST', '/Bulk/*'));
    cy.get(button).click();
    cy.wait('@resultsLoadingPOST');
  }

  getActionOnContent() {
    return this.get()
               .find(`.blank-slate-pf-main-action > .btn`);
  }

  submit() {
    this.getActionOnContent().then(button => ResultsPage.openViewResultsPage(button));
    return cy.wrap(new AdminPage(ResultsPage)).as('currentPage');
  }

  getStatus() {
    return this.get()
               .find('.alert');
  }

  getAlertDanger() {
    return this.get()
               .find('.alert-danger');
  }


}
