import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements } from '../../support/pageObjects/WebElement';
import { controller as assetsAPIUrl  } from '../../support/restAPI/assetsAPI';

const addAsset = (fileInfo, metadata) => cy.assetsController().then(controller => controller.addAsset(fileInfo, metadata));

const openAssetsPage = () => {
  cy.visit('/');
  let currentPage = new HomePage();
  currentPage     = currentPage.getMenu().getContent().open();
  return currentPage.openAssets();
};

describe('Assets', () => {

  let currentPage;
  let assetId;

  let assetToBeDeleted = false;

  const testFileInfo = { fixture: 'upload/image1.JPG', fileName: 'image1.JPG', fileType: 'image/jpeg' };
  const testMetadata = { group: 'administrators', categories: [], type: 'image' };

  beforeEach(() => {
    cy.kcLogin('admin').as('tokens');
  });

  afterEach(() => {
    if (assetToBeDeleted) {
      cy.assetsController().then(controller => controller.deleteAsset(assetId));
    }
    
    cy.kcLogout();
  });

  it('Add asset', () => {
    cy.intercept('POST', assetsAPIUrl, (req) => {
      req.continue((res) => {
        assetId =  res.body.payload.id;
      });
    });

    currentPage = openAssetsPage();
    currentPage.getContent().attachFiles('upload/image1.JPG');
    currentPage.getDialog().getBody().getGroupSelect().select('administrators');
    currentPage.getDialog().getBody().submit();

    cy.wait(2000);

    currentPage.getContent().getTableRows().then(rows =>
      cy.wrap(rows).eq(0).children(htmlElements.td).eq(2).should('contain.text', 'image1.JPG')
    );

    assetToBeDeleted = true;
  });

  it('Delete asset', () => {

    addAsset(testFileInfo, testMetadata).then(({ response }) => {
      assetId = response.payload.id;

      currentPage = openAssetsPage();
      cy.wait(2000);
      currentPage.getContent().getKebabMenu(assetId).open().clickDelete();
      cy.wait(1000);
      currentPage.getDialog().confirm();
      cy.validateToast(currentPage);
    });
  });

  it('Edit asset - description', () => {

    addAsset(testFileInfo, testMetadata).then(({ response }) => {
      assetId = response.payload.id;

      currentPage = openAssetsPage();
      cy.wait(2000);
      currentPage.getContent().getKebabMenu(assetId).open().openEdit();
      currentPage.getDialog().getBody().getDescriptionInput().type('test');
      currentPage.getDialog().confirm();
      cy.validateToast(currentPage, 'test');
    });

    assetToBeDeleted = true;
  });

});
