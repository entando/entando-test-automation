import {loremIpsum}       from 'lorem-ipsum';
import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

describe('File browser', () => {

  beforeEach(() => {
    cy.wrap([]).as('filesToBeDeleted');
    cy.wrap([]).as('foldersToBeDeleted');
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => {
    cy.get('@filesToBeDeleted')
      .then(files => files.forEach(file =>
          cy.fileBrowserController().then(controller => controller.deleteFile(file))));
    cy.get('@foldersToBeDeleted')
      .then(folders => folders.forEach(folder =>
          cy.fileBrowserController().then(controller => controller.deleteFolder(folder))));
    cy.kcTokenLogout();
  });

  describe('Structure', () => {

    it([Tag.SMOKE, 'ENG-3297'], 'Root folder', () => {
      cy.get('@currentPage')
        .then(page => page.getMenu().getAdministration().open().openFileBrowser())
        .then(page => {
          cy.validateUrlPathname('/file-browser');
          page.getContent().getFilesTable().should('exist').and('be.visible');
          page.getContent().getTableRows().should('have.length', 2);
          page.getContent().getTableRow('public').should('exist').and('be.visible');
          page.getContent().getTableRow('protected').should('exist').and('be.visible');
        });
    });

    it([Tag.SMOKE, 'ENG-3297'], 'Subfolder', () => {
      cy.get('@currentPage')
        .then(page => page.getMenu().getAdministration().open().openFileBrowser())
        .then(page => page.getContent().openPublicFolder())
        .then(page => {
          page.getContent().getFilesTable().should('exist').and('be.visible');
          page.getContent().getTableHeaders().children(htmlElements.th).should('have.length', 4)
              .then(elements => cy.validateListTexts(elements, [' up..', 'Size', 'Last Edit', 'Actions']));
          page.getContent().getUpButton().should('exist').and('be.visible');
          page.getContent().getUploadFilesOperationButton().should('exist').and('be.visible');
          page.getContent().getCreateFolderOperationButton().should('exist').and('be.visible');
          page.getContent().getCreateTextFileOperationButton().should('exist').and('be.visible');
        });
    });

    it([Tag.SMOKE, 'ENG-3297'], 'Folder context menu', () => {
      cy.fileBrowserController().then(controller =>
          controller.createFolder(generateRandomId()).then(response =>
              cy.unshiftAlias('@foldersToBeDeleted', response.body.payload.path)))
        .then(folder =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getAdministration().open().openFileBrowser())
              .then(page => page.getContent().openPublicFolder())
              .then(page => validateKebabMenu(page, folder.slice(1))));
    });

    it([Tag.SMOKE, 'ENG-3297'], 'File context menu', () => {
      cy.fileBrowserController().then(controller =>
          controller.createFile(getUploadFile())).then(response =>
          cy.unshiftAlias('@filesToBeDeleted', response.body.payload.path))
        .then(file =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getAdministration().open().openFileBrowser())
              .then(page => page.getContent().openPublicFolder())
              .then(page => validateKebabMenu(page, file.slice(1), true)));
    });

    it([Tag.SMOKE, Tag.FEATURE, 'ENG-3297'], 'Upload files page', () => {
      cy.get('@currentPage')
        .then(page => page.getMenu().getAdministration().open().openFileBrowser())
        .then(page => page.getContent().openPublicFolder())
        .then(page => page.getContent().openUploadFilesPage())
        .then(page => {
          if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('SMOKE')) {
            cy.validateUrlPathname('/file-browser/upload');
            page.getContent().getUploadFilesForm().should('exist').and('be.visible');
            page.getContent().getUploadFilesInput().should('exist').and('be.visible');
            page.getContent().getCancelButton().should('exist').and('be.visible');
            page.getContent().getUploadButton().should('exist').and('be.visible');
          }
          if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('FEATURE')) {
            page.getContent().getUploadButton().should('be.disabled');
          }
        });
    });

    it([Tag.SMOKE, Tag.FEATURE, 'ENG-3297'], 'Create folder page', () => {
      cy.get('@currentPage')
        .then(page => page.getMenu().getAdministration().open().openFileBrowser())
        .then(page => page.getContent().openPublicFolder())
        .then(page => page.getContent().openCreateFolderPage())
        .then(page => {
          if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('SMOKE')) {
            cy.validateUrlPathname('/file-browser/create-folder');
            page.getContent().getCreateFolderForm().should('exist').and('be.visible');
            page.getContent().getNameInput().should('exist').and('be.visible');
            page.getContent().getCancelButton().should('exist').and('be.visible');
            page.getContent().getSaveButton().should('exist').and('be.visible');
          }
          if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('FEATURE')) {
            page.getContent().getSaveButton().should('be.disabled');
          }
        });
    });

    it([Tag.SMOKE, Tag.FEATURE, 'ENG-3297'], 'Create text file page', () => {
      cy.get('@currentPage')
        .then(page => page.getMenu().getAdministration().open().openFileBrowser())
        .then(page => page.getContent().openPublicFolder())
        .then(page => page.getContent().openCreateTextFilePage())
        .then(page => {
          if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('SMOKE')) {
            cy.validateUrlPathname('/file-browser/create-text-file');
            page.getContent().getCreateTextFileForm().should('exist').and('be.visible');
            page.getContent().getNameInput().should('exist').and('be.visible');
            page.getContent().getExtensionSelector().should('exist').and('be.visible');
            page.getContent().getExtensionSelector()
                .children(htmlElements.option).should('have.length', 2)
                .then(options => {
                  cy.get(options).eq(0).should('have.value', '.txt');
                  cy.get(options).eq(1).should('have.value', '.css');
                });
            page.getContent().getTextArea().should('exist').and('be.visible');
            page.getContent().getCancelButton().should('exist').and('be.visible');
            page.getContent().getSaveButton().should('exist').and('be.visible');
          }
          if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('FEATURE')) {
            page.getContent().getSaveButton().should('be.disabled');
          }
        });
    });

    it([Tag.SANITY, 'ENG-3297'], 'Subfolder content', () => {
      cy.fileBrowserController().then(controller =>
          controller.createFolder(generateRandomId()).then(response =>
              cy.unshiftAlias('@foldersToBeDeleted', response.body.payload.path)).then(folder =>
              controller.createFolder(`${folder.slice(1)}/${generateRandomId()}`).then(response =>
                  cy.unshiftAlias('@foldersToBeDeleted', response.body.payload.path)).then(subfolder =>
                  controller.createFile(getUploadFile(`${folder.slice(1)}/`)).then(response =>
                      cy.unshiftAlias('@filesToBeDeleted', response.body.payload.path)).then(file =>
                      cy.get('@currentPage')
                        .then(page => page.getMenu().getAdministration().open().openFileBrowser())
                        .then(page => page.getContent().openPublicFolder())
                        .then(page => page.getContent().openFolder(folder.slice(1)))
                        .then(page => {
                          page.getContent().getFilesTable().should('exist').and('be.visible');
                          page.getContent().getTableHeaders().children(htmlElements.th).should('have.length', 4)
                              .then(elements => cy.validateListTexts(elements, [' up..', 'Size', 'Last Edit', 'Actions']));
                          page.getContent().getUpButton().should('exist').and('be.visible');
                          page.getContent().getUploadFilesOperationButton().should('exist').and('be.visible');
                          page.getContent().getCreateFolderOperationButton().should('exist').and('be.visible');
                          page.getContent().getCreateTextFileOperationButton().should('exist').and('be.visible');
                          validateKebabMenu(page, file.split('/')[2], true);
                          validateKebabMenu(page, subfolder.split('/')[2]);
                        })))));
    });

    it([Tag.SANITY, 'ENG-3297'], 'A confirmation modal should be displayed when trying to delete a content', () => {
      cy.fileBrowserController().then(controller =>
          controller.createFile(getUploadFile())).then(response =>
          cy.unshiftAlias('@filesToBeDeleted', response.body.payload.path))
        .then(file =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getAdministration().open().openFileBrowser())
              .then(page => page.getContent().openPublicFolder())
              .then(page => page.getContent().getKebabMenu(file.slice(1)).open().clickDelete())
              .then(page => page.getDialog().getBody().getStateInfo().should('exist').and('contain', file.slice(1))));
    });

    const validateKebabMenu = (page, element, isFile = false) => {
      const kebabMenu = page.getContent().getKebabMenu(element).open();
      kebabMenu.get().should('exist').and('be.visible');
      if (isFile) kebabMenu.getDownload().should('exist').and('be.visible');
      kebabMenu.getDelete().should('exist').and('be.visible');
    };

  });

  describe('Interactions', () => {

    describe('File download', () => {

      beforeEach(() => {
        cy.wrap(null).as('deleteDownloadsFolder');
        cy.fileBrowserController().then(controller => controller.createFile(getUploadFile()))
          .then(response => cy.unshiftAlias('@filesToBeDeleted', response.body.payload.path));
      });

      afterEach(() =>
          cy.get('@deleteDownloadsFolder').then(deleteFolder => {
            if (deleteFolder) cy.task('deleteDownloadsFolder');
          })
      );

      it([Tag.SANITY, 'ENG-3297'], 'Downloading a file by clicking on it', () => {
        cy.get('@filesToBeDeleted').then(files => files[0])
          .then(file =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getAdministration().open().openFileBrowser())
                .then(page => page.getContent().openPublicFolder())
                .then(page => page.getContent().downloadFile(file.slice(1)))
                .then(() => cy.verifyDownload(file.slice(1)).as('deleteDownloadsFolder')));
      });

      it([Tag.FEATURE, 'ENG-3297'], 'Downloading a file using the context menu', () => {
        cy.get('@filesToBeDeleted').then(files => files[0])
          .then(file =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getAdministration().open().openFileBrowser())
                .then(page => page.getContent().openPublicFolder())
                .then(page => page.getContent().getKebabMenu(file.slice(1)).open().clickDownload())
                .then(() => cy.verifyDownload(file.slice(1)).as('deleteDownloadsFolder')));
      });

    });

    describe('Content creation', () => {

      it([Tag.FEATURE, 'ENG-3297', 'ENG-3381'], 'No file is uploaded when canceling out of upload page', () => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getAdministration().open().openFileBrowser())
          .then(page => page.getContent().openPublicFolder())
          .then(page => page.getContent().openUploadFilesPage())
          .then(page => page.getContent().selectFiles(`cypress/fixtures/upload/${FILE}`))
          .then(page => page.getContent().cancelUpload())
          .then(page => {
            cy.validateUrlPathname('/file-browser');
            page.getContent().getFilesTable().should('exist').and('be.visible');
            page.getContent()
                .getTableRows().children(htmlElements.td).contains(FILE)
                .should('not.exist');
          });
      });

      it([Tag.SANITY, 'ENG-3297', 'ENG-3377'], 'Uploading a file', () => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getAdministration().open().openFileBrowser())
          .then(page => page.getContent().openPublicFolder())
          .then(page => page.getContent().openUploadFilesPage())
          .then(page => page.getContent().selectFiles(`cypress/fixtures/upload/${FILE}`))
          .then(page => page.getContent().confirmUpload())
          .then(page => {
            cy.unshiftAlias('@filesToBeDeleted', `/${FILE}`);
            cy.validateUrlPathname('/file-browser');
            cy.validateToast(page);
            page.getContent().getFilesTable().should('exist').and('be.visible');
            page.getContent().getRowLink(FILE).should('exist').and('be.visible');
            page.getContent().getKebabMenu(FILE).open().get().should('exist').and('be.visible');
          });
      });

      it([Tag.FEATURE, 'ENG-3297', 'ENG-3381'], 'No folder is created when canceling out of create folder page', () => {
        const folder = generateRandomId();

        cy.get('@currentPage')
          .then(page => page.getMenu().getAdministration().open().openFileBrowser())
          .then(page => page.getContent().openPublicFolder())
          .then(page => page.getContent().openCreateFolderPage())
          .then(page => page.getContent().getNameInput().then(input => page.getContent().type(input, folder)))
          .then(page => page.getContent().cancel())
          .then(page => {
            cy.validateUrlPathname('/file-browser');
            page.getContent().getFilesTable().should('exist').and('be.visible');
            page.getContent()
                .getTableRows().children(htmlElements.td).contains(folder)
                .should('not.exist');
          });
      });

      it([Tag.SANITY, 'ENG-3297', 'ENG-3377'], 'Creating a folder', () => {
        const folder = generateRandomId();

        cy.get('@currentPage')
          .then(page => page.getMenu().getAdministration().open().openFileBrowser())
          .then(page => page.getContent().openPublicFolder())
          .then(page => page.getContent().openCreateFolderPage())
          .then(page => page.getContent().getNameInput().then(input => page.getContent().type(input, folder)))
          .then(page => page.getContent().save())
          .then(page => {
            cy.unshiftAlias('@foldersToBeDeleted', `/${folder}`);
            cy.validateUrlPathname('/file-browser');
            cy.validateToast(page);
            page.getContent().getFilesTable().should('exist').and('be.visible');
            page.getContent().getRowLink(folder).should('exist').and('be.visible');
            page.getContent().getKebabMenu(folder).open().get().should('exist').and('be.visible');
          });
      });

      it([Tag.FEATURE, 'ENG-3297', 'ENG-3381'], 'No file is created when canceling out of create text file page', () => {
        const file = generateRandomId();

        cy.get('@currentPage')
          .then(page => page.getMenu().getAdministration().open().openFileBrowser())
          .then(page => page.getContent().openPublicFolder())
          .then(page => page.getContent().openCreateTextFilePage())
          .then(page => page.getContent().getNameInput().then(input => page.getContent().type(input, file)))
          .then(page => page.getContent().getTextArea().then(textArea => page.getContent().type(textArea, loremIpsum())))
          .then(page => page.getContent().cancel())
          .then(page => {
            cy.validateUrlPathname('/file-browser');
            page.getContent().getFilesTable().should('exist').and('be.visible');
            page.getContent()
                .getTableRows().children(htmlElements.td).contains(file)
                .should('not.exist');
          });
      });

      it([Tag.SANITY, 'ENG-3297', 'ENG-3377'], 'Creating a text file', () => {
        const file = generateRandomId();

        cy.get('@currentPage')
          .then(page => page.getMenu().getAdministration().open().openFileBrowser())
          .then(page => page.getContent().openPublicFolder())
          .then(page => {
            page.getContent().getTableRows().then(rows => cy.wrap(rows.length).as('previousRows'));
            page.getContent().openCreateTextFilePage();
          })
          .then(page => page.getContent().getNameInput().then(input => page.getContent().type(input, file)))
          .then(page => page.getContent().getTextArea().then(textArea => page.getContent().type(textArea, loremIpsum())))
          .then(page => page.getContent().save())
          .then(page => {
            cy.unshiftAlias('@filesToBeDeleted', `/${file}.txt`);
            cy.validateUrlPathname('/file-browser');
            cy.validateToast(page);
            cy.wait(500);
            page.getContent().getFilesTable().should('exist').and('be.visible');
            cy.get('@previousRows').then(previousRows => page.getContent().getTableRows().should('have.length', previousRows+1));
            page.getContent().getRowLink(`${file}.txt`).should('exist').and('be.visible');
            page.getContent().getKebabMenu(`${file}.txt`).open().get().should('exist').and('be.visible');
          });
      });

    });

    describe('Content deletion', () => {

      beforeEach(() =>
          cy.fileBrowserController().then(controller => controller.createFile(getUploadFile()))
            .then(response => cy.unshiftAlias('@filesToBeDeleted', response.body.payload.path))
      );

      it([Tag.SANITY, 'ENG-3297'], 'When canceling the deletion, the modal should close and the content should not be deleted', () => {
        cy.get('@filesToBeDeleted').then(files => files[0])
          .then(file =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getAdministration().open().openFileBrowser())
                .then(page => page.getContent().openPublicFolder())
                .then(page => page.getContent().getKebabMenu(file.slice(1)).open().clickDelete())
                .then(page => page.getDialog().cancel())
                .then(page => {
                  page.getDialog().get().should('not.exist');
                  page.getContent().getFilesTable().should('exist').and('be.visible');
                  page.getContent().getRowLink(file.slice(1)).should('exist').and('be.visible');
                  page.getContent().getKebabMenu(file.slice(1)).open().get().should('exist').and('be.visible');
                }));
      });

      it([Tag.SANITY, 'ENG-3297'], 'Deleting a content', () => {
        cy.get('@filesToBeDeleted').then(files => files[0])
          .then(file =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getAdministration().open().openFileBrowser())
                .then(page => page.getContent().openPublicFolder())
                .then(page => page.getContent().getKebabMenu(file.slice(1)).open().clickDelete())
                .then(page => page.getDialog().confirm())
                .then(page => {
                  cy.deleteAlias('@filesToBeDeleted', file);
                  page.getDialog().get().should('not.exist');
                  page.getContent().getFilesTable().should('exist').and('be.visible');
                  page.getContent()
                      .getTableRows().children(htmlElements.td).contains(file.slice(1))
                      .should('not.exist');
                }));
      });

    });

    describe('Navigation', () => {

      beforeEach(() =>
          cy.fileBrowserController().then(controller =>
              controller.createFolder(generateRandomId()).then(response =>
                  cy.unshiftAlias('@foldersToBeDeleted', response.body.payload.path)).then(folder =>
                  controller.createFile(getUploadFile(`${folder.slice(1)}/`))
                            .then(response => {
                              cy.unshiftAlias('@filesToBeDeleted', response.body.payload.path);
                              cy.get('@currentPage')
                                .then(page => page.getMenu().getAdministration().open().openFileBrowser())
                                .then(page => page.getContent().openPublicFolder())
                                .then(page => page.getContent().openFolder(folder.slice(1)));
                            })
              ))
      );

      it([Tag.FEATURE, 'ENG-3297'], 'The up button should take to the parent folder', () => {
        cy.get('@currentPage')
          .then(page => page.getContent().goUpFolder())
          .then(page => {
            cy.validateUrlPathname('/file-browser');
            page.getContent().getBreadCrumbsFirstLevelFolder().should('have.text', 'public');
          });
      });

      it([Tag.FEATURE, 'ENG-3297'], 'Navigating out of file upload page to root using breadcrumb', () => {
        cy.get('@currentPage')
          .then(page => page.getContent().openUploadFilesPage())
          .then(page => page.getContent().goToRootViaBreadCrumbs())
          .then(page => {
            cy.validateUrlPathname('/file-browser');
            page.getContent().getBreadCrumbsFirstLevelFolder().should('not.exist');
          });
      });

      it([Tag.FEATURE, 'ENG-3297', 'ENG-3376'], 'Navigating out of file upload page NOT to root using breadcrumb', () => {
        cy.get('@currentPage')
          .then(page => page.getContent().openUploadFilesPage())
          .then(page => page.getContent().goToFirstLevelViaBreadCrumbs())
          .then(page => {
            cy.validateUrlPathname('/file-browser');
            page.getContent().getBreadCrumbsFirstLevelFolder().should('have.text', 'public');
          });
      });

      it([Tag.FEATURE, 'ENG-3297'], 'Navigating out of create folder page to root using breadcrumb', () => {
        cy.get('@currentPage')
          .then(page => page.getContent().openCreateFolderPage())
          .then(page => page.getContent().goToRootViaBreadCrumbs())
          .then(page => {
            cy.validateUrlPathname('/file-browser');
            page.getContent().getBreadCrumbsFirstLevelFolder().should('not.exist');
          });
      });

      it([Tag.FEATURE, 'ENG-3297', 'ENG-3376'], 'Navigating out of create folder page NOT to root using breadcrumb', () => {
        cy.get('@currentPage')
          .then(page => page.getContent().openCreateFolderPage())
          .then(page => page.getContent().goToFirstLevelViaBreadCrumbs())
          .then(page => {
            cy.validateUrlPathname('/file-browser');
            page.getContent().getBreadCrumbsFirstLevelFolder().should('have.text', 'public');
          });
      });

      it([Tag.FEATURE, 'ENG-3297'], 'Navigating out of create text file page to root using breadcrumb', () => {
        cy.get('@currentPage')
          .then(page => page.getContent().openCreateTextFilePage())
          .then(page => page.getContent().goToRootViaBreadCrumbs())
          .then(page => {
            cy.validateUrlPathname('/file-browser');
            page.getContent().getBreadCrumbsFirstLevelFolder().should('not.exist');
          });
      });

      it([Tag.FEATURE, 'ENG-3297', 'ENG-3376'], 'Navigating out of create text file page NOT to root using breadcrumb', () => {
        cy.get('@currentPage')
          .then(page => page.getContent().openCreateTextFilePage())
          .then(page => page.getContent().goToFirstLevelViaBreadCrumbs())
          .then(page => {
            cy.validateUrlPathname('/file-browser');
            page.getContent().getBreadCrumbsFirstLevelFolder().should('have.text', 'public');
          });
      });

    });

  });

  describe('Validations', () => {

    it([Tag.ERROR, 'ENG-3297'], 'When creating a folder, an error should be displayed when deselecting the folder name field without filling it', () => {
      cy.get('@currentPage')
        .then(page => page.getMenu().getAdministration().open().openFileBrowser())
        .then(page => page.getContent().openPublicFolder())
        .then(page => page.getContent().openCreateFolderPage())
        .then(page => validateInputError(page, page.getContent().getNameInput()));
    });

    it([Tag.ERROR, 'ENG-3297'], 'When creating a text file, an error should be displayed when deselecting a field without filling it', () => {
      cy.get('@currentPage')
        .then(page => page.getMenu().getAdministration().open().openFileBrowser())
        .then(page => page.getContent().openPublicFolder())
        .then(page => page.getContent().openCreateTextFilePage())
        .then(page => {
          validateInputError(page, page.getContent().getNameInput());
          validateInputError(page, page.getContent().getTextArea());
        });
    });

    const validateInputError = (page, input) => {
      input.then(input => {
        page.getContent().getInputError(input).should('not.exist');
        page.getContent().focus(input);
        page.getContent().blur(input);
        page.getContent().getInputError(input).should('exist').and('be.visible');
      });
    };

  });

  const FILE = 'data1.json';

  const getUploadFile = (path = '') => ({path, name: 'data1.json', base64: '', type: 'application/json'});

});
