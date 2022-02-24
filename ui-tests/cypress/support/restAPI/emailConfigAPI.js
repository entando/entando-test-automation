const apiURL     = Cypress.config('restAPI');

const controller = `${apiURL}plugins/emailSettings/SMTPServer`;

Cypress.Commands.add('emailConfigController', () => {
  cy.get('@tokens').then(tokens => {
    return new EmailConfigController(tokens.access_token);
  });
});

class EmailConfigController{
    
    constructor(access_token) {
        this.access_token = access_token;
      }

      smtpDefaultSettings = {  
        active: false,
        checkServerIdentity: true,
        debugMode: false,
        host: "localhost",
        password: "",
        port: 25000,
        protocol: "STD",
        timeout: null,
        username: ""
      }

      defaultSettings() {
        cy.request({
          url: `${controller}`,
          method: 'PUT',
          body: {
            ...this.smtpDefaultSettings
          },
          auth: {
            bearer: this.access_token
          }
        });

      }

}