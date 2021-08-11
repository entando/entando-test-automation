/**
 * Check if the toast notification and its message is visible
 * @param page - the current page
 * @param isOk - a boolean value if success or not
 * @param text - the text message that should be visible in the toast notification
 */
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

/**
 * Validate if the elements present in the list have the expected text
 * @param list - the list of html elements to be validated
 * @param values - the ordered expected texts
 */
Cypress.Commands.add('validateListTexts', (list, values) => {
  for (let i = 0; i < values.length; i++) {
    if (values[i]) {
      cy.get(list).eq(i).should('have.text', values[i]);
    }
  }
});

export {};
