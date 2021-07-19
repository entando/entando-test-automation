/**
 * Check if the toast notification and its message is visible
 * @param page - the current page
 * @param isOk - a boolean value if success or not
 * @param text - the text message that should be visible in the toast notification
 */
Cypress.Commands.add('validateToast', ( page, isOk = true , text) => {
  const toast = page.getToastList().children('div');
  toast.should('contain',text);
  if (isOk) {
    toast.children('span.pficon.pficon-ok').should('be.visible');
  } else {
    toast.children('span.pficon.pficon-error-circle-o').should('be.visible');
  }
});

/**
 * Validate if the elements present in the list have the expected text
 * @param list - the list of html elements to be validated
 * @param values - the ordered expected texts
 */
Cypress.Commands.add('validateListTexts', (list, values) => {
  for (let i = 0; i < values.length; i++) {
    cy.get(list).eq(i).should('have.text', values[i]);
  }
});

export {};
