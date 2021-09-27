const apiURL     = Cypress.config('restAPI');
export const controller = `${apiURL}plugins/cms/contents`;

Cypress.Commands.add('contentsController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentsController(tokens.access_token);
  });
});

class ContentsController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  getContentList() {
    return cy.request({
      url: controller,
      method: 'GET',
      auth: {
        bearer: this.access_token
      },
      qs: {
        sort: 'lastModified',
        direction: 'DESC',
        mode: 'full',
        page: 1,
        pageSize: 5,
      }
    });
  }

  postContent(content) {
    return cy.request({
      url: `${controller}`,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: [{
        ...content
      }]
    });
  }

  deleteContent(id) {
    cy.request({
      url: `${controller}/${id}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

  updateStatus(id, status) {
    return cy.request({
      url: `${controller}/status`,
      method: 'PUT',
      auth: {
        bearer: this.access_token
      },
      body: {
        codes: [id],
        status
      }
    });
  }
}
