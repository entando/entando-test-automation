// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const {isFileExist} = require('cy-verify-downloads');
const {rmdir}       = require('fs');
const tagify        = require('cypress-tags');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  require('cypress-mochawesome-reporter/plugin')(on);
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--disable-gpu');
    }
    return launchOptions;
  });

  on('task', {
    deleteFolder(folderName) {
      console.log('deleting folder %s', folderName)

      return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
          if (err) {
            console.error(err)
            return reject(err)
          }
          resolve(null)
        })
      })
    },
    isFileExist
  })
    
  config.env.CYPRESS_EXCLUDE_TAGS = 'WIP';
  on('file:preprocessor', tagify(config));
  return require('@bahmutov/cypress-extends')(config.configFile);
  
};
