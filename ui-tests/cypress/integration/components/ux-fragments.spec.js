import HomePage           from '../../support/pageObjects/HomePage';
import {generateRandomId} from '../../support/utils';

describe('UX Fragments', () => {

  let currentPage;

  beforeEach(() => cy.kcLogin('login/admin').as('tokens'));

  afterEach(() => cy.kcLogout());

  describe([Tag.GTS],'Base tests', () => {

    beforeEach(() => {
      fragment.code = `${generateRandomId()}`;
      cy.wrap(null).as('fragmentToBeDeleted');
    });

    afterEach(() => {
      cy.get('@fragmentToBeDeleted').then(fragmentToBeDeleted => {
        if (fragmentToBeDeleted !== null) {
          cy.fragmentsController().then(controller => controller.deleteFragment(fragmentToBeDeleted.code));
        }
      });
    });

    it('Add a new fragment', () => {
      currentPage = openFragmentsPage();

      currentPage = currentPage.getContent().openAddFragmentPage();
      currentPage.getContent().typeCode(fragment.code);
      currentPage.getContent().typeGuiCode(fragment.guiCode);
      currentPage = currentPage.getContent().save();
      cy.wrap(fragment).as('fragmentToBeDeleted');

      cy.validateToast(currentPage);
    });

    it('Edit fragment', () => {
      cy.fragmentsController()
        .then(controller => controller.addFragment(fragment))
        .then(() => cy.wrap(fragment).as('fragmentToBeDeleted'));

      currentPage = openFragmentsPage();

      currentPage = currentPage.getContent().getKebabMenu(fragment.code).open().openEdit();
      currentPage.getContent().getCodeInput().should('be.disabled');
      currentPage.getContent().typeGuiCode('_updated');

      currentPage = currentPage.getContent().save();

      cy.validateToast(currentPage);
    });

    it('Delete fragment', () => {
      cy.fragmentsController()
        .then(controller => controller.addFragment(fragment))
        .then(() => cy.wrap(fragment).as('fragmentToBeDeleted'));

      currentPage = openFragmentsPage();

      currentPage.getContent().getKebabMenu(fragment.code).open().clickDelete();
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage);

      cy.wrap(null).as('fragmentToBeDeleted');
    });

    const fragment = {
      guiCode: 'test'
    };

  });

  describe(['ENG-2680'], 'Fragments Browsing', () => {

    it('Pagination check when there are no results', () => {
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

  const openFragmentsPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getComponents().open();
    return currentPage.openUXFragments();
  };

});
