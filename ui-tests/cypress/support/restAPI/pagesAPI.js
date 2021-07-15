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

  deletePage(id) {
    cy.request({
      url: `${controller}/${id}`,
      method: "DELETE",
      auth: {
        bearer: this.access_token
      }
    });
  }

}