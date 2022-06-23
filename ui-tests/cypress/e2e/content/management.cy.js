import {generateRandomId, generateRandomTypeCode} from '../../support/utils.js';

import {htmlElements} from '../../support/pageObjects/WebElement.js';

describe('Contents', () => {

  beforeEach(() => {
    cy.wrap(null).as('contentToBeDeleted');
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => {
    cy.get('@contentToBeDeleted').then(contentCode => {
      if (contentCode) cy.contentsController().then(controller => controller.deleteContent(contentCode));
    });
    cy.kcTokenLogout();
  });


  describe('Browse Contents', () => {

    it([Tag.GTS, 'ENG-2487'], 'Filter contents with zero results and checking pagination info if the information is correct', () => {
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

    it([Tag.GTS, 'ENG-2487'], 'Add content', () => {

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
    // it([Tag.GTS, 'ENG-2488'], 'Add content without an owner group - not allowed', () => {});

    // Saving a content with only default language is allowed
    // it([Tag.GTS, 'ENG-2487'], 'Add new content and does not fill values for any language but the default one, a modal must present to inform for other languages (ENG-2714)', () => {});

  });

  describe('Operations on unPublished content', () => {
    beforeEach(() =>
        cy.fixture('data/testContent.json').then(testContent => {
          testContent.description = generateRandomId();
          addTestContent(testContent).as('contentToBeDeleted');
        }));

    it([Tag.GTS, 'ENG-2487'], 'Edit content', () => {
      openContentMgmtPage()
          .then(page => {
            cy.get('@contentToBeDeleted').then(content => {
              // FIXME/TODO the element seems to be covered by another element
              page.getContent().getKebabMenu(content).open(true).openEdit()
                  .then(page => page.getContent().getContentDescriptionInput().then(input => {
                    page.getContent().clear(input);
                    page.getContent().type(input, updatedDescription);
                  }))
                  .then(page => page.getContent().save())
                  .then(page => page.getContent().getTableRow(content).find(htmlElements.td).eq(1).should('contain.text', updatedDescription));
            });
          });
    });
    it([Tag.GTS, 'ENG-2487'], 'Delete content', () => {
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

    afterEach(() => removePublishedContent());

    it([Tag.GTS, 'ENG-2487'], 'Delete published content - not allowed', () => {
      cy.fixture('data/testContent.json').then(testContent => {
        testContent.description = generateRandomId();
        addPublishedContent(testContent);

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
  });

  describe('Operations on referenced content', () => {

    beforeEach(() => addContentReferences());
    afterEach(() => removeContentReferences());

    it([Tag.GTS, 'ENG-2489'], 'Update status of content referenced by a published page', () => {
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
  const contentTypeCode      = generateRandomTypeCode();
  const contentTypeName      = generateRandomId();
  const content              = {
    description: 'test',
    mainGroup: 'administrators'
  };
  const updatedDescription   = `${generateRandomId()}`;


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
    return cy.fixture('data/demoPage.json').then(demoPage => {
      demoPage.code = generateRandomId();
      cy.seoPagesController().then(controller => controller.addNewPage(demoPage))
        .then(response => cy.wrap(response.body.payload).as('pageToBeDeleted'));
    });
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
    return cy.fixture('data/pageWidget.json').then(pageWidget => {
      cy.get('@pageToBeDeleted').then(page => {
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
    });
  };
  const removeWidget             = () => {
    return cy.get('@pageToBeDeleted').then(page => {
      cy.pageWidgetsController(page.code).then(controller => controller.deleteWidget(0));
    });
  };
  const addContentType           = () => {
    return cy.contentTypesController().then(controller => controller.addContentType(contentTypeCode, contentTypeName))
             .then(response => cy.wrap(response.body.payload)).as('contentTypeToBeDelete');
  };
  const removeContentType        = () => {

    return cy.get('@contentTypeToBeDelete').then(contentTypeCode =>
        cy.contentTypesController().then(controller => controller.deleteContentType(contentTypeCode.code)));
  };

  const addContentReferences = () => {
    addPage();
    addContentType();
    addPublishedContent({...content, typeCode: contentTypeCode});
    addWidget();
    setPageStatusOnPublished();
  };

  const removeContentReferences = () => {
    removeWidget();
    removePublishedPage();
    removePublishedContent();
    removeContentType();
  };
});
