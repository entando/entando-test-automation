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
import 'cypress-pipe';
import 'cypress-real-events/support';
import 'cypress-mochawesome-reporter/register';

import './command/command';
import './command/validation-commands';
import './exception-handler';

import './restAPI/AssetsController';
import './restAPI/CategoriesController';
import './restAPI/ContentsController';
import './restAPI/ContentSettingsController';
import './restAPI/ContentTemplatesController';
import './restAPI/ContentTypeAttributesController';
import './restAPI/ContentTypesController';
import './restAPI/DatabaseController';
import './restAPI/EmailConfigController';
import './restAPI/EmailConfigSenderController';
import './restAPI/FileBrowserController';
import './restAPI/FragmentsController';
import './restAPI/GroupsController';
import './restAPI/LabelsController';
import './restAPI/LanguagesController';
import './restAPI/PagesController';
import './restAPI/PageTemplatesController';
import './restAPI/PageWidgetsController';
import './restAPI/PermissionsController';
import './restAPI/ProfileTypesController';
import './restAPI/RolesController';
import './restAPI/SeoPagesController';
import './restAPI/UserPreferencesController';
import './restAPI/UsersController';
import './restAPI/WidgetsController';
