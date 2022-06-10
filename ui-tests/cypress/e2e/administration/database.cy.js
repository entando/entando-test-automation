import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Database', () => {

  beforeEach(() => {
    cy.wrap(null).as('backupToBeDeleted');
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.get('@backupToBeDeleted').then(backup => {
      if (backup) cy.databaseController().then(controller => controller.deleteBackup(backup.code));
    });
    cy.kcUILogout();
  });

  it([Tag.SMOKE, 'ENG-3239'], 'Database section', () => {
    createBackup().then(backup =>
        openDatabasePage()
            .then(page => {
              cy.validateUrlPathname('/database');
              page.getContent().getCreateBackupButton().should('exist').and('be.visible');
              page.getContent().getDatabaseListTable().should('exist').and('be.visible');
              page.getContent().getTableHeaders().children(htmlElements.th).should('have.length', 4)
                  .then(elements => cy.validateListTexts(elements, ['Code', 'Date', 'Required time', 'Actions']));
              page.getContent().getTableRow(backup.code).should('exist').and('be.visible');
            }));
  });

  it([Tag.SMOKE, 'ENG-3239'], 'Backup details page', () => {
    createBackup().then(backup =>
        openDatabasePage()
            .then(page => page.getContent().openRowDetails(backup.code))
            .then(page => {
              cy.validateUrlPathname(`/database/report/${backup.code}`);
              page.getContent().getDescriptionDataTitles().should('have.length', 2)
                  .then(elements => cy.validateListTexts(elements, ['Date', 'Required time']));
              page.getContent().getComponentTable().should('exist').and('be.visible');
              page.getContent().getDataSourceCollapse().should('exist').and('be.visible');
            }));
  });

  it([Tag.SMOKE, 'ENG-3239'], 'Create backup page', () => {
    openDatabasePage()
        .then(page => page.getContent().openCreateBackup())
        .then(page => {
          cy.validateUrlPathname('/database/add');
          page.getContent().getTablesList().should('exist').and('be.visible');
          page.getContent().getTablesList().children(htmlElements.li).should('have.length', 9);
          page.getContent().getBackupNowButton().should('exist').and('be.visible');
          page.getContent().getGoBackButton().should('exist').and('be.visible');
        });
  });

  //TODO make this test less data dependent
  it([Tag.FEATURE, 'ENG-3239'], 'A message should be displayed when no backups are present', () => {
    openDatabasePage()
        .then(page => page.getContent().getAlert().should('exist').and('be.visible'));
  });

  describe('Create and delete backups', () => {

    it([Tag.SANITY, 'ENG-3239'], 'Create a backup', () => {
      openDatabasePage()
          .then(page => page.getContent().openCreateBackup())
          .then(page => page.getContent().createBackup())
          .then(page =>
              getLatestBackupCode().then(backup => {
                cy.validateUrlPathname('/database');
                page.getContent().getDatabaseListTable().should('exist').and('be.visible');
                page.getContent().getTableRow(backup.code).should('exist').and('be.visible');
              }));
    });

    it([Tag.FEATURE, 'ENG-3239'], 'Backup should not be created when canceling creation', () => {
      openDatabasePage()
          .then(page => page.getContent().openCreateBackup())
          .then(page => page.getContent().goBack())
          .then(page => page.getContent().getAlert().should('exist').and('be.visible'));
    });

    it([Tag.FEATURE, 'ENG-3239'], 'A confirmation modal should displayed when clicking the remove button', () => {
      createBackup().then(backup =>
          openDatabasePage()
              .then(page => page.getContent().clickDeleteButton(backup.code))
              .then(page => page.getDialog().getBody().getStateInfo().should('exist').and('contain', backup.code)));
    });

    it([Tag.FEATURE, 'ENG-3239'], 'When confirming deletion, the modal is closed and the backup deleted', () => {
      createBackup().then(backup =>
          openDatabasePage()
              .then(page => page.getContent().clickDeleteButton(backup.code))
              .then(page => page.getDialog().confirm())
              .then(page => {
                cy.wrap(null).as('backupToBeDeleted');
                page.getDialog().get().should('not.exist');
                page.getContent().getAlert().should('exist').and('be.visible');
              }));
    });

    it([Tag.FEATURE, 'ENG-3239'], 'When canceling deletion, the modal is closed and the backup is not deleted', () => {
      createBackup().then(backup =>
          openDatabasePage()
              .then(page => page.getContent().clickDeleteButton(backup.code))
              .then(page => page.getDialog().cancel())
              .then(page => {
                page.getDialog().get().should('not.exist');
                page.getContent().getTableRow(backup.code).should('exist').and('be.visible');
              }));
    });

  });

  describe('Database report page', () => {

    it([Tag.FEATURE, 'ENG-3239'], 'Datasource details', () => {
      createBackup().then(backup =>
          openDatabasePage()
              .then(page => page.getContent().openRowDetails(backup.code))
              .then(page => page.getContent().openDataSource())
              .then(page => {
                page.getContent().getDataSourceTables().should('be.visible');
                page.getContent().getDataSourcePortTableHeaders().children(htmlElements.th).should('have.length', 3)
                    .then(elements => cy.validateListTexts(elements, ['Table name', 'Rows', 'Required time']));
                page.getContent().getDataSourceServTableHeaders().children(htmlElements.th).should('have.length', 3)
                    .then(elements => cy.validateListTexts(elements, ['Table name', 'Rows', 'Required time']));
              }));
    });

    it([Tag.FEATURE, 'ENG-3239'], 'Selecting a table should show the SQL query to create it', () => {
      createBackup().then(backup =>
          openDatabasePage()
              .then(page => page.getContent().openRowDetails(backup.code))
              .then(page => page.getContent().openDataSource())
              .then(page => {
                page.getContent().openSQLQueryFromDataSourcePortTableByIndex(0);
                page.getDialog().getBody().get().find(`${htmlElements.div}#dump_content`).should('exist').and('contain', 'INSERT');
              }));
    });

  });

  const createBackup        = () => {
    return cy.databaseController()
             .then(controller => controller.addBackup())
             .then(() => getLatestBackupCode());
  };
  //FIXME have to perform a GET request because the POST request doesn't return the backup code
  const getLatestBackupCode = () => {
    return cy.databaseController().then(controller => controller.getBackupList())
             .then(response => cy.wrap(response.body.payload[response.body.payload.length - 1]).as('backupToBeDeleted'));
  };

  const openDatabasePage = () => {
    return cy.get('@currentPage')
             .then(page => page.getMenu().getAdministration().open().openDatabase());
  };

});
