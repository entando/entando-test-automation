const apiURL     = Cypress.config('restAPI');
const controller = `${apiURL}widgets`;

Cypress.Commands.add('widgetsController', (widgetCode) => {
  cy.get('@tokens').then(tokens => {
    return new WidgetsController(tokens.access_token, widgetCode);
  });
});

class WidgetsController {
  constructor(access_token, widgetCode) {
    this.access_token = access_token;
    if (widgetCode) {
      this.widgetCode = widgetCode;
    }
  }

  addWidget(widget) {
    return cy.request({
      url: `${controller}`,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: {
        ...widget
      }
    });
  }

  getWidget(widget = this.widgetCode) {
    return cy.request({
      url: `${controller}/${widget}`,
      method: 'GET',
      auth: {
        bearer: this.access_token
      }
    }).then((response) => {
      const {
        code,
        titles,
        group,
        configUi,
        parentType,
        widgetCategory,
        icon,
        guiFragments,
      } = response.body.payload;
      const formData = {
        code,
        titles,
        group,
        configUi,
        parentType,
        widgetCategory,
        icon,
        customUi: guiFragments[0].customUi,
      }
      return { controller: this, response, formData };
    });
  }

  putWidget(widget) {
    return cy.request({
      url: `${controller}/${widget.code}`,
      method: 'PUT',
      auth: {
        bearer: this.access_token
      },
      body: {
        ...widget
      }
    });
  }

  deleteWidget(widgetCode) {
    cy.request({
      url: `${controller}/${widgetCode}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }
}
