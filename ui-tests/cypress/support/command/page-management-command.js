import {
  TEST_ID_LIST_PAGE_TREE,
  TEST_ID_PAGE_TREE,
  TEST_ID_PAGE_TREE_SEARCH_FORM,
} from '../../test-const/page-management-test-const';

import TEST_ID_GENERIC_MODAL from '../../test-const/test-const';

function doDragAndDrop(dragPageName, targetPageName, position) {
  cy.getByTestId(TEST_ID_PAGE_TREE.PAGE_NAME).contains(targetPageName).then(($el) => {
    cy.getByTestId(TEST_ID_PAGE_TREE.PAGE_NAME).contains(dragPageName).parent()
      .siblings('button')
      .drag($el, { force: true, position })
      .then(() => {
        cy.getByTestId(TEST_ID_GENERIC_MODAL.BUTTON).contains('Move').click();
      });
  });
}

/**
 * Drag the page above the target page by clicking on the drag button on the left of the row.
 * @param draggedPageName the exact displayed page name in the UI e.g. "Sitemap"
 * @param targetPageName the exact displayed page name in the UI e.g. "Home"
 */
Cypress.Commands.add('dragAndDropPageAbove', (draggedPageName, targetPageName) => {
  doDragAndDrop(draggedPageName, targetPageName, 'top');
});

/**
 * Drag the page into the target page by clicking on the drag button on the left of the row.
 * This is intended to be used to target a folder.
 * @param draggedPageName the exact displayed page name in the UI e.g. "Sitemap"
 * @param targetPageName the exact displayed page name in the UI e.g. "Home"
 */
Cypress.Commands.add('dragAndDropPageInto', (draggedPageName, targetPageName) => {
  doDragAndDrop(draggedPageName, targetPageName, 'center');
});

/**
 *  Drag the page below the target page by clicking on the drag button on the left of the row.
 * @param draggedPageName the exact displayed page name in the UI e.g. "Sitemap"
 * @param targetPageName the exact displayed page name in the UI e.g. "Home"
 */
Cypress.Commands.add('dragAndDropPageBelow', (draggedPageName, targetPageName) => {
  doDragAndDrop(draggedPageName, targetPageName, 'bottom');
});

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
 * Select the element we want to filter with and the value.
 * @param filterName the name in the UI dropdown list
 * @param value the value we want to search the page with
 */
Cypress.Commands.add('searchPageBy', (filterName, value) => {
  cy.getByTestId(TEST_ID_PAGE_TREE_SEARCH_FORM.DROPDOWN_BUTTON).click().then(() => {
    cy.getByTestId(TEST_ID_PAGE_TREE_SEARCH_FORM.DROPDOWN_MENU_ITEM).contains(filterName)
      .click().then(() => {
        cy.getByTestId(TEST_ID_PAGE_TREE_SEARCH_FORM.SEARCH_FIELD).type(value).then(() => {
          cy.getByTestId(TEST_ID_PAGE_TREE_SEARCH_FORM.SEARCH_BUTTON).click();
        });
      });
  });
});

/**
 * Clear all the results after a research.
 */
Cypress.Commands.add('clearSearchPageResults', () => {
  cy.getByTestId(TEST_ID_LIST_PAGE_TREE.BUTTON).contains('Clear results').click();
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
