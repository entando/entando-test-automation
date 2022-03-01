import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

describe([Tag.GTS], 'Languages and Labels', () => {

  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('languageToBeDeleted');
    cy.kcLogin('login/admin').as('tokens');
  });

  afterEach(() => {
    cy.get('@languageToBeDeleted').then((language) => {
      if (language) {
        cy.languagesController().then(controller => controller.putLanguage(language.code, language.name, false, false));
      }
    });
    cy.kcLogout();
  });

  describe('Languages', () => {

    it('Add new Language', () => {
      currentPage = openLanguagesAndLabelsPage();
      currentPage.getContent().addLanguage(sampleLanguage.code);
      cy.wrap(sampleLanguage).as('languageToBeDeleted');
      cy.validateToast(currentPage);
      getLanguageTableRowByCode(sampleLanguage.code).children(htmlElements.td).eq(1).should('have.text', sampleLanguage.name);
    });

    it('Delete / Deactivate a Language', () => {
      cy.languagesController().then(controller => controller.putLanguage(sampleLanguage.code, sampleLanguage.name, true, false));
      currentPage = openLanguagesAndLabelsPage();
      getLanguageTableRowByCode(sampleLanguage.code).then(row => currentPage.getContent().clickDeleteLanguageByIndex(row.index()));
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage);
    });

    const sampleLanguage = {
      code: 'cs',
      name: 'Czech'
    };

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
                      .closest(htmlElements.tr);
  };

});
