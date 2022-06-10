import {htmlElements}                              from '../../support/pageObjects/WebElement';
import {generateRandomId, generateRandomNumericId} from '../../support/utils';
import sampleContentTemplate                       from "../../fixtures/data/sampleContentTemplate.json";

const openContentTemplatesPage = () =>  cy.get('@currentPage').then(page => page.getMenu().getContent().open().openTemplates());

const addContentTemplate = template => cy.contentTemplatesController().then(controller => controller.addContentTemplate(template))
                                                                      .then(() => cy.wrap(template.id).as('templateToBeDeleted'));

const deleteContentTemplate = id => cy.contentTemplatesController().then(controller => controller.deleteContentTemplate(id));

const postContentType = (code, name) => cy.contentTypesController().then(controller => controller.addContentType(code, name)
                                                                   .then(() => cy.wrap(code).as('contentTypeToBeDeleted')));

const deleteContentType = (code) => cy.contentTypesController().then(controller => controller.deleteContentType(code));

describe([Tag.GTS], 'Content Templates', () => {

  beforeEach(() => {
    cy.wrap(null).as('pageToBeDeleted');
    cy.wrap(null).as('contentToBeDeleted');
    cy.wrap(null).as('templateToBeDeleted');
    cy.wrap(null).as('contentTypeToBeDeleted');
    sampleContentTemplate.id    = generateRandomNumericId();
    sampleContentTemplate.descr = generateRandomId();

    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.get('@pageToBeDeleted').then(code => {
      if (code) cy.pagesController().then(controller => controller.deletePage(code));
    });
    cy.get('@contentToBeDeleted').then(contentId => {
      if (contentId) {
        cy.contentsController().then(controller => {
          controller.updateStatus(contentId, 'draft');
          controller.deleteContent(contentId);
        });
      }
    });
    cy.get('@templateToBeDeleted').then(template => {
      if (template) deleteContentTemplate(template);
    });
    cy.get('@contentTypeToBeDeleted').then(contentType => {
      if (contentType) deleteContentType(contentType);
    });
    cy.kcUILogout();
  });

  it('Add content template', () => {
    openContentTemplatesPage()
      .then(page => {
        cy.log(`Add content template with id ${sampleContentTemplate.id}`);
        page.getContent(). openAddTemplatePage();
      })
      .then(page => {
        page.getContent().fillFormFields(sampleContentTemplate);
        page.getContent().submitForm();
      })
      .then(page => page.getContent().getTableRow(sampleContentTemplate.id).find(htmlElements.td).then(($tds) => {
        cy.wrap($tds).eq(0).should('contain.text', sampleContentTemplate.descr);
        cy.wrap($tds).eq(1).should('contain.text', sampleContentTemplate.contentTypeText);
        cy.wrap($tds).eq(2).should('contain.text', sampleContentTemplate.id);
        cy.wrap(sampleContentTemplate.id).as('templateToBeDeleted');
      }));
  });

  it('Edit content template', () => {
    addContentTemplate(sampleContentTemplate);

    openContentTemplatesPage()
      .then(page => {
        cy.log(`Edit content template with id ${sampleContentTemplate.id}`);
        page.getContent().getKebabMenu(sampleContentTemplate.id).open().openEdit();
      })
      .then(page => {
        page.getContent().getNameInput().then(input => page.getContent().type(input, `${sampleContentTemplate.descr}-new`));
        page.getContent().submitForm();
      })
      .then(page => page.getContent().getTableRow(sampleContentTemplate.id).find(htmlElements.td).eq(0).should('contain.text', `${sampleContentTemplate.descr}-new`));
  });

  it('Delete content template', () => {
    addContentTemplate(sampleContentTemplate);

    openContentTemplatesPage()
      .then(page => {
        cy.log(`Delete content template with id ${sampleContentTemplate.id}`);
        page.getContent().getKebabMenu(sampleContentTemplate.id).open().clickDelete();
      })
      .then(page => page.getContent().submit())
      .then(page => {
        page.getContent().getTable().should('not.contain', sampleContentTemplate.id);
        cy.wrap(null).as('templateToBeDeleted');
      });
  });

  it('Search for content template', () => {
    addContentTemplate(sampleContentTemplate);

    openContentTemplatesPage()
      .then(page => {
        page.getContent().getSearchInput().then(input => page.getContent().select(input, sampleContentTemplate.contentTypeText));
        page.getContent().clickSearch();
        page.getContent().getTableRow(sampleContentTemplate.id).find(htmlElements.td).eq(0).should('contain.text', sampleContentTemplate.descr);
      });
  });

  it('Empty template type should be not available', () => {
    postContentType(sampleContentTemplate.testType, sampleContentTemplate.testName);

    openContentTemplatesPage()
      .then(page => {
        page.getContent().getSearchInput().then(input => page.getContent().select(input, sampleContentTemplate.testName));
        page.getContent().clickSearch();
        page.getContent().getForm().should('contain.text', 'There are no models available.');
      });
  });

  it('Delete content template referenced by a published content - not allowed', () => {

    const content = {
      description: 'test',
      mainGroup: 'administrators',
      typeCode: 'BNR',
      attributes: [{ code: 'title', values: { en: 'test', it: 'test' } }]
    };

    const page = {
      charset: 'utf-8',
      code: generateRandomId(),
      contentType: 'text/html',
      pageModel: '1-2-column',
      parentCode: 'homepage',
      titles: { en: 'Test' },
      ownerGroup: 'administrators'
    };

    const pageWidget = {
      frameId: 4,
      code: 'content_viewer',
      config: {
        ownerGroup: page.ownerGroup,
        joinGroups: [],
        contentDescription: content.description,
        modelId: sampleContentTemplate.id
      }
    };

    addContentTemplate(sampleContentTemplate);

    cy.contentsController()
      .then(controller => controller.addContent(content))
      .then((response) => {
        const { body: { payload } } = response;
        cy.wrap(payload[0].id).as('contentToBeDeleted');
      });
    cy.get('@contentToBeDeleted').then(contentId => {
      cy.contentsController().then(controller => controller.updateStatus(contentId, 'published'));
      cy.seoPagesController().then(controller => controller.addNewPage(page))
                             .then(() => cy.wrap(page.code).as('pageToBeDeleted'));
      cy.pageWidgetsController(page.code)
        .then(controller =>
          controller.addWidget(
            pageWidget.frameId,
            pageWidget.code,
            {
              ownerGroup: pageWidget.config.ownerGroup,
              joinGroups: pageWidget.config.joinGroups,
              contentDescription: pageWidget.config.contentDescription,
              modelId: pageWidget.config.modelId,
              contentId: contentId
            }));
    });

    openContentTemplatesPage()
      .then(page => {
        cy.log(`Delete referenced content template with id ${sampleContentTemplate.id}`);
        page.getContent().getKebabMenu(sampleContentTemplate.id).open().clickDelete();
      })
      .then(page => page.getContent().getAlertMessage().should('exist').and('contain.text', 'used'));
  });

  it('Edit mandatory fields', () => {
    openContentTemplatesPage()
      .then(page => page.getContent().openAddTemplatePage())
      .then(page => {
        page.getContent().fillFormFields(sampleContentTemplate);
        page.getContent().getSaveButton().should('not.be.disabled');

        cy.log(`Verify that template id is mandatory`);
        page.getContent().getIDInput().then(input => page.getContent().clear(input));
        page.getContent().getSaveButton().then(button => page.getContent().click(button));
        page.getContent().getAlertMessage().should('be.visible');
        page.getContent().getFormArea().should('contain', 'is mandatory');
        page.getContent().getIDInput().then(input => page.getContent().type(input, sampleContentTemplate.id));
        
        cy.log(`Verify that template name is mandatory`);
        page.getContent().getNameInput().then(input => page.getContent().clear(input));
        page.getContent().getSaveButton().then(button => page.getContent().click(button));
        page.getContent().getAlertMessage().should('be.visible');
        page.getContent().getFormArea().should('contain', 'is mandatory');
        page.getContent().getNameInput().then(input => page.getContent().type(input, sampleContentTemplate.descr));
        
        cy.log(`Verify that template HTML model is mandatory`);
        page.getContent().clearHTMLModel(sampleContentTemplate.contentShape);
        page.getContent().getSaveButton().then(button => page.getContent().click(button));
        page.getContent().getAlertMessage().should('be.visible');
        page.getContent().getFormArea().should('contain', 'is mandatory');
        page.getContent().getContentShapeInput().then(input => page.getContent().type(input, sampleContentTemplate.contentShape, true));
      });
  });

});
