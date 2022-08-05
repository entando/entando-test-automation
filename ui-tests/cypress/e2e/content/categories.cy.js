import {generateRandomId} from '../../support/utils';

describe('Categories', () => {
  const testCategory = {
    titleIt: generateRandomId(),
    titleEn: generateRandomId(),
    categoryCode: generateRandomId(),
    treePosition: 'Root',
    rootCode: 'home'
  };

  beforeEach(() => {
    cy.wrap(null).as('categoryToBeDeleted');
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => {
    cy.get('@categoryToBeDeleted').then(categoryCode => {
      if (categoryCode) deleteTestCategory(categoryCode);
    });
    cy.kcTokenLogout();
  });

  it([Tag.GTS, 'ENG-2527'], 'Create a category should be possible', () => {
    openCategoriesPage()
        .then(page => page.getContent().openAddCategoryPage())
        .then(page => page.getContent().addCategory(testCategory.titleEn, testCategory.titleIt, testCategory.categoryCode, testCategory.treePosition))
        .then(page => {
          page.getContent().getCategoriesTree().should('contain', testCategory.titleEn);
          cy.wrap(testCategory.categoryCode).as('categoryToBeDeleted');
        });
  });

  it([Tag.GTS, 'ENG-2527'], 'Create a category with an already existing code should not be possible', () => {
    postTestCategory();
    openCategoriesPage()
        .then(page => page.getContent().openAddCategoryPage())
        .then(page => {
          page.getContent().fillFields(`AAA${testCategory.titleEn}`, testCategory.titleIt, testCategory.categoryCode, testCategory.treePosition);
          page.getContent().getSaveButton().click();
          page.getContent().getAlertMessage().contains('span', testCategory.categoryCode).should('be.visible');
          cy.validateToast(page, testCategory.categoryCode, false);
        });
  });

  it([Tag.GTS, 'ENG-2527'], 'Edit a category should be possible', () => {
    const newTitleEn = `${testCategory.titleEn}-new`;
    const newTitleIt = `${testCategory.titleIt}-new`;
    postTestCategory();
    openCategoriesPage()
        .then(page => page.getContent().getKebabMenu(testCategory).open().openEdit())
        .then(page => page.getContent().editCategory(newTitleEn, newTitleIt))
        .then(page => page.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible'));
  });

  it([Tag.GTS, 'ENG-2527'], 'Delete a category should be possible', () => {
    postTestCategory();
    openCategoriesPage()
        .then(page => {
          page.getContent().getCategoriesTree().contains('td', testCategory.titleEn).should('contain.text', testCategory.titleEn);
          page.getContent().getKebabMenu(testCategory).open().clickDelete();
        })
        .then(page => page.getDialog().confirm())
        .then(page => {
          page.getContent().getCategoriesTree().should('not.contain', testCategory.titleEn);
          cy.wrap(null).as('categoryToBeDeleted');
        });
  });

  describe('Category used in a content', () => {

    const content = {
      description: 'test',
      mainGroup: 'administrators',
      typeCode: 'BNR',
      attributes: [{code: 'title', values: {en: 'test', it: 'test'}}],
      categories: [testCategory.categoryCode]
    };

    beforeEach(() => {
      postTestCategory();
      cy.contentsController()
        .then(controller => controller.addContent(content))
        .then((response) => {
          const {body: {payload}} = response;
          cy.wrap(payload[0].id).as('contentToBeDeleted');
        });
    });

    afterEach(() => {
      cy.get('@contentToBeDeleted').then(contentId => {
        if (contentId) {
          cy.contentsController().then(controller => controller.updateStatus(contentId, 'draft'));
          cy.contentsController().then(controller => controller.deleteContent(contentId))
        }
      });
    });

    it([Tag.GTS, 'ENG-2528'], 'Update a category used in an unpublished content', () => {
      const newTitleEn = `${testCategory.titleEn}-new`;
      const newTitleIt = `${testCategory.titleIt}-new`;

      openCategoriesPage()
          .then(page => page.getContent().getKebabMenu(testCategory).open().openEdit())
          .then(page => page.getContent().editCategory(newTitleEn, newTitleIt))
          .then(page => page.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible'));
    });

    it([Tag.GTS, 'ENG-2528'], 'Update a category used in a published content', () => {
      cy.get('@contentToBeDeleted').then(contentId => cy.contentsController().then(controller => controller.updateStatus(contentId, 'published')));

      const newTitleEn = `${testCategory.titleEn}-new`;
      const newTitleIt = `${testCategory.titleIt}-new`;

      openCategoriesPage()
          .then(page => page.getContent().getKebabMenu(testCategory).open().openEdit())
          .then(page => page.getContent().editCategory(newTitleEn, newTitleIt))
          .then(page => page.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible'));
    });

  });

  const postTestCategory = () => {
    return cy.categoriesController()
             .then(controller => controller.postCategory(testCategory.titleEn, testCategory.titleIt, testCategory.categoryCode, testCategory.rootCode))
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
