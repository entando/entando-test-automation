/// <reference types='cypress-tags' />

import AssetsController from './restAPI/AssetsController';
import CategoriesController from './restAPI/CategoriesController';
import ContentsController from './restAPI/ContentsController';
import ContentSettingsController from './restAPI/ContentSettingsController';
import ContentTemplatesController from './restAPI/ContentTemplatesController';
import ContentTypesController from './restAPI/ContentTypesController';
import ContentTypeAttributesController from './restAPI/ContentTypeAttributesController';
import DatabaseController from './restAPI/DatabaseController';
import EmailConfigController from './restAPI/EmailConfigController';
import SenderController from './restAPI/EmailConfigSenderController';
import FileBrowserController from './restAPI/FileBrowserController';
import FragmentsController from './restAPI/FragmentsController';
import GroupsController from './restAPI/GroupsController';
import LabelsController from './restAPI/LabelsController';
import LanguagesController from './restAPI/LanguagesController';
import PagesController from './restAPI/PagesController';
import PageTemplatesController from './restAPI/PageTemplatesController';
import PageWidgetsController from './restAPI/PageWidgetsController';
import PermissionsController from './restAPI/PermissionsController';
import ProfileTypesController from './restAPI/ProfileTypesController';
import RolesController from './restAPI/RolesController';
import SeoPagesController from './restAPI/SeoPagesController';
import UserPreferencesController from './restAPI/UserPreferencesController';
import UsersController from './restAPI/UsersController';
import WidgetsController from './restAPI/WidgetsController';

export const enum Tag {
    WIP,
    GTS,
    SMOKE,
    SANITY,
    FEATURE,
    ERROR,
    EDGE,
    ACCEPTANCE
}

declare namespace Cypress {

    interface Chainable<Subject> {
        /**
         * Checks any window.open invocation (_blank types) and converts it to same-tab window navigation
         */
        initWindowOpenChecker(): void

        /**
         * Perform the login to keycloak with the configured confidential client with grant type client_credentials and stores the response with alias tokens
         */
        kcAPILogin(): void

        /**
         * Perform the login to keycloak with the configured public client for the specified user with grant type authorization_code and stores the response with alias UITokens
         */
        kcUILogin(user): void

        /**
         * Perform the logout of the user associated with the stored value UITokens
         */
        kcUILogout(): void
    }

    interface Chainable<Subject> {
        /**
         * Validate if the elements present in the list have the expected text
         * @param list - the list of html elements to be validated
         * @param values - the ordered expected texts
         */
        validateListTexts(list, values): void

        /**
         * Validate if the url pathname is as expected
         * @param pathname - the expected url
         */
        validateUrlPathname(pathname): void

        /**
         * Validate if the url pathname is as expected, prepending /app-builder path
         * @param pathname - the expected url inside /app-builder
         */
        validateAppBuilderUrlPathname(pathname): void

        /**
         * Validate if the toast notification and its message are visible
         * @param page - the current page
         * @param text - the text message that should be visible in the toast notification
         * @param isOk - a boolean value if success or not
         */
        validateToast(page: object, text?: string, isOk?: boolean): void
    }

    interface Chainable<Subject> {
        /**
         * Returns a new instance of an assets controller
         */
        assetsController(): Chainable<AssetsController>

        /**
         * Returns a new instance of a categories controller
         */
        categoriesController(): Chainable<CategoriesController>

        /**
         * Returns a new instance of a contents controller
         */
        contentsController(): Chainable<ContentsController>

        /**
         * Returns a new instance of a content settings controller
         */
        contentSettingsController(): Chainable<ContentSettingsController>

        /**
         * Returns a new instance of a content types controller
         */
        contentTypesController(): Chainable<ContentTypesController>

        /**
         * Returns a new instance of a content type attributes controller
         */
        contentTypeAttributesController(contentTypeCode): Chainable<ContentTypeAttributesController>

        /**
         * Returns a new instance of a content templates controller
         */
        contentTemplatesController(): Chainable<ContentTemplatesController>

        /**
         * Returns a new instance of a database controller
         */
        databaseController(): Chainable<DatabaseController>

        /**
         * Returns a new instance of an email configuration controller
         */
        emailConfigController(): Chainable<EmailConfigController>


        /**
         * Returns a new instance of a file browser controller
         */
        fileBrowserController(): Chainable<FileBrowserController>

        /**
         * Returns a new instance of a fragments controller
         */
        fragmentsController(): Chainable<FragmentsController>

        /**
         * Returns a new instance of a groups controller
         */
        groupsController(): Chainable<GroupsController>

        /**
         * Returns a new instance of a labels controller
         */
        labelsController(): Chainable<LabelsController>

        /**
         * Returns a new instance of a languages controller
         */
        languagesController(): Chainable<LanguagesController>

        /**
         * Returns a new instance of a pages controller
         */
        pagesController(): Chainable<PagesController>

        /**
         * Returns a new instance of a page templates controller
         */
        pageTemplatesController(): Chainable<PageTemplatesController>

        /**
         * Returns a new instance of a page widgets controller
         */
        pageWidgetsController(pageCode): Chainable<PageWidgetsController>

        /**
         * Returns a new instance of a permissions controller
         */
        permissionsController(): Chainable<PermissionsController>

        /**
         * Returns a new instance of a profile types controller
         */
        profileTypesController(): Chainable<ProfileTypesController>

        /**
         * Returns a new instance of a roles controller
         */
        rolesController(): Chainable<RolesController>

        /**
         * Returns a new instance of an email sender configuration controller
         */
        senderController(): Chainable<SenderController>

        /**
         * Returns a new instance of a seo pages controller controller
         */
        seoPagesController(): Chainable<SeoPagesController>


        /**
         * Returns a new instance of a users controller
         */
        usersController(): Chainable<UsersController>

        /**
         * Returns a new instance of a user preferences controller
         */
        userPreferencesController(): Chainable<UserPreferencesController>

        /**
         * Returns a new instance of a widgets controller
         */
        widgetsController(widgetCode): Chainable<WidgetsController>
    }

}