import {generateRandomId} from '../../support/utils.js';

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
      cy.get('@currentPage')
        .then(page => page.getMenu().getContent().open().openManagement())
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

      cy.get('@currentPage')
        .then(page => page.getMenu().getContent().open().openManagement())
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

  //FIXME add content API is returning 101 GENERIC_ERROR
  xdescribe('Edit content', () => {

    beforeEach(() => {
      const testContent = {
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

      cy.contentsController().then(controller => controller.addContent(testContent))
        .then(response => cy.wrap(response.body.payload[0].id).as('contentToBeDeleted'));
    });

    it('Edit content', () => {});

    it('Update status of content referenced by a published page', () => {});

  });

  //FIXME add content API is returning 101 GENERIC_ERROR
  xdescribe('Delete content', () => {

    beforeEach(() => {
      const testContent = {
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
      cy.contentsController().then(controller => controller.addContent(testContent))
        .then(response => cy.wrap(response.body.payload[0].id).as('contentToBeDeleted'));
    });

    it('Delete content', () => {});

    it('Delete published content - not allowed', () => {});

  });

  const DEFAULT_GROUP        = 'Free Access';
  const DEFAULT_CONTENT_TYPE = 'Banner';

});
