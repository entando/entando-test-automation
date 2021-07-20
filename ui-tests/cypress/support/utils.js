import { v4 as uuidv4 } from 'uuid';

export const generateRandomId = () => uuidv4().substr(0, 10).replace(/-/g, '_');

export const generateRandomContentTypeCode = () => {
  let code = '';
  for (let i = 0; i < 3; i++) {
    code += String.fromCharCode('A'.charCodeAt() + Math.random() * 26);
  }
  return code;
};

// Page commands Utils
export const replaceLangCodePlaceholder = (str, language) => str.replace('LANG-CODE', language);
export const replaceMetaTagPlaceholders = (str, id, language) => str.replace('LANG-CODE', language).replace('META_TAG_ID', id);
