import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements } from '../../support/pageObjects/WebElement';

describe('Languages and Labels', () => {
  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('languageToDelete');
    cy.wrap(null).as('labelToDelete');
    cy.kcLogin('admin').as('tokens');
  });

  afterEach(() => {
    cy.get('@languageToDelete').then((languageToDelete) => {
      if (languageToDelete) {
        cy.languagesController()
            .then(controller => controller.putLanguage(languageToDelete.code, languageToDelete.name, false, false));
      }
    });
    cy.get('@labelToDelete').then((labelToDelete) => {
      if (labelToDelete) {
        cy.labelsController()
            .then(controller => controller.removeLabel(labelToDelete));
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
      currentPage.getContent().getLanguageTableRow(sampleLanguage.code).children(htmlElements.td).eq(1).should('have.text', sampleLanguage.name);
    });

    it('Delete / Deactivate a Language', () => {
      cy.languagesController()
          .then(controller => controller.putLanguage(sampleLanguage.code, sampleLanguage.name, true, false));
          currentPage = openLanguagesAndLabelsPage();
      currentPage.getContent().clickDeleteLanguageByCode(sampleLanguage.code);
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage);
    });
  });

  describe('Labels', () => {
    describe('Search for labels', () => {
      beforeEach(() => {
        currentPage = openLanguagesAndLabelsPage();
      });

      it('Add New Label', () => {
        currentPage.getContent().getLabelsTabLink().click();
        currentPage = currentPage.getContent().openAddLabel();
        currentPage.getContent().typeCodeTextField('DEMO');
        currentPage.getContent().typeLanguageTextField('en', 'demo en');
        currentPage.getContent().typeLanguageTextField('it', 'demo it');
        currentPage = currentPage.getContent().submitForm();
        cy.wrap('DEMO').as('labelToDelete');
        cy.wait(100);
        currentPage.getContent().getLabelSearchForm().type('DEMO', { force: true });
        currentPage.getContent().getSearchSubmitButton().click();
        currentPage.getContent().getDisplayedLabelsCount().should('have.length', 2);
      });

      it('Verify the amount of searched labels when empty criteria', () => {
        currentPage.getContent().getLabelsTabLink().click();
        currentPage.getContent().getSearchSubmitButton().click();
        currentPage.getContent().getDisplayedLabelsCount().should('have.length', 11)
      });

      it('Verify the amount of searched labels when criteria is non-empty', () => {
        currentPage.getContent().getLabelsTabLink().click();
        currentPage.getContent().getLabelSearchForm().type("ALL");
        currentPage.getContent().getSearchSubmitButton().click();
        currentPage.getContent().getDisplayedLabelsCount().should('have.length', 4)
      });

    });
  });

  const openLanguagesAndLabelsPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    return currentPage.openLanguages_Labels();
  };

});
