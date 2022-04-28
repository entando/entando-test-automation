import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage';

describe([Tag.GTS], 'Page Management', () => {

  const OOTB_PAGE_TEMPLATES = [
    {value: '1-2-column', text: '1-2 Columns'},
    {value: '1-2x2-1-column', text: '1-2x2-1 Columns'},
    {value: '1-2x4-1-column', text: '1-2x4-1 Columns'},
    {value: '1-column', text: '1 Column'},
    {value: 'content-page', text: 'Content Page'},
    {value: 'home', text: 'Home Page'},
    {value: 'single_frame_page', text: 'Single Frame Page'}
  ];


  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
    cy.languagesController().then(controller => controller.intercept({ method: 'GET' }, 'loadedLanguages', '?page=1&pageSize=0'));
    cy.pagesController().then(controller => controller.intercept({method: 'POST'}, 'clonedPage', '/**'));
    cy.seoPagesController().then(controller => controller.intercept({method: 'POST'}, 'addedNewPage'));
    cy.wrap(null).as('pageToBeDeleted');
    cy.wrap(null).as('subPageToBeDeleted');
  });

  afterEach(() => {
    cy.get('@subPageToBeDeleted').then(subPageToBeDeleted => {
      if (subPageToBeDeleted) {
        cy.pagesController()
          .then(controller => {
            controller.setPageStatus(subPageToBeDeleted, 'draft');
            controller.deletePage(subPageToBeDeleted);
          })
          .then(() => {
            subPage = {
              ownerGroup: {
                code: 'administrators',
                name: 'Administrators'
              },
              template: '1-2-column'
            };
          });
      }
    });

    cy.get('@pageToBeDeleted').then(pageToBeDeleted => {
      if (pageToBeDeleted) {
        cy.pagesController()
          .then(controller => {
            controller.setPageStatus(pageToBeDeleted, 'draft');
            controller.deletePage(pageToBeDeleted);
          })
          .then(() => {
            page = {
              pageTree: 0,
              parentCode: homePage.code,
              ownerGroup: {
                code: 'administrators',
                name: 'Administrators'
              },
              template: '1-2-column'
            };
          });
      }
    });

    cy.kcUILogout();
  });

    describe('UI', () => {

        it('Add page', () => {

          const OOTB_PAGE_TEMPLATES_TEXTS = OOTB_PAGE_TEMPLATES.map(template => template.text);
          OOTB_PAGE_TEMPLATES_TEXTS.unshift('Choose an option');

          currentPage = openManagementPage();
          currentPage = currentPage.getContent().openAddPagePage();
          cy.validateUrlPathname('/page/add');

          currentPage.getContent().openOwnerGroupMenu();

          currentPage.getContent().getOwnerGroupDropdown().children(htmlElements.li)
                     .should('have.length', OOTB_OWNER_GROUPS.length)
                     .then(elements => cy.validateListTexts(elements, OOTB_OWNER_GROUPS));

          currentPage.getContent().getPageTemplateSelect().children(htmlElements.option)
                     .should('have.length', 8)
                     .then(elements => cy.validateListTexts(elements, OOTB_PAGE_TEMPLATES_TEXTS));
        });

    });

    describe('AddPage and Seo Attributes',() => {

        beforeEach(() => {

          page.code     = generateRandomId();
          page.title    = {
            en: generateRandomId(),
            it: generateRandomId()
          };

          newPage.code       = page.code;
          newPage.titles     = {
            en: page.title.en
          };
          newPage.parentCode = homePage.code;

          page.seoData  = {
            en: {
              description: generateRandomId(),
              keywords: generateRandomId(),
              friendlyCode: generateRandomId()
            },
            it: {
              description: generateRandomId(),
              keywords: generateRandomId(),
              friendlyCode: generateRandomId()
            }
          };
          page.metaTags = [
            {
              key: generateRandomId(),
              type: 'name',
              value: generateRandomId()
            },
            {
              key: generateRandomId(),
              type: 'http-equiv',
              value: generateRandomId()
            },
            {
              key: generateRandomId(),
              type: 'property',
              value: generateRandomId()
            }
          ];

        });

        describe('Add a new page without SEO attributes', () => {

          OOTB_PAGE_TEMPLATES.map(template => template.value).forEach(template => {
            it(`Add ${template} template`, () => {
              page.template = template;
              currentPage   = openManagementPage();
              currentPage   = currentPage.getContent().openAddPagePage();
              cy.validateUrlPathname('/page/add');
              currentPage.getContent().getTitleInput('en').should('be.empty');

              addPageMandatoryData(currentPage, page);
              saveAndValidate(currentPage, page);
            });
          });
        });

        describe('Add a new page with SEO Attributes', () => {

          OOTB_PAGE_TEMPLATES.map(template => template.value).forEach(template => {
            it(`Add ${template} template`, () => {
              page.template = template;
              currentPage   = openManagementPage();
              currentPage   = currentPage.getContent().openAddPagePage();
              cy.validateUrlPathname('/page/add');
              currentPage.getContent().getTitleInput('en').should('be.empty');

              addPageMandatoryData(currentPage, page);
              addSeoData(currentPage, page.seoData);
              page.metaTags.forEach(metaTag => addMetaTag(currentPage, metaTag));

              saveAndValidate(currentPage, page);
            });
          });
        });

    });

    describe('Actions', () => {

        beforeEach(() => {

          page.code     = generateRandomId();
          page.title    = {
            en: generateRandomId(),
            it: generateRandomId()
          };

          newPage.code       = page.code;
          newPage.titles     = {
            en: page.title.en
          };
          newPage.parentCode = homePage.code;

          page.seoData  = {
            en: {
              description: generateRandomId(),
              keywords: generateRandomId(),
              friendlyCode: generateRandomId()
            },
            it: {
              description: generateRandomId(),
              keywords: generateRandomId(),
              friendlyCode: generateRandomId()
            }
          };
          page.metaTags = [
            {
              key: generateRandomId(),
              type: 'name',
              value: generateRandomId()
            },
            {
              key: generateRandomId(),
              type: 'http-equiv',
              value: generateRandomId()
            },
            {
              key: generateRandomId(),
              type: 'property',
              value: generateRandomId()
            }
          ];

        });


        it('Add a new child page', () => {

          subPage.code       = generateRandomId();
          subPage.title      = {
            en: generateRandomId(),
            it: generateRandomId()
          };

          subPage.parentCode = page.code;

          cy.seoPagesController()
            .then(controller => controller.addNewPage(newPage))
            .then(response => cy.wrap(response.body.payload.code).as('pageToBeDeleted'));

          currentPage = openManagementPage();
          currentPage = currentPage.getContent().getKebabMenu(page.title.en).open().openAdd();
          cy.validateUrlPathname('/page/add');

          currentPage.getContent().getTitleInput('en').should('be.empty');

          addPageMandatoryData(currentPage, subPage);
          currentPage        = currentPage.getContent().clickSaveButton();
          cy.wait('@addedNewPage').then(res => cy.wrap(res.response.body.payload.code).as('subPageToBeDeleted'));
          cy.wait('@loadedLanguages');

          checkPagesRelation(page.title.en, subPage.title.en);
        });

        it('Adding a new page with non existing parent code is forbidden', () => {
            openManagementPage();
            cy.visit('/page/add?parentCode=non-existing-page');

            cy.location().should(url => {
              expect(url.pathname).eq('/app-builder/page/add');
              expect(url.search).eq('');
            });
        });

        it('Adding a new page with empty fields is forbidden', () => {
            currentPage = openManagementPage();
            currentPage = currentPage.getContent().openAddPagePage();
            cy.validateUrlPathname('/page/add');

            currentPage.getContent().getSaveAndDesignButton().should('be.disabled');
            currentPage.getContent().getSaveButton().should('be.disabled');
        });

        it('Adding a new page without mandatory fields is forbidden', () => {
            currentPage = openManagementPage();
            currentPage = currentPage.getContent().openAddPagePage();
            cy.validateUrlPathname('/page/add');

            addPageMandatoryData(currentPage, page);
            currentPage.getContent().getSaveAndDesignButton().should('not.be.disabled');
            currentPage.getContent().getSaveButton().should('not.be.disabled');

            currentPage.getContent().clearCode();
            currentPage.getContent().getSaveAndDesignButton().should('be.disabled');
            currentPage.getContent().getSaveButton().should('be.disabled');
        });

        it('Adding a new page with existing code is forbidden', () => {
            currentPage = openManagementPage();
            currentPage = currentPage.getContent().openAddPagePage();
            cy.validateUrlPathname('/page/add');

            page.code = homePage.code;
            addPageMandatoryData(currentPage, page);
            currentPage.getContent().clickSaveButton();

            cy.validateToast(currentPage, page.code, false);
            currentPage.getContent().getAlertMessage()
                       .should('be.visible')
                       .and('contain', homePage.code);

        });
        describe('Search a page', () => {

            beforeEach(() => {
              currentPage = openManagementPage();
            });

            it('Search by name', () => {
              currentPage.getContent().selectSearchOption(0);
              currentPage.getContent().typeSearch(homePage.name);
              currentPage = currentPage.getContent().clickSearchButton();

              currentPage.getContent().getTableRows()
                         .should('have.length', 2)
                         .each(row => cy.wrap(row).children(htmlElements.td).eq(2).should('contain', homePage.name));
            });

            it('Search by code', () => {
              currentPage.getContent().selectSearchOption(1);
              currentPage.getContent().typeSearch(homePage.code);
              currentPage = currentPage.getContent().clickSearchButton();

              currentPage.getContent().getTableRows()
                         .should('have.length', 2)
                         .each(row => cy.wrap(row).children(htmlElements.td).eq(0).should('contain', homePage.code));
            });

          });
          describe('Update an existing page', () => {

            it('with an owner not compatible with the users', () => {
              currentPage = openManagementPage();

              currentPage = currentPage.getContent().getKebabMenu('Sitemap').open().openEdit();

              currentPage.getContent().getOwnerGroupButton().should('be.disabled');
            });

            it('Change a page\'s owner group - not allowed', () => {
              page.code  = generateRandomId();
              page.title = {
                en: generateRandomId(),
                it: generateRandomId()
              };

              newPage.code       = page.code;
              newPage.titles     = {
                en: page.title.en
              };
              newPage.parentCode = homePage.code;

              cy.seoPagesController()
                .then(controller => controller.addNewPage(newPage))
                .then(response => cy.wrap(response.body.payload.code).as('pageToBeDeleted'));

              currentPage = openManagementPage();
              currentPage = currentPage.getContent().getKebabMenu(page.title.en).open().openEdit();

              currentPage.getContent().getOwnerGroupButton().click({force: true});
              currentPage.getContent().getOwnerGroupDropdown().should('not.exist');
            });

            it('when adding secondary language, editing a page automatically adds default page code from default language (ENG-2695)', () => {
              page.code  = generateRandomId();
              page.title = {
                en: generateRandomId(),
                it: generateRandomId()
              };

              newPage.code       = page.code;
              newPage.titles     = {
                en: page.title.en
              };
              newPage.parentCode = homePage.code;

              cy.seoPagesController()
                .then(controller => controller.addNewPage(newPage))
                .then(response => cy.wrap(response.body.payload.code).as('pageToBeDeleted'));

              cy.languagesController()
                .then(controller => controller.putLanguage('cs', 'Czech', true, false));

              currentPage = openManagementPage();
              currentPage = currentPage.getContent().getKebabMenu(page.title.en).open().openEdit();
              currentPage.getContent().getTitleInput('en').invoke('val').should('eq', page.title.en);
              currentPage.getContent().selectSeoLanguage(1);
              currentPage.getContent().getTitleInput('cs').invoke('val').should('eq', page.title.en);

              cy.languagesController()
                .then(controller => controller.putLanguage('cs', 'Czech', false, false));
            });

            it('Avoid accept blank page titles in an inactive language tab (ENG-2642)', () => {
              page.code  = generateRandomId();
              page.title = {
                en: generateRandomId(),
                it: generateRandomId()
              };
              newPage.code       = page.code;
              newPage.titles     = {
                en: page.title.en,
                it: page.title.it
              };
              newPage.parentCode = homePage.code;
              cy.seoPagesController()
                .then(controller => controller.addNewPage(newPage))
                .then(response => cy.wrap(response.body.payload.code).as('pageToBeDeleted'));

              currentPage = openManagementPage();
              currentPage = currentPage.getContent().getKebabMenu(page.title.en).open().openEdit();
              currentPage.getContent().getTitleInput('en').should('have.value', page.title.en);
              currentPage.getContent().getTitleInput('en').clear();
              currentPage.getContent().selectSeoLanguage(1);
              currentPage.getContent().getTitleInput('it').clear().type(`${page.title.it}_1`);
              currentPage.getContent().getSaveButton().invoke('attr', 'disabled').should('eq', 'disabled');
              currentPage.getContent().getSaveAndDesignButton().invoke('attr', 'disabled').should('eq', 'disabled');
            });

        });

        describe('Change page position in the page tree', () => {


          beforeEach(() => {
            page.code  = generateRandomId();
            page.title = generateRandomId();

            newPage.code       = page.code;
            newPage.titles     = {
              en: page.title
            };
            newPage.parentCode = homePage.code;

            subPage.code  = generateRandomId();
            subPage.title = generateRandomId();

            addPage(page)
          });


         it('Move outside page', () => {

            addPage(subPage, page.code);

            currentPage = openManagementPage();

            checkIsParent(page.title.en);
            currentPage.getContent().toggleRowSubPages(page.title.en);
            checkPageIsLoaded(page.title.en);
            currentPage.getContent().dragRow(subPage.title.en, homePage.name, 'top');
            currentPage.getDialog().confirm();
            checkPageIsLoaded(subPage.title.en);
            checkIsNotParent(page.title.en);
            checkIsNotParent(subPage.title.en);
          });

          it('Move inside page', () => {
            addPage(subPage, homePage.code);
            currentPage = openManagementPage();
            checkIsNotParent(page.title.en);
            checkIsNotParent(subPage.title.en);
            currentPage = moveSubPageInPage();
            checkPageIsLoaded(subPage.title.en);
            currentPage.getContent().toggleRowSubPages(page.title.en);

            checkPagesRelation(page.title.en, subPage.title.en);
          });

          it('Move inside subpages is forbidden', () => {
            addPage(subPage, page.code);

            currentPage = openManagementPage();
            currentPage.getContent().toggleRowSubPages(page.title.en);
            checkPagesRelation(page.title.en, subPage.title.en);

            currentPage.getContent().dragRow(page.title.en, subPage.title.en, 'center');
            currentPage.getDialog().confirm();

            cy.validateToast(currentPage, null, false);

            currentPage.getContent().toggleRowSubPages(page.title.en);
            checkPagesRelation(page.title.en, subPage.title.en);
          });

          it('Move free pages inside reserved pages is forbidden', () => {
            subPage.ownerGroup = {code: 'free', name: 'Free Access'};

            addPage(subPage, homePage.code);

            currentPage = openManagementPage();
            currentPage = moveSubPageInPage();

            cy.validateToast(currentPage, null, false);

            checkIsNotParent(page.title.en);
            checkIsNotParent(subPage.title.en);
          });

          it('Move published pages inside unpublished pages is forbidden', () => {
            addPage(subPage, homePage.code);
            cy.pagesController().then(controller => controller.setPageStatus(subPage.code, 'published'));
            currentPage = openManagementPage();
            currentPage = moveSubPageInPage();

            cy.validateToast(currentPage, null, false);

            checkIsNotParent(page.title.en);
            checkIsNotParent(subPage.title.en);
          });

          const moveSubPageInPage  = () => {
            currentPage.getContent().dragRow(subPage.title.en, page.title.en, 'center');
            currentPage.getDialog().confirm();

            return currentPage;
          };

        });

        describe('Change page status', () => {

          beforeEach(() => addPage(page));

          it('Publish a page', () => {
            currentPage = openManagementPage();

            currentPage.getContent().getKebabMenu(page.title.en).open().clickPublish();
            currentPage.getDialog().confirm();

            currentPage.getContent().getTableRow(page.title.en).then(row =>
                cy.wrap(row).children(htmlElements.td).eq(2).children(htmlElements.i)
                  .should('have.attr', 'title')
                  .and('equal', 'Published')
            );
          });

          it('Unpublish a page', () => {
            cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));

            currentPage = openManagementPage();

            currentPage.getContent().getKebabMenu(page.title.en).open().clickUnpublish();
            currentPage.getDialog().confirm();

            currentPage.getContent().getTableRow(page.title.en).then(row =>
                cy.wrap(row).children(htmlElements.td).eq(2).children(htmlElements.i)
                  .should('have.attr', 'title')
                  .and('equal', 'Unpublished')
            );
          });

          it('Publish a subpage of an unpublished page is forbidden', () => {
           addPage(subPage, page.code);

            currentPage = openManagementPage();
            currentPage.getContent().toggleRowSubPages(page.title.en);
            checkPageIsLoaded(page.title.en);

            currentPage.getContent().getKebabMenu(subPage.title.en).getPublish()
                       .should('have.class', 'disabled');
          });

          it('Unpublish a page with published children is forbidden', () => {
           addPage(subPage, page.code);
            cy.pagesController().then(controller => {
              controller.setPageStatus(page.code, 'published');
              controller.setPageStatus(subPage.code, 'published');
            });

            currentPage = openManagementPage();
            currentPage.getContent().toggleRowSubPages(page.title.en);

            currentPage.getContent().getKebabMenu(page.title.en).getUnpublish()
                       .should('have.class', 'disabled');
          });
        });



        describe('Non admin user', () => {
          const groupCode = 'group1';
          const groupName = 'Group1';

          beforeEach(() => {
            // create group
            cy.groupsController().then(controller => {
              controller.addGroup(groupCode, groupName);
            });

            // add new user with no permission
            cy.fixture(`users/details/user`).then(userJSON =>
                cy.usersController().then(controller => {
                  controller.addUser(userJSON);
                  controller.updateUser(userJSON);
                  controller.addAuthorities(userJSON.username, groupCode, 'approver');
                })
            );
          });

          afterEach(() => {
            cy.kcLogout();
            cy.kcAPILogin();
            cy.kcUILogin('login/admin');

            cy.fixture(`users/details/user`).then(userJSON =>
                cy.usersController().then(controller => {
                  controller.deleteAuthorities(userJSON.username);
                  controller.deleteUser(userJSON.username);
                })
            );

            cy.groupsController().then(controller => {
              controller.deleteGroup(groupCode);
            });
          });

          it('Unpublish a page without permission', () => {
            addPage(page);
            cy.pagesController().then(controller => {
              controller.setPageStatus(page.code, 'published');
            });

            // login with unauthorized user
            cy.kcLogout();
            cy.kcUILogin('login/user');

            cy.visit('/');
            currentPage = new HomePage();
            currentPage = currentPage.getMenu().getPages().open();
            currentPage = currentPage.openManagement();

            // user should not be able to see the new page
            currentPage.getContent().getTableRows().should('not.contain', page.title.en);
          });
        });


        describe('Delete a page', () => {

          beforeEach(() => addPage(page));

          it('Delete an unpublished page', () => {
            currentPage = openManagementPage();

            currentPage.getContent().getKebabMenu(page.title.en).open().clickDelete();
            currentPage.getDialog().getBody().getStateInfo()
                       .should('contain', page.code);

            currentPage.getDialog().confirm();

            currentPage.getContent().getTableRows().should('not.contain', page.title.en);

            cy.wrap(null).as('pageToBeDeleted');
          });

          it('Delete a published page is forbidden', () => {
            cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));

            currentPage = openManagementPage();

            currentPage.getContent().getKebabMenu(page.title.en).getDelete()
                       .should('have.class', 'disabled');
          });

          it('Delete a drafted page is forbidden', () => {
            cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));
            cy.pageWidgetsController(page.code).then(controller => controller.addWidget(0, 'search_form'));

            currentPage = openManagementPage();
            currentPage = currentPage.getContent().getKebabMenu(page.title.en).open();
            currentPage.getDelete().should('have.class', 'disabled');
          });

          it('Delete a page with children is forbidden', () => {
           addPage(subPage, page.code);

            currentPage = openManagementPage();

            currentPage = currentPage.getContent().getKebabMenu(page.title.en).open();
            currentPage.getDelete().should('have.class', 'disabled');
          });

        });



        describe('Form Validations', () => {

            describe('Page form should be not possible to save NULL title in default language (ENG-2687)', () => {
              it('There must be a page title for default language, otherwise it will not allow to save', () => {
                addPage(page);

                currentPage = openManagementPage();
                currentPage = currentPage.getContent().getKebabMenu(page.title.en).open().openEdit();

                currentPage.getContent().getTitleInput('en').should('have.value', page.title.en);
                currentPage.getContent().getTitleInput('en').clear();
                currentPage.getContent().selectSeoLanguage(1);

                currentPage.getContent().getSaveAndDesignButton().should('be.disabled');
                currentPage.getContent().getSaveButton().should('be.disabled');
              });

              it('Adding a title from default language without other languages will be allowed to save', () => {
                page.code  = generateRandomId();
                page.title = generateRandomId();

                currentPage = openManagementPage();
                currentPage = currentPage.getContent().openAddPagePage();
                cy.validateUrlPathname('/page/add');
                cy.wait('@loadedLanguages');

                currentPage.getContent().selectSeoLanguage(0);
                currentPage.getContent().typeTitle(page.title, 'en');

                currentPage.getContent().clearCode();
                currentPage.getContent().typeCode(page.code);

                currentPage.getContent().selectPageOnPageTreeTable(page.pageTree);

                currentPage.getContent().selectOwnerGroup(page.ownerGroup.name);
                currentPage.getContent().selectPageTemplate(page.template);

                currentPage.getContent().getSaveAndDesignButton().should('not.be.disabled');
                currentPage.getContent().getSaveButton().should('not.be.disabled');

              });
            });
        });

        describe('Clone a page', () => {
            let newPage;

            beforeEach(() => {
              page.code       = generateRandomId();
              page.titles     = {
                en: generateRandomId(),
                it: generateRandomId()
              };
              page.pageModel  = '1-2-column';
              page.ownerGroup = 'administrators';
              page.seoData    = {
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
              };

              newPage = {
                title: generateRandomId(),
                code: generateRandomId(),
                placement: 0
              };

              cy.wrap(null).as('clonedPageToBeDeleted');

              cy.seoPagesController()
                .then(controller => controller.addNewPage(page))
                .then(response => cy.wrap(response.body.payload.code).as('pageToBeDeleted'));
            });

            afterEach(() => {
              cy.get('@clonedPageToBeDeleted').then(clonedPageToBeDeleted => {
                if (clonedPageToBeDeleted) {
                  cy.pagesController()
                    .then(controller => {
                      controller.deletePage(clonedPageToBeDeleted);
                    })
                }
              });
            });

            it('Cloning a page should copy all SEO details to the new page', () => {
              currentPage = openManagementPage();
              currentPage = currentPage.getContent().getKebabMenu(page.titles.en).open().clickClone();
              cy.validateUrlPathname(`/page/clone`);
              cy.wait('@loadedLanguages');
              currentPage.getContent().typeTitle(newPage.title, 'en');
              currentPage.getContent().typeTitle(newPage.title, 'it');
              currentPage.getContent().clearCode();
              currentPage.getContent().typeCode(newPage.code);
              currentPage.getContent().selectPagePlacement(newPage.placement);
              currentPage = currentPage.getContent().clickSave();

              cy.wait('@clonedPage').then(res => cy.wrap(res.response.body.payload.code).as('clonedPageToBeDeleted'));
              cy.wait('@loadedLanguages');

              currentPage = currentPage.getContent().getKebabMenu(newPage.title).open().openEdit();
              currentPage.getContent().getSeoDescriptionInput('en').should('have.value', page.seoData.seoDataByLang.en.description);
              currentPage.getContent().getSeoKeywordsInput('en').should('have.value', page.seoData.seoDataByLang.en.keywords);
              currentPage.getContent().getSeoFriendlyCodeInput('en').should('have.value', page.seoData.seoDataByLang.en.friendlyCode);
            });

            it('Cloning a page should copy all attached widgets to the new page', () => {
              const pageWidget = {
                frameId: 4,
                code: 'NWS_Archive'
              };

              cy.pageWidgetsController(page.code)
                .then(controller =>
                    controller.addWidget(
                        pageWidget.frameId,
                        pageWidget.code,
                        {}
                    )
                );

              currentPage = openManagementPage();
              currentPage = currentPage.getContent().getKebabMenu(page.titles.en).open().clickClone();
              cy.validateUrlPathname(`/page/clone`);
              cy.wait('@loadedLanguages');
              currentPage.getContent().typeTitle(newPage.title, 'en');
              currentPage.getContent().typeTitle(newPage.title, 'it');
              currentPage.getContent().clearCode();
              currentPage.getContent().typeCode(newPage.code);
              currentPage.getContent().selectPagePlacement(newPage.placement);
              currentPage = currentPage.getContent().clickSave();

              cy.wait('@clonedPage').then(res => cy.wrap(res.response.body.payload.code).as('clonedPageToBeDeleted'));
              cy.wait('@loadedLanguages');

              currentPage = currentPage.getContent().getKebabMenu(newPage.title).open().openDesignerOld();
              currentPage.getContent().getDesigner().contains('News Archive');
            });
          });

    });


  const openManagementPage = () => {
    cy.visit('/');
    cy.wait('@loadedLanguages');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getPages().open();
    currentPage = currentPage.openManagement();
    cy.wait('@loadedLanguages');
    return currentPage;
  };

  const addPageMandatoryData = (page, data) => {
    cy.wait('@loadedLanguages');
    page.getContent().typeTitle(data.title.en, 'en');

    page.getContent().selectSeoLanguage(1);
    page.getContent().typeTitle(data.title.it, 'it');

    page.getContent().clearCode();
    page.getContent().typeCode(data.code);

    if (data.pageTree !== null && data.pageTree !== undefined) {
      page.getContent().selectPageOnPageTreeTable(data.pageTree);
    }

    page.getContent().selectOwnerGroup(data.ownerGroup.name);

    page.getContent().selectPageTemplate(data.template);
  };

  const saveAndValidate = (page, data) => {
    currentPage = page.getContent().clickSaveButton();
    cy.wait('@addedNewPage').then(res => cy.wrap(res.response.body.payload.code).as('pageToBeDeleted'));

    cy.validateToast(currentPage);
    currentPage.getContent().getTableRow(data.title.en).should('exist');
  };

  const addSeoData = (page, seoData) => {
    page.getContent().selectSeoLanguage(0);
    page.getContent().typeSeoDescription(seoData.en.description, 'en');
    page.getContent().typeSeoKeywords(seoData.en.keywords, 'en');
    page.getContent().typeSeoFriendlyCode(seoData.en.friendlyCode, 'en');
    page.getContent().selectSeoLanguage(1);
    page.getContent().typeSeoDescription(seoData.it.description, 'it');
    page.getContent().typeSeoKeywords(seoData.it.keywords, 'it');
    page.getContent().typeSeoFriendlyCode(seoData.it.friendlyCode, 'it');
  };

  const addMetaTag = (page, metaTag) => {
    page.getContent().selectSeoLanguage(0);
    page.getContent().typeMetaKey(metaTag.key);
    page.getContent().selectMetaType(metaTag.type);
    page.getContent().typeMetaValue(metaTag.value);
    page.getContent().clickMetaTagAddButton();
  };

  const addPage = (page, parent = null) => {

    page.code = generateRandomId();
    page.title = {
      en: generateRandomId(),
    };
    newPage.code = page.code;
    newPage.titles = {
      en: page.title.en
    };
    newPage.ownerGroup = page.ownerGroup.code;
    if (parent) {
      page.parentCode = parent;
      newPage.parentCode = parent;
    } else {
      newPage.parentCode = homePage.code;
    }
    cy.seoPagesController()
      .then(controller => controller.addNewPage(newPage))
      .then(response => {
        if (parent) {
          cy.wrap(response.body.payload.code).as('subPageToBeDeleted');
        } else {
          cy.wrap(response.body.payload.code).as('pageToBeDeleted');
        }
      });
  };

  const checkIsNotParent = (pageTitle) => {
    currentPage.getContent().getTableRow(pageTitle).find(`${htmlElements.i}.fa`).eq(2)
      .should('have.class', 'fa-folder-o').and('not.have.class', 'fa-folder');
  };

  const checkIsParent = (pageTitle) => {
    currentPage.getContent().getTableRow(pageTitle).find(`${htmlElements.i}.fa`).eq(2)
      .should('have.class', 'fa-folder').and('not.have.class', 'fa-folder-o');
  };

  const checkPagesRelation = (parentPageTitle, subPageTitle) => {
    checkIsParent(parentPageTitle);
    /*currentPage.getContent().toggleRowSubPages(parentPageTitle);
    checkPageIsLoaded(parentPageTitle);*/
    currentPage.getContent().getTableRow(subPageTitle).should('not.exist');
    currentPage.getContent().toggleRowSubPages(parentPageTitle);
    checkPageIsLoaded(parentPageTitle);
    checkIsNotParent(subPageTitle);
  };

  const checkPageIsLoaded = (pageTitle) => {
    currentPage.getContent().getTableRow(pageTitle).find(`${htmlElements.div}.RowSpinner`).should('not.exist');
  }

  const OOTB_OWNER_GROUPS = ['Administrators', 'Free Access'];

  const homePage = {
    code: 'homepage',
    name: 'Home'
  };

  let currentPage;

  let page    = {
    pageTree: 0,
    parentCode: homePage.code,
    ownerGroup: {
      code: 'administrators',
      name: 'Administrators'
    },
    template: '1-2-column'
  };

  let subPage = {
    ownerGroup: {
      code: 'administrators',
      name: 'Administrators'
    },
    template: '1-2-column'
  };

  let newPage = {
    charset: 'utf-8',
    contentType: 'text/html',
    displayedInMenu: true,
    joinGroups: null,
    seo: false,
    ownerGroup: 'administrators',
    pageModel: '1-2-column'
  };

});
