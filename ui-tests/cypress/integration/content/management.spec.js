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

  describe('Operations on unPublished content', () => {
    beforeEach(() => addTestContent(testContent).as('contentToBeDeleted'));

    it('Edit content', () => {
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
    it('Delete content', () => {
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
  });


  describe('Operations on published content', () => {

    beforeEach(() => addPublishedContent(testContent));
    afterEach(() => removePublishedContent());

    it('Delete published content - not allowed', () => {

      openContentMgmtPage()
          .then(page => {
            cy.get('@publishedContentToBeDeleted').then(content => {
                page.getContent().getContentCheckBox(content).check({force: true});
                page.getContent().clickDelete();
              })
              .then(page => page.getContent().submit())
              .then(page => page.getContent().getAlertDanger().should('exist').and('be.visible').and('contain', `${testContent.description}`));
          });
    });
  });

  describe('Operations on referenced content', () => {

    beforeEach(() => testSetUp());
    afterEach(() => testTearDown());

    it('Update status of content referenced by a published page', () => {
      openContentMgmtPage()
          .then(page =>
              cy.get('@publishedContentToBeDeleted').then(content => {
                page.getContent().getContentCheckBox(content).check({force: true});
                page.getContent().clickUnPublish();
              }))
          .then(page => page.getContent().submit())
          .then(page => page.getContent().getAlertDanger().should('exist').and('be.visible').and('contain', `${content.description}`));
      cy.wrap(null).as('contentToBeDeleted');
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

  const addTestContent = (content, typeCode) => {
    return cy.contentsController().then(controller => controller.addContent(content, typeCode))
             .then(response => cy.wrap(response.body.payload[0].id));
  };

  const addPublishedContent      = (content, typeCode) => {
    return addTestContent(content, typeCode).as('publishedContentToBeDeleted').then(content =>
        cy.contentsController().then(controller => controller.updateStatus(content, 'published')));
  };
  const removePublishedContent   = () => {
    return cy.get('@publishedContentToBeDeleted').then(contentCode => {
      cy.contentsController().then(controller => {
        controller.updateStatus(contentCode, 'draft');
        controller.deleteContent(contentCode);
      });
    });
  };
  const addPage                  = () => {
    return cy.seoPagesController().then(controller => controller.addNewPage(page))
             .then(response => cy.wrap(response.body.payload).as('pageToBeDeleted'));
  };
  const setPageStatusOnPublished = () => {
    return cy.get('@pageToBeDeleted').then(page =>
        cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'))
    );
  };
  const removePublishedPage      = () => {
    return cy.get('@pageToBeDeleted').then(page => {
      if (page) cy.pagesController().then(controller => {
        controller.setPageStatus(page.code, 'draft');
        controller.deletePage(page.code);
      });
    });
  };
  const addWidget                = () => {
    return cy.get('@pageToBeDeleted').then(page => {
      cy.get('@publishedContentToBeDeleted').then(contentId => {
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
      });
    });
  };
  const removeWidget             = () => {
    return cy.pageWidgetsController(page.code).then(controller => controller.deleteWidget(0));
  };
  const addContentType           = () => {
    return cy.contentTypesController().then(controller => controller.addContentType(contentTypeCode, contentTypeName))
             .then(response => cy.wrap(response.body.payload)).as('contentTypeToBeDelete');
  };
  const removeContentType        = () => {

    return cy.get('@contentTypeToBeDelete').then(contentTypeCode =>
        cy.contentTypesController().then(controller => controller.deleteContentType(contentTypeCode)));
  };

  const testSetUp = () => {
    addPage();
    addContentType();
    addPublishedContent({...content, typeCode: contentTypeCode});
    addWidget();
    setPageStatusOnPublished();
  };

  const testTearDown = () => {
    removeWidget();
    removePublishedPage();
    removeContentType();
    removePublishedContent();
  };
});
