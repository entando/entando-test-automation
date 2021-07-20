import { generateRandomId } from '../../support/utils';
import HomePage             from "../../support/pageObjects/HomePage";

describe('Categories', () => {
    const titleIt = generateRandomId();
    const titleEn = generateRandomId();
    const categoryCode = generateRandomId();
    const treePosition = 'Root';
    const rootCode = 'home';
    let currentPage;

    beforeEach(() => {
        cy.kcLogin("admin").as("tokens");
    });

    afterEach(() => {
        cy.kcLogout();
    });

    it('Create a category should be possible', () => {
        currentPage = openCategoriesPage();
        currentPage = currentPage.getContent().openAddCategoryPage();
        currentPage = currentPage.getContent().addCategory(titleEn, titleIt, categoryCode, treePosition);
        currentPage.getContent().getCategoriesTree().contains('td', titleEn).should('be.visible');
        deleteTestCategory();
    })

    it('Create a category with an already existing code should not be possible', () => {
        postTestCategory();
        currentPage = openCategoriesPage();
        currentPage = currentPage.getContent().openAddCategoryPage();
        // the current page shouldn't change because an error is returned from the add function and an alert is shown
        // in the same page (AddPage)
        currentPage.getContent().addCategory(`AAA${titleEn}`, titleIt, categoryCode, treePosition);
        currentPage.getContent().getAlertMessage().contains('span', categoryCode).should('be.visible');
        cy.validateToast(currentPage, false, categoryCode);
        deleteTestCategory();
    })

    it('Edit a category should be possible', () => {
        const newTitleEn = `${titleEn}-new`;
        const newTitleIt = `${titleIt}-new`;
        postTestCategory()
        currentPage = openCategoriesPage();
        currentPage = currentPage.getContent().openEditCategoryPage(categoryCode);
        currentPage = currentPage.getContent().editCategory(newTitleEn, newTitleIt);
        currentPage.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible');
        deleteTestCategory();
    })

    it('Delete a category should be possible', () => {
        postTestCategory();
        currentPage = openCategoriesPage();
        currentPage.getContent().getCategoriesTree().contains('td', titleEn).should('be.visible');
        currentPage = currentPage.getContent().deleteCategory(categoryCode);
        currentPage.getContent().getCategoriesTree().should('not.contain',titleEn);
    })

    const postTestCategory = () => {
        cy.categoriesController().then(controller => controller.postCategory(titleEn, titleIt, categoryCode, rootCode));
    }

    const deleteTestCategory = () => {
        cy.categoriesController().then(controller => controller.deleteCategory(categoryCode));
    }

    const openCategoriesPage = () => {
        cy.visit('/');
        let currentPage = new HomePage();
        currentPage = currentPage.getMenu().getContent().open();
        return currentPage.openCategories();
    }

});
