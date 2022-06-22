import {generateRandomId} from '../../support/utils';

describe('Categories', () => {
  const titleIt      = generateRandomId();
  const titleEn      = generateRandomId();
  const categoryCode = generateRandomId();
  const treePosition = 'Root';
  const rootCode     = 'home';

  beforeEach(() => {
    cy.wrap(null).as('categoryToBeDeleted');
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.get('@categoryToBeDeleted').then(categoryCode => {
      if (categoryCode) deleteTestCategory(categoryCode);
    });
    cy.kcUILogout();
  });

  it([Tag.GTS, 'ENG-2527'], 'Create a category should be possible', () => {
    openCategoriesPage()
        .then(page => page.getContent().openAddCategoryPage())
        .then(page => {
          page.getContent().addCategory(titleEn, titleIt, categoryCode, treePosition);
          cy.wrap(categoryCode).as('categoryToBeDeleted');
        });
    cy.get('@currentPage')
      .then(page => page.getContent().getCategoriesTree().contains('td', titleEn).should('be.visible'));
  });

  it([Tag.GTS, 'ENG-2527'], 'Create a category with an already existing code should not be possible', () => {
    postTestCategory();
    openCategoriesPage()
        .then(page => page.getContent().openAddCategoryPage())
        .then(page => {
          page.getContent().fillFields(`AAA${titleEn}`, titleIt, categoryCode, treePosition);
          page.getContent().getSaveButton().click();
          page.getContent().getAlertMessage().should('be.visible');
        });
  });

  it([Tag.GTS, 'ENG-2527'], 'Edit a category should be possible', () => {
    const newTitleEn = `${titleEn}-new`;
    const newTitleIt = `${titleIt}-new`;
    postTestCategory();
    openCategoriesPage()
        .then(page => page.getContent().getKebabMenu(titleEn).open().openEdit())
        .then(page => page.getContent().editCategory(newTitleEn, newTitleIt))
        .then(page => page.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible'));
  });

  it([Tag.GTS, 'ENG-2527'], 'Delete a category should be possible', () => {
    postTestCategory();
    openCategoriesPage()
        .then(page => {
          page.getContent().getCategoriesTree().contains('td', titleEn).should('contain.text', titleEn);
          page.getContent().getKebabMenu(titleEn).open().clickDelete();
        })
        .then(page => page.getContent().submit())
        .then(page => {
          page.getContent().getCategoriesTree().should('not.contain', titleEn);
          cy.wrap(null).as('categoryToBeDeleted');
        });
  });

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
      const newTitleEn = `${titleEn}-new`;
      const newTitleIt = `${titleIt}-new`;

      openCategoriesPage()
          .then(page => page.getContent().getKebabMenu(titleEn).open().openEdit())
          .then(page => page.getContent().editCategory(newTitleEn, newTitleIt))
          .then(page => page.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible'));
    });

    it([Tag.GTS, 'ENG-2528'], 'Update a category used in a published content', () => {
      cy.get('@contentToBeDeleted').then(contentId => cy.contentsController().then(controller => controller.updateStatus(contentId, 'published')));

      const newTitleEn = `${titleEn}-new`;
      const newTitleIt = `${titleIt}-new`;

      openCategoriesPage()
          .then(page => page.getContent().getKebabMenu(titleEn).open().openEdit())
          .then(page => page.getContent().editCategory(newTitleEn, newTitleIt))
          .then(page => page.getContent().getCategoriesTree().contains('td', newTitleEn).should('be.visible'));
    });

  });

  const postTestCategory = () => {
    return cy.categoriesController()
             .then(controller => controller.postCategory(titleEn, titleIt, categoryCode, rootCode))
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
