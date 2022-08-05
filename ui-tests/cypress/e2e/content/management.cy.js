import {generateRandomId, generateRandomTypeCode} from '../../support/utils.js';

import {htmlElements} from '../../support/pageObjects/WebElement.js';

describe('Contents', () => {

  beforeEach(() => {
    cy.wrap(null).as('contentToBeDeleted');
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => {
    cy.get('@contentToBeDeleted').then(content => {
      if (content) cy.contentsController().then(controller => controller.deleteContent(content.id));
    });
    cy.kcTokenLogout();
  });


  describe('Browse Contents', () => {

    it([Tag.GTS, 'ENG-2487', 'ENG-2680'], 'Filter contents with zero results and checking pagination info if the information is correct', () => {
      openContentMgmtPage()
          .then(page => page.getContent().doSearch('z'))
          .then(page => {
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '0-0');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '0');
          });
    });

  });

  describe('Add content', () => {

    it([Tag.GTS, 'ENG-2487'], 'Add content', () => {
      openContentMgmtPage()
        .then(page => page.getContent().openAddContentPage(DEFAULT_CONTENT_TYPE))
        .then(page => page.getContent().fillBeginContent(content.description, DEFAULT_GROUP))
        .then(page => page.getContent().fillAttributes([{type: 'Text', value: 'test text'}]))
        .then(page => page.getContent().copyToAllLanguages())
        .then(page => {
          cy.contentsController().then(controller => controller.intercept({method: 'POST'}, 'postedContent'));
          page.getContent().submitForm();
        })
        .then(page => {
          cy.wait('@postedContent').then(response => cy.wrap(response.response.body.payload[0]).as('contentToBeDeleted'));
          cy.validateToast(page, 'Saved');
        });
    });

    it([Tag.GTS, 'ENG-2488'], 'Add content without an owner group - not allowed', () => {
      openContentMgmtPage()
        .then(page => page.getContent().openAddContentPage(DEFAULT_CONTENT_TYPE))
        .then(page => page.getContent().getDescriptionInput().then(input => page.getContent().type(input, content.description)))
        .then(page => page.getContent().clearOwnerGroup())
        .then(page => page.getContent().getSaveAction().should('have.class', 'disabled'));
    });

    it([Tag.GTS, 'ENG-2487'], 'Add new content and does not fill values for any language but the default one, a modal must present to inform for other languages (ENG-2714)', () => {
      openContentMgmtPage()
        .then(page => page.getContent().openAddContentPage(DEFAULT_CONTENT_TYPE))
        .then(page => page.getContent().fillBeginContent(content.description, DEFAULT_GROUP))
        .then(page => page.getContent().fillAttributes([{type: 'Text', value: 'test text'}]))
        .then(page => page.getContent().getDropDown)
        .then(page => {
          page.getContent().getSaveAction().invoke('hasClass', 'disabled').should('be.false');
          page.getContent().getSaveContinueAction().invoke('hasClass', 'disabled').should('be.false');
          page.getContent().getSaveApproveAction().should('not.have.class', 'disabled');
          page.getContent().getSaveApproveAction(true).then(button => page.getContent().click(button));
        })
        .then(page => {
          page.getDialog().getHeader().should('contain.text', 'Missing Translations');
          page.getDialog().getCancelButton().then(button => page.getContent().click(button))
        })
        .then(page => {
          page.getDialog().get().should('not.exist');
          page.getContent().getSaveApproveAction(true).then(button => page.getContent().click(button));
        })
        .then(page => page.getDialog().getFooter().children(htmlElements.button).eq(2).then(button => page.getContent().click(button)))
        .then(page => {
          page.getContent().getContentAttributesLanguageTab('it').invoke('attr', 'aria-selected').should('eq', 'true');
          cy.contentsController().then(controller => controller.intercept({method: 'POST'}, 'postedContent'));
          page.getContent().submitForm(true);
        })
        .then(page => {
          cy.wait('@postedContent').then(response => cy.wrap(response.response.body.payload[0]).as('contentToBeDeleted'));
          cy.validateToast(page, 'Saved');
        });
    });

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
              page.getContent().getKebabMenu(content.id).open().openEdit(content.typeCode)
                  .then(page => page.getContent().editContent(updatedDescription))
                  .then(page => page.getContent().getTableRow(content.id).find(htmlElements.td).eq(2).should('contain.text', updatedDescription));
              })
          });
    });

    it([Tag.GTS, 'ENG-2487'], 'Delete content', () => {
      openContentMgmtPage()
          .then(page => {
            cy.get('@contentToBeDeleted').then(content => {
              page.getContent().getKebabMenu(content.id).open().clickDelete()
                  .then(page => page.getDialog().confirm())
                  .then(page => cy.validateToast(page, 'removed'))
            });
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
              cy.get('@publishedContentToBeDeleted').then(content => 
                page.getContent().getKebabMenu(content.id).open().getDelete().should('have.class', 'disabled')
              )
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
              cy.get('@publishedContentToBeDeleted').then(content => 
                page.getContent().getKebabMenu(content.id).open().clickUnpublish()
                    .then(page => page.getDialog().confirm())
                    .then(page => cy.validateToast(page, content.id, false))
              ));
    });

  });

  const DEFAULT_GROUP        = 'Free Access';
  const DEFAULT_CONTENT_TYPE = {name: 'Banner', code: 'BNR'};
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
             .then(response => cy.wrap(response.body.payload[0]));
  };

  const addPublishedContent      = (content, typeCode) => {
    return addTestContent(content, typeCode).as('publishedContentToBeDeleted').then(content =>
        cy.contentsController().then(controller => controller.updateStatus(content.id, 'published')));
  };

  const removePublishedContent   = () => {
    return cy.get('@publishedContentToBeDeleted').then(content => {
      cy.contentsController().then(controller => {
        controller.updateStatus(content.id, 'draft');
        controller.deleteContent(content.id);
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
        cy.get('@publishedContentToBeDeleted').then(content => {
          cy.pageWidgetsController(page.code)
            .then(controller => controller
                .addWidget(0,
                    'search_form',
                    {
                      ...pageWidget.config,
                      contentId: content.id
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
