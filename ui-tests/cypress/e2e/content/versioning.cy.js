describe( 'Content Versioning', () => {

  beforeEach(() => {
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => cy.kcTokenLogout());

  describe('Content Version Browsing', () => {
    it('ENG-2680', 'Pagination check when there are no results', () => {
      openVersioningPage()
          .then(page => page.getContent().getSearchDescInput().then(input => page.getContent().type(input, 'z')))
          .then(page => page.getContent().submitSearch())
          .then(page => {
            page.getContent().getPagination()
                .getItemsCurrent().invoke('text').should('be.equal', '0-0');
            page.getContent().getPagination()
                .getItemsTotal().invoke('text').should('be.equal', '0');
          });
    });

  });

});

const openVersioningPage = () => {
  return cy.get('@currentPage')
           .then(page => page.getMenu().getContent().open().openVersioning());
};
