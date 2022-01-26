import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements } from '../../support/pageObjects/WebElement';

describe('Languages and Labels', () => {
  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('languageToDelete');
    cy.kcLogin('admin').as('tokens');
  });

  afterEach(() => {
    cy.get('@languageToDelete').then((languageToDelete) => {
      if (languageToDelete) {
        cy.languagesController()
            .then(controller => controller.putLanguage(languageToDelete.code, languageToDelete.name, false, false));
      }
    });
    cy.kcLogout();
  });

  describe('Languages', () => {
    const sampleLanguage = { code: 'cs', name: 'Czech' };
    it('Add new Language', () => {  
      currentPage = openLanguagesAndLabelsPage();
      currentPage.getContent().addLanguage(sampleLanguage.code);
      cy.wrap(sampleLanguage).as('languageToDelete');
      cy.validateToast(currentPage);
      getLanguageTableRowByCode(sampleLanguage.code).children(htmlElements.td).eq(1).should('have.text', sampleLanguage.name);
    });

    it('Delete / Deactivate a Language', () => {
      cy.languagesController()
          .then(controller => controller.putLanguage(sampleLanguage.code, sampleLanguage.name, true, false));
          currentPage = openLanguagesAndLabelsPage();
          getLanguageTableRowByCode(sampleLanguage.code).then(row => currentPage.getContent().clickDeleteLanguageByIndex(row.index()));
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage);
    });
  });

  describe('Labels', () => {
    describe('Search for labels', () => {
      beforeEach(() => {
        currentPage = openLanguagesAndLabelsPage();
      });

      it('Verify the amount of searched labels when empty criteria', () => {
        currentPage.getContent().getLabelsTabLink().click();
        currentPage.getContent().getSearchSubmitButton().click();
        currentPage.getContent().getDisplayedLabelsCount().should('have.length', 10) //The search function only shows 10 results
      });

      it('Verify the amount of searched labels when criteria is non-empty', () => {
        currentPage.getContent().getLabelsTabLink().click();
        currentPage.getContent().getLabelSearchForm().type("ALL");
        currentPage.getContent().getSearchSubmitButton().click();
        currentPage.getContent().getDisplayedLabelsCount().should('have.length', 3)  //The corresponding labels are 3
      });

    });
  });

  const openLanguagesAndLabelsPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    return currentPage.openLanguages_Labels();
  };

  const getLanguageTableRowByCode = (code) => {
    return currentPage.getContent()
               .getLanguageTable()
               .contains(code)
               .closest(htmlElements.tr)
  }

});
