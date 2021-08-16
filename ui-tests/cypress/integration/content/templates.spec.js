import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements } from '../../support/pageObjects/WebElement';
import { generateRandomId, generateRandomNumericId } from '../../support/utils';

const openContentTemplatesPage = () => {
  cy.visit('/');
  let currentPage = new HomePage();
  currentPage     = currentPage.getMenu().getContent().open();
  return currentPage.openTemplates();
};

const addContentTemplate = template => cy.contentTemplatesController().then(controller => controller.addContentTemplate(template));
const deleteContentTemplate = id => cy.contentTemplatesController().then(controller => controller.deleteContentTemplate(id));

describe('Content Templates', () => {

  let currentPage;
  let template = {
    contentType: 'BNR',
    contentTypeText: 'Banner',
    contentShape: '<div>test</div>'
  };

  beforeEach(() => {
    template.id = generateRandomNumericId();
    template.descr = generateRandomId();

    cy.kcLogin('admin').as('tokens');
  });

  afterEach(() => cy.kcLogout());

  it('Add content template', () => {
    currentPage = openContentTemplatesPage();

    cy.log(`Add content template with id ${template.id}`);
    currentPage = currentPage.getContent().clickAddButton();
    currentPage.getContent().typeId(template.id);
    currentPage.getContent().typeName(template.descr);
    currentPage.getContent().selectContentType(template.contentTypeText);
    currentPage.getContent().typeHTMLModel(template.contentShape);
    
    currentPage = currentPage.getContent().submitForm();
    currentPage.getContent().getTableRow(template.id).find(htmlElements.td).eq(0).should('contain.text', template.id);
    currentPage.getContent().getTableRow(template.id).find(htmlElements.td).eq(2).should('contain.text', template.contentType);
    currentPage.getContent().getTableRow(template.id).find(htmlElements.td).eq(4).should('contain.text', template.descr);

    deleteContentTemplate(template.id);
  });

  it('Edit content template', () => {
    addContentTemplate(template);
  
    currentPage = openContentTemplatesPage();

    cy.log(`Edit content template with id ${template.id}`);
    const newName = `${template.descr}-new`;
    currentPage = currentPage.getContent().getKebabMenu(template.id).open().openEdit();
    currentPage.getContent().typeName(newName);

    currentPage = currentPage.getContent().submitForm();
    currentPage.getContent().getTableRow(template.id).find(htmlElements.td).eq(4).should('contain.text', template.descr);

    deleteContentTemplate(template.id);
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

    currentPage = openContentTemplatesPage();

    cy.log(`Search for content template with name ${template.descr}`);
    currentPage.getContent().typeSearchKeyword(template.descr);
    currentPage.getContent().clickSearch();

    currentPage.getContent().getTableRow(template.id).find(htmlElements.td).eq(4).should('contain.text', template.descr);
    
    deleteContentTemplate(template.id);
  });
});
