import { TEST_ID_PAGE_DESIGNER } from '../../test-const/page-designer-test-const';

describe('Pages Designer', () => {
  beforeEach(() => {
    cy.appBuilderLogin();
    cy.closeWizardAppTour();
  });

  afterEach(() => {
    cy.appBuilderLogout();
  });

  describe('Drag and drop a widget', () => {
    it('Should add a widget to an empty frame in a page', () => {
      const PAGE = 'My Homepage';
      cy.openPageFromMenu(['Pages', 'Designer']);
      cy.getByTestId(TEST_ID_PAGE_DESIGNER.CONFIG_TABS).contains('Page Tree').click();
      cy.getByTestId(TEST_ID_PAGE_DESIGNER.PAGE_TREE).contains(PAGE).click();
      cy.log('Select the widget');
      cy.getByTestId(TEST_ID_PAGE_DESIGNER.CONFIG_TABS).contains('Widgets').click();
      cy.log('Add the widget to the page in the first empty frame');
      cy.addWidgetToFrame('News Latest', 'Frame 4');
      cy.moveWidget('Frame 4', 'Frame 3');
      cy.getPageStatus().should('match', new RegExp('^Published, with pending changes$'));
      cy.publishPageClick();
      cy.getPageStatus().should('match', new RegExp('^Published$'));
      cy.deletePageWidgetByFrame('Frame 3');
      cy.publishPageClick();
    });
  });
});
