import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements } from '../../support/pageObjects/WebElement';

describe('Labels', () => {

    let currentPage;
    const testLabel = {
        key: 'AAA',
        name: {
            en: 'Test',
            it: 'Prova'
        }
    }

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

    it([Tag.SMOKE, 'ENG-3238'], 'Add form', () => {
        currentPage = openLabelsPage();
        currentPage = currentPage.getContent().openAddLabel();
        cy.validateAppBuilderUrlPathname('/labels-languages/add');
        currentPage.getContent().getForm().should('exist').and('be.visible');
        currentPage.getContent().getCodeTextField().should('exist').and('be.visible');
        currentPage.getContent().getLanguageTextField('en').should('exist').and('be.visible');
        currentPage.getContent().getLanguageTextField('it').should('exist').and('be.visible');
    });

    it([Tag.SMOKE, 'ENG-3238'], 'Action context menu', () => {
        addTestLabel();
        currentPage = openLabelsPage();
        currentPage = currentPage.getContent().getKebabMenu(testLabel.key).open();
        currentPage.getDropdown().should('exist').and('be.visible');
        currentPage.getEdit().should('exist').and('be.visible');
        currentPage.getDelete().should('exist').and('be.visible');
    });

    it([Tag.SMOKE, 'ENG-3238'], 'Edit form', () => {
        addTestLabel();
        currentPage = openLabelsPage();
        currentPage = currentPage.getContent().getKebabMenu(testLabel.key).open().openEdit();
        cy.validateAppBuilderUrlPathname(`/labels-languages/edit/${testLabel.key}`);
        currentPage.getContent().getForm().should('exist').and('be.visible');
        currentPage.getContent().getCodeTextField().should('exist').and('be.visible');
        currentPage.getContent().getLanguageTextField('en').should('exist').and('be.visible');
        currentPage.getContent().getLanguageTextField('it').should('exist').and('be.visible');
    });

    describe('Labels list navigation', () => {

        beforeEach(() => {
            currentPage = openLabelsPage();
        });

        it([Tag.SANITY, 'ENG-3238'], 'Verify labels list', () => {
            currentPage.getContent().getDisplayedLabelsTable().should('exist').and('be.visible');
            currentPage.getContent().getLabelPaginationForm().find(htmlElements.button).should('contain', '10');
            currentPage.getContent().getDisplayedLabelsCount().should('have.length', 10);
            currentPage.getContent().getLabelPaginationTextArea().should('have.value', 1);
        });

        it([Tag.SANITY, 'ENG-3238'], 'Next page button', () => {
            currentPage.getContent().getLabelNextButton().click();
            currentPage.getContent().getLabelPaginationTextArea().should('have.value', 2);
        });

        it([Tag.SANITY, 'ENG-3238'], 'Navigate using page field', () => {
            currentPage.getContent().navigateToLabelListPage(7);
            currentPage.getContent().getLabelPaginationForm().children().eq(1)
                .find(`${htmlElements.span}.pagination-pf-items-current`)
                .should('have.text', "61-70");
        });

        it([Tag.SANITY, 'ENG-3238'], 'Previous page button', () => {
            currentPage.getContent().navigateToLabelListPage(5);
            currentPage.getContent().getLabelPreviousButton().click();
            currentPage.getContent().getLabelPaginationTextArea().should('have.value', 4);
        });

        it([Tag.SANITY, 'ENG-3238'], 'First page button', () => {
            currentPage.getContent().navigateToLabelListPage(8);
            currentPage.getContent().getLabelFirstPageButton().click();
            currentPage.getContent().getLabelPaginationTextArea().should('have.value', 1);
        });

    });

    const openLabelsPage = () => {
        cy.visit('/');
        currentPage = new HomePage();
        currentPage = currentPage.getMenu().getAdministration().open();
        currentPage = currentPage.openLanguages_Labels();
        currentPage.getContent().getLabelsTabLink().click();
        return currentPage;
    };

    const addTestLabel = () => {
        cy.labelsController()
            .then(controller => controller.addLabel(testLabel.key, testLabel.name))
            .then(res => cy.wrap(res.body.payload).as('labelToDelete'));
    }

});
