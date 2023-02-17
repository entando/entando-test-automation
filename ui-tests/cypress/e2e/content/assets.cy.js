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
          .then(page => page.getContent().openAddAssets())
          .then(page => page.getContent().selectFiles('cypress/fixtures/upload/image1.jpg'))
          .then(page => page.getContent().getGroupSelect().then(select => page.getContent().select(select, 'administrators')))
          .then(page => page.getContent().submit())
          .then(page =>
              page.getContent().getAssetsBody().then(rows =>
                  cy.wrap(rows).children(htmlElements.div).should('contain.text', 'image1.jpg')));
      cy.assetsController().then(controller =>
          controller.getAssetsList().then(response =>
              cy.wrap(response.body.payload[0]).as('assetToBeDeleted')));
    });

  });

  describe('Operations on existing asset', () => {

    beforeEach(() =>
        cy.assetsController()
          .then(controller => controller.addAsset(testFileInfo, testMetadata))
          .then(response => cy.wrap(response.payload).as('assetToBeDeleted')));

    describe('Delete asset', () => {

      it([Tag.GTS, 'ENG-2526'], 'Delete asset', () => {
        openAssetsPage()
            .then(page => page.getContent().getKebabMenu(testFileInfo.name).openDropdown().clickDelete())
            .then(page => page.getContent().submit())
            .then(page => page.getContent().getAssetsBody().then(rows =>
                cy.wrap(rows).children(htmlElements.div).should('not.contain.text', 'image1.jpg')));
        cy.wrap(null).as('assetToBeDeleted');
      });

      it([Tag.GTS, 'ENG-2526'], 'Delete asset referenced by a content - not allowed', () => {
        const isForbidden = true;

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
              .then(response => content.id = response.body.payload[0].id);
            cy.contentsController().then(controller => controller.updateStatus(content.id, 'published'));

            openAssetsPage()
                .then(page => page.getContent().getKebabMenu(testFileInfo.name).openDropdown().clickDelete(isForbidden))
                .then(page => page.getContent().getAlertText().should('have.text', 'Sorry. You cannot perform this action right now, you must first unlink the following cross-references.'));

            cy.contentsController().then(controller => {
              controller.updateStatus(content.id, 'draft');
              controller.deleteContent(content.id);
            });
          });
      });

    });

    describe('Edit asset', () => {

      it([Tag.GTS, 'ENG-2524'], 'Edit description', () => {
        openAssetsPage()
            .then(page => page.getContent().getKebabMenu(testFileInfo.name).openDropdown().openEdit())
            .then(page => page.getContent().getDescriptionInput().then(input => {
              page.getContent().clear(input);
              page.getContent().type(input, 'test');
            }))
            .then(page => page.getContent().submit())
            .then(page =>
                page.getContent().getAssetsBody().then(rows =>
                    cy.wrap(rows).children(htmlElements.div).should('contain.text', 'test')));
      });

      it([Tag.GTS, 'ENG-2525', 'ENG-3860'], 'Crop image', () => {
        openAssetsPage()
            .then(page => page.getContent().getKebabMenu(testFileInfo.name).openDropdown().openEdit())
            .then(page => page.getContent().getImageHeight().invoke('text').then(originalImageHeight =>
                cy.get('@currentPage')
                  .then(page => page.getContent().openDropDown().openEdit())
                  .then(page => page.getDialog().getBody().crop(-50, -50))
                  .then(page => page.getDialog().close())
                  .then(page => page.getContent().submit())
                  .then(page => page.getContent().getKebabMenu(testFileInfo.name).openDropdown().openEdit())
                  .then(page => page.getContent().getImageHeight().invoke('text').should('not.equal', originalImageHeight))));
      });

      it([Tag.GTS, 'ENG-2525', 'ENG-3860'], 'Rotate image', () => {
        openAssetsPage()
            .then(page => page.getContent().getKebabMenu(testFileInfo.name).openDropdown().openEdit())
            .then(page => page.getContent().getFileModifiedDate().invoke('text').then(originalModifiedDate =>
                cy.get('@currentPage')
                  .then(page => page.getContent().openDropDown().openEdit())
                  .then(page => page.getDialog().getBody().rotate())
                  .then(page => page.getDialog().close())
                  .then(page => page.getContent().submit())
                  .then(page => page.getContent().getKebabMenu(testFileInfo.name).openDropdown().openEdit())
                  .then(page => page.getContent().getFileModifiedDate().invoke('text').should('not.equal', originalModifiedDate))));
      });

    });

    describe('Asset Browsing', () => {

      it('ENG-2680', 'Displaying correct item counts when searching with zero results', () => {
        openAssetsPage()
            .then(page => page.getContent().openAdvancedFilter())
            .then(page => page.getContent().getSearchTextfield().then(input => {
              page.getContent().clear(input);
              page.getContent().type(input, 'z');
            }))
            .then(page => page.getContent().submitSearch())
            .then(page => page.getContent().getFilterResultItemCount().invoke('text')
                              .should('be.equal', 'Your search returned 0 results |\n    Page 0 - 0'));
      });

    });

  });

  const testFileInfo = {path: 'upload/image1.jpg', name: 'image1.jpg', type: 'image/jpeg'};
  const testMetadata = {group: 'administrators', categories: [], type: 'image'};

  const openAssetsPage = () => cy.get('@currentPage').then(page => page.getMenu().getContent().open().openAssets());

});
