import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';
import {assetsAPIUrl} from '../../support/restAPI/controllersEndPoints';

const addAsset = (fileInfo, metadata) => cy.assetsController().then(controller => controller.addAsset(fileInfo, metadata));

const openAssetsPage = () => {
  cy.visit('/');
  let currentPage = new HomePage();
  currentPage     = currentPage.getMenu().getContent().open();
  return currentPage.openAssets();
};

describe([Tag.GTS], 'Assets', () => {

  let currentPage;
  let assetId;

  let assetToBeDeleted = false;

  const testFileInfo = {fixture: 'upload/image1.JPG', fileName: 'image1.JPG', fileType: 'image/jpeg'};
  const testMetadata = {group: 'administrators', categories: [], type: 'image'};

  beforeEach(() => {
    cy.kcLogin('login/admin').as('tokens');
  });

  afterEach(() => {
    if (assetToBeDeleted) {
      cy.assetsController()
        .then(controller => controller.deleteAsset(assetId))
        .then(() => assetToBeDeleted = false);
    }

    cy.kcLogout();
  });

  describe('Delete asset', () => {
    beforeEach(() => {
      addAsset(testFileInfo, testMetadata).then(({response}) => {
        assetId = response.payload.id;
      });
    });

    it('Delete asset', () => {
      currentPage = openAssetsPage();
      cy.wait(2000);

      currentPage.getContent().getKebabMenu(assetId).open().clickDelete();
      cy.wait(1000);
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage);
    });

    it('Delete asset referenced by a content - not allowed', () => {
      const content = {
        description: 'test',
        mainGroup: 'administrators',
        typeCode: 'BNR',
        attributes: [
          {code: 'title', values: {en: 'test', it: 'test'}},
          {code: 'image', values: {en: {id: assetId, correlationCode: assetId}}}
        ]
      };
      let contentId;

      cy.contentsController()
        .then(controller => controller.postContent(content))
        .then((response) => {
          const {body: {payload}} = response;
          contentId               = payload[0].id;
        });
      cy.contentsController().then(controller => controller.updateStatus(contentId, 'published'));

      currentPage = openAssetsPage();
      cy.wait(2000);

      currentPage.getContent().getKebabMenu(assetId).open().clickDelete();
      cy.wait(1000);
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage, assetId, false);

      cy.contentsController().then(controller => {
        controller.updateStatus(contentId, 'draft');
        controller.deleteContent(contentId);
      });

      assetToBeDeleted = true;
    });
  });

  describe('Edit asset', () => {
    beforeEach(() => {
      addAsset(testFileInfo, testMetadata).then(({response}) => {
        assetId = response.payload.id;

        assetToBeDeleted = true;
      });
    });

    it('Edit description', () => {
      currentPage = openAssetsPage();
      cy.wait(2000);
      currentPage.getContent().getKebabMenu(assetId).open().openEdit();

      currentPage.getDialog().getBody().getDescriptionInput().type('test');
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage, 'test');
    });

    it('Crop image', () => {
      currentPage = openAssetsPage();
      cy.wait(2000);
      currentPage.getContent().getKebabMenu(assetId).open().openEdit();

      currentPage.getDialog().getBody().crop(-100, -100);
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage);
    });

    it('Rotate image', () => {
      currentPage = openAssetsPage();
      cy.wait(2000);
      currentPage.getContent().getKebabMenu(assetId).open().openEdit();

      currentPage.getDialog().getBody().rotate('left');
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage);
    });
  });

  describe('Add asset', () => {
    it('Add asset', () => {
      cy.intercept('POST', assetsAPIUrl, (req) => {
        req.continue((res) => {
          assetId = res.body.payload.id;
        });
      });

      currentPage = openAssetsPage();
      currentPage.getContent().selectFiles('cypress/fixtures/upload/image1.JPG');
      currentPage.getDialog().getBody().getGroupSelect().select('administrators');
      currentPage.getDialog().getBody().submit();

      cy.wait(2000);

      currentPage.getContent().getTableRows().then(rows =>
          cy.wrap(rows).eq(0).children(htmlElements.td).eq(2).should('contain.text', 'image1.JPG')
      );

      assetToBeDeleted = true;
    });
  });

  describe('Asset Browsing', () => {
    it('Displaying correct item counts when searching with zero results (ENG-2680)', () => {
      currentPage = openAssetsPage();
      currentPage.getContent().getSearchTextfield().clear();
      currentPage.getContent().getSearchTextfield().type('z');
      currentPage.getContent().getSearchButton().click();
      cy.wait(1000);
      currentPage.getContent().getFilterResultItemCount().invoke('text').should('be.equal', '0 of 0 items');
    });
  });
});
