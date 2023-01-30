## Guide for configuring and running the Cypress tests

### Clone the project and install the node dependencies
- `git clone https://github.com/entando/entando-test-automation.git`
- `cd entando-test-automation/ui-tests`
- `npm install`
### Define your Entando environment in the configuration file
- `cd configs`
- Edit the `7.1.json` file and change the following values:
1) in `baseURL`, `restAPI`, `adminConsolePath` and `auth_base_url`: replace {YOUR_ENTANDO_BASE_URL} with the base URL of your Entando environment
2) in `api_client_id`: replace {YOUR_API_CLIENT_ID} with your API client ID
3) in `api_client_secret`: replace {YOUR_API_CLIENT_SECRET} with your API client secret
### Change the set password for the admin user
The Cypress test suite uses the login information found in `entando-test-automation/ui-tests/cypress/fixtures/users/login/admin.json`.
If your Entando environment's admin account has a user/password pair different from `username: admin`/`password: adminadmin`:
- Go to `entando-test-automation/ui-tests/cypress/fixtures/users/login/`
- Edit the `admin.json` file and change the `password` value to the password your admin account uses
- **N.B.: Make sure you have logged in at least once in App Builder to change/confirm your password on your first login before running tests, or the tests will get stuck on that prompt**
### Disable the Welcome Wizard
The Cypress test suite assumes the Welcome Wizard in App Builder to be disabled. If the Welcome Wizard is not disabled yet in your environment:
- Login to App Builder and disable the Welcome Wizard from your profile preferences or by checking the `Don't show next time` checkbox after logging in
### Run the Cypress tests
The following commands to run the tests have to be run from inside the `entando-test-automation/ui-tests` folder:
- `./node_modules/.bin/cypress run --env configFile=configs/7.1.json`: this command runs the entire test suite using the configuration file in `configs/7.1.json`
- `./node_modules/.bin/cypress run --env configFile=configs/7.1.json --spec "./cypress/e2e/{PATH}/{FILE_NAME}.cy.js"`: this command runs a specific test spec file
- `npm run cypress:{TAG} -- --env configFile=configs/7.1.json`: this command runs only the tests that have a certain tag. These are the currently used tags:
```
smoke
sanity
feature
error
edge
acceptance
```
**N.B.: the command above runs a premade script. The complete commands to run tests with specific tags are:**
- `CYPRESS_INCLUDE_TAGS={TAG} npx cypress run --env configFile=configs/7.1.json`: runs all tests with the specified tag
- `CYPRESS_INCLUDE_TAGS={TAG1},{TAG2} npx cypress run --env configFile=configs/7.1.json`: runs all tests with either one of the specified tags
- `CYPRESS_INCLUDE_USE_BOOLEAN_AND=true CYPRESS_INCLUDE_TAGS={TAG1},{TAG2} npx cypress run --env configFile=configs/7.1.json`: runs only the tests that have **both** of the specified tags
The tags currently used for the above commands are:
```
WIP
GTS
SMOKE
SANITY
FEATURE
ERROR
EDGE
ACCEPTANCE
```
For debugging and to run tests while still writing them, it can be useful to run them using the Cypress open feature:
- `./node_modules/.bin/cypress open --env configFile=configs/7.1.json`: this command opens an interface where specific spec files can be run individually in the browser and can be seen and examined as they go, including "time travel" once the test is over, to examine the state of the page at the time of each given command (to learn more: [Cypress App documentation](https://docs.cypress.io/guides/core-concepts/cypress-app))
### Check test results
When running the tests with any of the `run` commands, a `results` folder will be created in `entando-test-automation/ui-tests/cypress`, which contains an `index.html` file which can be opened to check the results of the test. For each failed test, a screenshot will also be present.

---

### Project structure and guidelines for test writing

The project uses the Page Object structure, where each page and/or component of the web application has a corresponding file that describes its structure using function and variables that point to relevant elements of the page.
The page objects are inside `entando-test-automation/ui-tests/cypress/support/pageObjects` and the folder structure is divided by following the App Builder sections.
Tests are stored inside `entando-test-automation/ui-tests/cypress/e2e` and the structure mimics the App Builder sections here as well.
Other than the `pageObjects` folder, the `support` folder contains common commands, utilities, controllers for the API calls, as well as other Cypress global configuration settings.
The `entando-test-automation/ui-tests/cypress/fixtures` folder and subfolders contain fixtures that are used in tests (e.g. files to be uploaded, or JSON files containing set configurations)
Each test usually has to start with these two commands, which will be generally run in a `beforeEach` hook:
1) `cy.kcClientCredentialsLogin()`: performs the login to keycloak with the configured confidential client with grant type client_credentials and stores the response with the alias `tokens`
2) `cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin')`: calls `kcAuthorizationCodeLogin` and opens the App Builder dashboard (`kcAuthorizationCodeLogin` performs the login to keycloak with the configured public client for the specified user with grant type authorization_code and stores the response with the alias `UITokens`)

After the above commands have been launched in a test suite, the App Builder homepage's page object will be set as the Cypress label `currentPage`. This label gets used throughout the tests to reference the current page object being used.
Usage example:
```
cy.get('@currentPage')
   .then(page => page.getMenu().getAdministration().open().openDatabase())
   .then(page => page.getContent().getCreateBackupButton().should('exist').and('be.visible');
```
The cy.get command gets the variable set with the label 'currentPage' (e.g.: the App Builder dashboard/homepage). Using the functions in the HomePage page object, Cypress opens the side menu section 'Administration' and subsequently the subsection 'Database'. 'page' is now no longer pointing to the HomePage page object, but to the DatabasePage page object, and this command is asserting the existence and visibility of the 'Create Backup' button by using functions in this page object.
Inside a page object, a function that would move the browser to a different page should also update the `currentPage` label. For example, the above function `openDatabase`:
```
  openDatabase() {
    this.getDatabase().then(button => DatabasePage.openPage(button));
    return cy.wrap(new AppPage(DatabasePage)).as('currentPage');
  }
```
This creates a new AppPage page object (the generic App Builder page), with its content set as DatabasePage.
Each test ends with the `cy.kcTokenLogout()` command, which performs the logout of the user associated with the stored value `UITokens`.

References -> [Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress)