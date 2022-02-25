import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements } from '../../support/pageObjects/WebElement';

describe('Languages', () => {

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

    it([Tag.SMOKE, 'ENG-3237'], 'Languages section', () => {
        currentPage = openLanguagesPage();
        currentPage.getContent().getLanguageTable().should('exist').and('be.visible');
        currentPage.getContent().getLanguageRowByIndex(0).children(htmlElements.td).should('have.length', 3);
        currentPage.getContent().getDeleteLanguageByIndex(0).should('exist').and('be.visible');
        currentPage.getContent().getLanguageDropdown().should('exist').and('be.visible');
        currentPage.getContent().getAddLanguageSubmit().should('exist').and('be.visible');
    });

    const openLanguagesPage = () => {
        cy.visit('/');
        currentPage = new HomePage();
        currentPage = currentPage.getMenu().getAdministration().open();
        currentPage = currentPage.openLanguages_Labels();
        currentPage.getContent().getLanguagesTabLink().click();
        cy.wait(1000); //wait for page to load
        return currentPage;
    };

});