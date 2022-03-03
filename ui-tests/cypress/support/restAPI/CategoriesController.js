import AbstractController from './abstractController';

import {categoriesAPIURL} from './controllersEndPoints';

Cypress.Commands.add('categoriesController', () => {
  cy.get('@tokens').then(tokens => {
    return new CategoriesController(categoriesAPIURL, tokens.access_token);
  });
});

export default class CategoriesController extends AbstractController {

  postCategory(titleEn, titleIt, code, parentCode) {
    return this.request({
      method: 'POST',
      body: {
        'code': code,
        'titles': {
          'en': titleEn,
          'it': titleIt
        },
        'parentCode': parentCode
      }
    });
  }

  deleteCategory(code) {
    return this.request({
      url: `${this.apiURL}/${code}`,
      method: 'DELETE'
    });
  }

}
