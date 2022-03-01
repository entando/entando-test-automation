import {generateRandomId} from '../../support/utils';
import HomePage           from '../../support/pageObjects/HomePage';

describe([Tag.GTS], 'Categories', () => {
  const titleIt      = generateRandomId();
  const titleEn      = generateRandomId();
  const categoryCode = generateRandomId();
  const treePosition = 'Root';
  const rootCode     = 'home';
  let currentPage;

  beforeEach(() => {
    cy.kcLogin('login/admin').as('tokens');
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
  });

  it('Create a category with an already existing code should not be possible', () => {
    postTestCategory();
    currentPage = openCategoriesPage();
    currentPage = currentPage.getContent().openAddCategoryPage();
    // the current page shouldn't change because an error is returned from the add function and an alert is shown
    // in the same page (AddPage)
    currentPage.getContent().addCategory(`AAA${titleEn}`, titleIt, categoryCode, treePosition);
    currentPage.getContent().getAlertMessage().contains('span', categoryCode).should('be.visible');
    cy.validateToast(currentPage, categoryCode, false);
    deleteTestCategory();
  });

  it('Edit a category should be possible', () => {
    const newTitleEn = `${titleEn}-new`;
    const newTitleIt = `${titleIt}-new`;
    postTestCategory();
    currentPage = openCategoriesPage();
    currentPage = currentPage.getContent().openEditCategoryPage(categoryCode);
    currentPage = currentPage.getContent().editCategory(newTitleEn, newTitleIt);
    currentPage.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible');
    deleteTestCategory();
  });

  it('Delete a category should be possible', () => {
    postTestCategory();
    currentPage = openCategoriesPage();
    currentPage.getContent().getCategoriesTree().contains('td', titleEn).should('be.visible');
    currentPage = currentPage.getContent().deleteCategory(categoryCode);
    currentPage.getContent().getCategoriesTree().should('not.contain', titleEn);
  });

  describe('Category used in a content', () => {

    let contentId;

    const content = {
      description: 'test',
      mainGroup: 'administrators',
      typeCode: 'BNR',
      attributes: [{ code: 'title', values: { en: 'test', it: 'test' } }],
      categories: [categoryCode]
    };

    beforeEach(() => {
      postTestCategory();
      cy.contentsController()
        .then(controller => controller.postContent(content))
        .then((response) => {
            const { body: { payload } } = response;
            contentId = payload[0].id;
        });
    });

    afterEach(() => {
      cy.contentsController().then(controller => controller.deleteContent(contentId));
      deleteTestCategory();
    });

    it('Update a category used in an unpublished content', () => {
      const newTitleEn = `${titleEn}-new`;
      const newTitleIt = `${titleIt}-new`;
      currentPage = openCategoriesPage();
      currentPage = currentPage.getContent().openEditCategoryPage(categoryCode);
      currentPage = currentPage.getContent().editCategory(newTitleEn, newTitleIt);
      currentPage.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible');
    });

    it('Update a category used in an published content', () => {
      cy.contentsController().then(controller => controller.updateStatus(contentId, 'published'));

      const newTitleEn = `${titleEn}-new`;
      const newTitleIt = `${titleIt}-new`;
      currentPage = openCategoriesPage();
      currentPage = currentPage.getContent().openEditCategoryPage(categoryCode);
      currentPage = currentPage.getContent().editCategory(newTitleEn, newTitleIt);
      currentPage.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible');

      cy.contentsController().then(controller => controller.updateStatus(contentId, 'draft'));
    });
  });

  const postTestCategory = () => {
    cy.categoriesController().then(controller => controller.postCategory(titleEn, titleIt, categoryCode, rootCode));
  };

  const deleteTestCategory = () => {
    cy.categoriesController().then(controller => controller.deleteCategory(categoryCode));
  };

  const openCategoriesPage = () => {
    cy.visit('/');
    let currentPage = new HomePage();
    currentPage     = currentPage.getMenu().getContent().open();
    return currentPage.openCategories();
  };

});
