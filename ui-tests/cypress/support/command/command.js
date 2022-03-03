Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  return originalFn(Cypress.config('basePath') + url, options);
});

Cypress.Commands.add('initWindowOpenChecker', () => {
  cy.window().then((win) => {
    cy.stub(win, 'open').as('windowOpen').callsFake(url => {
      cy.visit(url);
    });
  });
});
