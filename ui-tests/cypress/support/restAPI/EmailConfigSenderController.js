import AbstractController from './abstractController';

import {sendersAPIURL} from './controllersEndPoints';

Cypress.Commands.add('senderController', () => {
  cy.get('@tokens').then(tokens => {
    return new SenderController(sendersAPIURL, tokens.access_token);
  });
});

export default class SenderController extends AbstractController{
    
    

    deleteSender(code) {
        return this.request({
          url: `${this.apiURL}/${code}`,
          method: 'DELETE',
        });
      }
    addSender(code, email) {
        return this.request({
          url: `${this.apiURL}`,
          method: 'POST',
          body: {       
            code, email            
          }
        });
      }

}

