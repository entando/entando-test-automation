import {sendersAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('senderController', () => {
  cy.get('@tokens').then(tokens => {
    return new SenderController(tokens.access_token);
  });
});

class SenderController{
    
    constructor(access_token) {
        this.access_token = access_token;
      }

    

    deleteSender(code) {
        cy.request({
          url: `${controller}/${code}`,
          method: 'DELETE',
          auth: {
            bearer: this.access_token
          }
        });
      }
      addSender(code, email) {
        cy.request({
          url: `${controller}`,
          method: 'POST',
          body: {
            
            code, email         
            
          },
          auth: {
            bearer: this.access_token
          }
        });
      }

}

