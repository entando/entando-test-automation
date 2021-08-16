Cypress.Commands.add('validateListTexts', (list, values) => {
  for (let i = 0; i < values.length; i++) {
    if (values[i]) {
      cy.get(list).eq(i).should('have.text', values[i]);
    }
  }
});

Cypress.Commands.add('validateUrlPathname', pathname => {
  cy.location('pathname').should('eq', pathname);
});

Cypress.Commands.add('validateToast', (page, text = null, isOk = true) => {
  const toast = page.getToastList().children('div');
  if (text) {
    toast.should('contain', text);
  }
  const icon = toast.children('span.pficon');
  icon.should('be.visible');
  if (isOk) {
    icon.should('have.class', 'pficon-ok');
  } else {
    icon.should('have.class', 'pficon-error-circle-o');
  }
});

export {};
