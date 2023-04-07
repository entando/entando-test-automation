import {defineConfig} from 'cypress';

import * as path   from 'path';
import * as fs     from 'fs-extra';

async function enterOTP ({page, options}) {
    options.getMessages().then(async emails => {
        if (!emails || emails.length === 0) {
            await page.waitForSelector('#firstName');
            await page.type('#firstName', 'Dummy');
            await page.type('#lastName', 'Test');
            await page.click('[type=submit]');
        } else {
            const text = emails[0].body.text;
            const start_index = text.indexOf("Verification code: ") + "Verification code: ".length;
            const end_index = text.indexOf("\n", start_index);
            const verification_code = text.slice(start_index, end_index);
            await page.waitForSelector('#otp');
            await page.type('#otp', verification_code);
            await page.waitForSelector('#firstName');
            await page.type('#firstName', 'Dummy');
            await page.type('#lastName', 'Test');
            await page.click('[type=submit]');
        }
    })
}

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
        experimentalSessionAndOrigin: true,
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
                },
                readFileMaybe(filename) {
                    if (fs.existsSync(filename)) {
                      return fs.readFileSync(filename, 'utf8');
                    }
                    return null;
                }
            });

            const {isFileExist, findFiles} = require('cy-verify-downloads');
            on('task', {isFileExist, findFiles});

            on('task', {
                'gmail:get-messages': async (args) => {
                    const gmailTester = require('gmail-tester');
                    const messages = await gmailTester.get_messages(
                        path.resolve(__dirname, 'credentials.json'),
                        path.resolve(__dirname, 'token.json'),
                        args.options
                    );
                    if (messages) return messages;
                    else return null;
                },
            });

            const {GitHubSocialLogin} = require('cypress-social-logins').plugins
            on('task', {
                GitHubSocialLogin: options => {
                    async function getMessages () {
                        const gmailTester = require('gmail-tester');
                        const messages = await gmailTester.get_messages(
                            path.resolve(__dirname, 'credentials.json'),
                            path.resolve(__dirname, 'token.json'),
                            {
                                from: 'noreply@github.com',
                                subject: '[GitHub] Please verify your device',
                                include_body: true,
                                before: new Date(Date.now() + 60000),
                                after: new Date(Date.now() - 60000)
                            }
                        );
                        if (messages) return messages;
                        else return null;
                    }
                    options.additionalSteps = enterOTP;
                    options.getMessages = getMessages;
                    return GitHubSocialLogin(options);
                }
            })

            const tagify = require('cypress-tags');
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