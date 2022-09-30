describe('Portal UI', () => {

  it('ENG-4181', 'Non-existent URL MUST return 404 status code and Page not found page', () => {
    const baseURL = Cypress.config('portalUIPath');
    const pageURL = '/cypress.page';

    cy.request({
      url: baseURL + pageURL,
      followRedirect: false,
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(404);
      expect(resp.redirectedToUrl).to.eq(undefined);
    });
    cy.visit('/cypress.page', {portalUI: true, failOnStatusCode: false});
    cy.location().should((location) => {
      expect(location.pathname).to.eq(`${baseURL}/cypress.page`);
    });
    cy.get('h1').should('have.text', 'Page not found');
  });

});
