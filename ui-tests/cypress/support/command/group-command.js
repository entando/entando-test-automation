import { TEST_ID_GROUP_DELETE_ACTION } from '../../test-const/group-test-const';

Cypress.Commands.add('deleteGroup', (groupCode) => {
  cy.openPageFromMenu(['Users', 'Groups']);
  cy.openTableActionsByTestId(groupCode);
  cy.getByTestId(TEST_ID_GROUP_DELETE_ACTION).filter(':visible').click();
  cy.wait(500);
  cy.getButtonByText('Delete').click();
});

export {};
