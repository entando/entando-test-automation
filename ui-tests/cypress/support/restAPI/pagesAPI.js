const apiURL = Cypress.config("restAPI");
const controller = `${apiURL}pages`;

Cypress.Commands.add('pagesController', () => {
  cy.get("@tokens").then(tokens => {
    return new PagesController(tokens.access_token);
  });
})

class PagesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addPage(page) {
    return cy.request({
      url: `${controller}`,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: {
        ...page,
      }
    });
  }

  updateStatus(code, status) {
    return cy.request({
      url: `${controller}/${code}/status`,
      method: 'PUT',
      auth: {
        bearer: this.access_token
      },
      body: {
        status,
      }
    });
  }

  deletePage(id) {
    cy.request({
      url: `${controller}/${id}`,
      method: "DELETE",
      auth: {
        bearer: this.access_token
      }
    });
  }

  updatePageWidget(pageCode, frameId, widgetCode, config) {
    return cy.request({
      url: `${controller}/${pageCode}/widgets/${frameId}`,
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
}
