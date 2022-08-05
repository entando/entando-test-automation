import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Assets', () => {

  beforeEach(() => {
    cy.wrap(null).as('assetToBeDeleted');

    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => {
    cy.get('@assetToBeDeleted').then(assetToBeDeleted => {
      if (assetToBeDeleted !== null) cy.assetsController().then(controller => controller.deleteAsset(assetToBeDeleted.id));
    });

    cy.kcTokenLogout();
  });

  describe('Add asset', () => {

    it([Tag.GTS, 'ENG-2524'], 'Add asset', () => {
      openAssetsPage()
          .then(page => page.getContent().selectFiles('cypress/fixtures/upload/image1.JPG'))
          .then(page => page.getDialog().getBody().selectGroup('administrators'))
          .then(page => page.getDialog().getBody().submit())
          .then(() => checkTableLoaded());
      cy.assetsController().then(controller =>
          controller.getAssetsList().then(response =>
              cy.wrap(response.body.payload[0]).as('assetToBeDeleted')));
    });

  });

  describe('Operations on existing asset', () => {

    beforeEach(() => {
      cy.wrap(null).as('contentToBeDeleted');
      cy.assetsController()
        .then(controller => controller.addAsset(testFileInfo, testMetadata))
        .then(response => cy.wrap(response.payload).as('assetToBeDeleted'))
    });

    afterEach(() => {
      cy.get('@contentToBeDeleted').then(contentId => {
        if (contentId) cy.contentsController().then(controller => {
          controller.updateStatus(contentId, 'draft');
          controller.deleteContent(contentId);
        });
      });
    });

    describe('Delete asset', () => {

      it([Tag.GTS, 'ENG-2526'], 'Delete asset', () => {
        cy.get('@assetToBeDeleted').then(asset => {
          openAssetsPage()
              .then(page => {
                checkTableLoaded();
                page.getContent().getKebabMenu(asset.id).open().clickDelete();
              })
              .then(page => page.getDialog().confirm())
              .then(page => {
                cy.validateToast(page);
                page.getContent().getTableRows().should('exist');
                page.getContent().getAssetsBody().then(rows =>
                  cy.wrap(rows).children(htmlElements.div).should('not.contain.text', 'image1.JPG'));
                cy.wrap(null).as('assetToBeDeleted');
              });
        });
      });

      it([Tag.GTS, 'ENG-2526'], 'Delete asset referenced by a content - not allowed', () => {
        cy.get('@assetToBeDeleted').then(assetToBeDeleted =>
            ({
              description: 'test',
              mainGroup: 'administrators',
              typeCode: 'BNR',
              attributes: [
                {
                  code: 'title',
                  values: {
                    en: 'test',
                    it: 'test'
                  }
                },
                {
                  code: 'image',
                  values: {
                    en: {
                      id: assetToBeDeleted.id,
                      correlationCode: assetToBeDeleted.id
                    }
                  }
                }
              ]
            }))
          .then(content => {
            cy.contentsController()
              .then(controller => controller.addContent(content))
              .then(response => {
                cy.wrap(response.body.payload[0].id).as('contentToBeDeleted');
                content.id = response.body.payload[0].id;
              });
            cy.contentsController().then(controller => controller.updateStatus(content.id, 'published'));
            
            cy.get('@assetToBeDeleted').then(asset => {
              openAssetsPage()
              .then(page => {
                checkTableLoaded();
                page.getContent().getKebabMenu(asset.id).open().clickDelete();
              })
              .then(page => page.getDialog().confirm())
              .then(page => {
                cy.validateToast(page, asset.id, false);
              });
            })
          });
      });

    });

    describe('Edit asset', () => {

      it([Tag.GTS, 'ENG-2524'], 'Edit description', () => {
        cy.get('@assetToBeDeleted').then(asset => {
          openAssetsPage()
              .then(page => {
                checkTableLoaded();
                page.getContent().getKebabMenu(asset.id).open().openEdit();
              })
              .then(page => page.getDialog().getBody().getDescriptionInput().then(input => page.getContent().type(input, 'test')))
              .then(page => page.getDialog().confirm())
              .then(page => cy.validateToast(page, 'test'));
        });
      });

      it([Tag.GTS, 'ENG-2525'], 'Crop image', function () {
        cy.get('@assetToBeDeleted').then(asset => {
          openAssetsPage()
              .then(page => {
                checkTableLoaded();
                page.getContent().getKebabMenu(asset.id).open().openEdit();
              })
              .then(page => page.getDialog().getBody().apply())
              .then(page => {
                page.getDialog().getBody().get().find(`${htmlElements.img}[crossorigin="use-credentials"]`).eq(0).invoke('attr', 'src').as('previousSrc');
                page.getDialog().getBody().crop(-100, -100);
              })
              .then(page => {
                page.getDialog().getBody().get().find(`${htmlElements.img}[crossorigin="use-credentials"]`).eq(0).invoke('attr', 'src').should('not.equal', this.previousSrc);
                page.getDialog().confirm();
              })
              .then(page => cy.validateToast(page));
        });
      });

      it([Tag.GTS, 'ENG-2525'], 'Rotate image', function () {
        cy.get('@assetToBeDeleted').then(asset => {
          openAssetsPage()
              .then(page => {
                checkTableLoaded();
                page.getContent().getKebabMenu(asset.id).open().openEdit();
              })
              .then(page => page.getDialog().getBody().apply())
              .then(page => {
                page.getDialog().getBody().get().find(`${htmlElements.img}[crossorigin="use-credentials"]`).eq(0).invoke('attr', 'src').as('previousSrc');
                page.getDialog().getBody().rotate('left');
              })
              .then(page => {
                page.getDialog().getBody().get().find(`${htmlElements.img}[crossorigin="use-credentials"]`).eq(0).invoke('attr', 'src').should('not.equal', this.previousSrc);
                page.getDialog().confirm();
              })
              .then(page => cy.validateToast(page));
        });
      });

    });

    describe('Asset Browsing', () => {

      it('ENG-2680', 'Displaying correct item counts when searching with zero results', () => {
        openAssetsPage()
            .then(page => page.getContent().getSearchTextfield().then(input => page.getContent().type(input, 'z')))
            .then(page => page.getContent().getSearchButton().then(button => page.getContent().click(button)))
            .then(page => page.getContent().getFilterResultItemCount().invoke('text').should('be.equal', '0 of 0 items'))
      });

    });

  });

  const testFileInfo = {path: 'upload/image1.JPG', name: 'image1.JPG', type: 'image/jpeg'};
  const testMetadata = {group: 'administrators', categories: [], type: 'image'};

  const openAssetsPage = () => cy.get('@currentPage').then(page => page.getMenu().getContent().open().openAssets());
  
  const checkTableLoaded = () => cy.get('@currentPage').then(page => {
    page.getContent().getTableRows().should('have.length', 4);
    page.getContent().getTableRows().then(rows =>
      cy.wrap(rows).eq(0).children(htmlElements.td).eq(0).children(htmlElements.img).should('be.visible').and('have.prop', 'naturalWidth').should('be.greaterThan', 0));
    page.getContent().getTableRows().then(rows =>
      cy.wrap(rows).eq(0).children(htmlElements.td).eq(2).should('contain.text', 'image1.JPG'));
  });

});
