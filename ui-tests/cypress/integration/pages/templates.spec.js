import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements } from '../../support/pageObjects/WebElement';

const sampleData = {
  code: '2-2_democol',
  descr: '2-2 Demo Col',
  configuration: '{"frames": [{"pos": 0, "descr": "Logo", "mainFrame": false, "defaultWidget": {"code": "logo","properties": null}, "sketch": {"x1": 0, "y1": 0, "x2": 2, "y2": 0}}]}',
  template: '<h1>hello there a frame</h1>'
};


const openPageTemplateMgmtPage = () => {
  cy.visit('/');
  let currentPage = new HomePage();
  currentPage = currentPage.getMenu().getPages().open();
  return currentPage.openTemplates();
};

describe('Page Templates', () => {

  beforeEach(() => {
    cy.wrap(null).as('templateToBeDeleted');
    cy.kcLogin('admin').as('tokens');
  });

  afterEach(() => {
    cy.get('@templateToBeDeleted').then(templateToBeDeleted => {
      if (templateToBeDeleted !== null) {
        cy.pageTemplatesController()
          .then(controller => controller.deletePageTemplate(templateToBeDeleted));
      }
    });
    cy.kcLogout();
  });
  
  let currentPage;

  describe('Page Template Form', () => {

    it('Add Template', () => {
      currentPage = openPageTemplateMgmtPage();
      currentPage = currentPage.getContent().openAddPage();
      currentPage.getContent().fillForm(sampleData);
      currentPage = currentPage.getContent().submitForm();
      cy.wrap(sampleData.code).as('templateToBeDeleted');
      cy.wait(100);
      currentPage.getContent().getTableRow(sampleData.code).children(htmlElements.td).eq(2).should('contain.text', sampleData.descr);
      
    });

  });
});