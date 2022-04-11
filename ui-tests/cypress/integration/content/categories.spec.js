import {generateRandomId} from '../../support/utils';

import CategoriesPage     from '../../support/pageObjects/content/categories/CategoriesPage';

describe([Tag.GTS], 'Categories', () => {
  const titleIt      = generateRandomId();
  const titleEn      = generateRandomId();
  const categoryCode = generateRandomId();
  const treePosition = 'Root';
  const rootCode     = 'home';
  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('categoryToBeDeleted');
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
    openCategoriesPage();
  });

  afterEach(() => {
    cy.get('@categoryToBeDeleted').then(categoryCode => {
      if (categoryCode) deleteTestCategory(categoryCode);
    });
    cy.kcUILogout();
  });

  it('Create a category should be possible', () => {
    cy.get('@currentPage')
      .then(page => page.getContent().openAddCategoryPage());

    cy.get('@currentPage')
      .then(page => {
        page.getContent().addCategory(titleEn, titleIt, categoryCode, treePosition);
        cy.wrap(categoryCode).as('categoryToBeDeleted');
      });
    cy.get('@currentPage')
      .then (page => page.getContent().getCategoriesTree().contains('td', titleEn).should('be.visible'));
  });

  it.only('Create a category with an already existing code should not be possible', () => {
    postTestCategory();
    cy.get('@currentPage')
      .then(page => page.getContent().openAddCategoryPage());

    cy.get('@currentPage')
      .then(page => page.getContent().addCategory(`AAA${titleEn}`, titleIt, categoryCode, treePosition))
      .then(page => page.getContent().getAlertMessage().should('be.visible'));

    // the current page shouldn't change because an error is returned from the add function and an alert is shown
    // in the same page (AddPage)
  });

  it('Edit a category should be possible', () => {
    const newTitleEn = `${titleEn}-new`;
    const newTitleIt = `${titleIt}-new`;
    postTestCategory();
    currentPage = openCategoriesPage();
    currentPage = currentPage.getContent().getKebabMenu(titleEn).open().openEdit();
    currentPage = currentPage.getContent().editCategory(newTitleEn, newTitleIt);
    currentPage.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible');
  });

  it('Delete a category should be possible', () => {
    postTestCategory();
    currentPage = openCategoriesPage();
    currentPage.getContent().getCategoriesTree().contains('td', titleEn).should('be.visible');
    currentPage = currentPage.getContent().getKebabMenu(titleEn).open().clickDelete();
    currentPage = currentPage.getContent().submitCancel(CategoriesPage);
    currentPage.getContent().getCategoriesTree().should('not.contain', titleEn);
    cy.wrap(null).as('categoryToBeDeleted');
  });


  //FIX ME wait for api to be fixed

  describe('Category used in a content', () => {

    const content = {
      description: 'test',
      mainGroup: 'administrators',
      typeCode: 'BNR',
      attributes: [{code: 'title', values: {en: 'test', it: 'test'}}],
      categories: [categoryCode]
    };

    beforeEach(() => {
      postTestCategory();
      cy.contentsController()
        .then(controller => controller.addContent(content))
        .then((response) => {
          const {body: {payload}} = response;
          cy.wrap(payload[0].id).as('testContentId');
        });
    });

    afterEach(() => {
      cy.get('@testContentId').then(contentId => cy.contentsController().then(controller => controller.deleteContent(contentId)));
    });

    xit('Update a category used in an unpublished content', () => {
      const newTitleEn = `${titleEn}-new`;
      const newTitleIt = `${titleIt}-new`;
      currentPage      = openCategoriesPage();
      currentPage      = currentPage.getContent().openEditCategoryPage(titleEn);
      currentPage      = currentPage.getContent().editCategory(newTitleEn, newTitleIt);
      currentPage.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible');
    });

    xit('Update a category used in a published content', () => {
      cy.contentsController().then(controller => controller.updateStatus(this.testContentId, 'published'));

      const newTitleEn = `${titleEn}-new`;
      const newTitleIt = `${titleIt}-new`;
      currentPage      = openCategoriesPage();
      currentPage      = currentPage.getContent().openEditCategoryPage(titleEn);
      currentPage      = currentPage.getContent().editCategory(newTitleEn, newTitleIt);
      currentPage.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible');

      cy.contentsController().then(controller => controller.updateStatus(this.testContentId, 'draft'));
    });
  });

  const postTestCategory = () => {
    cy.categoriesController().then(controller => controller.postCategory(titleEn, titleIt, categoryCode, rootCode))
      .then(response => cy.wrap(response.body.payload.code).as('categoryToBeDeleted'));
  };

  const deleteTestCategory = (categoryCode) => {
    cy.categoriesController().then(controller => controller.deleteCategory(categoryCode));
  };

  const openCategoriesPage = () => {
    return cy.get('@currentPage')
        .then(page => page.getMenu().getContent().open().openCategories());
  };

});
