import AdminContent   from '../../app/AdminContent';

export default class RemoveContentPage extends AdminContent {

  static openDeleteContentsPage(button){
    cy.get(button).click();
  }
  getDeleteContent() {
    return this.get()
               .find(`.blank-slate-pf-main-action > .btn`)
  }
  submitDeleteContent(){
    this.getDeleteContent().then(button => this.click(button));
    return cy.get('@currentPage');
  }
  getStatus () {
    return this.get()
        .find('.alert > :nth-child(2)');
  }
  getAlertDanger(){
    return this.get()
        .find('.alert-danger > ul > li')
  }



}
