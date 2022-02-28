import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Database', () => {

  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('backupToBeDeleted');
    cy.kcLogin('login/admin').as('tokens');
  });

  afterEach(() => {
    cy.get('@backupToBeDeleted').then((backup) => {
      if (backup) {
        cy.databaseController().then(controller => controller.deleteBackup(backup));
      }
    });
    cy.kcLogout();
  });

  it([Tag.SMOKE, 'ENG-3239'], 'Database section', () => {
    createBackup().then(() => saveBackupCode());
    currentPage = openDatabasePage();
    cy.validateAppBuilderUrlPathname('/database');
    currentPage.getContent().getDatabaseListTable().should('exist').and('be.visible');
    currentPage.getContent().getTableRowByIndex(0).children(htmlElements.td).should('have.length', 4);
    currentPage.getContent().getDeleteButtonByIndex(0).should('exist').and('be.visible');
    currentPage.getContent().getCreateBackupButton().should('exist').and('be.visible');
  });

  it([Tag.SMOKE, 'ENG-3239'], 'Backup details page', () => {
    createBackup().then(() => saveBackupCode());
    currentPage = openDatabasePage();
    currentPage = currentPage.getContent().openDetailsByIndex(0);
    cy.get('@backupToBeDeleted').then(code => {
      cy.validateAppBuilderUrlPathname(`/database/report/${code}`);
    });
    currentPage.getContent().getDescriptionData().should('have.length', 4);
    currentPage.getContent().getComponentTable().should('exist').and('be.visible');
  });

  it([Tag.SMOKE, 'ENG-3239'], 'Create backup page', () => {
    currentPage = openDatabasePage();
    currentPage.getContent().getCreateBackupButton().click();
    cy.validateAppBuilderUrlPathname('/database/add');
    currentPage.getContent().getTablesList().should('exist').and('be.visible');
    currentPage.getContent().getTablesList().children(htmlElements.li).should('have.length', 9);
    currentPage.getContent().getBackupNowButton().should('exist').and('be.visible');
    currentPage.getContent().getGoBackButton().should('exist').and('be.visible');
  });

  describe('Create and delete backups', () => {

    it([Tag.SANITY, 'ENG-3239'], 'Create a backup', () => {
      currentPage = openDatabasePage();
      currentPage.getContent().createBackup();
      cy.validateAppBuilderUrlPathname('/database');
      currentPage.getContent().getDatabaseListTable().should('exist').and('be.visible');
      saveBackupCode();
      cy.get('@backupToBeDeleted').then(backup => {
        currentPage.getContent().getTableRowByIndex(0)
          .children(htmlElements.td).eq(0).should('have.text', backup);
      })
    });

  });

  const createBackup = () => {
    return cy.databaseController().then(controller => {
      controller.addBackup();
      cy.wait(1000);  //wait for POST request to finish
    });
  };

  //have to perform a GET request because the POST request doesn't return the backup code
  const saveBackupCode = () => {
    cy.databaseController().then(controller => controller.getBackupList())
      .then(response => cy.wrap(response.body.payload[response.body.payload.length - 1].code).as('backupToBeDeleted'));
  };

  const openDatabasePage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    currentPage = currentPage.openDatabase();
    return currentPage;
  };

});
