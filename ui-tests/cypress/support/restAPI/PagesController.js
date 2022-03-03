import {pagesAPIURL as controller, addPagesAPIURL as addUrl} from './controllersEndPoints';

Cypress.Commands.add('pagesController', () => {
  cy.get('@tokens').then(tokens => {
    return new PagesController(tokens.access_token);
  });
});

export default class PagesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addNewPage(page) {
    return cy.request({
      url: addUrl,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: {
        ...page
      }
    });
  }

  addPage(code, title, ownerGroup, pageModel, parentCode) {
    cy.request({
      url: addUrl,
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

  deletePage(id) {
    cy.request({
      url: `${controller}/${id}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
