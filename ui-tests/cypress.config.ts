import {defineConfig} from 'cypress';

import * as path from 'path';
import * as fs   from 'fs-extra';

export default defineConfig({
    video: false,
    chromeWebSecurity: false,
    viewportWidth: 1200,
    viewportHeight: 720,
    retries: {
        runMode: 0,
        openMode: 0
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
        reportTitle: 'App-builder functional tests',
        reportPageTitle: 'App-builder functional tests',
        reportDir: 'cypress/results',
        charts: true
    },
    e2e: {
        setupNodeEvents(on, config) {
            require('cypress-mochawesome-reporter/plugin')(on);

            on('before:browser:launch', (browser, launchOptions) => {
                if (browser.name === 'chrome' && browser.isHeadless) launchOptions.args.push('--disable-gpu');
                return launchOptions;
            });

            on('task', {
                deleteDownloadsFolder() {
                    const downloadsFolder = config.downloadsFolder;

                    return new Promise((resolve, reject) => {
                        fs.rmdir(downloadsFolder, {maxRetries: 10, recursive: true}, (err) => {
                            if (err) {
                                console.error(err);
                                return reject(err);
                            }
                            resolve(null);
                        });
                    });
                }
            });

            const {isFileExist, findFiles} = require('cy-verify-downloads');
            on('task', {isFileExist, findFiles});

            const tagify = require('cypress-tags');
            config.env.CYPRESS_EXCLUDE_TAGS = 'WIP';
            on('file:preprocessor', tagify(config));

            const configFilePath = config.env.configFile;
            if (!configFilePath) throw new Error('You must specify a configuration file with the environment setup\nUse --env configFile to specify it');
            const configFile = (configFilePath && fs.readJson(path.join(__dirname, './', configFilePath)));
            return configFile || config;
        },
        env: {
            configFile: "configs/configs.json"
        }
    }
});