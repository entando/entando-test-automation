import AdminContent from '../../app/AdminContent';

export default class ResultsPage extends AdminContent {

  static openDeleteContentsPage(button) {
    cy.get(button).click();
  }

  static openUnPublishContentsPage(button) {
    cy.get(button).click();
  }


  getActionOnContent() {
    return this.get()
               .find(`.blank-slate-pf-main-action > .btn`);
  }

  submit() {
    this.getActionOnContent().then(button => this.click(button));
    return cy.get('@currentPage');
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
