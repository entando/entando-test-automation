import { TEST_ID_GROUPS_TABLE } from '../../test-const/group-test-const';
import { generateRandomId }     from '../../support/utils';

describe('Groups', () => {
  let groupName;
  let groupCode;

  beforeEach(() => {
    cy.appBuilderLogin();
    cy.closeWizardAppTour();

    groupName = generateRandomId();
    groupCode = groupName.toLowerCase();
  });

  afterEach(() => {
    cy.appBuilderLogout();
  });

  it('Add group', () => {
    cy.log('should redirect to list with new group after submitting the form');
    cy.addGroup(groupName);
    cy.getByTestId(TEST_ID_GROUPS_TABLE).should('be.visible');
    cy.getTableRowsBySelector(groupName).should('be.visible');
    cy.getTableRowsBySelector(groupCode).should('be.visible');

    cy.log('should redirect back to list on cancel');
    cy.getButtonByText('Add').click();
    cy.getButtonByText('Cancel').click();
    cy.getByTestId(TEST_ID_GROUPS_TABLE).should('be.visible');

    cy.deleteGroup(groupCode);
  });

  it('Edit group', () => {
    cy.addGroup(groupName);

    cy.log('should redirect to list with updated group after submitting the form');
    const updatedGroupName = generateRandomId();
    cy.editGroup(groupCode, updatedGroupName);
    cy.getByTestId(TEST_ID_GROUPS_TABLE).should('be.visible');
    cy.getTableRowsBySelector(updatedGroupName).should('be.visible');
    cy.getTableRowsBySelector(groupCode).should('be.visible');

    cy.log('should redirect back to list on cancel');
    cy.openTableActionsByTestId(groupCode);
    cy.get(`[data-id=edit-${groupCode}`).find('a').click();
    cy.getButtonByText('Cancel').click();
    cy.getByTestId(TEST_ID_GROUPS_TABLE).should('be.visible');

    cy.deleteGroup(groupCode);
  });

  it('Delete group', () => {
    cy.addGroup(groupName);
    cy.wait(1000);
    cy.log('should delete the group after clicking and confirming the delete action');
    cy.deleteGroup(groupCode);
    cy.contains(groupCode).should('not.be.visible');
  });
});
