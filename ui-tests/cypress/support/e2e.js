// ***********************************************************
// This support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import 'cypress-real-events/support';
import 'cypress-mochawesome-reporter/register';
import 'cypress-time';
import {registerCommand} from 'cypress-wait-for-stable-dom';
registerCommand({ pollInterval: 750, timeout: 10000 });

import './command/command';
import './command/validation-commands';
import './exception-handler';

import './controllers/restAPI/AssetsController';
import './controllers/restAPI/CategoriesController';
import './controllers/restAPI/ContentsController';
import './controllers/restAPI/ContentSettingsController';
import './controllers/restAPI/ContentTemplatesController';
import './controllers/restAPI/ContentTypeAttributesController';
import './controllers/restAPI/ContentTypesController';
import './controllers/restAPI/DatabaseController';
import './controllers/restAPI/FileBrowserController';
import './controllers/restAPI/FragmentsController';
import './controllers/restAPI/GroupsController';
import './controllers/restAPI/LabelsController';
import './controllers/restAPI/LanguagesController';
import './controllers/restAPI/MyProfileTypeController';
import './controllers/restAPI/MyUserProfileController';
import './controllers/restAPI/PagesController';
import './controllers/restAPI/PageTemplatesController';
import './controllers/restAPI/PageWidgetsController';
import './controllers/restAPI/PermissionsController';
import './controllers/restAPI/ProfileTypeAttributesController';
import './controllers/restAPI/ProfileTypesController';
import './controllers/restAPI/ReloadConfigurationController';
import './controllers/restAPI/RepositoriesController';
import './controllers/restAPI/RolesController';
import './controllers/restAPI/SenderController';
import './controllers/restAPI/SeoPagesController';
import './controllers/restAPI/SMTPServerController';
import './controllers/restAPI/UserPreferencesController';
import './controllers/restAPI/UsersController';
import './controllers/restAPI/WidgetsController';

import './controllers/cmsActions/AssetsAdminConsoleController';
import './controllers/cmsActions/CategoriesAdminConsoleController';
import './controllers/cmsActions/ContentsAdminConsoleController';
import './controllers/cmsActions/ContentTemplatesAdminConsoleController';
import './controllers/cmsActions/ContentTypesAdminConsoleController';
import './controllers/cmsActions/ContentTypesJacmsAdminConsoleController';
import './controllers/cmsActions/VersioningAdminConsoleController';

const setWizard = (option) => {
  cy.kcAuthorizationCodeLogin('login/admin');
  cy.userPreferencesController().then(controller => {
    // FIXME the userPreferences are not immediately available after user creation, but are immediately created on GET
    controller.getUserPreferences('admin');
    controller.updateUserPreferences('admin', { wizard: option });
  });
  cy.kcTokenLogout();
}

before(() => {
  cy.task('readFileMaybe', 'cypress/fixtures/icon/Entando.svg').then((textOrNull) => {
    if (textOrNull === null) {
      cy.readFile('cypress/fixtures/icon/Entando.txt').then(text => cy.writeFile('cypress/fixtures/icon/Entando.svg', text))
    }
  });
  cy.kcClientCredentialsLogin();
  cy.fixture('users/details/admin').then(admin => {
    cy.usersController().then(controller =>
      controller.getUser(admin).then(adminData => {
        if(adminData.body.payload.credentialsNotExpired === false) controller.updateUser(admin);
      }));
  });
  setWizard(false);
});

after(() => {
  cy.kcClientCredentialsLogin();
  setWizard(true);
});
