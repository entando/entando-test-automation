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

  });

});
