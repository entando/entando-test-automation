import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Assets', () => {

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

      openAssetsPage()
          .then(page => page.getContent().openAddAssets())
          .then(page => {
            page.getContent().selectFiles('cypress/fixtures/upload/image1.JPG');
            page.getContent().getGroupSelect().select('administrators');
            page.getContent().submit();
          })
          .then(page => {
            page.getContent().getAssetsBody().then(rows =>
                cy.wrap(rows).children(htmlElements.div).should('contain.text', 'image1.JPG')
            );
          })
          .then(() => {
            cy.assetsController()
              .then((controller) => {
                controller.getAssetsList()
                          .then((response) => {
                            const {body: {payload}} = response;
                            cy.wrap(payload[0]).as('assetToBeDeleted');
                          });
              });
          });
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
        openAssetsPage()
            .then(page => page.getContent().getKebabMenu().openDropdown().clickDelete())
            .then(page => page.getContent().submit())
            .then(page => {
              page.getContent().getAssetsBody().then(rows =>
                  cy.wrap(rows).children(htmlElements.div).should('not.contain.text', 'image1.JPG')
              );
            });
        cy.wrap(null).as('assetToBeDeleted');

      });

      it('Delete asset referenced by a content - not allowed', () => {
        let content;
        let isForbidden = true;

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

        openAssetsPage()
            .then(page =>
                page.getContent().getKebabMenu().openDropdown().clickDelete(isForbidden)
            )
            .then(page =>
                page.getContent().getAlertText().should('have.text', 'Sorry. You cannot perform this action right now, you must first unlink the following cross-references.')
            );

        cy.contentsController().then(controller => {
          controller.updateStatus(content.id, 'draft');
          controller.deleteContent(content.id);
        });
      });

    });

    describe([Tag.GTS], 'Edit asset', () => {

      it('Edit description', () => {
        openAssetsPage()
            .then(page => page.getContent().getKebabMenu().openDropdown().openEdit())
            .then(page => {
              page.getContent().getDescriptionInput().clear().type('test');
              page.getContent().submit();
            })
            .then(page => {
              page.getContent().getAssetsBody().then(rows =>
                  cy.wrap(rows).children(htmlElements.div).should('contain.text', 'test'));
            });

      });

      it.only('Crop image', () => {
        openAssetsPage()
            .then(page => {
              page.getContent().getKebabMenu().openDropdown().openEdit()
                  .then(page => {
                    page.getContent().getImageHeight().invoke('text').then(OriginalImageHeight => {
                      cy.get('@currentPage')
                        .then(page => {
                          page.getContent().openDropDown().openEdit();
                        })
                        .then(page => {
                          page.getDialog().getBody().crop(-50, -50);
                          page.getDialog().close();
                          page.getContent().submit();
                        })
                        .then(page =>
                            page.getContent().getKebabMenu().openDropdown().openEdit())
                        .then(page =>
                            page.getContent().getImageHeight().invoke('text').then(CroppedImageHeight => {
                              expect(CroppedImageHeight).not.equal(OriginalImageHeight);
                            })
                        );
                    });
                  });
            });
      });

      it('Rotate image', () => {
        openAssetsPage()
            .then(page =>
                page.getContent().getKebabMenu().openDropdown().openEdit())
            .then(page => {
              page.getContent().getFileModifiedDate().invoke('text').then(OriginalModifiedDate => {
                cy.get('@currentPage')
                  .then(page => {
                    page.getContent().openDropDown().openEdit();
                  })
                  .then(page => {
                    page.getDialog().getBody().rotate();
                    page.getDialog().close();
                    page.getContent().submit();
                  })
                  .then(page =>
                      page.getContent().getKebabMenu().openDropdown().openEdit())
                  .then(page =>
                      page.getContent().getFileModifiedDate().invoke('text').then(LastModifiedDate => {
                        expect(OriginalModifiedDate).not.equal(LastModifiedDate);
                      })
                  );
              });
            });
      });
    });

    describe(['ENG-2680'], 'Asset Browsing', () => {

      it('Displaying correct item counts when searching with zero results', () => {
        openAssetsPage()
            .then(page => {
              page.getContent().openAdvancedFilter();
              page.getContent().getSearchTextfield().clear();
              page.getContent().getSearchTextfield().type('z');
              page.getContent().submitSearch();
              page.getContent().getFilterResultItemCount().invoke('text').should('be.equal', 'Your search returned 0 results |\n' +
                  '    Page 0 - 0');
            });
      });
    });

  });
  const testFileInfo = {path: 'upload/image1.JPG', name: 'image1.JPG', type: 'image/jpeg'};
  const testMetadata = {group: 'administrators', categories: [], type: 'image'};

  const openAssetsPage = () => {
    return cy.get('@currentPage')
             .then(page => page.getMenu().getContent().open().openAssets());
  };
});
