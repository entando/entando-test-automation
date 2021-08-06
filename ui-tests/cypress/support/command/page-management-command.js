import {
  TEST_ID_LIST_PAGE_TREE,
  TEST_ID_PAGE_TREE,
} from '../../test-const/page-management-test-const';

function expandOrCollapseAll(label) {
  cy.getByTestId(TEST_ID_PAGE_TREE.PAGE_NAME).siblings().contains(label).click();
}

/**
 * Expand all folders by clicking on the "Expand" main button above the page tree.
 */
Cypress.Commands.add('expandAllPageTreeFolders', () => {
  expandOrCollapseAll('Expand');
});

/**
 * Get page Status
 * @param draggedPageName the exact displayed page name in the UI e.g. "Sitemap"
 */
Cypress.Commands.add('getPageStatusInPageTree', (pageName) => {
  cy.getByTestId(TEST_ID_PAGE_TREE.PAGE_NAME).contains(pageName).parents('td:first')
    .siblings()
    .find(`[data-testid=${TEST_ID_LIST_PAGE_TREE.STATUS}]`)
    .invoke('attr', 'title');
});

export {};
