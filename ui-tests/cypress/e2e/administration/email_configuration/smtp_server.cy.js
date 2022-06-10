import {htmlElements} from '../../../support/pageObjects/WebElement';

describe('SMTP Server Functionalities', () => {

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
    cy.get('@currentPage')
      .then(page => page
          .getMenu().getAdministration().open()
          .openEmailConfiguration());
  });

  afterEach(() => {
    cy.smtpServerController().then(controller => controller.defaultSettings());
    cy.kcUILogout();
  });

  it([Tag.SMOKE, 'ENG-3298'], 'SMTP Current Configuration is displayed', () => {
    cy.get('@currentPage')
      .then(page => {
        page.getContent().getSMTPServerTab()
            .should('be.visible')
            .and('have.class', 'active');
        page.getContent().getSenderManagementTab()
            .should('be.visible')
            .and('not.have.class', 'active');

        page.getContent().getActiveSwitchLabel()
            .should('be.visible')
            .and('have.text', 'Active ');
        page.getContent().getActiveSwitchSwitch()
            .should('be.visible')
            .and('have.class', 'bootstrap-switch-off');

        page.getContent().getDebugSwitchLabel()
            .should('be.visible')
            .and('have.text', 'Debug Mode ');
        page.getContent().getDebugSwitchSwitch()
            .should('be.visible')
            .and('have.class', 'bootstrap-switch-off');

        page.getContent().getHostInput()
            .should('be.visible')
            .and('have.value', 'localhost');

        page.getContent().getPortInput()
            .should('be.visible')
            .and('have.value', '25000');

        page.getContent().getSecurityRender()
            .should('be.visible')
            .children(htmlElements.label).eq(0)
            .and('have.text', 'None')
            .and('have.class', 'active');

        page.getContent().getCheckServerIdSwitchLabel()
            .should('be.visible')
            .and('have.text', 'Check Server Identity ');
        page.getContent().getCheckServerIdSwitchSwitch()
            .should('be.visible')
            .and('have.class', 'bootstrap-switch-on');

        page.getContent().getTimeOutInput()
            .should('be.visible')
            .and('be.empty');

        page.getContent().getUserNameInput()
            .should('be.visible')
            .and('be.empty');

        page.getContent().getPasswordInput()
            .should('be.visible')
            .and('be.empty');

        page.getContent().getTestConfigurationButton()
            .should('be.visible')
            .and('be.enabled');
        page.getContent().getSendTestEmailButton()
            .should('be.visible')
            .and('be.enabled');
        page.getContent().getSaveButton()
            .should('be.visible')
            .and('be.enabled');
      });
  });

  it([Tag.SANITY, 'ENG-3298'], 'Update configuration', () => {
    cy.get('@currentPage')
      .then(page => page.getContent().getPortInput().then(input => page.getContent().type(input, '50000')))
      .then(page => page.getContent().save())
      .then(page => cy.validateToast(page));
  });

  it([Tag.ERROR, 'ENG-3298'], 'Error Validation', () => {
    cy.get('@currentPage')
      .then(page => page.getContent().getHostInput().then(input => {
        page.getContent().clear(input);
        page.getContent().blur(input);
        page.getContent().getInputError(input)
            .should('be.visible')
            .and('have.text', 'Field required');
        page.getContent().getToolButtons().children()
            .each(button => cy.wrap(button).should('be.disabled'));
      }));
  });

});
