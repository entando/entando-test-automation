import HomePage from '../../support/pageObjects/HomePage.js';
import {generateRandomTypeCode, generateRandomId} from '../../support/utils.js';

describe('Contents', () => {
  beforeEach(() => {
    cy.kcLogin('admin').as('tokens');
  });

  afterEach(() => {
    cy.kcLogout();
  });

  it('Create a new content', () => {
    cy.visit('/');
    let currentPage = new HomePage();

    currentPage = currentPage.getMenu().getContent().open().openManagement();
    currentPage = currentPage.getContent().openAddContentPage();

    currentPage.getContent().addContent(`AAA-EN`, `AAA-IT`, 'description test');

    cy.validateToast(currentPage, 'Saved');
  });


  // @TODO uncomment when edit of content bug is fixed (simulate bug: create a new content, then go to content management and edit it. You cannot save it)
  // it('Edit a newly created content', () => {
  //   cy.kcLogin("admin").as("tokens");

  //   cy.visit('/');
  //   let currentPage = new HomePage();

  //   currentPage = currentPage.getMenu().getContent().open().openManagement();
  //   currentPage = currentPage.getContent().openEditContentPage();

  //   currentPage.getContent().editContent('description changed');
  //   cy.validateToast(currentPage, 'Saved');

  //   // cy.kcLogout();
  // })

  it('Delete a newly created content', () => {
    cy.kcLogin('admin').as('tokens');

    cy.visit('/');
    let currentPage = new HomePage();

    currentPage = currentPage.getMenu().getContent().open().openManagement();
    currentPage = currentPage.getContent().deleteLastAddedContent();

    cy.validateToast(currentPage, 'removed');

    cy.kcLogout();
  });

  it('Create a content without an owner group - not allowed', () => {
    cy.visit('/');
    let currentPage = new HomePage();

    currentPage = currentPage.getMenu().getContent().open().openManagement();
    currentPage = currentPage.getContent().openAddContentPage();

    currentPage.getContent().typeDescription('test description');
    currentPage.getContent().clearOwnerGroup();

    currentPage.getContent().getSaveAction().should('have.class', 'disabled');
  });

  it('Update status of content referenced by a published page', () => {
    const contentTypeCode = generateRandomTypeCode();
    const contentTypeName = generateRandomId();

    const page = {
      charset: 'utf-8',
      code: 'test',
      contentType: 'text/html',
      pageModel: '1-2-column',
      parentCode: 'homepage',
      titles: {en: 'Test'},
      ownerGroup: 'administrators'
    };

    const content = {
      description: 'test',
      mainGroup: 'administrators'
    };

    let contentId = {value: null};

    const pageWidget = {
      frameId: 4,
      code: 'content_viewer',
      config: {
        ownerGroup: page.ownerGroup,
        joinGroups: [],
        contentDescription: content.description
      }
    };

    cy.pagesController().then(controller => controller.addPage(page));
    cy.contentTypesController().then(controller => controller.postContentType(contentTypeCode, contentTypeName));
    cy.contentsController().then(controller => controller.postContent({...content, typeCode: contentTypeCode}))
      .then((response) => {
        const {body: {payload}} = response;
        contentId               = payload[0].id;
      });
    cy.contentsController().then(controller => controller.updateStatus(contentId, 'published'));
    cy.pagesController().then(controller =>
        controller.updatePageWidget(page.code, pageWidget.frameId, pageWidget.code, {
          ...pageWidget.config,
          contentId: contentId
        }));
    cy.pagesController().then(controller => {
      controller.updateStatus(page.code, 'published');

      cy.visit('/');
      let currentPage = new HomePage();
      currentPage     = currentPage.getMenu().getContent().open().openManagement();
      // TODO: find a way to avoid waiting for arbitrary time periods
      cy.wait(1000);
      currentPage.getContent().unpublishContent(contentId);

      cy.validateToast(currentPage, contentId, false);
    });

    cy.pagesController().then(controller => controller.updateStatus(page.code, 'draft'));
    cy.pagesController().then(controller => controller.deletePage(page.code));
    cy.contentsController().then(controller => controller.updateStatus(contentId, 'draft'));
    cy.contentsController().then(controller => controller.deleteContent(contentId));
    cy.contentTypesController().then(controller => controller.deleteContentType(contentTypeCode));
  });
});
