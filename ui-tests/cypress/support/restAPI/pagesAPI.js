const apiURL     = Cypress.config('restAPI');
const controller = `${apiURL}pages`;
const addUrl     = `${apiURL}plugins/seo/pages`;

Cypress.Commands.add('pagesController', () => {
  cy.get('@tokens').then(tokens => {
    return new PagesController(tokens.access_token);
  });
});

Cypress.Commands.add('widgetsController', (pageCode) => {
  cy.get('@tokens').then(tokens => {
    return new WidgetsController(tokens.access_token, pageCode);
  });
});

class PagesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addNewPage(page) {
    return cy.request({
      url: `${controller}`,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: {
        ...page
      }
    });
  }

  deletePage(id) {
    cy.request({
      url: `${controller}/${id}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

  addPage(code, title, ownerGroup, pageModel, parentCode) {
    cy.request({
      url: `${addUrl}`,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: {
        charset: 'utf-8',
        contentType: 'text/html',
        displayedInMenu: true,
        joinGroups: null,
        seo: false,
        titles: {
          en: title
        },
        code,
        ownerGroup,
        pageModel,
        parentCode
      }
    });
  }

  setPageStatus(id, status) {
    cy.request({
      url: `${controller}/${id}/status`,
      method: 'PUT',
      auth: {
        bearer: this.access_token
      },
      body: {
        status
      }
    });
  }

}

class WidgetsController {

  constructor(access_token, pageCode) {
    this.access_token = access_token;
    this.pageCode     = pageCode;
  }

  addWidget(frameCode, widgetCode, config) {
    cy.request({
      url: `${controller}/${this.pageCode}/widgets/${frameCode}`,
      method: 'PUT',
      auth: {
        bearer: this.access_token
      },
      body: {
        code: widgetCode,
        config
      }
    });
  }

  deleteWidget(frameCode) {
    cy.request({
      url: `${controller}/${this.pageCode}/widgets/${frameCode}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
