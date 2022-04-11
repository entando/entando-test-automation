import {htmlElements} from "../../support/pageObjects/WebElement";

describe('Page Templates', () => {

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.kcUILogout();
  });

  const openPageTemplateMgmtPage = () => {
    return cy.get('@currentPage')
             .then(page => page.getMenu().getPages().open().openTemplates());
  };

  describe('Templates section structure', () => {

    it([Tag.SMOKE, 'ENG-3525'], 'Templates section', () => {
      openPageTemplateMgmtPage()
        .then(page => {
          cy.validateUrlPathname('/page-template');
          page.getContent().getTable().should('exist').and('be.visible')
              .then(table => {
                cy.wrap(table.children(htmlElements.thead).find(htmlElements.th))
                  .then(headings => cy.validateListTexts(headings, ['Code', 'Name', 'Actions']));
              });
          page.getContent().getAddButton().should('exist').and('be.visible');
          page.getContent().getPagination().get().should('exist').and('be.visible');
          page.getContent().getPagination().getInput().should('have.value', 1);
        });
    });

    it([Tag.SMOKE, 'ENG-3525'], 'Add template page', () => {
      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          cy.validateUrlPathname('/page-template/add');
          page.getContent().getFormArea().should('exist').and('be.visible')
              .then(form => cy.wrap(form).find(htmlElements.label)
              .then(labels => cy.validateListTexts(labels, ['Code ', 'Name ', 'JSON configuration ', 'Template ', 'Template preview'])));
          page.getContent().getCodeInput().should('exist').and('be.visible');
          page.getContent().getNameInput().should('exist').and('be.visible');
          page.getContent().getJsonConfigInput().should('exist').and('be.visible');
          page.getContent().getTemplateInput().should('exist').and('be.visible');
          page.getContent().getPreviewGrid().should('exist').and('be.visible');
          page.getContent().getCancelButton().should('exist').and('be.visible');
          page.getContent().getSaveDropdownButton().should('exist').and('be.visible');
        });
    });

  });

});
