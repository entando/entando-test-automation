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

    it('Edit Template', () => {
      cy.pageTemplatesController()
        .then(controller => controller.addPageTemplate({
          ...sampleData,
          configuration: JSON.parse(sampleData.configuration),
        }));
      cy.wrap(sampleData.code).as('templateToBeDeleted');
      const newDescr = 'edited 2-2 Demo col';

      currentPage = openPageTemplateMgmtPage();
      currentPage = currentPage.getContent().getKebabMenuByCode(sampleData.code).open().openEdit();

      currentPage.getContent().getNameInput().clear().type(newDescr);
      
      currentPage.getContent().getJsonConfigInput().click();
      cy.realPress(['Meta', 'F']);
      cy.realType('"descr":{enter}{rightarrow}{rightarrow}');
      cy.realPress(['Meta', 'Shift', 'ArrowRight']);
      cy.realType('{backspace}"Not Logo",');

      currentPage = currentPage.getContent().submitForm();
      cy.wait(100);
      currentPage.getContent().getTableRow(sampleData.code).children(htmlElements.td).eq(2).should('contain.text', newDescr);
    });

    it('Clone Template', () => {
      const cloneCode = `${sampleData.code}-2`;
      currentPage = openPageTemplateMgmtPage();
      currentPage = currentPage.getContent().getKebabMenuByCode('1-column').open().openClone();

      currentPage.getContent().typeCode(cloneCode);
      currentPage.getContent().typeName(sampleData.descr);
      
      currentPage = currentPage.getContent().submitForm();
      cy.wrap(cloneCode).as('templateToBeDeleted');
      cy.wait(100);
      currentPage.getContent().getTableRow(cloneCode).children(htmlElements.td).eq(2).should('contain.text', sampleData.descr);
    });

    it('Delete Template', () => {
      cy.pageTemplatesController()
        .then(controller => controller.addPageTemplate({
          ...sampleData,
          configuration: JSON.parse(sampleData.configuration),
        }));
      cy.wrap(sampleData.code).as('templateToBeDeleted');

      currentPage = openPageTemplateMgmtPage();
      currentPage.getContent().getKebabMenuByCode(sampleData.code).open().clickDelete();
      currentPage.getDialog().confirm();
      cy.wait(100);

      cy.validateToast(currentPage);
    });

    it('Open Template Details', () => {
      cy.pageTemplatesController()
        .then(controller => controller.addPageTemplate({
          ...sampleData,
          configuration: JSON.parse(sampleData.configuration),
        }));
      cy.wrap(sampleData.code).as('templateToBeDeleted');

      currentPage = openPageTemplateMgmtPage();
      currentPage.getContent().getKebabMenuByCode(sampleData.code).open().clickDetails();

      cy.validateUrlPathname(`/page-template/view/${sampleData.code}`);
    });

    it('If the "descr" property of any object in the JSON configuration is an object, it should accept. Other mis-types under "descr" will display an error beneath (ENG-2711)', () => {
      cy.pageTemplatesController()
        .then(controller => controller.addPageTemplate({
          ...sampleData,
          configuration: JSON.parse(sampleData.configuration),
        }));
      cy.wrap(sampleData.code).as('templateToBeDeleted');
      currentPage = openPageTemplateMgmtPage();
      currentPage = currentPage.getContent().getKebabMenuByCode(sampleData.code).open().openEdit();
      currentPage.getContent().getJsonConfigInput().click();
      cy.realPress(['Meta', 'F']);
      cy.realType('"descr":{enter}{rightarrow}{rightarrow}');
      cy.realPress(['Meta', 'Shift', 'ArrowRight']);
      cy.realType('{backspace}');
      cy.realType('{', { parseSpecialCharSequences: false });
      currentPage.getContent().getJsonConfigArea().invoke('hasClass', 'has-error').should('be.true');
      cy.realType('},', { parseSpecialCharSequences: false });
      currentPage.getContent().getJsonConfigArea().invoke('hasClass', 'has-error').should('be.false');
    });
  });
});