const apiURL = Cypress.config("restAPI");
const controller = `${apiURL}plugins/cms/contents`;

Cypress.Commands.add('contentsController', () => {
  cy.get("@tokens").then(tokens => {
    return new ContentsController(tokens.access_token);
  });
})

class ContentsController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  postContent(content) {
    return cy.request({
      url: `${controller}`,
      method: "POST",
      auth: {
        bearer: this.access_token
      },
      body: [{
        ...content,
      }]
    });
  }

  deleteContent(id) {
    cy.request({
      url: `${controller}/${id}`,
      method: "DELETE",
      auth: {
        bearer: this.access_token
      }
    });
  }
}
