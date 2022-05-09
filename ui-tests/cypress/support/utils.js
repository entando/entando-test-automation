import {v4 as uuidv4} from 'uuid';
import RandExp        from 'randexp';

//FIXME enable complete email regex once randexp support
// const emailRegex = new RandExp(/(?=^[^@]{2,64}@[^@]{5,255}$)^([a-z][a-z0-9]*([-._][a-z0-9]+)*)@(([a-z][-a-z0-9]+([-.][a-z0-9]+)*\.[a-z0-9]{2,4})|(((25[0-5])|(2[0-4][0-9])|(1?[1-9]?[0-9])\.){3}((25[0-5])|(2[0-4][0-9])|(1?[1-9]?[0-9]))))$/);
const emailRegex = new RandExp(/^([a-z][a-z0-9]{1,9}([-._][a-z0-9]{1,9}){0,5})@(([a-z][-a-z0-9]{4}([-.][a-z0-9]{1,9}){0,10}\.[a-z0-9]{2,4})|((((25[0-5])|(2[0-4][0-9])|(1?[1-9]?[0-9]))\.){3}((25[0-5])|(2[0-4][0-9])|(1?[1-9]?[0-9]))))$/);

export const getArrayRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

export const generateRandomId = () => uuidv4().substr(0, 10).replace(/-/g, '_');

export const generateRandomTypeCode = () => {
  let code = '';
  for (let i = 0; i < 3; i++) {
    code += String.fromCharCode('A'.charCodeAt(0) + Math.random() * 26);
  }
  return code;
};

export const generateRandomNumericId = () => Math.floor(Math.random() * 1000000000);

export const generateRandomEmail = () => emailRegex.gen();

export const deleteDownloadsFolder = () => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  cy.task('deleteFolder', downloadsFolder);
};
