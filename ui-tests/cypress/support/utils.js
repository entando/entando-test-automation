import {v4 as uuidv4} from 'uuid';

export const generateRandomId = () => uuidv4().substr(0, 10).replace(/-/g, '_');

export const generateRandomTypeCode = () => {
  let code = '';
  for (let i = 0; i < 3; i++) {
    code += String.fromCharCode('A'.charCodeAt(0) + Math.random() * 26);
  }
  return code;
};

export const generateRandomNumericId = () => Math.floor(Math.random() * 1000000000);
