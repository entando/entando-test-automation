const TEST_ID_KEY = "data-testid";

/**
 *  Get DOM elements by TEST_ID_KEY
 *  @param selector - The data-testid of the DOM elements
 */
Cypress.Commands.add("getByTestId", (selector, ...args) => cy.get(`[${TEST_ID_KEY}=${selector}]`, ...args));

/**
 *  Get a Button by text
 *  @param text - the exact label text displayed in the UI
 */
Cypress.Commands.add("getButtonByText", text => cy.get("button").contains(text));

/**
 *  Get a row of the table using a selector
 *  @param selector - the selector of the row to get
 */
Cypress.Commands.add("getTableRowsBySelector", selector => cy.contains("td", selector).siblings());

/**
 *  Get the action menu (kebab menu) from a specific row of a table bu data test key
 *  @param selector - the action menu selector
 */
Cypress.Commands.add("getTableActionsByTestId", (selector) => {
  cy.log(`getTableActionsByTestId ${selector}-actions`);
  cy.getByTestId(`${selector}-actions`);
});

/**
 * Login to AppBuilder
 */
Cypress.Commands.add("appBuilderLogin", () => {
  cy.log("App-builder Login");
  cy.getOauth2Data();
  cy.get("@oauth2Data").then((oauth2Data) => {
    cy.keycloackLogin(oauth2Data, "user");
  });
});

/**
 * Logout from AppBuilder
 */
Cypress.Commands.add("appBuilderLogout", () => {
  cy.log("App-builder Logout");
  cy.get("@oauth2Data").then((oauth2Data) => {
    cy.keycloackLogout(oauth2Data);
  });
  cy.clearCache();
});

/**
 * Check if the url is changed as expected
 * @param expectedUrl - the changed expected url
 */
Cypress.Commands.add("validateUrlChanged", (expectedUrl) => {
  cy.location("pathname").should("eq", expectedUrl);
});

/**
 *  Close the wizard App Tour if it's visible
 */
Cypress.Commands.add("closeWizardAppTour", () => {
  cy.log("Close App Tour Wizard");
  cy.wait(500);
  const status = JSON.parse(localStorage.getItem("redux")).appTour.appTourProgress;
  console.log("status", status);
  cy.log(`AppTourWizardDialog status ${status}`);
  if (!status || status !== "cancelled") {
    cy.log("AppTourWizardDialog is active");
    cy.get(".reactour__helper--is-open").then(() => {
      cy.wait(500); // Wait until the animation of the App Tour dialog is completed
      cy.getButtonByText("Close").click();
      cy.getButtonByText("Yes").click();
    });
  } else {
    cy.log("AppTourWizardDialog is NOT active");
  }
});

/**
 *  Open a page from the left menu
 *  @param menuLinks - an array with the exact Menu items names displayed in the UI
 *         e.g. ['Users', 'Management'],
 */
Cypress.Commands.add("openPageFromMenu", (menuLinks) => {
  cy.log("Open a page from menu");
  cy.contains("Dashboard").click({force: true});
  cy.wait(500);
  cy.closeWizardAppTour();
  cy.log("Click Menu Group", menuLinks[0]);
  cy.contains(menuLinks[0]).click();
  cy.wait(500);
  if (menuLinks[1]) {
    cy.log("Click Page Menu Item", menuLinks[1]);
    cy.get("li.secondary-nav-item-pf.is-hover.list-group-item").contains(menuLinks[1]).click();
  }
});

/**
 * Checks any window.open invocation (_blank types) and converts it to same-tab window navigation
 */
Cypress.Commands.add('initWindowOpenChecker', () => {
  cy.window().then((win) => {
    cy.stub(win, 'open').as('windowOpen').callsFake(url => {
        cy.visit(url);
    });
  });
});

export {};
