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

        it([Tag.SANITY, 'ENG-3238'], 'Last page button', () => {
            currentPage.getContent().getLabelLastPageButton().click();
            currentPage.getContent().getLabelPaginationTextArea().should('have.value', 15);
        });

    });

    describe('Search for labels', () => {

        beforeEach(() => {
            currentPage = openLabelsPage();
        });

        it([Tag.SANITY, 'ENG-3238'], 'Verify the results of a search using the search button', () => {
            currentPage.getContent().getLabelSearchForm().type("ALL");
            currentPage.getContent().getSearchSubmitButton().click();
            currentPage.getContent().getDisplayedLabelsCount().should('have.length', 3);
            currentPage.getContent().getDisplayedLabelsCount().eq(0)
                .children().eq(0)
                .should('contain', 'ALL');
            currentPage.getContent().getDisplayedLabelsCount().eq(1)
                .children().eq(0)
                .should('contain', 'ALL');
            currentPage.getContent().getDisplayedLabelsCount().eq(2)
                .children().eq(0)
                .should('contain', 'ALL');
        });

        it([Tag.FEATURE, 'ENG-3238'], 'Verify the results of a search using the return key', () => {
            currentPage.getContent().getLabelSearchForm().type("ALL{enter}");
            currentPage.getContent().getDisplayedLabelsCount().should('have.length', 3);
            currentPage.getContent().getDisplayedLabelsCount().eq(0)
                .children().eq(0)
                .should('contain', 'ALL');
            currentPage.getContent().getDisplayedLabelsCount().eq(1)
                .children().eq(0)
                .should('contain', 'ALL');
            currentPage.getContent().getDisplayedLabelsCount().eq(2)
                .children().eq(0)
                .should('contain', 'ALL');
        });

        it([Tag.FEATURE, 'ENG-3238'], 'Search with no results', () => {
            currentPage.getContent().getLabelSearchForm().type("ABC{enter}");
            currentPage.getContent().getDisplayedLabelsCount().should('not.exist');
        });

    });

    describe('Update labels list functionalities', () => {

        it([Tag.SANITY, 'ENG-3238'], 'List should be updated when a new label is added', () => {
            currentPage = openLabelsPage();
            currentPage = currentPage.getContent().openAddLabel();
            cy.validateAppBuilderUrlPathname('/labels-languages/add');
            currentPage.getContent().typeCodeTextField(testLabel.key);
            currentPage.getContent().typeLanguageTextField('en', testLabel.name.en);
            currentPage.getContent().typeLanguageTextField('it', testLabel.name.it);
            currentPage = currentPage.getContent().submitForm();
            cy.wrap(testLabel).as('labelToDelete');
            cy.validateAppBuilderUrlPathname('/labels-languages');
            currentPage.getContent().getDisplayedLabelsTable().should('exist').and('be.visible');
            currentPage.getContent().getLabelPaginationForm().children().eq(1)
                .find(`${htmlElements.span}.pagination-pf-items-total`)
                .should('have.text', 145);
            currentPage.getContent().getLabelRowByCode(testLabel.key).should('exist');
        });

        it([Tag.SANITY, 'ENG-3238'], 'Label should be updated in the list when it is edited', () => {
            const editedName = "Edited";
            addTestLabel();
            currentPage = openLabelsPage();
            currentPage = currentPage.getContent().getKebabMenu(testLabel.key).open().openEdit();
            cy.validateAppBuilderUrlPathname(`/labels-languages/edit/${testLabel.key}`);
            currentPage.getContent().typeLanguageTextField('en', editedName);
            currentPage = currentPage.getContent().submitForm();
            cy.validateAppBuilderUrlPathname('/labels-languages');
            currentPage.getContent().getLabelRowByCode(testLabel.key)
                .children(htmlElements.td).eq(1)
                .should('not.have.text', testLabel.name.en)
                .and('have.text', editedName);
        });

        it([Tag.SANITY, 'ENG-3238'], 'Modal should be displayed when trying to delete a label', () => {
            addTestLabel();
            currentPage = openLabelsPage();
            currentPage.getContent().getKebabMenu(testLabel.key).open().clickDelete();
            currentPage.getDialog().getBody().getStateInfo().should('exist').and('contain', testLabel.key);
        });

        it([Tag.SANITY, 'ENG-3238'], 'When deletion is confirmed, modal should close and list should be updated', () => {
            addTestLabel();
            currentPage = openLabelsPage();
            currentPage.getContent().getKebabMenu(testLabel.key).open().clickDelete();
            currentPage.getDialog().confirm();
            currentPage.getContent().getActionsButtonByCode(testLabel.key).should('not.exist');
            currentPage.getDialog().get().should('not.exist');
            cy.wrap(null).as('labelToDelete');
        });

        it([Tag.SANITY, 'ENG-3238'], 'When deletion is canceled, modal should close and the label should still be present', () => {
            addTestLabel();
            currentPage = openLabelsPage();
            currentPage.getContent().getKebabMenu(testLabel.key).open().clickDelete();
            currentPage.getDialog().cancel();
            currentPage.getContent().getLabelRowByCode(testLabel.key).should('exist');
            currentPage.getDialog().get().should('not.exist');
        });

        it([Tag.FEATURE, 'ENG-3238'], 'Save button disabled when add form not filled', () => {
            currentPage = openLabelsPage();
            currentPage = currentPage.getContent().openAddLabel();
            cy.validateAppBuilderUrlPathname('/labels-languages/add');
            currentPage.getContent().getForm().should('exist').and('be.visible');
            currentPage.getContent().getSubmit().should('be.disabled');
        });

        it([Tag.FEATURE, 'ENG-3238'], 'Values should be filled in the edit form and the code should be not editable', () => {
            addTestLabel();
            currentPage = openLabelsPage();
            currentPage = currentPage.getContent().getKebabMenu(testLabel.key).open().openEdit();
            cy.validateAppBuilderUrlPathname(`/labels-languages/edit/${testLabel.key}`);
            currentPage.getContent().getForm().should('exist').and('be.visible');
            currentPage.getContent().getCodeTextField().should('exist').and('be.disabled').and('have.value', testLabel.key);
            currentPage.getContent().getLanguageTextField('en').should('exist').and('have.text', testLabel.name.en);
            currentPage.getContent().getLanguageTextField('it').should('exist').and('have.text', testLabel.name.it);
        });

        it([Tag.FEATURE, 'ENG-3238'], 'No label added when navigating out of the add form using breadcrumb', () => {
            currentPage = openLabelsPage();
            currentPage = currentPage.getContent().openAddLabel();
            cy.validateAppBuilderUrlPathname('/labels-languages/add');
            currentPage = currentPage.getContent().navigateToLanguagesAndLabelsFromBreadcrumb();
            cy.validateAppBuilderUrlPathname('/labels-languages');
            currentPage.getContent().getLabelPaginationForm().children().eq(1)
                .find(`${htmlElements.span}.pagination-pf-items-total`)
                .should('have.text', 144);
        });

        it([Tag.FEATURE, 'ENG-3238'], 'Label unchanged when navigating out of the edit form using breadcrumb', () => {
            const editedName = "Edited";
            addTestLabel();
            currentPage = openLabelsPage();
            currentPage = currentPage.getContent().getKebabMenu(testLabel.key).open().openEdit();
            cy.validateAppBuilderUrlPathname(`/labels-languages/edit/${testLabel.key}`);
            currentPage.getContent().typeLanguageTextField('en', editedName);
            currentPage = currentPage.getContent().navigateToLanguagesAndLabelsFromBreadcrumb();
            cy.validateAppBuilderUrlPathname('/labels-languages');
            currentPage.getContent().getLabelRowByCode(testLabel.key)
                .closest(htmlElements.tr)
                .children(htmlElements.td).eq(1)
                .should('not.have.text', editedName)
                .and('have.text', testLabel.name.en);
        });

    });

    describe('Error validation', () => {

        it([Tag.ERROR, 'ENG-3238'], 'Error should be present when selecting but not filling a field in the add label page', () => {
            currentPage = openLabelsPage();
            currentPage = currentPage.getContent().openAddLabel();

            currentPage.getContent().getCodeTextField().focus().blur();
            currentPage.getContent().getCodeTextField().parent().parent().children(htmlElements.span).should('exist').and('have.class', 'help-block');

            currentPage.getContent().getLanguageTextField('en').focus().blur();
            currentPage.getContent().getLanguageTextField('en').parent().parent().children(htmlElements.span).should('exist').and('have.class', 'help-block');

            currentPage.getContent().getLanguageTextField('it').focus().blur();
            currentPage.getContent().getLanguageTextField('it').parent().parent().children(htmlElements.span).should('exist').and('have.class', 'help-block');
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
