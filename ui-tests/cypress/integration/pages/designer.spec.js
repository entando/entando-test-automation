import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';
import HomePage       from '../../support/pageObjects/HomePage';

describe([Tag.GTS], 'Pages Designer', () => {

  const page = {
    charset: 'utf-8',
    contentType: 'text/html',
    displayedInMenu: true,
    joinGroups: null,
    seo: false,
    titles: {
      en: generateRandomId()
    },
    code: generateRandomId(),
    ownerGroup: 'administrators',
    pageModel: '1-2-column',
    parentCode: 'homepage'
  };

  let currentPage;

  before(() => {
    cy.kcAPILogin();
    cy.seoPagesController()
      .then(controller => controller.addNewPage(page));
  });

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
    cy.pagesController()
      .then((controller => controller.intercept({ method: 'GET' }, 'sidebarLoaded', '/homepage/widgets?status=published')));
    cy.pagesController()
      .then((controller => controller.intercept({ method: 'GET' }, 'pageWidgetsLoaded', `/${page.code}/widgets?status=draft`)));
    cy.pagesController()
      .then((controller => controller.intercept({method: 'PUT'}, 'widgetAddedToPage', `/${page.code}/widgets/*`)));
    cy.wrap(null).as('widgetToBeDeleted');
  });

  afterEach(() => {
    cy.get('@widgetToBeDeleted').then(widgetToBeDeleted => {
      if (widgetToBeDeleted !== null) {
        cy.pageWidgetsController(page.code)
          .then(controller => controller.deleteWidget(widgetToBeDeleted));
        cy.pagesController()
          .then(controller => controller.setPageStatus(page.code, 'draft'));
      }
    });
    cy.kcUILogout();
  });

  after(() => {
    cy.kcAPILogin();
    cy.pagesController()
      .then(controller => {
        controller.setPageStatus(page.code, 'draft');
        controller.deletePage(page.code);
      });
  });

  describe('Drag and drop widgets', () => {

    it('Add widget to empty frame', () => {
      currentPage = openDesignerPage();
      selectPageFromPageTreeTable(currentPage, page.code);
      addWidgetToPageFrame(currentPage, page.pageModel, 0, 0, 1, 0);

      currentPage.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                 .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                 .then(contents => {
                   cy.wrap(contents).children()
                     .should('have.length', 3)
                     .should(content => expect(content.eq(2)).to.have.text('News Archive'));
                 });
    });

    it('Add widget to published page', () => {
      cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));

      currentPage = openDesignerPage();
      selectPageFromPageTreeTable(currentPage, page.code);
      addWidgetToPageFrame(currentPage, page.pageModel, 0, 0, 1, 0);

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
    });

    it('Move widget to different frame', () => {
      cy.pageWidgetsController(page.code)
        .then(controller => controller.addWidget(4, 'NWS_Archive'))
        .then(() => cy.wrap(4).as('widgetToBeDeleted'));

      currentPage = openDesignerPage();
      selectPageFromPageTreeTable(currentPage, page.code);
      currentPage.getContent().dragGridWidgetToFrame(1, 0, 1, 1);
      cy.wrap(getGridFrame(page.pageModel, 1, 1)).as('widgetToBeDeleted');
      cy.wait('@widgetAddedToPage');
      currentPage.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).should('have.class', 'EmptyFrame');

      currentPage.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                 .should(contents => expect(contents).to.have.prop('tagName').to.equal('SPAN'));

      currentPage.getContent().getDesignerGridFrame(1, 1).children(htmlElements.div).children()
                 .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                 .then(contents => {
                   cy.wrap(contents).children()
                     .should('have.length', 3)
                     .should(content => expect(content.eq(2)).to.have.text('News Archive'));
                 });
    });

    const addWidgetToPageFrame = (browserPage, pageTemplate, widgetSection, widgetPos, gridRow, gridCol) => {
      browserPage.getContent().clickSidebarTab(0);
      cy.get(`${htmlElements.div}#toolbar-tab-pane-0`).should('be.visible');
      browserPage.getContent().dragWidgetToGrid(widgetSection, widgetPos, gridRow, gridCol);

      cy.wrap(getGridFrame(pageTemplate, gridRow, gridCol)).as('widgetToBeDeleted');
      cy.wait('@widgetAddedToPage');
    };

  });

  describe('Change page status', () => {

    it('Publish a page', () => {
      currentPage = openDesignerPage();
      selectPageFromPageTreeTable(currentPage, page.code);

      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
    });

  });

  const openDesignerPage = () => {
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getPages().open();
    return currentPage.openDesigner();
  };

  const getGridFrame = (template, gridRow, gridCol) => {
    let frame;
    switch (template) {
      case '1-2-column':
        switch (gridRow) {
          case 0:
            frame = gridCol;
            break;
          case 5:
            frame = 12;
            break;
          default:
            frame = 3 +
                (gridRow - 1) * 2 +
                gridCol + 1;
        }
        break;
    }

    return frame;
  };

  const selectPageFromPageTreeTable = (browserPage, pageCode) => {
    browserPage.getContent().clickSidebarTab(1);
    cy.wait('@sidebarLoaded');
    browserPage.getContent().designPageFromSidebarPageTreeTable(pageCode);
    cy.wait('@pageWidgetsLoaded');
  };

});
