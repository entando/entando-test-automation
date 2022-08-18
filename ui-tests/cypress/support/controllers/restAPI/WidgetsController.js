import AbstractController from '../abstractController';

import {widgetsAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('widgetsController', (widgetCode = null) => {
  cy.get('@tokens').then(tokens => {
    return new WidgetsController(widgetsAPIURL, tokens.access_token, widgetCode);
  });
});

export default class WidgetsController extends AbstractController {

  constructor(apiURL, accessToken, widgetCode) {
    super(apiURL, accessToken);
    this.widgetCode = widgetCode;
  }

  addWidget(widget) {
    return this.request({
      method: 'POST',
      body: widget
    });
  }

  getWidget(widget = this.widgetCode) {
    return this.request({
      url: `${this.apiURL}/${widget}`,
      method: 'GET'
    }).then((response) => {
      const {
              code,
              titles,
              group,
              configUi,
              parentType,
              widgetCategory,
              icon,
              config
            }        = response.body.payload;
      const formData = {
        code,
        titles,
        group,
        configUi,
        parentType,
        widgetCategory,
        icon,
        customUi: '',
        config
      };
      if (response.body.payload.guiFragments.length > 0) {
        formData.customUi = response.body.payload.guiFragments[0].customUi;
      }
      return {controller: this, response, formData};
    });
  }

  putWidget(widget) {
    return this.request({
      url: `${this.apiURL}/${widget.code}`,
      method: 'PUT',
      body: widget
    });
  }

  deleteWidget(widgetCode) {
    return this.request({
      url: `${this.apiURL}/${widgetCode}`,
      method: 'DELETE'
    });
  }

}
