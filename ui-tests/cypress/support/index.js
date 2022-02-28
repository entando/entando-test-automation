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

import '@4tw/cypress-drag-drop';
import 'cypress-keycloak-commands';
import 'cypress-real-events/support';
import 'cypress-mochawesome-reporter/register';

import './command/command';
import './command/validation-commands';
import './exception-handler';

import './restAPI/assetsAPI';
import './restAPI/categoriesAPI';
import './restAPI/contentsAPI';
import './restAPI/contentSettingsAPI';
import './restAPI/contentTypesAPI';
import './restAPI/contentTemplatesAPI';
import './restAPI/databaseAPI';
import './restApi/emailConfigAPI';
import './restAPI/fileBrowserAPI';
import './restAPI/fragmentsAPI';
import './restAPI/groupsAPI';
import './restAPI/labelsAPI';
import './restAPI/languagesAPI';
import './restAPI/pagesAPI';
import './restAPI/pageTemplatesAPI';
import './restAPI/pageWidgetsAPI';
import './restAPI/profileTypesAPI';
import './restAPI/rolesAPI';
import './restAPI/usersAPI';
import './restAPI/userPreferencesAPI';
import './restAPI/widgetsAPI';
