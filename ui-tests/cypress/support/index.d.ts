/// <reference types='cypress-tags' />

import AssetsController                from './controllers/restAPI/AssetsController';
import CategoriesController            from './controllers/restAPI/CategoriesController';
import ContentsController              from './controllers/restAPI/ContentsController';
import ContentSettingsController       from './controllers/restAPI/ContentSettingsController';
import ContentTemplatesController      from './controllers/restAPI/ContentTemplatesController';
import ContentTypeAttributesController from './controllers/restAPI/ContentTypeAttributesController';
import ContentTypesController          from './controllers/restAPI/ContentTypesController';
import DatabaseController              from './controllers/restAPI/DatabaseController';
import FileBrowserController           from './controllers/restAPI/FileBrowserController';
import FragmentsController             from './controllers/restAPI/FragmentsController';
import GroupsController                from './controllers/restAPI/GroupsController';
import LabelsController                from './controllers/restAPI/LabelsController';
import LanguagesController             from './controllers/restAPI/LanguagesController';
import MyProfileTypeController         from './controllers/restAPI/MyProfileTypeController';
import MyUserProfileController         from './controllers/restAPI/MyUserProfileController';
import PagesController                 from './controllers/restAPI/PagesController';
import PageTemplatesController         from './controllers/restAPI/PageTemplatesController';
import PageWidgetsController           from './controllers/restAPI/PageWidgetsController';
import PermissionsController           from './controllers/restAPI/PermissionsController';
import ProfileTypesController          from './controllers/restAPI/ProfileTypesController';
import RolesController                 from './controllers/restAPI/RolesController';
import SenderController                from './controllers/restAPI/SenderController';
import SeoPagesController              from './controllers/restAPI/SeoPagesController';
import SMTPServerController            from './controllers/restAPI/SMTPServerController';
import UserPreferencesController       from './controllers/restAPI/UserPreferencesController';
import UsersController                 from './controllers/restAPI/UsersController';
import WidgetsController               from './controllers/restAPI/WidgetsController';

import ContentsAdminConsoleController  from './controllers/jacms/ContentsAdminConsoleController';

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
        initWindowOpenChecker(): void;

        /**
         * Get the value stored in the provided alias and push the provided value into the array
         * Returns the provided value
         */
        pushAlias(alias, value): Object;

        /**
         * Get the value stored in the provided alias and unshift the provided value into the array
         * Returns the provided value
         */
        unshiftAlias(alias, value): Object;

        /**
         * Get the value stored in the provided alias and delete the provided value from the array;
         * if the provided value is null (default), it stores an empty array in the alias
         * Returns the provided value
         */
        deleteAlias(alias, value): Object;

        /**
         * Perform the login to keycloak with the configured confidential client with grant type client_credentials and stores the response with alias tokens
         */
        kcAPILogin(): void;

        /**
         * Perform the login to keycloak with the configured public client for the specified user with grant type authorization_code and stores the response with alias UITokens
         */
        kcUILogin(user): void;

        /**
         * Perform the logout of the user associated with the stored value UITokens
         */
        kcUILogout(): void;

        /**
         * Perform the logout associated with the cookie session
         */
        kcLogout(): void;
    }

    interface Chainable<Subject> {
        /**
         * Validate if the elements present in the list have the expected text
         * @param list - the list of html elements to be validated
         * @param values - the ordered expected texts
         */
        validateListTexts(list, values): void;

        /**
         * Validate if the url pathname is as expected
         * @param pathname - the expected url
         */
        validateUrlPathname(pathname): void;

        /**
         * Validate if the toast notification and its message are visible
         * @param page - the current page
         * @param text - the text message that should be visible in the toast notification
         * @param isOk - a boolean value if success or not
         */
        validateToast(page: object, text?: string, isOk?: boolean): void;
    }

    interface Chainable<Subject> {
        /**
         * Returns a new instance of an assets controller
         */
        assetsController(): Chainable<AssetsController>;

        /**
         * Returns a new instance of a categories controller
         */
        categoriesController(): Chainable<CategoriesController>;

        /**
         * Returns a new instance of a contents admin console controller
         */
         contentsAdminConsoleController(): Chainable<ContentsAdminConsoleController>;

        /**
         * Returns a new instance of a contents controller
         */
        contentsController(): Chainable<ContentsController>;

        /**
         * Returns a new instance of a content settings controller
         */
        contentSettingsController(): Chainable<ContentSettingsController>;

        /**
         * Returns a new instance of a content templates controller
         */
        contentTemplatesController(): Chainable<ContentTemplatesController>;

        /**
         * Returns a new instance of a content type attributes controller
         */
        contentTypeAttributesController(contentTypeCode): Chainable<ContentTypeAttributesController>;

        /**
         * Returns a new instance of a content types controller
         */
        contentTypesController(): Chainable<ContentTypesController>;

        /**
         * Returns a new instance of a database controller
         */
        databaseController(): Chainable<DatabaseController>;

        /**
         * Returns a new instance of a file browser controller
         */
        fileBrowserController(): Chainable<FileBrowserController>;

        /**
         * Returns a new instance of a fragments controller
         */
        fragmentsController(): Chainable<FragmentsController>;

        /**
         * Returns a new instance of a groups controller
         */
        groupsController(): Chainable<GroupsController>;

        /**
         * Returns a new instance of a labels controller
         */
        labelsController(): Chainable<LabelsController>;

        /**
         * Returns a new instance of a languages controller
         */
        languagesController(): Chainable<LanguagesController>;

        /**
         * Returns a new instance of a myProfileType controller
         */
        myProfileTypeController(): Chainable<MyProfileTypeController>;

        /**
         * Returns a new instance of a myUserProfile controller
         */
        myUserProfileController(): Chainable<MyUserProfileController>;

        /**
         * Returns a new instance of a pages controller
         */
        pagesController(): Chainable<PagesController>;

        /**
         * Returns a new instance of a page templates controller
         */
        pageTemplatesController(): Chainable<PageTemplatesController>;

        /**
         * Returns a new instance of a page widgets controller
         */
        pageWidgetsController(pageCode): Chainable<PageWidgetsController>;

        /**
         * Returns a new instance of a permissions controller
         */
        permissionsController(): Chainable<PermissionsController>;

        /**
         * Returns a new instance of a profile types controller
         */
        profileTypesController(): Chainable<ProfileTypesController>;

        /**
         * Returns a new instance of a roles controller
         */
        rolesController(): Chainable<RolesController>;

        /**
         * Returns a new instance of an email sender configuration controller
         */
        senderController(): Chainable<SenderController>;

        /**
         * Returns a new instance of a seo pages controller controller
         */
        seoPagesController(): Chainable<SeoPagesController>;

        /**
         * Returns a new instance of an email configuration controller
         */
        smtpServerController(): Chainable<SMTPServerController>;

        /**
         * Returns a new instance of a user preferences controller
         */
        userPreferencesController(): Chainable<UserPreferencesController>;

        /**
         * Returns a new instance of a users controller
         */
        usersController(): Chainable<UsersController>;

        /**
         * Returns a new instance of a widgets controller
         */
        widgetsController(widgetCode?): Chainable<WidgetsController>;
    }

}