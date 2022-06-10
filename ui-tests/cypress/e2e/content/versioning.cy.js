describe( 'Content Versioning', () => {

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => cy.kcUILogout());

  describe('Content Version Browsing', () => {
    it('Pagination check when there are no results (ENG-2680)', () => {
      openVersioningPage()
          .then(page => page.getContent().getSearchDescInput().then(input => page.getContent().type(input, 'z')))
          .then(page => page.getContent().submitSearch())
          .then(page => page.getContent().getSearchForm().should('contain.text', 'There aren\'t modified contents.'));
    });

  });

});

const openVersioningPage = () => {
  return cy.get('@currentPage')
           .then(page => page.getMenu().getContent().open().openVersioning());
};
