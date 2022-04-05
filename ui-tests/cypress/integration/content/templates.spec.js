import HomePage                                    from '../../support/pageObjects/HomePage';
import {htmlElements}                              from '../../support/pageObjects/WebElement';
import {generateRandomId, generateRandomNumericId} from '../../support/utils';
import TemplatesPage                               from '../../support/pageObjects/pages/templates/TemplatesPage';

const openContentTemplatesPage = () => {
  let currentPage = new HomePage();
  currentPage     = currentPage.getMenu().getContent().open();
  return currentPage.openTemplates();
};

const addContentTemplate    = template => cy.contentTemplatesController().then(controller => controller.addContentTemplate(template));
const deleteContentTemplate = id => cy.contentTemplatesController().then(controller => controller.deleteContentTemplate(id));

const postContentType   = (code, name) => cy.contentTypesController().then(controller => controller.addContentType(code, name));
const deleteContentType = (code) => cy.contentTypesController().then(controller => controller.deleteContentType(code));

describe([Tag.GTS], 'Content Templates', () => {

  let currentPage;

  let template = {
    contentType: 'BNR',
    contentTypeText: 'Banner',
    contentShape: '<div>test</div>',
    testType: 'BAU',
    testName:'Test'
  };

  let templateToBeDeleted = false;

  beforeEach(() => {
    template.id    = generateRandomNumericId();
    template.descr = generateRandomId();

    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    if (templateToBeDeleted) {
      deleteContentTemplate(template.id).then(() => templateToBeDeleted = false);
    }

    cy.kcUILogout();
  });

  it('Add content template', () => {
    currentPage = openContentTemplatesPage();

    cy.log(`Add content template with id ${template.id}`);
    currentPage = currentPage.getContent().clickAddButton();
    currentPage.getContent().typeId(template.id);
    currentPage.getContent().typeName(template.descr);
    currentPage.getContent().selectContentType(template.contentTypeText);
    currentPage.getContent().typeHTMLModel(template.contentShape);

    currentPage = currentPage.getContent().submitForm();
    currentPage.getContent().getTableRow(template.id).find(htmlElements.td).then(($tds) => {
      cy.wrap($tds).eq(0).should('contain.text', template.descr);
      cy.wrap($tds).eq(1).should('contain.text', template.contentTypeText);
      cy.wrap($tds).eq(2).should('contain.text', template.id);

    });

    templateToBeDeleted = true;
  });

  it('Edit content template', () => {
    addContentTemplate(template);
    templateToBeDeleted = true;

    currentPage = openContentTemplatesPage();

    cy.log(`Edit content template with id ${template.id}`);
    const newName = `${template.descr}-new`;
    currentPage   = currentPage.getContent().getKebabMenu(template.id).open().openEdit();
    currentPage.getContent().typeName(newName);

    currentPage = currentPage.getContent().submitForm();
    currentPage.getContent().getTableRow(template.id).find(htmlElements.td).eq(0).should('contain.text', template.descr);
  });

  it('Delete content template', () => {
    addContentTemplate(template);

    currentPage = openContentTemplatesPage();

    cy.log(`Delete content template with id ${template.id}`);
    currentPage = currentPage.getContent().getKebabMenu(template.id).open().clickDelete();
    currentPage = currentPage.getContent().submitCancel(TemplatesPage);
    currentPage.getContent().getTable().should('not.contain', template.id);
  });

  it('Search for content template', () => {
    addContentTemplate(template);
    templateToBeDeleted = true;

    currentPage = openContentTemplatesPage();

    cy.log(`Search for content template with name ${template.descr}`);
    currentPage.getContent().searchType(template.contentTypeText);
    currentPage.getContent().clickSearch();

    currentPage.getContent().getTableRow(template.id).find(htmlElements.td).eq(0).should('contain.text', template.descr);
  });

  it('Empty template type should be not available', () => {

    postContentType(template.testType, template.testName);
    currentPage = openContentTemplatesPage();
    currentPage.getContent().searchType(template.testName);
    currentPage.getContent().clickSearch();
    cy.wait(1000);
    currentPage.getContent().getForm().should('contain.text', 'There are no models available.')
    deleteContentType(template.testType);
  });

  //FIX ME wait for api to be fixed
  xit('Delete content template referenced by a published content - not allowed', () => {
    const content = {
      description: 'test',
      mainGroup: 'administrators',
      typeCode: 'BNR',
      attributes: [{code: 'title', values: {en: 'test', it: 'test'}}]
    };
      const page = {
      charset: 'utf-8',
      code: generateRandomId(),
      contentType: 'text/html',
      pageModel: '1-2-column',
      parentCode: 'homepage',
      titles: {en: 'Test'},
      ownerGroup: 'administrators'
    };

    const pageWidget = {
      frameId: 4,
      code: 'content_viewer',
      config: {
        ownerGroup: page.ownerGroup,
        joinGroups: [],
        contentDescription: content.description,
        modelId: template.id
      }
    };

    let contentId;

    addContentTemplate(template);
    templateToBeDeleted = true;

    cy.contentsController()
      .then(controller => controller.addContent(content))
      .then((response) => {
        const {body: {payload}} = response;
        contentId               = payload[0].id;
      });
     cy.contentsController().then(controller => controller.updateStatus(contentId, 'published'));
     cy.seoPagesController().then(controller => controller.addNewPage(page));
     cy.widgetsController(page.code)
     .then(controller =>
     controller.addWidget({
     frameId: pageWidget.frameId,
     code: pageWidget.code,
     ownerGroup: pageWidget.config.ownerGroup,
     joinGroups: pageWidget.config.joinGroups,
     contentDescription: pageWidget.config.contentDescription,
     modelId: pageWidget.config.modelId,
     contentId: contentId
     }));

     currentPage = openContentTemplatesPage();

     cy.log(`Delete referenced content template with id ${template.id}`);
     currentPage.getContent().getKebabMenu(template.id).open().clickDelete();
     currentPage.getDialog().confirm();
     cy.validateToast(currentPage, 'referenced', false);

     cy.pagesController().then(controller => controller.deletePage(page.code));
    cy.contentsController().then(controller => {
      controller.updateStatus(contentId, 'draft');
      controller.deleteContent(contentId);
    });
  });

  it('Edit mandatory fields', () => {
    currentPage = openContentTemplatesPage();

    currentPage = currentPage.getContent().clickAddButton();
    currentPage.getContent().typeId(template.id);
    currentPage.getContent().typeName(template.descr);
    currentPage.getContent().selectContentType(template.contentTypeText);
    currentPage.getContent().typeHTMLModel(template.contentShape);
    currentPage.getContent().getSaveButton().should('not.be.disabled');

    cy.log(`Verify that template id is mandatory`);
    currentPage.getContent().clearId();
    currentPage.getContent().submitForm();
    currentPage.getContent().getAlert().should('be.visible');
    currentPage.getContent().getFormArea().should('contain', 'is mandatory');
    currentPage.getContent().typeId(template.id);

    cy.log(`Verify that template name is mandatory`);
    currentPage.getContent().clearName();
    currentPage.getContent().submitForm();
    currentPage.getContent().getAlert().should('be.visible');
    currentPage.getContent().getFormArea().should('contain', 'is mandatory');
    currentPage.getContent().typeName(template.descr);

    cy.log(`Verify that template HTML model is mandatory`);
    currentPage.getContent().clearHTMLModel(template.contentShape);
    currentPage.getContent().submitForm();
    currentPage.getContent().getAlert().should('be.visible');
    currentPage.getContent().getFormArea().should('contain', 'is mandatory');
    currentPage.getContent().typeHTMLModel(template.contentShape);
  });
});
