const apiURL = Cypress.config('restAPI');

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

const pluginsURL                         = `${apiURL}/plugins`;
export const versioningURL               = `${pluginsURL}/versioning`;

const cmsURL                             = `${pluginsURL}/cms`;
export const assetsAPIURL                = `${cmsURL}/assets`;
export const contentsAPIURL              = `${cmsURL}/contents`;
export const contentModelsAPIURL         = `${cmsURL}/contentmodels`;
export const contentSettingsAPIURL       = `${cmsURL}/contentSettings`;
export const contentTypesAPIURL          = `${cmsURL}/contentTypes`;
export const contentTypeAttributesAPIURL = `${cmsURL}/contentTypeAttributes`;

const emailSettingsURL        = `${pluginsURL}/emailSettings`;
export const sendersAPIURL    = `${emailSettingsURL}/senders`;
export const SMTPServerAPIURL = `${emailSettingsURL}/SMTPServer`;

const seoURL                = `${pluginsURL}/seo`;
export const seoPagesAPIURL = `${seoURL}/pages`;
