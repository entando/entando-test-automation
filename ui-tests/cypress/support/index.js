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
import "cypress-real-events/support"

import './command/command';
import './command/validation-commands';

import './restAPI/categoriesAPI.js';
import './restAPI/contentsAPI';
import './restAPI/contentTypesAPI';
import './restAPI/contentTemplatesAPI';
import './restAPI/fileBrowserAPI';
import './restAPI/groupsAPI.js';
import './restAPI/pagesAPI.js';
import './restAPI/profileTypesAPI';
import './restAPI/rolesAPI.js';
import './restAPI/usersAPI.js';
import './restAPI/widgetsAPI.js';
import './restAPI/assetsAPI.js';
import './restAPI/contentSettingsAPI.js';

import './exception-handler';
