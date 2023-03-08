import AdminContent from '../../app/AdminContent';
import AdminPage    from '../../app/AdminPage';

export default class ResultsPage extends AdminContent {

  static openConfirmActionPage(button) {
    super.loadPage(button, '/jacms/Content/search.action');
  }

  static openViewResultsPage(button, action) {
    super.loadPage(button, `/jacms/Content/Bulk/${action}.action`);
  }

  getActionOnContent() {
    return this.get()
               .find(`.blank-slate-pf-main-action > .btn`);
  }

  submit(action) {
    this.getActionOnContent().then(button => ResultsPage.openViewResultsPage(button, action));
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
