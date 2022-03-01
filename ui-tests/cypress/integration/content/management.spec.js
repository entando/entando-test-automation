import HomePage                                   from '../../support/pageObjects/HomePage.js';
import {htmlElements}                             from '../../support/pageObjects/WebElement.js';
import {contentsAPIURL}                           from '../../support/restAPI/controllersEndPoints';
import {generateRandomTypeCode, generateRandomId} from '../../support/utils.js';

const openContentMgmtPage = () => {
  cy.visit('/');
  let currentPage = new HomePage();
  currentPage     = currentPage.getMenu().getContent().open();
  return currentPage.openManagement();
};

describe([Tag.GTS], 'Contents', () => {

  const testContent = {
    typeCode: 'BNR',
    description: 'test content',
    mainGroup: 'administrators',
    attributes: [
      {code: 'title', values: {en: 'test', it: 'test'}}
    ]
  };
  const contentType = 'Banner';

  let contentToBeDeleted = false;
  let currentPage;
  let contentCode;

  beforeEach(() => {
    cy.kcLogin('login/admin').as('tokens');
  });

  afterEach(() => {
    if (contentToBeDeleted) {
      cy.contentsController()
        .then(controller => controller.deleteContent(contentCode))
        .then(() => contentToBeDeleted = false);
    }

    cy.kcLogout();
  });

  describe('Delete content', () => {
    beforeEach(() => {
      cy.contentsController().then(controller => controller.postContent(testContent))
        .then((response) => {
          const {body: {payload}} = response;
          contentCode             = payload[0].id;
        });
    });

    it('Delete content', () => {
      currentPage = openContentMgmtPage();
      currentPage.getContent().getKebabMenu(contentCode).open().clickDelete();
      cy.wait(1000);
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage, 'removed');
    });

    it('Delete published content - not allowed', () => {
      cy.contentsController().then(controller => controller.updateStatus(contentCode, 'published'));

      currentPage = openContentMgmtPage();
      currentPage.getContent().getKebabMenu(contentCode).open().getDelete().should('have.class', 'disabled');

      cy.contentsController().then(controller => controller.updateStatus(contentCode, 'draft'));
      contentToBeDeleted = true;
    });
  });

  describe('Edit content', () => {
    beforeEach(() => {
      cy.contentsController().then(controller => controller.postContent(testContent))
        .then((response) => {
          const {body: {payload}} = response;
          contentCode             = payload[0].id;
          contentToBeDeleted      = true;
        });
    });

    it('Edit content', () => {
      const updatedDescription = `${testContent.description}-updated`;

      currentPage = openContentMgmtPage();
      currentPage = currentPage.getContent().getKebabMenu(contentCode).open().openEdit();
      currentPage.getContent().clearDescription();
      currentPage.getContent().typeDescription(updatedDescription);
      currentPage = currentPage.getContent().submitForm();

      currentPage.getContent().getTableRow(contentCode).find(htmlElements.td).eq(2).should('contain.text', updatedDescription);
    });
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

    cy.pagesController().then(controller => controller.addNewPage(page));
    cy.contentTypesController().then(controller => controller.addContentType(contentTypeCode, contentTypeName));
    cy.contentsController().then(controller => controller.postContent({...content, typeCode: contentTypeCode}))
      .then((response) => {
        const {body: {payload}} = response;
        contentId               = payload[0].id;
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

    cy.visit('/').then(() => {
      let currentPage = new HomePage();
      currentPage     = currentPage.getMenu().getContent().open().openManagement();
      // TODO: find a way to avoid waiting for arbitrary time periods
      cy.wait(1000);
      currentPage.getContent().unpublishContent(contentId);

      cy.validateToast(currentPage, contentId, false);
    });

    cy.pagesController().then(controller => {
      controller.setPageStatus(page.code, 'draft');
      controller.deletePage(page.code);
    });
    cy.contentsController().then(controller => {
      controller.updateStatus(contentId, 'draft');
      controller.deleteContent(contentId);
    });
    cy.contentTypesController().then(controller => controller.deleteContentType(contentTypeCode));
  });


  describe('Add content', () => {
    it('Add content', () => {
      cy.intercept('POST', contentsAPIURL, (req) => {
        req.continue((res) => {
          contentCode = res.body.payload[0].id;
        });
      });

      currentPage = openContentMgmtPage();
      currentPage = currentPage.getContent().openAddContentPage(contentType);
      currentPage.getContent().fillBeginContent(testContent.description);
      currentPage.getContent().fillAttributes([{type: 'Text', value: 'test text'}]);
      currentPage.getContent().copyToAllLanguages();
      cy.wait(1000);
      currentPage = currentPage.getContent().submitForm();

      cy.validateToast(currentPage, 'Saved');

      contentToBeDeleted = true;
    });

    it('Add content without an owner group - not allowed', () => {
      currentPage = openContentMgmtPage();
      currentPage = currentPage.getContent().openAddContentPage(contentType);
      currentPage.getContent().typeDescription(testContent.description);
      currentPage.getContent().clearOwnerGroup();

      currentPage.getContent().getSaveAction().should('have.class', 'disabled');
    });

    it('Add new content and does not fill values for any language but the default one, a modal must present to inform for other languages (ENG-2714)', () => {
      cy.intercept('POST', contentsAPIURL, (req) => {
        req.continue((res) => {
          contentCode = res.body.payload[0].id;
        });
      });

      currentPage = openContentMgmtPage();
      currentPage = currentPage.getContent().openAddContentPage(contentType);
      currentPage.getContent().fillBeginContent(testContent.description);
      currentPage.getContent().fillAttributes([{type: 'Text', value: 'test text'}]);
      cy.wait(1000);
      currentPage.getContent().getSaveAction().invoke('hasClass', 'disabled').should('be.false');
      currentPage.getContent().getSaveContinueAction().invoke('hasClass', 'disabled').should('be.false');
      const saveApproveBtn = currentPage.getContent().getSaveApproveAction();
      saveApproveBtn.should('not.have.class', 'disabled');
      saveApproveBtn.click();
      currentPage.getDialog().getHeader().should('contain.text', 'Missing Translations');
      currentPage.getDialog().getCancelButton().click();
      currentPage.getDialog().get().should('not.exist');
      currentPage.getContent().getSaveApproveAction().click();
      currentPage.getDialog().getFooter().children(htmlElements.button).eq(2).click();
      currentPage.getContent().getItLanguageTab().invoke('attr', 'aria-selected').should('eq', 'true');

      currentPage = currentPage.getContent().submitForm(true);
      cy.validateToast(currentPage, 'Saved');
      contentToBeDeleted = true;
    });
  });

  describe('Browse Contents', () => {
    it('Filter contents with zero results and checking pagination info if the information is correct', () => {
      currentPage = openContentMgmtPage();
      currentPage.getContent().doSearch('z');
      cy.wait(1000);
      currentPage.getContent().getPagination()
                 .getItemsCurrent().invoke('text').should('be.equal', '0-0');
      currentPage.getContent().getPagination()
                 .getItemsTotal().invoke('text').should('be.equal', '0');
    });
  });
});
