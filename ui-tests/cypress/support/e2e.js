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
import './controllers/restAPI/RolesController';
import './controllers/restAPI/SenderController';
import './controllers/restAPI/SeoPagesController';
import './controllers/restAPI/SMTPServerController';
import './controllers/restAPI/UserPreferencesController';
import './controllers/restAPI/UsersController';
import './controllers/restAPI/VersioningController';
import './controllers/restAPI/WidgetsController';
