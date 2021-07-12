const apiURL = Cypress.config("restAPI");
const controller = `${apiURL}categories`;

Cypress.Commands.add('categoriesController', () => {
  cy.get("@tokens").then(tokens => {
    return new categoriesController(tokens.access_token);
  });
})

class categoriesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  postCategory(titleEn, titleIt, code, parentCode) {
    cy.request({
      url: `${controller}`,
      method: "POST",
      auth: {
        bearer: this.access_token
      },
      body: {
        "code": code,
        "titles": {
          "en": titleEn,
          "it": titleIt
        },
        "parentCode": parentCode
      }
    });
  }

  deleteCategory(code) {
    cy.request({
      url: `${controller}/${code}`,
      method: "DELETE",
      auth: {
        bearer: this.access_token
      }
    });
  }
}
