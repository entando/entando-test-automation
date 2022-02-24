import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements }                              from '../../support/pageObjects/WebElement';
import { generateRandomId, generateRandomNumericId } from '../../support/utils';

const openContentTemplatesPage = () => {
  cy.visit('/');
  let currentPage = new HomePage();
  currentPage     = currentPage.getMenu().getContent().open();
  return currentPage.openTemplates();
};

const addContentTemplate = template => cy.contentTemplatesController().then(controller => controller.addContentTemplate(template));
const deleteContentTemplate = id => cy.contentTemplatesController().then(controller => controller.deleteContentTemplate(id));

describe([Tag.GTS], 'Content Templates', () => {

  let currentPage;

  let template = {
    contentType: 'BNR',
    contentTypeText: 'Banner',
    contentShape: '<div>test</div>'
  };

  let templateToBeDeleted = false;

  beforeEach(() => {
    template.id = generateRandomNumericId();
    template.descr = generateRandomId();

    cy.kcLogin('admin').as('tokens');
  });

  afterEach(() => {
    if (templateToBeDeleted){
      deleteContentTemplate(template.id).then(() => templateToBeDeleted = false);
    }

    cy.kcLogout();
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
      cy.wrap($tds).eq(0).should('contain.text', template.id);
      cy.wrap($tds).eq(2).should('contain.text', template.contentType);
      cy.wrap($tds).eq(4).should('contain.text', template.descr);
    });

    templateToBeDeleted = true;
  });

  it('Edit content template', () => {
    addContentTemplate(template);
    templateToBeDeleted = true;

    currentPage = openContentTemplatesPage();

    cy.log(`Edit content template with id ${template.id}`);
    const newName = `${template.descr}-new`;
    currentPage = currentPage.getContent().getKebabMenu(template.id).open().openEdit();
    currentPage.getContent().typeName(newName);

    currentPage = currentPage.getContent().submitForm();
    currentPage.getContent().getTableRow(template.id).find(htmlElements.td).eq(4).should('contain.text', template.descr);
  });

  it('Delete content template', () => {
    addContentTemplate(template);

    currentPage = openContentTemplatesPage();

    cy.log(`Delete content template with id ${template.id}`);
    currentPage.getContent().getKebabMenu(template.id).open().clickDelete();
    currentPage.getDialog().confirm();
    currentPage.getContent().getTable().should('not.contain', template.id);
  });

  it('Search for content template', () => {
    addContentTemplate(template);
    templateToBeDeleted = true;

    currentPage = openContentTemplatesPage();

    cy.log(`Search for content template with name ${template.descr}`);
    currentPage.getContent().typeSearchKeyword(template.descr);
    currentPage.getContent().clickSearch();

    currentPage.getContent().getTableRow(template.id).find(htmlElements.td).eq(4).should('contain.text', template.descr);
  });

  it('Check pagination for zero results if info displayed is correct (ENG-2680)', () => {
    currentPage = openContentTemplatesPage();

    currentPage.getContent().typeSearchKeyword('z');
    currentPage.getContent().clickSearch();

    cy.wait(1000);
    currentPage.getContent().getPagination()
                .getItemsCurrent().invoke('text').should('be.equal', '0-0');
    currentPage.getContent().getPagination()
                .getItemsTotal().invoke('text').should('be.equal', '0');
  });

  it('Delete content template referenced by a published content - not allowed', () => {
    const content = {
      description: 'test',
      mainGroup: 'administrators',
      typeCode: 'BNR',
      attributes: [{ code: 'title', values: { en: 'test', it: 'test' } }],
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
        modelId: template.id
      }
    };

    let contentId;

    addContentTemplate(template);
    templateToBeDeleted = true;

    cy.contentsController()
      .then(controller => controller.postContent(content))
      .then((response) => {
        const { body: { payload } } = response;
        contentId = payload[0].id;
      });
    cy.contentsController().then(controller => controller.updateStatus(contentId, 'published'));
    cy.pagesController().then(controller => controller.addNewPage(page))
    cy.widgetsController(page.code)
      .then(controller =>
        controller.addWidget(
          pageWidget.frameId,
          pageWidget.code,
          {
            ...pageWidget.config,
            contentId
          }
        )
      );

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
    currentPage.getContent().getSaveButton().should('be.disabled');
    currentPage.getContent().typeId(template.id);

    cy.log(`Verify that template name is mandatory`);
    currentPage.getContent().clearName();
    currentPage.getContent().getSaveButton().should('be.disabled');
    currentPage.getContent().typeName(template.descr);

    cy.log(`Verify that template HTML model is mandatory`);
    currentPage.getContent().clearHTMLModel();
    currentPage.getContent().getSaveButton().should('be.disabled');
  });
});
