/**
 * Checks any window.open invocation (_blank types) and converts it to same-tab window navigation
 */
Cypress.Commands.add('initWindowOpenChecker', () => {
  cy.window().then((win) => {
    cy.stub(win, 'open').as('windowOpen').callsFake(url => {
      cy.visit(url);
    });
  });
});

export {};
