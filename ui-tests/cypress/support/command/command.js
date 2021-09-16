Cypress.Commands.add('initWindowOpenChecker', () => {
  cy.window().then((win) => {
    cy.stub(win, 'open').as('windowOpen').callsFake(url => {
      cy.visit(url);
    });
  });
});

Cypress.Commands.add('uploadRequest', ({ method, url, body, headers, auth }) => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (headers) {
      Object.keys(headers).forEach((header) => {
        xhr.setRequestHeader(header, headers[header]);
      });
    }
    if (auth) {
      xhr.setRequestHeader('Authorization', `Bearer ${auth.bearer}`);
    }
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      resolve(xhr.response);
    };
    xhr.send(body);
  });
});

export {};
