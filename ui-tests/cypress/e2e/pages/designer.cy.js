import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

describe([Tag.GTS], 'Pages Designer', () => {

  before(() => {
    cy.kcAPILogin();
    cy.fixture('data/demoPage.json').then(page => {
      page.code      = generateRandomId();
      page.pageModel = '1-2-column';
      cy.seoPagesController().then(controller => controller.addNewPage(page));
      cy.wrap(page).as('pageToBeDeleted');
    });
  });

  beforeEach(() => {
    cy.wrap(null).as('widgetToBeRemovedFromPage');
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(function () {
    cy.wrap(this.pageToBeDeleted).then(page =>
        cy.get('@widgetToBeRemovedFromPage')
          .then(widget => {
            if (widget) {
              cy.pageWidgetsController(page.code).then(controller => controller.deleteWidget(widget));
              cy.pagesController().then(controller => controller.setPageStatus(page.code, 'draft'));
            }
          }));
    cy.kcUILogout();
  });

  after(function () {
    cy.kcAPILogin();
    cy.wrap(this.pageToBeDeleted).then(page =>
        cy.pagesController()
          .then(controller => controller.setPageStatus(page.code, 'draft')
                                        .then(() => controller.deletePage(page.code))));
  });

  describe('Drag and drop widgets', () => {

    it('Add widget to empty frame', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage =>
          cy.get('@currentPage')
            .then(page => page.getMenu().getPages().open().openDesigner())
            .then(page => page.getContent().clickSidebarTab(1))
            .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
            .then(page => page.getContent().clickSidebarTab(0))
            .then(page => page.getContent().dragWidgetToGrid(demoPage, 0, 0, 1, 0))
            .then(page => {
              cy.wrap(4).as('widgetToBeRemovedFromPage');
              page.getContent().getDesignerGridFrame(1, 0)
                  .children(htmlElements.div).children().should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                  .then(contents => {
                    cy.wrap(contents).children()
                      .should('have.length', 3)
                      .should(content => expect(content.eq(2)).to.have.text('News Archive'));
                  });
            }));
    });

    it('Add widget to published page', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().dragWidgetToGrid(demoPage, 0, 0, 1, 0))
          .then(page => {
            cy.wrap(4).as('widgetToBeRemovedFromPage');
            page.getContent().getPageStatusIcon()
                .should('have.class', 'PageStatusIcon--draft')
                .and('have.attr', 'title').should('eq', 'Published, with pending changes');
          });
      });
    });

    it('Move widget to different frame', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(4, 'NWS_Archive'))
          .then(() => cy.wrap(4).as('widgetToBeDeleted'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().dragGridWidgetToFrame(demoPage, 1, 0, 1, 1))
          .then(page => {
            cy.wrap(5).as('widgetToBeRemovedFromPage');
            page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).should('have.class', 'EmptyFrame');
            page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                .should(contents => expect(contents).to.have.prop('tagName').to.equal('SPAN'));
            page.getContent().getDesignerGridFrame(1, 1).children(htmlElements.div).children()
                .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                .then(contents => {
                  cy.wrap(contents).children()
                    .should('have.length', 3)
                    .should(content => expect(content.eq(2)).to.have.text('News Archive'));
                });
          });
      });
    });

  });

  describe('Change page status', () => {

    it('Publish a page', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage =>
          cy.get('@currentPage')
            .then(page => page.getMenu().getPages().open().openDesigner())
            .then(page => page.getContent().clickSidebarTab(1))
            .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
            .then(page => page.getContent().publishPageDesign())
            .then(page => page.getContent().getPageStatusIcon()
                              .should('have.class', 'PageStatusIcon--published')
                              .and('have.attr', 'title').should('eq', 'Published')));
    });

  });

});
