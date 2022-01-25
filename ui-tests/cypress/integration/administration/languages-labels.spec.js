import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements } from '../../support/pageObjects/WebElement';

describe('Languages & Labels', () => {
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
  });

  const openLanguages = () => {
    cy.visit('/');
    let page = new HomePage();
    page = page.getMenu().getAdministration().open();
    return page.openLanguages_Labels();
  };

  const sampleLanguage = { code: 'cs', name: 'Czech' };

  describe('Languages', () => {
    it('Add new Language', () => {  
      currentPage = openLanguages();
      currentPage.getContent().addLanguage(sampleLanguage.code);
      cy.wrap(sampleLanguage).as('languageToDelete');
      cy.validateToast(currentPage);
      currentPage.getContent().getLanguageTableRow(sampleLanguage.code).children(htmlElements.td).eq(1).should('have.text', sampleLanguage.name);
    });

    it('Delete / Deactivate a Language', () => {
      cy.languagesController()
          .then(controller => controller.putLanguage(sampleLanguage.code, sampleLanguage.name, true, false));
          currentPage = openLanguages();
      currentPage.getContent().clickDeleteLanguageByCode(sampleLanguage.code);
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage);
    });
  });

  xdescribe('Labels', () => {

  });
});