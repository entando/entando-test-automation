import { TEST_ID_ROLE_LIST_TABLE } from '../../test-const/role-test-const';

Cypress.Commands.add('deleteRole', (roleCode) => {
  cy.log(`Delete role ${roleCode}`);
  cy.openPageFromMenu(['Users', 'Roles']);
  cy.openTableActionsByTestId(roleCode);
  cy.getVisibleActionItemByTestID(TEST_ID_ROLE_LIST_TABLE.ACTION_DELETE_ROLE).click();
  cy.getModalDialogByTitle('Delete role').should('be.visible');
  cy.getButtonByText('Delete').click();
});

export {};