import {generateRandomId, generateRandomTypeCode} from '../../support/utils.js';

import {htmlElements} from '../../support/pageObjects/WebElement.js';

describe([Tag.GTS], 'Contents', () => {

  beforeEach(() => {
    cy.wrap(null).as('contentToBeDeleted');
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.get('@contentToBeDeleted').then(contentCode => {
      if (contentCode) cy.contentsController().then(controller => controller.deleteContent(contentCode));
    });
    cy.kcUILogout();
  });

  describe('Browse Contents', () => {

    it('Filter contents with zero results and checking pagination info if the information is correct', () => {
      openContentMgmtPage()
          .then(page => page.getContent().getFormNameInput().then(input => page.getContent().type(input, 'z')))
          .then(page => page.getContent().clickFormSearchButton())
          .then(page => {
            page.getContent().getAlertMessage()
                .should('exist').and('be.visible')
                .and('contain', 'empty');
          });
    });

  });

  describe('Add content', () => {

    it('Add content', () => {

      const contentTitle = generateRandomId();
      openContentMgmtPage()
          .then(page => page.getContent().openAddContentPage(DEFAULT_CONTENT_TYPE))
          .then(page => page.getContent().getOwnerGroupSelect().then(input => page.getContent().select(input, DEFAULT_GROUP)))
          .then(page => page.getContent().clickOwnerGroupSetGroupButton())
          .then(page => page.getContent().getContentAttributesContentAttributeInput('title').then(input => page.getContent().type(input, contentTitle)))
          .then(page => page.getContent().save())
          .then(page =>
              page.getContent().getTableRow(contentTitle).then(row => {
                cy.get(row).should('exist').and('be.visible');
                cy.get(row).children(htmlElements.td).eq(3).then(code => cy.wrap(code.text().trim()).as('contentToBeDeleted'));
              }));
    });

    // The save button is always enabled, the validation seems to happen on backend side; when trying to save without group, the default one is selected
    // it('Add content without an owner group - not allowed', () => {});

    // Saving a content with only default language is allowed
    // it('Add new content and does not fill values for any language but the default one, a modal must present to inform for other languages (ENG-2714)', () => {});

  });

  describe('Edit content', () => {

    it('Edit content', () => {
      addTestContent();
      openContentMgmtPage()
          .then(page => {
            cy.get('@contentToBeDeleted').then(content => {
              page.getContent().getKebabMenu(content).open().openEdit()
                  .then(page => page.getContent().getContentDescriptionInput().then(input => {
                    page.getContent().clear(input);
                    page.getContent().type(input, updatedDescription);
                  }))
                  .then(page => page.getContent().save())
                  .then(page => page.getContent().getTableRow(content).find(htmlElements.td).eq(1).should('contain.text', updatedDescription));
            });
          });
    });

    it('Update status of content referenced by a published page', () => {

      addPublishedPage();
      openContentMgmtPage()
          .then(page =>
              cy.get('@contentToBeDeleted').then(content => {
                page.getContent().getContentCheckBox(content).check({force: true});
                page.getContent().clickUnPublish();
              }))
          .then(page => page.getContent().submit())
          .then(page => page.getContent().getAlertDanger().should('exist').and('be.visible'));
      cy.wrap(null).as('contentToBeDeleted');
      removePublishedPage();
    });
  });

  describe('Delete content', () => {

    it('Delete content', () => {
      addTestContent();
      openContentMgmtPage()
          .then(page => {
            cy.get('@contentToBeDeleted').then(content => {
                page.getContent().getContentCheckBox(content).check({force: true});
                page.getContent().clickDelete();
              })
              .then(page => page.getContent().submit())
              .then(page => page.getContent().getStatus().should('exist').and('be.visible'));
            cy.wrap(null).as('contentToBeDeleted');
          });
    });

    it('Delete published content - not allowed', () => {

      addPublishedContent();
      openContentMgmtPage()
          .then(page => {
            cy.get('@contentToBeDeleted').then(content => {
                page.getContent().getContentCheckBox(content).check({force: true});
                page.getContent().clickDelete();
              })
              .then(page => page.getContent().submit())
              .then(page => page.getContent().getAlertDanger().should('exist').and('be.visible'));
            cy.wrap(null).as('contentToBeDeleted');
          });
      removePublishedContent();
    });
  });

  const DEFAULT_GROUP        = 'Free Access';
  const DEFAULT_CONTENT_TYPE = 'Banner';
  const testContent          = {
    typeCode: 'BNR',
    description: generateRandomId(),
    mainGroup: 'Free Access',
    attributes: [
      {
        code: 'title',
        values: {
          en: generateRandomId(),
          it: generateRandomId()
        }
      }
    ]
  };
  const contentTypeCode      = generateRandomTypeCode();
  const contentTypeName      = generateRandomId();

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

  const updatedDescription  = `${generateRandomId()}`;
  const openContentMgmtPage = () => cy.get('@currentPage').then(page => page.getMenu().getContent().open().openManagement());

  const addTestContent = () => {
    return cy.contentsController().then(controller => controller.addContent(testContent))
             .then(response => cy.wrap(response.body.payload[0].id).as('contentToBeDeleted'));
  };

  const addPublishedPage = () => {
    cy.seoPagesController().then(controller => controller.addNewPage(page));
    cy.contentTypesController().then(controller => controller.addContentType(contentTypeCode, contentTypeName));
    cy.contentsController().then(controller => controller.addContent({...content, typeCode: contentTypeCode}))
      .then((response) => {
        const {body: {payload}} = response;
        contentId               = payload[0].id;
        cy.wrap(contentId).as('contentToBeDeleted');
      });
    cy.contentsController().then(controller => controller.updateStatus(contentId, 'published'));
    cy.pageWidgetsController(page.code)
      .then(controller => controller
          .addWidget(0,
              'search_form',
              {
                ...pageWidget.config,
                contentId: contentId
              }
          )
      );
    cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));
  };

  const removePublishedPage = () => {
    cy.pageWidgetsController(page.code).then(controller => controller.deleteWidget(0));
    cy.pagesController().then(controller => {
      controller.setPageStatus(page.code, 'draft');
      controller.deletePage(page.code);
    });
    cy.contentsController().then(controller => {
      controller.updateStatus(contentId, 'draft');
      controller.deleteContent(contentId);
    });
    cy.contentTypesController().then(controller => controller.deleteContentType(contentTypeCode));
  };

  const removePublishedContent = () => {
    return cy.contentsController().then(controller => {
      controller.updateStatus(content.id, 'draft');
      controller.deleteContent(content.id);
    });
  };

  const addPublishedContent = () => {
    cy.contentsController()
      .then(controller => controller.addContent(testContent))
      .then(response => content.id = response.body.payload[0].id);
    cy.contentsController().then(controller => controller.updateStatus(content.id, 'published'))
      .then(response => cy.wrap(response.body.payload[0].id).as('contentToBeDeleted'));
  };

});
