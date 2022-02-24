import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements } from '../../support/pageObjects/WebElement';

describe('Labels', () => {

    let currentPage;

    beforeEach(() => {
        cy.wrap(null).as('labelToDelete');
        cy.kcLogin('admin').as('tokens');
    });

    afterEach(() => {
        cy.get('@labelToDelete').then((labelToDelete) => {
            if (labelToDelete) {
                cy.labelsController()
                    .then(controller => controller.removeLabel(labelToDelete.key));
            }
        });
        cy.kcLogout();
    });

    it([Tag.SMOKE, 'ENG-3238'], 'Labels section', () => {
        currentPage = openLabelsPage();
        currentPage.getContent().getDisplayedLabelsTable().should('exist').and('be.visible');
        currentPage.getContent().getDisplayedLabelsCount().eq(0).children(htmlElements.td).should('have.length', 3);
        currentPage.getContent().getActiveLanguageSelector().children(htmlElements.li).should('have.length', 2);
        currentPage.getContent().getActiveLanguageSelector().contains('*').parent().should('have.class', 'active')
        currentPage.getContent().getLabelSearchFormArea().should('exist').and('be.visible');
        currentPage.getContent().getAddLabelButton().should('exist').and('be.visible');
        currentPage.getContent().getLabelPaginationForm().should('exist').and('be.visible');
        currentPage.getContent().getLabelPaginationTextArea().should('have.value', 1);
    });

    const openLabelsPage = () => {
        cy.visit('/');
        currentPage = new HomePage();
        currentPage = currentPage.getMenu().getAdministration().open();
        currentPage = currentPage.openLanguages_Labels();
        currentPage.getContent().getLabelsTabLink().click();
        return currentPage;
    };

});
