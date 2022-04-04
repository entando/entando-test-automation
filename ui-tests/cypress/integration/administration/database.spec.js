import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Database', () => {

  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('backupToBeDeleted');
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
    cy.databaseController().then(controller => controller.intercept({method: 'GET'}, 'databaseListLoaded', '?page=1&pageSize=0'));
    cy.databaseController().then(controller => controller.intercept({method: 'DELETE'}, 'backupDeleted', '/report/**'));
  });

  afterEach(() => {
    cy.get('@backupToBeDeleted').then((backup) => {
      if (backup) {
        cy.databaseController().then(controller => controller.deleteBackup(backup));
      }
    });
    cy.kcUILogout();
  });

  it([Tag.SMOKE, 'ENG-3239'], 'Database section', () => {
    createBackup().then(() => saveBackupCode());
    currentPage = openDatabasePage();
    cy.validateUrlPathname('/database');
    currentPage.getContent().getDatabaseListTable().should('exist').and('be.visible');
    currentPage.getContent().getTableHeaders().should('have.length', 4)
               .then(elements => cy.validateListTexts(elements, ['Code', 'Date', 'Required time', 'Actions']));
    currentPage.getContent().getDeleteButtonByIndex(0).should('exist').and('be.visible');
    currentPage.getContent().getCreateBackupButton().should('exist').and('be.visible');
  });

  it([Tag.SMOKE, 'ENG-3239'], 'Backup details page', () => {
    createBackup().then(() => saveBackupCode());
    currentPage = openDatabasePage();
    currentPage = currentPage.getContent().openDetailsByIndex(0);
    cy.get('@backupToBeDeleted').then(code => {
      cy.validateUrlPathname(`/database/report/${code}`);
    });
    currentPage.getContent().getDescriptionDataTitles().should('have.length', 2)
               .then(elements => cy.validateListTexts(elements, ['Date', 'Required time']));
    currentPage.getContent().getComponentTable().should('exist').and('be.visible');
  });

  it([Tag.SMOKE, 'ENG-3239'], 'Create backup page', () => {
    currentPage = openDatabasePage();
    currentPage.getContent().getCreateBackupButton().click();
    cy.validateUrlPathname('/database/add');
    currentPage.getContent().getTablesList().should('exist').and('be.visible');
    currentPage.getContent().getTablesList().children(htmlElements.li).should('have.length', 9);
    currentPage.getContent().getBackupNowButton().should('exist').and('be.visible');
    currentPage.getContent().getGoBackButton().should('exist').and('be.visible');
  });

  it([Tag.FEATURE, 'ENG-3239'], 'A message should be displayed when no backups are present', () => {
    currentPage = openDatabasePage();
    currentPage.getContent().getAlert().should('exist').and('be.visible');
  });

  describe('Create and delete backups', () => {

    it([Tag.SANITY, 'ENG-3239'], 'Create a backup', () => {
      currentPage = openDatabasePage();
      currentPage.getContent().createBackup();
      cy.validateUrlPathname('/database');
      currentPage.getContent().getDatabaseListTable().should('exist').and('be.visible');
      saveBackupCode();
      cy.get('@backupToBeDeleted').then(backup => {
        currentPage.getContent().getTableRowByIndex(0)
                   .children(htmlElements.td).eq(0).should('have.text', backup);
      });
    });

    it([Tag.FEATURE, 'ENG-3239'], 'Backup should not be created when canceling creation', () => {
      createBackup().then(() => saveBackupCode());
      currentPage = openDatabasePage();
      currentPage.getContent().getTableRows().should('exist').and('have.length', 1);
      currentPage.getContent().getCreateBackupButton().click();
      cy.validateUrlPathname('/database/add');
      currentPage.getContent().getTablesList().should('exist').and('be.visible');
      currentPage.getContent().getGoBackButton().click();
      cy.validateUrlPathname('/database');
      currentPage.getContent().getTableRows().should('exist').and('have.length', 1);
    });

    it([Tag.FEATURE, 'ENG-3239'], 'A confirmation modal should displayed when clicking the remove button', () => {
      createBackup().then(() => saveBackupCode());
      currentPage = openDatabasePage();
      currentPage.getContent().clickDeleteButtonByIndex(0);
      currentPage.getDialog().getBody().get().should('exist').and('be.visible');
    });

    it([Tag.FEATURE, 'ENG-3239'], 'When confirming deletion, the modal is closed and the backup deleted', () => {
      createBackup().then(() => saveBackupCode());
      currentPage = openDatabasePage();
      currentPage.getContent().getTableRows().should('exist').and('have.length', 1);
      currentPage.getContent().clickDeleteButtonByIndex(0);
      currentPage.getDialog().confirm();
      cy.wait('@backupDeleted').then(() => cy.wrap(null).as('backupToBeDeleted'));
      cy.wait(['@databaseListLoaded', '@databaseListLoaded']);
      currentPage.getDialog().get().should('not.exist');
      currentPage.getContent().getAlert().should('exist').and('be.visible');
    });

    it([Tag.FEATURE, 'ENG-3239'], 'When canceling deletion, the modal is closed and the backup is not deleted', () => {
      createBackup().then(() => saveBackupCode());
      currentPage = openDatabasePage();
      currentPage.getContent().getTableRows().should('exist').and('have.length', 1);
      currentPage.getContent().clickDeleteButtonByIndex(0);
      currentPage.getDialog().cancel();
      currentPage.getDialog().get().should('not.exist');
      currentPage.getContent().getTableRows().should('exist').and('have.length', 1);
    });

  });

  describe('Database report page', () => {

    it([Tag.FEATURE, 'ENG-3239'], 'Datasource details', () => {
      createBackup().then(() => saveBackupCode());
      currentPage = openDatabasePage();
      currentPage = currentPage.getContent().openDetailsByIndex(0);
      cy.get('@backupToBeDeleted').then(code => {
        cy.validateUrlPathname(`/database/report/${code}`);
      });
      currentPage.getContent().getDataSourceTables().should('not.be.visible');
      currentPage.getContent().openDataSource();
      currentPage.getContent().getDataSourceTables().should('be.visible');
      currentPage.getContent().getDataSourcePortTableHeaders().should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['Table name', 'Rows', 'Required time']));
      currentPage.getContent().getDataSourceServTableHeaders(0).should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['Table name', 'Rows', 'Required time']));

    });

    it([Tag.FEATURE, 'ENG-3239'], 'Selecting a table should show the SQL query to create it', () => {
      createBackup().then(() => saveBackupCode());
      currentPage = openDatabasePage();
      currentPage = currentPage.getContent().openDetailsByIndex(0);
      currentPage.getDialog().get().should('not.exist');
      cy.get('@backupToBeDeleted').then(code => {
        cy.validateUrlPathname(`/database/report/${code}`);
      });
      currentPage.getContent().openDataSource();
      currentPage.getContent().openSQLQueryFromDataSourcePortByIndex(0);
      currentPage.getDialog().getBody().get().find(`${htmlElements.div}#dump_content`).should('exist').and('contain', 'INSERT');
    });

  });

  const createBackup = () => {
    return cy.databaseController().then(controller => controller.addBackup());
  };

  //FIXME have to perform a GET request because the POST request doesn't return the backup code
  const saveBackupCode = () => {
    cy.databaseController().then(controller => controller.getBackupList())
      .then(response => cy.wrap(response.body.payload[response.body.payload.length - 1].code).as('backupToBeDeleted'));
  };

  const openDatabasePage = () => {
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    currentPage = currentPage.openDatabase();
    cy.wait('@databaseListLoaded');
    return currentPage;
  };

});
