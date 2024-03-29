const apiURL = Cypress.config('baseUrl') + Cypress.config('restAPI');

export const categoriesAPIURL            = `${apiURL}/categories`;
export const databaseAPIURL              = `${apiURL}/database`;
export const fileBrowserAPIURL           = `${apiURL}/fileBrowser`;
export const fragmentsAPIURL             = `${apiURL}/fragments`;
export const groupsAPIURL                = `${apiURL}/groups`;
export const labelsAPIURL                = `${apiURL}/labels`;
export const languagesAPIURL             = `${apiURL}/languages`;
export const myProfileTypeAPIURL         = `${apiURL}/myProfileType`;
export const myUserProfileAPIURL         = `${apiURL}/myUserProfile`;
export const pagesAPIURL                 = `${apiURL}/pages`;
export const pageModelsAPIURL            = `${apiURL}/pageModels`;
export const permissionsAPIURL           = `${apiURL}/permissions`;
export const profileTypeAttributesAPIURL = `${apiURL}/profileTypeAttributes`;
export const profileTypesAPIURL          = `${apiURL}/profileTypes`;
export const reloadConfigurationAPIURL   = `${apiURL}/reloadConfiguration`;
export const rolesAPIURL                 = `${apiURL}/roles`;
export const usersAPIURL                 = `${apiURL}/users`;
export const userPreferencesAPIURL       = `${apiURL}/userPreferences`;
export const widgetsAPIURL               = `${apiURL}/widgets`;

const pluginsURL = `${apiURL}/plugins`;

const cmsURL                       = `${pluginsURL}/cms`;
export const assetsAPIURL          = `${cmsURL}/assets`;
export const contentsAPIURL        = `${cmsURL}/contents`;
export const contentModelsAPIURL   = `${cmsURL}/contentmodels`;
export const contentSettingsAPIURL = `${cmsURL}/contentSettings`;
export const contentTypesAPIURL    = `${cmsURL}/contentTypes`;

const emailSettingsURL        = `${pluginsURL}/emailSettings`;
export const sendersAPIURL    = `${emailSettingsURL}/senders`;
export const SMTPServerAPIURL = `${emailSettingsURL}/SMTPServer`;

const seoURL                = `${pluginsURL}/seo`;
export const seoPagesAPIURL = `${seoURL}/pages`;

const adminConsoleURL = Cypress.config('baseUrl') + Cypress.config('adminConsolePath');

export const categoriesURL   = `${adminConsoleURL}/Category`;
export const contentTypesURL = `${adminConsoleURL}/Entity`;

const jpVersioningURL      = `${adminConsoleURL}/jpversioning`;
const jpVersionContentURL  = `${jpVersioningURL}/Content`;
export const versioningURL = `${jpVersionContentURL}/Versioning`;

const cmsAdminConsoleURL          = `${adminConsoleURL}/jacms`;
export const contentManagementURL = `${cmsAdminConsoleURL}/Content`;
export const contentModelsURL     = `${cmsAdminConsoleURL}/ContentModel`;
export const contentTypesJacmsURL = `${cmsAdminConsoleURL}/Entity`;
export const assetsURL            = `${cmsAdminConsoleURL}/Resource`;

export const digitalExchangeURL   = Cypress.config('baseUrl') + '/digital-exchange';
