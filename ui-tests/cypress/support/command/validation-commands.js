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

export {};
