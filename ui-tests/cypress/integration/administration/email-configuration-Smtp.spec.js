import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

describe('SMTP Server Functionalities', () => {

  let currentPage;

  beforeEach(() => {
    cy.kcLogin('login/admin').as('tokens');
    currentPage = openEmailConfigurationPage();
  });

  afterEach(() => {
    cy.emailConfigController().then(controller => controller.defaultSettings());
    cy.kcLogout();
  });

  it([Tag.SMOKE, 'ENG-3298'], 'SMTP Current Configuration is displayed', () => {
    currentPage.getContent().getSmtpServerTab()
               .should('be.visible')
               .and('have.class', 'active');
    currentPage.getContent().getSenderManagementTab()
               .should('be.visible')
               .and('not.have.class', 'active');

    currentPage.getContent().getActiveSwitch()
               .children(htmlElements.span).eq(2)
               .should('be.visible')
               .and('have.text', 'OFF');
    currentPage.getContent().getDebugSwitch()
               .children(htmlElements.span).eq(2)
               .should('be.visible')
               .and('have.text', 'OFF');

    currentPage.getContent().getHostInput()
               .should('be.visible')
               .and('have.value', 'localhost');
    currentPage.getContent().getPortInput()
               .should('be.visible')
               .and('have.value', '25000');
    currentPage.getContent().getSecurityRender()
               .should('be.visible')
               .and('have.class', 'active')
               .and('have.text', 'None');
    currentPage.getContent().getCheckServerIdSwitch()
               .children(htmlElements.span).eq(0)
               .should('be.visible')
               .and('have.text', 'ON');
    currentPage.getContent().getTimeOutInput()
               .should('be.visible')
               .and('be.empty');

    currentPage.getContent().getUserNameInput()
               .should('be.visible')
               .and('be.empty');
    currentPage.getContent().getPassWordInput()
               .should('be.visible')
               .and('be.empty');
  });

  it([Tag.SANITY, 'ENG-3298'], 'Update configuration', () => {
    currentPage.getContent().getPortInput()
               .clear().type('50000');

    currentPage.getContent().submit()
               .click();

    cy.validateToast(currentPage);
  });

  it([Tag.ERROR, 'ENG-3298'], 'Error Validation', () => {
    currentPage.getContent().getHostInput()
               .clear().blur();

    currentPage.getContent().searchFieldError()
               .should('be.visible')
               .and('have.text', 'Field required');

    currentPage.getContent().getToolButton()
               .children()
               .should('be.disabled');
  });

  const openEmailConfigurationPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    return currentPage.openEmailConfiguration();
  };

});
