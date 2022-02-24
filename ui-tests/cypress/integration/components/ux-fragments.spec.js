import HomePage             from '../../support/pageObjects/HomePage';
import { generateRandomId } from '../../support/utils';

const openFragmentsPage = () => {
  cy.visit('/');
  let currentPage = new HomePage();
  currentPage = currentPage.getMenu().getComponents().open();
  return currentPage.openUXFragments();
};

describe([Tag.GTS], 'UX Fragments', () => {
  let currentPage;

  let fragment = {};

  let fragmentToBeDeleted = false;

  beforeEach(() => {
    cy.kcLogin('admin').as('tokens');

    fragment.code = `a${generateRandomId()}`;
    fragment.guiCode = 'test';
  });

  afterEach(() => {
    if (fragmentToBeDeleted) {
      cy.fragmentsController()
        .then(controller => controller.deleteFragment(fragment.code))
        .then(() => fragmentToBeDeleted = false);
    }

    cy.kcLogout();
  });

  it('Add a new fragment', () => {
    currentPage = openFragmentsPage();

    currentPage = currentPage.getContent().openAddFragmentPage();
    currentPage.getContent().typeCode(fragment.code);
    currentPage.getContent().typeGuiCode(fragment.guiCode);
    currentPage = currentPage.getContent().save();

    fragmentToBeDeleted = true;

    cy.validateToast(currentPage);
  });

  it('Edit fragment', () => {
    cy.fragmentsController()
      .then(controller => controller.addFragment(fragment.code, fragment.guiCode))
      .then(() => fragmentToBeDeleted = true);

    currentPage = openFragmentsPage();

    currentPage = currentPage.getContent().getKebabMenu(fragment.code).open().openEdit();
    currentPage.getContent().getCodeInput().should('be.disabled');
    currentPage.getContent().typeGuiCode('_updated');

    currentPage = currentPage.getContent().save();

    cy.validateToast(currentPage);
  });

  it('Delete fragment', () => {
    cy.fragmentsController()
      .then(controller => controller.addFragment(fragment.code, fragment.guiCode))
      .then(() => fragmentToBeDeleted = true);

    currentPage = openFragmentsPage();

    currentPage.getContent().getKebabMenu(fragment.code).open().clickDelete();
    currentPage.getDialog().confirm();

    cy.validateToast(currentPage);

    fragmentToBeDeleted = false;
  });

  describe('Fragments Browsing', () => {
    it('Pagination check when there are no results (ENG-2680)', () => {
      currentPage = openFragmentsPage();
      currentPage.getContent().getSearchCodeInput().type('z');
      currentPage.getContent().getSearchSubmitButton().click();
      cy.wait(1000);

      currentPage.getContent().getPagination()
                  .getItemsCurrent().invoke('text').should('be.equal', '0-0');
      currentPage.getContent().getPagination()
                  .getItemsTotal().invoke('text').should('be.equal', '0');
    });

  });

});
