import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Assets', () => {

  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('assetToBeDeleted');
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.get('@assetToBeDeleted').then(assetToBeDeleted => {
      if (assetToBeDeleted !== null) {
        cy.assetsController().then(controller => controller.deleteAsset(assetToBeDeleted.id));
      }
    });

    cy.kcUILogout();
  });

  describe([Tag.GTS], 'Add asset', () => {

    it('Add asset', () => {
      cy.assetsController().then(controller => controller.intercept({method: 'POST'}, 'interceptedPOST'));

      currentPage = openAssetsPage();
      currentPage.getContent().selectFiles('cypress/fixtures/upload/image1.JPG');
      currentPage.getDialog().getBody().getGroupSelect().select('administrators');
      currentPage.getDialog().getBody().submit();

      cy.wait('@interceptedPOST').then(interception => cy.wrap(interception.response.body.payload).as('assetToBeDeleted'));

      currentPage.getContent().getTableRows().then(rows =>
          cy.wrap(rows).eq(0).children(htmlElements.td).eq(2).should('contain.text', 'image1.JPG')
      );
    });

  });

  describe('Operations on existing asset', () => {

    beforeEach(() => {
      cy.assetsController()
        .then(controller => controller.addAsset(testFileInfo, testMetadata))
        .then(response => cy.wrap(response.payload).as('assetToBeDeleted'));
    });

    describe([Tag.GTS], 'Delete asset', () => {

      it('Delete asset', () => {
        currentPage = openAssetsPage();
        cy.wait(2000);

        cy.get('@assetToBeDeleted')
          .then(assetToBeDeleted => currentPage.getContent().getKebabMenu(assetToBeDeleted.id).open().clickDelete());
        cy.wait(1000);
        currentPage.getDialog().confirm();

        cy.validateToast(currentPage);

        cy.wrap(null).as('assetToBeDeleted');
      });

      it('Delete asset referenced by a content - not allowed', () => {
        let content;

        cy.get('@assetToBeDeleted').then(assetToBeDeleted =>
            content = {
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
            }
        );
        cy.contentsController()
          .then(controller => controller.addContent(content))
          .then(response => content.id = response.body.payload[0].id);
        cy.contentsController().then(controller => controller.updateStatus(content.id, 'published'));

        currentPage = openAssetsPage();
        //TODO validate this wait
        cy.wait(2000);

        cy.get('@assetToBeDeleted').then(assetToBeDeleted =>
            currentPage.getContent().getKebabMenu(assetToBeDeleted.id).open().clickDelete()
        );
        cy.wait(1000);
        currentPage.getDialog().confirm();

        cy.get('@assetToBeDeleted').then(assetToBeDeleted =>
            cy.validateToast(currentPage, assetToBeDeleted.id, false)
        );

        cy.contentsController().then(controller => {
          controller.updateStatus(content.id, 'draft');
          controller.deleteContent(content.id);
        });
      });

    });

    describe([Tag.GTS], 'Edit asset', () => {

      it('Edit description', () => {
        currentPage = openAssetsPage();
        //TODO validate this wait
        cy.wait(2000);
        cy.get('@assetToBeDeleted')
          .then(assetToBeDeleted => currentPage.getContent().getKebabMenu(assetToBeDeleted.id).open().openEdit())
          .then(() => {
            currentPage.getDialog().getBody().getDescriptionInput().type('test');
            currentPage.getDialog().confirm();
          });

        cy.validateToast(currentPage, 'test');
      });

      it('Crop image', () => {
        currentPage = openAssetsPage();
        cy.wait(2000);
        cy.get('@assetToBeDeleted')
          .then(assetToBeDeleted => currentPage.getContent().getKebabMenu(assetToBeDeleted.id).open().openEdit())
          .then(() => {
            currentPage.getDialog().getBody().crop(-100, -100);
            currentPage.getDialog().confirm();
          });

        cy.validateToast(currentPage);
      });

      it('Rotate image', () => {
        currentPage = openAssetsPage();
        cy.wait(2000);
        cy.get('@assetToBeDeleted')
          .then(assetToBeDeleted => currentPage.getContent().getKebabMenu(assetToBeDeleted.id).open().openEdit())
          .then(() => {
            currentPage.getDialog().getBody().rotate('left');
            currentPage.getDialog().confirm();
          });

        cy.validateToast(currentPage);
      });

    });

  });

  describe(['ENG-2680'], 'Asset Browsing', () => {

    it('Displaying correct item counts when searching with zero results', () => {
      currentPage = openAssetsPage();
      currentPage.getContent().getSearchTextfield().clear();
      currentPage.getContent().getSearchTextfield().type('z');
      currentPage.getContent().getSearchButton().click();
      cy.wait(1000);
      currentPage.getContent().getFilterResultItemCount().invoke('text').should('be.equal', '0 of 0 items');
    });

  });

  const testFileInfo = {path: 'upload/image1.JPG', name: 'image1.JPG', type: 'image/jpeg'};
  const testMetadata = {group: 'administrators', categories: [], type: 'image'};

  const openAssetsPage = () => {
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getContent().open();
    return currentPage.openAssets();
  };

});
