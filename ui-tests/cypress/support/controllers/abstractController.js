export default class AbstractController {

  constructor(apiURL, accessToken) {
    this.apiURL      = apiURL;
    this.accessToken = accessToken;
  }

  intercept(routeMatcher, alias, path = '') {
    routeMatcher.url = this.apiURL + path;
    return cy.intercept(routeMatcher).as(alias);
  }

  request(options) {
    const caller = this.getCallerName();
    options.url  = options.url || this.apiURL;
    options.auth = {bearer: this.accessToken};
    return cy.request(options).then(response => {
      cy.addToReport(() => ({
        title: caller,
        value: {
          request: {...options},
          response: response
        }
      }));
      return cy.then(() => response);
    });
  }

  uploadRequest(options) {
    options.url = options.url || this.apiURL;

    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open(options.method, options.url);

      if (options.headers) {
        Object.keys(options.headers).forEach((header) => {
          xhr.setRequestHeader(header, options.headers[header]);
        });
      }

      xhr.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);

      xhr.onload  = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        resolve(xhr.response);
      };

      xhr.send(options.body);
    })
        .then(response => JSON.parse(response));
  }

  uploadFixture(fileInfo, metadata) {
    return cy.fixture(fileInfo.path, 'base64')
             .then(file => Cypress.Blob.base64StringToBlob(file, fileInfo.type))
             .then((blob) => {
               const file     = new File([blob], fileInfo.name, {type: fileInfo.type});
               const formData = new FormData();

               formData.append('file', file);
               formData.append('metadata', JSON.stringify(metadata));

               return formData;
             })
             .then(body => this.uploadRequest({method: 'POST', body}));
  }

  uploadTextFile(fileInfo, url, protectedFolder) {
    return cy.fixture(`upload/${fileInfo.name}`)
             .then(file => {
               if (fileInfo.type == 'application/json') fileInfo.base64 = btoa(JSON.stringify(file, null, 2) + '\n');
               else fileInfo.base64 = btoa(file);
             })
             .then(() => this.request(
                 {
                   method: 'POST',
                   url: url,
                   body: {
                     protectedFolder: protectedFolder,
                     path: `/${fileInfo.path}${fileInfo.name}`,
                     filename: fileInfo.name,
                     base64: fileInfo.base64
                   }
                 })
             );
  }

  getCallerName() {
    try {
      throw new Error();
    } catch (e) {
      const stackTraceFunctions = e.stack.match(/at \w+\.(\w+)/g);
      const callerFunction = stackTraceFunctions[2];
      return callerFunction.substring(callerFunction.indexOf('.') + 1);
    }
  }

}
