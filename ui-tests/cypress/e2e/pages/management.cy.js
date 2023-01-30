import {generateRandomId} from '../../support/utils';

import {htmlElements}   from '../../support/pageObjects/WebElement';
import defaultTemplates from '../../fixtures/data/defaultTemplates.json';
import HomePage         from '../../support/pageObjects/HomePage';

describe('Page Management', () => {

  beforeEach(() => {
    cy.wrap([]).as('pagesToBeDeleted');
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => {
    cy.get('@pagesToBeDeleted').then(pages => pages
        .forEach(page => cy.pagesController().then(controller => {
          controller.setPageStatus(page, 'draft');
          controller.deletePage(page);
        })));
    cy.kcTokenLogout();
  });

  describe('UI', () => {

    it([Tag.GTS, 'ENG-2175'], 'Add page', () => {
      cy.get('@currentPage')
        .then(page => page.getMenu().getPages().open().openManagement())
        .then(page => page.getContent().openAddPagePage())
        .then(page => {
          cy.validateUrlPathname('/page/add');
          page.getContent().getTitleInput('en').should('be.empty');
          page.getContent().openOwnerGroupMenu();
          cy.fixture('data/defaultOwnerGroups.json')
            .then(defaultOwnerGroups => defaultOwnerGroups.map(ownerGroup => ownerGroup.name))
            .then(defaultOwnerGroups =>
                page.getContent().getOwnerGroupDropdown().children(htmlElements.li)
                    .should('have.length', defaultOwnerGroups.length)
                    .then(elements => cy.validateListTexts(elements, defaultOwnerGroups)));
          cy.wrap(defaultTemplates)
            .then(templates => templates.map(template => template.descr))
            .then(templates => {templates.unshift('Choose an option');})
            .then(templates =>
                page.getContent().getPageTemplateSelect().children(htmlElements.option)
                    .should('have.length', 8)
                    .then(elements => cy.validateListTexts(elements, templates)));
        });
    });

  });

  describe('Actions', () => {

    describe('AddPage and Seo Attributes', () => {

      describe('Add a new page without SEO attributes', () => {

        defaultTemplates.map(template => template.code).forEach(template =>
            it([Tag.GTS, 'ENG-2278'], `Add ${template} template`, () => {
              cy.wrap({
                code: generateRandomId(),
                title: generateRandomId()
              }).then(testPage =>
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openManagement())
                    .then(page => page.getContent().openAddPagePage())
                    .then(page => page.getContent().getTitleInput('en').then(input => page.getContent().type(input, testPage.title)))
                    .then(page => page.getContent().selectSeoLanguage(1))
                    .then(page => page.getContent().getTitleInput('it').then(input => page.getContent().type(input, generateRandomId())))
                    .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, testPage.code)))
                    .then(page => page.getContent().selectPageOnPageTreeTable(0))
                    .then(page => page.getContent().selectOwnerGroup('Administrators'))
                    .then(page => page.getContent().getPageTemplateSelect().then(select => page.getContent().select(select, template)))
                    .then(page => page.getContent().clickSaveButton())
                    .then(page => validatePageCreation(page, testPage)));
            }));

      });

      describe('Add a new page with SEO Attributes', () => {

        defaultTemplates.map(template => template.code).forEach(template =>
            it([Tag.GTS, 'ENG-2278'], `Add ${template} template`, () => {
              cy.wrap({
                code: generateRandomId(),
                title: generateRandomId()
              }).then(testPage =>
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openManagement())
                    .then(page => page.getContent().openAddPagePage())
                    .then(page => page.getContent().getTitleInput('en').then(input => page.getContent().type(input, testPage.title)))
                    .then(page => page.getContent().getSeoDescriptionInput('en').then(input => page.getContent().type(input, generateRandomId())))
                    .then(page => page.getContent().getSeoKeywordsInput('en').then(input => page.getContent().type(input, generateRandomId())))
                    .then(page => page.getContent().getSeoFriendlyCodeInput('en').then(input => page.getContent().type(input, generateRandomId())))
                    .then(page => cy.wrap(['name', 'http-equiv', 'property']).each(metaTag => {
                      page.getContent().getMetaKeyInput().then(input => page.getContent().type(input, generateRandomId()));
                      page.getContent().getMetaTypeSelect().then(select => page.getContent().select(select, metaTag));
                      page.getContent().getMetaValueInput().then(input => page.getContent().type(input, generateRandomId()));
                      page.getContent().clickMetaTagAddButton();
                    }).then(() => page))
                    .then(page => page.getContent().selectSeoLanguage(1))
                    .then(page => page.getContent().getTitleInput('it').then(input => page.getContent().type(input, testPage.title)))
                    .then(page => page.getContent().getSeoDescriptionInput('it').then(input => page.getContent().type(input, generateRandomId())))
                    .then(page => page.getContent().getSeoKeywordsInput('it').then(input => page.getContent().type(input, generateRandomId())))
                    .then(page => page.getContent().getSeoFriendlyCodeInput('it').then(input => page.getContent().type(input, generateRandomId())))
                    .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, testPage.code)))
                    .then(page => page.getContent().selectPageOnPageTreeTable(0))
                    .then(page => page.getContent().selectOwnerGroup('Administrators'))
                    .then(page => page.getContent().getPageTemplateSelect().then(select => page.getContent().select(select, template)))
                    .then(page => page.getContent().clickSaveButton())
                    .then(page => validatePageCreation(page, testPage)));
            }));

      });

      it([Tag.GTS, 'ENG-2278'], 'Add a new child page', () => {
        cy.fixture('data/demoPage.json').then(demoPage => {
          demoPage.code = generateRandomId();
          cy.seoPagesController().then(controller => controller.addNewPage(demoPage));
          cy.unshiftAlias('@pagesToBeDeleted', demoPage.code);
          cy.wrap({
            code: generateRandomId(),
            title: generateRandomId()
          }).then(testPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openManagement())
                .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().openAdd())
                .then(page => page.getContent().getTitleInput('en').then(input => page.getContent().type(input, testPage.title)))
                .then(page => page.getContent().selectSeoLanguage(1))
                .then(page => page.getContent().getTitleInput('it').then(input => page.getContent().type(input, generateRandomId())))
                .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, testPage.code)))
                .then(page => page.getContent().selectOwnerGroup('Administrators'))
                .then(page => page.getContent().getPageTemplateSelect().then(select => page.getContent().select(select, demoPage.pageModel)))
                .then(page => page.getContent().clickSaveButton())
                .then(page => {
                  cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                  page.getContent().getTableRow(demoPage.titles.en).find(`${htmlElements.i}.fa`).eq(2)
                      .should('have.class', 'fa-folder').and('not.have.class', 'fa-folder-o');
                  page.getContent().getTableRow(testPage.title).should('not.exist');
                  page.getContent().toggleRowSubPages(demoPage.titles.en);
                })
                .then(page => page.getContent().getTableRow(testPage.title).find(`${htmlElements.i}.fa`).eq(2)
                                  .should('have.class', 'fa-folder-o').and('not.have.class', 'fa-folder'))
          );
        });
      });

      const validatePageCreation = (page, testPage) => {
        cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
        cy.validateToast(page);
        page.getContent().getTableRow(testPage.title).should('exist');
      };

    });

    describe('Add page validations', () => {

      it([Tag.GTS, 'ENG-2278'], 'Adding a new page with non existing parent code is forbidden', () => {
        cy.visit('/page/add?parentCode=non-existing-pageCode');
        cy.location().should(url => {
          expect(url.pathname).eq('/app-builder/page/add');
          expect(url.search).eq('');
        });
      });

      it([Tag.GTS, 'ENG-2278'], 'Adding a new page with empty fields is forbidden', () => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openManagement())
          .then(page => page.getContent().openAddPagePage())
          .then(page => {
            page.getContent().getSaveAndDesignButton().should('be.disabled');
            page.getContent().getSaveButton().should('be.disabled');
          });
      });

      it([Tag.GTS, 'ENG-2278'], 'Adding a new page without mandatory fields is forbidden', () => {
        cy.wrap({
          code: generateRandomId(),
          title: generateRandomId()
        }).then(testPage =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openManagement())
              .then(page => page.getContent().openAddPagePage())
              .then(page => page.getContent().getTitleInput('en').then(input => page.getContent().type(input, testPage.title)))
              .then(page => page.getContent().selectSeoLanguage(1))
              .then(page => page.getContent().getTitleInput('it').then(input => page.getContent().type(input, generateRandomId())))
              .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, testPage.code)))
              .then(page => page.getContent().selectPageOnPageTreeTable(0))
              .then(page => page.getContent().selectOwnerGroup('Administrators'))
              .then(page => page.getContent().getPageTemplateSelect().then(select => page.getContent().select(select, '1-column')))
              .then(page => {
                page.getContent().getSaveAndDesignButton().should('not.be.disabled');
                page.getContent().getSaveButton().should('not.be.disabled');
                page.getContent().getCodeInput().then(input => page.getContent().clear(input));
              })
              .then(page => {
                page.getContent().getSaveAndDesignButton().should('be.disabled');
                page.getContent().getSaveButton().should('be.disabled');
              }));
      });

      it([Tag.GTS, 'ENG-2278', 'ENG-3918'], 'Adding a new page with existing code is forbidden', () => {
        cy.fixture('data/demoPage.json').then(demoPage => {
          demoPage.code = generateRandomId();
          cy.seoPagesController().then(controller => controller.addNewPage(demoPage));
          cy.unshiftAlias('@pagesToBeDeleted', demoPage.code);
          cy.get('@currentPage')
            .then(page => page.getMenu().getPages().open().openManagement())
            .then(page => page.getContent().openAddPagePage())
            .then(page => page.getContent().getTitleInput('en').then(input => page.getContent().type(input, generateRandomId())))
            .then(page => page.getContent().selectSeoLanguage(1))
            .then(page => page.getContent().getTitleInput('it').then(input => page.getContent().type(input, generateRandomId())))
            .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, demoPage.code)))
            .then(page => page.getContent().selectPageOnPageTreeTable(0))
            .then(page => page.getContent().selectOwnerGroup('Administrators'))
            .then(page => page.getContent().getPageTemplateSelect().then(select => page.getContent().select(select, '1-column')))
            .then(page => page.getContent().clickSaveButton())
            .then(page => {
              cy.validateToast(page, demoPage.code, false);
              page.getContent().getAlertMessage()
                  .should('be.visible')
                  .and('contain', demoPage.code);
            });
        });
      });

    });

    describe('Operations on existing page', () => {

      beforeEach(() => {
        cy.fixture('data/demoPage.json').then(demoPage => {
          demoPage.code = generateRandomId();
          cy.seoPagesController().then(controller => controller.addNewPage(demoPage));
          cy.unshiftAlias('@pagesToBeDeleted', demoPage.code);
        });
      });

      describe('Search a page', () => {

        it([Tag.GTS, 'ENG-2175'], 'Search by name', () => {
          cy.fixture('data/demoPage.json').then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openManagement())
                .then(page => page.getContent().selectSearchOption(0))
                .then(page => page.getContent().getSearchInput().then(input => page.getContent().type(input, demoPage.titles.en)))
                .then(page => page.getContent().clickSearchButton('name', demoPage.titles.en))
                .then(page => page.getContent().getSearchTableRows()
                                  .each(row => cy.wrap(row).children(htmlElements.td).eq(2).should('contain', demoPage.titles.en))));
        });

        it([Tag.GTS, 'ENG-2175'], 'Search by code', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(pageCode =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openManagement())
                .then(page => page.getContent().selectSearchOption(1))
                .then(page => page.getContent().getSearchInput().then(input => page.getContent().type(input, pageCode)))
                .then(page => page.getContent().clickSearchButton('code', pageCode))
                .then(page => page.getContent().getSearchTableRows().should('have.length', 1)
                                  .each(row => cy.wrap(row).children(htmlElements.td).eq(0).should('contain', pageCode))));
        });

      });

      describe('Update a page', () => {

        //FIXME this is not a real test case, it's covered by the following one
        xit([Tag.GTS, 'ENG-2483'], 'with an owner not compatible with the users', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(pageCode =>
              cy.fixture('data/demoPage.json').then(demoPage =>
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openManagement())
                    .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().openEdit(pageCode))
                    .then(page => page.getContent().getOwnerGroupButton().should('be.disabled'))));
        });

        it([Tag.GTS, 'ENG-2483'], 'Change a page\'s owner group - not allowed', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(pageCode =>
              cy.fixture('data/demoPage.json').then(demoPage =>
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openManagement())
                    .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().openEdit(pageCode))
                    .then(page => {
                      page.getContent().getOwnerGroupButton().should('be.disabled');
                      page.getContent().getOwnerGroupButton().click({force: true});
                      page.getContent().getOwnerGroupDropdown().should('not.exist');
                    })));
        });

        //TODO move the creation and deletion of the language outside of test
        //FIXME it adds the page title, not the page code
        it('ENG-2695', 'when adding secondary language, editing a page automatically adds default page code from default language (ENG-2695)', () => {
          cy.languagesController()
            .then(controller => controller.putLanguage('cs', 'Czech', true, false));
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(pageCode =>
              cy.fixture('data/demoPage.json').then(demoPage =>
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openManagement())
                    .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().openEdit(pageCode))
                    .then(page => {
                      page.getContent().getTitleInput('en').invoke('val').should('eq', demoPage.titles.en);
                      page.getContent().selectSeoLanguage(1);
                    })
                    .then(page => page.getContent().getTitleInput('cs').invoke('val').should('eq', demoPage.titles.en))));
          cy.languagesController()
            .then(controller => controller.putLanguage('cs', 'Czech', false, false));
        });

        it(['ENG-2642', 'ENG-4283'], 'Avoid accept blank page titles in an inactive language tab', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(pageCode =>
              cy.fixture('data/demoPage.json').then(demoPage =>
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openManagement())
                    .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().openEdit(pageCode))
                    .then(page => {
                      page.getContent().getTitleInput('en').should('have.value', demoPage.titles.en);
                      page.getContent().getTitleInput('en').then(input => page.getContent().clear(input));
                    }).then(page => page.getContent().selectSeoLanguage(1))
                    .then(page => page.getContent().getTitleInput('it').then(input => page.getContent().type(input, `${demoPage.titles.en}_1`)))
                    .then(page => {
                      page.getContent().getSaveButton().should('be.disabled');
                      page.getContent().getSaveAndDesignButton().should('be.disabled');
                    })));
        });

      });

      describe('Change page position in the page tree', () => {

        it([Tag.GTS, 'ENG-2486'], 'Move outside page', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(parentPageCode =>
              cy.fixture('data/demoPage.json').then(parentPage =>
                  cy.fixture('data/demoPage.json').then(testPage => {
                    testPage.code       = generateRandomId();
                    testPage.titles.en  = generateRandomId();
                    testPage.parentCode = parentPageCode;
                    cy.seoPagesController().then(controller => controller.addNewPage(testPage));
                    cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                    cy.get('@currentPage')
                      .then(page => page.getMenu().getPages().open().openManagement())
                      .then(page => page.getContent().toggleRowSubPages(parentPage.titles.en))
                      .then(page => page.getContent().dragRow(testPage.titles.en, 'Home', 'center'))
                      .then(page => page.getDialog().confirm())
                      .then(page => {
                        page.getContent().getTableRow(parentPage.titles.en).find(`${htmlElements.i}.fa`).eq(2)
                            .should('have.class', 'fa-folder-o').and('not.have.class', 'fa-folder');
                        page.getContent().getTableRow(testPage.titles.en).find(`${htmlElements.i}.fa`).eq(2)
                            .should('have.class', 'fa-folder-o').and('not.have.class', 'fa-folder');
                      });
                  })));
        });

        it([Tag.GTS, 'ENG-2486'], 'Move inside page', () => {
          cy.fixture('data/demoPage.json').then(parentPage =>
              cy.fixture('data/demoPage.json').then(testPage => {
                testPage.code      = generateRandomId();
                testPage.titles.en = generateRandomId();
                cy.seoPagesController().then(controller => controller.addNewPage(testPage));
                cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                cy.get('@currentPage')
                  .then(page => page.getMenu().getPages().open().openManagement())
                  .then(page => page.getContent().dragRow(testPage.titles.en, parentPage.titles.en, 'center'))
                  .then(page => page.getDialog().confirm())
                  .then(page => page.getContent().toggleRowSubPages(parentPage.titles.en))
                  //FIXME the folder has to be clicked twice in order to close it
                  .then(page => page.getContent().toggleRowSubPages(parentPage.titles.en))
                  .then(page => checkPagesRelation(page, parentPage, testPage));
              }));
        });

        it([Tag.GTS, 'ENG-2486'], 'Move inside subpages is forbidden', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(parentPageCode =>
              cy.fixture('data/demoPage.json').then(parentPage =>
                  cy.fixture('data/demoPage.json').then(testPage => {
                    testPage.code       = generateRandomId();
                    testPage.titles.en  = generateRandomId();
                    testPage.parentCode = parentPageCode;
                    cy.seoPagesController().then(controller => controller.addNewPage(testPage));
                    cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                    cy.get('@currentPage')
                      .then(page => page.getMenu().getPages().open().openManagement())
                      .then(page => page.getContent().toggleRowSubPages(parentPage.titles.en))
                      .then(page => page.getContent().dragRow(parentPage.titles.en, testPage.titles.en, 'center'))
                      .then(page => page.getDialog().confirm())
                      .then(page => {
                        cy.validateToast(page, parentPageCode, false);
                        page.getContent().toggleRowSubPages(parentPage.titles.en);
                      })
                      .then(page => checkPagesRelation(page, parentPage, testPage));
                  })));
        });

        it([Tag.GTS, 'ENG-2486'], 'Move free pages inside reserved pages is forbidden', () => {
          cy.fixture('data/demoPage.json').then(parentPage =>
              cy.fixture('data/demoPage.json').then(testPage => {
                testPage.code       = generateRandomId();
                testPage.titles.en  = generateRandomId();
                testPage.ownerGroup = 'free';
                cy.seoPagesController().then(controller => controller.addNewPage(testPage));
                cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                cy.get('@currentPage')
                  .then(page => page.getMenu().getPages().open().openManagement())
                  .then(page => page.getContent().dragRow(testPage.titles.en, parentPage.titles.en, 'center'))
                  .then(page => page.getDialog().confirm())
                  .then(page => checkHasNoSubPages(page, parentPage));
              }));
        });

        it([Tag.GTS, 'ENG-2486'], 'Move published pages inside unpublished pages is forbidden', () => {
          cy.fixture('data/demoPage.json').then(parentPage =>
              cy.fixture('data/demoPage.json').then(testPage => {
                testPage.code      = generateRandomId();
                testPage.titles.en = generateRandomId();
                cy.seoPagesController().then(controller => controller.addNewPage(testPage));
                cy.pagesController().then(controller => controller.setPageStatus(testPage.code, 'published'));
                cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                cy.get('@currentPage')
                  .then(page => page.getMenu().getPages().open().openManagement())
                  .then(page => page.getContent().dragRow(testPage.titles.en, parentPage.titles.en, 'center'))
                  .then(page => page.getDialog().confirm())
                  .then(page => checkHasNoSubPages(page, parentPage));
              }));
        });

        it([Tag.SANITY, 'ENG-4242'], 'When moving a page in a new position in the page tree, the position is retained when refreshing the browser page', () => {
          cy.fixture('data/demoPage.json').then(firstPage => {
            cy.fixture('data/demoPage.json').then(secondPage => {
              secondPage.code      = generateRandomId();
              secondPage.titles.en = generateRandomId();
              cy.seoPagesController().then(controller => controller.addNewPage(secondPage));
              cy.pushAlias('@pagesToBeDeleted', secondPage.code);
              cy.get('@pagesToBeDeleted').then(pages => cy.pagesController().then(controller => controller.intercept({method: 'PUT'}, 'pageMovedPUT', `/${pages[0]}/position`)));
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openManagement())
                .then(page => page.getContent().dragRow(firstPage.titles.en, secondPage.titles.en, 'bottom'))
                .then(page => page.getDialog().confirm())
                .then(page => {
                  cy.wait('@pageMovedPUT');
                  checkPagesRelativePosition(secondPage, firstPage);
                  page.getContent().reloadPage();
                  checkPagesRelativePosition(secondPage, firstPage);
                });
            });
          });
        });

        it([Tag.SANITY, 'ENG-4242'], 'When moving a child page from a parent page to another parent page, the position is retained when refreshing the browser page', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(parentPageCode =>
            cy.fixture('data/demoPage.json').then(parentPage =>
                cy.fixture('data/demoPage.json').then(childPage => {
                  childPage.code       = generateRandomId();
                  childPage.titles.en  = generateRandomId();
                  childPage.parentCode = parentPageCode;
                  cy.seoPagesController().then(controller => controller.addNewPage(childPage));
                  cy.unshiftAlias('@pagesToBeDeleted', childPage.code);
                  cy.get('@pagesToBeDeleted').then(pages => cy.pagesController().then(controller => controller.intercept({method: 'PUT'}, 'pageMovedPUT', `/${pages[0]}/position`)));
                  cy.fixture('data/demoPage.json').then(testParentPage => {
                    testParentPage.code      = generateRandomId();
                    testParentPage.titles.en = generateRandomId();
                    cy.seoPagesController().then(controller => controller.addNewPage(testParentPage));
                    cy.pushAlias('@pagesToBeDeleted', testParentPage.code);
                    cy.get('@currentPage')
                      .then(page => page.getMenu().getPages().open().openManagement())
                      .then(page => page.getContent().toggleRowSubPages(parentPage.titles.en))
                      .then(page => page.getContent().dragRow(childPage.titles.en, testParentPage.titles.en, 'center'))
                      .then(page => page.getDialog().confirm())
                      .then(page => {
                        cy.wait('@pageMovedPUT');
                        page.getContent().getTableRow(parentPage.titles.en).find(`${htmlElements.i}.fa`).eq(2)
                            .should('have.class', 'fa-folder-o').and('not.have.class', 'fa-folder');
                        page.getContent().getTableRow(testParentPage.titles.en).find(`${htmlElements.i}.fa`).eq(2)
                            .should('have.class', 'fa-folder').and('not.have.class', 'fa-folder-o');
                        checkPagesRelativePosition(testParentPage, childPage);
                        page.getContent().reloadPage();
                        checkPagesRelation(page, testParentPage, childPage);
                        checkPagesRelativePosition(testParentPage, childPage);
                      });
                  });
                })
          ));
        });

        describe('User with "Free Access group" permission', () => {

          beforeEach(() => {
            cy.kcTokenLogout();
            cy.kcClientCredentialsLogin();
            cy.fixture('users/details/user').then(user => {
              cy.usersController().then(controller => {
                controller.addUser(user);
                controller.updateUser(user);
                controller.addAuthorities(user.username, 'free', 'admin');
              });
              cy.kcAuthorizationCodeLogin('login/user');
              cy.userPreferencesController().then(controller => {
                // FIXME the userPreferences are not immediately available after user creation, but are immediately created on GET
                controller.getUserPreferences(user.username);
                controller.updateUserPreferences(user.username, {wizard: false});
              });
              cy.kcTokenLogout();
            })
          });

          afterEach(() => {
            //FIXME deleted user, when re-created, retain user preferences
            cy.fixture('users/details/user').then(user =>
              cy.userPreferencesController().then(controller => controller.resetUserPreferences(user.username)));
            cy.kcTokenLogout();
            cy.kcClientCredentialsLogin();
            cy.fixture('users/details/user')
              .then(user => cy.usersController().then(controller => {
                controller.deleteUser(user.username);
                controller.deleteAuthorities(user.username);
              }));
          });

          it([Tag.SANITY, 'ENG-4242'], 'When a user with "Free Access group" moves a "Free Access group" page from the top of the page tree to the bottom, and the second page in the page tree is a "Administrator group" page, the position is retained after refreshing the page', () => {
            cy.kcClientCredentialsLogin();
            cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(administratorPageCode =>
              cy.fixture('data/demoPage.json').then(administratorPage => {
                cy.pagesController().then(controller => controller.movePage(administratorPageCode, administratorPage.parentCode, 1));
                cy.fixture('data/demoPage.json').then(freePage => {
                  freePage.code       = generateRandomId();
                  freePage.titles.en  = generateRandomId();
                  freePage.ownerGroup = 'free';
                  cy.seoPagesController().then(controller => controller.addNewPage(freePage));
                  cy.unshiftAlias('@pagesToBeDeleted',freePage.code);
                  cy.pagesController().then(controller => controller.movePage(freePage.code, freePage.parentCode, 1));
                  cy.kcTokenLogout();
                  cy.kcAuthorizationCodeLoginAndOpenDashboard('login/user');
                  cy.pagesController().then(controller => controller.intercept({method: 'PUT'}, 'pageMovedPUT', `/${freePage.code}/position`));
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openManagement())
                    .then(page => {
                      page.getContent().getPageNameFromIndex(-1).then(lastPage => cy.wrap(lastPage.text()).as('lastPage'));
                      cy.get('@lastPage').then(lastPage => page.getContent().dragRow(freePage.titles.en, lastPage, 'bottom'));
                    })
                    .then(page => page.getDialog().confirm())
                    .then(page => {
                      cy.wait('@pageMovedPUT');
                      cy.get('@lastPage').then(lastPage => {
                        checkPagesRelativePosition({titles: {en: lastPage}}, freePage);
                        page.getContent().reloadPage();
                        checkPagesRelativePosition({titles: {en: lastPage}}, freePage);
                      })
                    })
                })
              })
            )
          });

        });

        const checkPagesRelativePosition = (higherPage, lowerPage) => {
          cy.get('@currentPage')
            .then(page =>
              page.getContent().getTableRow(higherPage.titles.en).invoke('index').then(higherPageIndex => {
                page.getContent().getTableRow(lowerPage.titles.en).invoke('index').should('eq', higherPageIndex + 1);
              })
            );
        }

        const checkPagesRelation = (currentPage, parentPage, testPage) => {
          cy.wrap(currentPage)
            .then(page => {
              page.getContent().getTableRow(parentPage.titles.en).find(`${htmlElements.i}.fa`).eq(2)
                  .should('have.class', 'fa-folder').and('not.have.class', 'fa-folder-o');
              page.getContent().getTableRow(testPage.titles.en).should('not.exist');
              page.getContent().toggleRowSubPages(parentPage.titles.en);
            })
            .then(page => page.getContent().getTableRow(testPage.titles.en).find(`${htmlElements.i}.fa`).eq(2)
                              .should('have.class', 'fa-folder-o').and('not.have.class', 'fa-folder'));
        };

        const checkHasNoSubPages = (currentPage, parentPage) => {
          cy.wrap(currentPage)
            .then(page => {
              cy.validateToast(page, null, false);
              page.getContent().getTableRow(parentPage.titles.en).find(`${htmlElements.i}.fa`).eq(2)
                  .should('have.class', 'fa-folder-o').and('not.have.class', 'fa-folder');
            });
        };

      });

      describe('Change page status', () => {

        it([Tag.GTS, 'ENG-2485'], 'Publish a page', () => {
          cy.fixture('data/demoPage.json').then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openManagement())
                .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().clickPublish())
                .then(page => page.getDialog().confirm())
                .then(page => page.getContent().getTableRow(demoPage.titles.en).then(row =>
                    cy.wrap(row).children(htmlElements.td).eq(2).children(htmlElements.i)
                      .should('have.attr', 'title')
                      .and('equal', 'Published')
                )));
        });

        it([Tag.GTS, 'ENG-2485'], 'Unpublish a page', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0])
            .then(demoPageCode => cy.pagesController().then(controller => controller.setPageStatus(demoPageCode, 'published')));
          cy.fixture('data/demoPage.json').then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openManagement())
                .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().clickUnpublish())
                .then(page => page.getDialog().confirm())
                .then(page => page.getContent().getTableRow(demoPage.titles.en).then(row =>
                    cy.wrap(row).children(htmlElements.td).eq(2).children(htmlElements.i)
                      .should('have.attr', 'title')
                      .and('equal', 'Unpublished'))));
        });

        it([Tag.GTS, 'ENG-2485'], 'Publish a subpage of an unpublished page is forbidden', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(parentPageCode =>
              cy.fixture('data/demoPage.json').then(parentPage =>
                  cy.fixture('data/demoPage.json').then(testPage => {
                    testPage.code       = generateRandomId();
                    testPage.titles.en  = generateRandomId();
                    testPage.parentCode = parentPageCode;
                    cy.seoPagesController().then(controller => controller.addNewPage(testPage));
                    cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                    cy.get('@currentPage')
                      .then(page => page.getMenu().getPages().open().openManagement())
                      .then(page => page.getContent().toggleRowSubPages(parentPage.titles.en))
                      .then(page => page.getContent().getKebabMenu(testPage.titles.en).getPublish().should('have.class', 'disabled'));
                  })));
        });

        it([Tag.GTS, 'ENG-2485'], 'Unpublish a page with published children is forbidden', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(parentPageCode =>
              cy.fixture('data/demoPage.json').then(parentPage =>
                  cy.fixture('data/demoPage.json').then(testPage => {
                    testPage.code       = generateRandomId();
                    testPage.titles.en  = generateRandomId();
                    testPage.parentCode = parentPageCode;
                    cy.seoPagesController().then(controller => controller.addNewPage(testPage));
                    cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                    cy.pagesController().then(controller => {
                      controller.setPageStatus(parentPageCode, 'published');
                      controller.setPageStatus(testPage.code, 'published');
                    });
                    cy.get('@currentPage')
                      .then(page => page.getMenu().getPages().open().openManagement())
                      .then(page => page.getContent().getKebabMenu(parentPage.titles.en).getUnpublish().should('have.class', 'disabled'));
                  })));
        });

        describe('Non admin user', () => {

          beforeEach(() => {
            cy.kcTokenLogout();
            cy.wrap({code: generateRandomId(), name: generateRandomId()}).as('groupToBeDeleted').then(group => {
              cy.groupsController().then(controller => controller.addGroup(group.code, group.name));
              cy.fixture('users/details/user').then(userJSON => {
                cy.usersController().then(controller => {
                  controller.addUser(userJSON);
                  controller.updateUser(userJSON);
                  controller.addAuthorities(userJSON.username, group.code, 'approver');
                });
                cy.kcAuthorizationCodeLogin('login/user');
                cy.userPreferencesController().then(controller => {
                  // FIXME the userPreferences are not immediately available after user creation, but are immediately created on GET
                  controller.getUserPreferences(userJSON.username);
                  controller.updateUserPreferences(userJSON.username, {wizard: false});
                });
              });
            });
            cy.visit('/').then(() => HomePage.openPage());
            cy.wrap(new HomePage()).as('currentPage');
          });

          afterEach(() => {
            cy.fixture('users/details/user').then(userJSON => {
              //FIXME deleted user, when re-created, retain user preferences
              cy.userPreferencesController().then(controller => controller.resetUserPreferences(userJSON.username));
              cy.usersController().then(controller => {
                controller.deleteAuthorities(userJSON.username);
                controller.deleteUser(userJSON.username);
              });
            });
            cy.get('@groupToBeDeleted').then(group => cy.groupsController().then(controller => controller.deleteGroup(group.code)));
          });

          it([Tag.GTS, 'ENG-2485'], 'Unpublish a page without permission', () => {
            cy.fixture('data/demoPage.json').then(demoPage =>
                cy.get('@currentPage')
                  .then(page => page.getMenu().getPages().open().openManagement())
                  .then(page => page.getContent().getTableRows().should('not.contain', demoPage.titles.en)));
          });

        });

      });

      describe('Delete a page', () => {

        it([Tag.GTS, 'ENG-2484'], 'Delete an unpublished page', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(demoPageCode =>
              cy.fixture('data/demoPage.json').then(demoPage =>
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openManagement())
                    .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().clickDelete())
                    .then(page => {
                      page.getDialog().getBody().getStateInfo().should('contain', demoPageCode);
                      page.getDialog().confirm();
                    })
                    .then(page => {
                      page.getContent().getTableRows().should('not.contain', demoPage.titles.en);
                      cy.deleteAlias('@pagesToBeDeleted', demoPageCode);
                    })));
        });

        it([Tag.GTS, 'ENG-2484'], 'Delete a published page is forbidden', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0])
            .then(demoPageCode => cy.pagesController().then(controller => controller.setPageStatus(demoPageCode, 'published')));
          cy.fixture('data/demoPage.json').then(demoPage => cy.get('@currentPage').then(page => checkDeleteIsDisabled(page, demoPage.titles.en)));
        });

        it([Tag.GTS, 'ENG-2484'], 'Delete a drafted page is forbidden', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0])
            .then(demoPageCode => {
              cy.pagesController().then(controller => controller.setPageStatus(demoPageCode, 'published'));
              cy.pageWidgetsController(demoPageCode).then(controller => controller.addWidget(0, 'search_form'));
            });
          cy.fixture('data/demoPage.json').then(demoPage => cy.get('@currentPage').then(page => checkDeleteIsDisabled(page, demoPage.titles.en)));
        });

        it([Tag.GTS, 'ENG-2484'], 'Delete a page with children is forbidden', () => {
          cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(parentPageCode =>
              cy.fixture('data/demoPage.json').then(parentPage => {
                cy.fixture('data/demoPage.json').then(testPage => {
                  testPage.code       = generateRandomId();
                  testPage.titles.en  = generateRandomId();
                  testPage.parentCode = parentPageCode;
                  cy.seoPagesController().then(controller => controller.addNewPage(testPage));
                  cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                });
                cy.get('@currentPage').then(page => checkDeleteIsDisabled(page, parentPage.titles.en));
              }));
        });

        const checkDeleteIsDisabled = (currentPage, pageTitle) => {
          cy.wrap(currentPage)
            .then(page => page.getMenu().getPages().open().openManagement())
            .then(page => page.getContent().getKebabMenu(pageTitle).getDelete().should('have.class', 'disabled'));
        };

      });

    });

    describe('Form Validations', () => {

      describe('Page form should be not possible to save NULL title in default language', () => {

        //FIXME duplicate of 'when adding secondary language, editing a page automatically adds default page code from default language (ENG-2695)'
        xit('ENG-2687', 'There must be a page title for default language, otherwise it will not allow to save', () => {
          cy.fixture('data/demoPage.json').then(demoPage => {
            demoPage.code = generateRandomId();
            cy.seoPagesController().then(controller => controller.addNewPage(demoPage));
            cy.unshiftAlias('@pagesToBeDeleted', demoPage.code);
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openManagement())
              .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().openEdit(demoPage.code))
              .then(page => {
                page.getContent().getTitleInput('en').should('have.value', demoPage.titles.en);
                page.getContent().getTitleInput('en').then(input => page.getContent().clear(input));
              }).then(page => page.getContent().selectSeoLanguage(1))
              .then(page => {
                page.getContent().getSaveButton().should('be.disabled');
                page.getContent().getSaveAndDesignButton().should('be.disabled');
              });
          });
        });

        //FIXME duplicate of 'Add a new page without SEO attributes' > 'Add 1-2-column template'
        xit('ENG-2687', 'Adding a title from default language without other languages will be allowed to save', () => {
          cy.wrap({
            code: generateRandomId(),
            title: generateRandomId()
          }).then(testPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openManagement())
                .then(page => page.getContent().openAddPagePage())
                .then(page => page.getContent().getTitleInput('en').then(input => page.getContent().type(input, testPage.title)))
                .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, testPage.code)))
                .then(page => page.getContent().selectPageOnPageTreeTable(0))
                .then(page => page.getContent().selectOwnerGroup('Administrators'))
                .then(page => page.getContent().getPageTemplateSelect().then(select => page.getContent().select(select, '1-2-column')))
                .then(page => {
                  page.getContent().getSaveAndDesignButton().should('not.be.disabled');
                  page.getContent().getSaveButton().should('not.be.disabled');
                }));
        });

      });

      describe('Clone a page', () => {

        beforeEach(() => {
          cy.wrap({
            seoDataByLang: {
              en: {
                description: generateRandomId(),
                keywords: generateRandomId(),
                friendlyCode: generateRandomId(),
                inheritDescriptionFromDefaultLang: false,
                inheritFriendlyCodeFromDefaultLang: false,
                inheritKeywordsFromDefaultLang: false,
                metaTags: []
              },
              it: {
                description: generateRandomId(),
                keywords: generateRandomId(),
                friendlyCode: generateRandomId(),
                inheritDescriptionFromDefaultLang: false,
                inheritFriendlyCodeFromDefaultLang: false,
                inheritKeywordsFromDefaultLang: false,
                metaTags: []
              }
            },
            useExtraDescriptions: false,
            useExtraTitles: false
          }).as('seoData').then(seoData =>
              cy.fixture('data/demoPage.json').then(demoPage => {
                demoPage.code    = generateRandomId();
                demoPage.seoData = seoData;
                cy.seoPagesController().then(controller => controller.addNewPage(demoPage));
                cy.unshiftAlias('@pagesToBeDeleted', demoPage.code);
              }));
        });

        it([Tag.GTS, 'ENG-2638'], 'Cloning a page should copy all SEO details to the new page', () => {
          cy.wrap({
            code: generateRandomId(),
            title: generateRandomId()
          }).then(testPage =>
              cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(demoPageCode =>
                  cy.fixture('data/demoPage.json').then(demoPage =>
                      cy.get('@currentPage')
                        .then(page => page.getMenu().getPages().open().openManagement())
                        .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().clickClone(demoPageCode))
                        .then(page => cy.validateUrlPathname(`/page/clone`).then(() => page))
                        .then(page => page.getContent().getTitleInput('en').then(input => page.getContent().type(input, testPage.title)))
                        .then(page => page.getContent().getTitleInput('it').then(input => page.getContent().type(input, generateRandomId())))
                        .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, testPage.code)))
                        .then(page => page.getContent().selectPagePlacement(0))
                        .then(page => page.getContent().clickSave())
                        .then(page => {
                          cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                          page.getContent().getKebabMenu(testPage.title).open().openEdit(testPage.code);
                        })
                        .then(page =>
                            cy.get('@seoData').then(seoData => {
                              page.getContent().getSeoDescriptionInput('en').should('have.value', seoData.seoDataByLang.en.description);
                              page.getContent().getSeoKeywordsInput('en').should('have.value', seoData.seoDataByLang.en.keywords);
                              page.getContent().getSeoFriendlyCodeInput('en').should('have.value', seoData.seoDataByLang.en.friendlyCode);
                            })))));
        });

        it([Tag.GTS, 'ENG-2638'], 'Cloning a page should copy all attached widgets to the new page', () => {
          cy.wrap({
            code: generateRandomId(),
            title: generateRandomId()
          }).then(testPage =>
              cy.get('@pagesToBeDeleted').then(pages => pages[0]).then(demoPageCode => {
                cy.pageWidgetsController(demoPageCode).then(controller => controller.addWidget(4, 'NWS_Archive', {}));
                cy.fixture('data/demoPage.json').then(demoPage =>
                    cy.get('@currentPage')
                      .then(page => page.getMenu().getPages().open().openManagement())
                      .then(page => page.getContent().getKebabMenu(demoPage.titles.en).open().clickClone(demoPageCode))
                      .then(page => cy.validateUrlPathname(`/page/clone`).then(() => page))
                      .then(page => page.getContent().getTitleInput('en').then(input => page.getContent().type(input, testPage.title)))
                      .then(page => page.getContent().getTitleInput('it').then(input => page.getContent().type(input, generateRandomId())))
                      .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, testPage.code)))
                      .then(page => page.getContent().selectPagePlacement(0))
                      .then(page => page.getContent().clickSave())
                      .then(page => {
                        cy.unshiftAlias('@pagesToBeDeleted', testPage.code);
                        page.getContent().getKebabMenu(testPage.title).open().openDesigner(testPage.code);
                      })
                      .then(page => page.getContent().getDesigner().contains('News Archive')));
              }));
        });

      });

    });

  });

});
