import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage';

describe([Tag.GTS], 'Page Management', () => {


    beforeEach(() =>{ 
        cy.kcLogin('login/admin').as('tokens')
      });
    
    afterEach(() => {
      
        if (subPageToBeDeleted) {
          cy.pagesController()
            .then(controller => {
              controller.setPageStatus(subPage.code, 'draft');
              controller.deletePage(subPage.code);
            })
            .then(() => {
              subPage            = {
                ownerGroup: {
                  code: 'administrators',
                  name: 'Administrators'
                },
                template: '1-2-column'
              };
              subPageToBeDeleted = false;
            });
        }
        if (pageToBeDeleted) {
          cy.pagesController()
            .then(controller => {
              controller.setPageStatus(page.code, 'draft');
              controller.deletePage(page.code);
            })
            .then(() => {
              page            = {
                pageTree: 0,
                parentCode: homePage.code,
                ownerGroup: {
                  code: 'administrators',
                  name: 'Administrators'
                },
                template: '1-2-column'
              };
              pageToBeDeleted = false;
            });
        }
    
        cy.kcLogout();
      });

    describe('UI', () => {

        it('Add page', () => {
    
          const OOTB_PAGE_TEMPLATES = [ 
            {},
            {value: '1-2-column', text: '1-2 Columns'},
            {value: '1-2x2-1-column', text: '1-2x2-1 Columns'},
            {value: '1-2x4-1-column', text: '1-2x4-1 Columns'},
            {value: '1-column', text: '1 Column'},
            {value: 'content-page', text: 'Content Page'},
            {value: 'home', text: 'Home Page'},
            {value: 'single_frame_page', text: 'Single Frame Page'}
          ];
    
          const OOTB_PAGE_TEMPLATES_TEXTS = OOTB_PAGE_TEMPLATES.map(template => template.text);
          OOTB_PAGE_TEMPLATES_TEXTS.unshift('Choose an option');
    
         
    
          currentPage = openManagementPage();
          currentPage = currentPage.getContent().openAddPagePage();
          cy.validateAppBuilderUrlPathname('/page/add').wait(1000);
    
          currentPage.getContent().openOwnerGroupMenu();
          
          currentPage.getContent().getOwnerGroupDropdown().children(htmlElements.li)
                     .should('have.length', OOTB_OWNER_GROUPS.length)
                     .then(elements => cy.validateListTexts(elements, OOTB_OWNER_GROUPS));
    
          currentPage.getContent().getPageTemplateSelect().children(htmlElements.option)
                     .should('have.length', '9')
                     .then(elements => cy.validateListTexts(elements, OOTB_PAGE_TEMPLATES_TEXTS));
        });
    
    });

    describe('AddPage and Seo Attributes',() => {

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
              cy.validateAppBuilderUrlPathname('/page/add');
    
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
              cy.validateAppBuilderUrlPathname('/page/add');
    
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
            .then(() => pageToBeDeleted = true);
    
          currentPage = openManagementPage();
          currentPage = currentPage.getContent().getKebabMenu(page.code).open().openAdd();
          cy.validateAppBuilderUrlPathname('/page/add');
    
          addPageMandatoryData(currentPage, subPage);
          currentPage        = currentPage.getContent().clickSaveButton();
          subPageToBeDeleted = true;
    
          currentPage.getContent().getTableRows().then(rows =>
              cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('have.text', page.title.en)
          );
    
          currentPage.getContent().toggleRowSubPages(page.code);
          currentPage.getContent().getTableRows().then(rows =>
              cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('have.text', subPage.title.en)
          );
    
        });
    
        it('Adding a new page with non existing parent code is forbidden', () => {
            openManagementPage();
            cy.visit('/page/add?parentCode=non-existing-page');
            cy.wait(3000);
    
            cy.location().should(url => {
              expect(url.pathname).eq('/app-builder/page/add');
              expect(url.search).eq('');
            });
        });
    
        it('Adding a new page with empty fields is forbidden', () => {
            currentPage = openManagementPage();
            currentPage = currentPage.getContent().openAddPagePage();
            cy.validateAppBuilderUrlPathname('/page/add');
    
            currentPage.getContent().getSaveAndDesignButton().should('be.disabled');
            currentPage.getContent().getSaveButton().should('be.disabled');
        });
    
        it('Adding a new page without mandatory fields is forbidden', () => {
            currentPage = openManagementPage();
            currentPage = currentPage.getContent().openAddPagePage();
            cy.validateAppBuilderUrlPathname('/page/add');
    
            addPageMandatoryData(currentPage, page);
            currentPage.getContent().getSaveAndDesignButton().should('not.be.disabled');
            currentPage.getContent().getSaveButton().should('not.be.disabled');
    
            currentPage.getContent().clearCode();
            currentPage.getContent().getSaveAndDesignButton().should('be.disabled');
            currentPage.getContent().getSaveButton().should('be.disabled');
        });
    
        it('Adding a new page with existing code is forbidden', () => {
            const homepageCode = 'homepage';
    
            currentPage = openManagementPage();
            currentPage = currentPage.getContent().openAddPagePage();
            cy.validateAppBuilderUrlPathname('/page/add').wait(1000);
    
            page.code = homepageCode;
            addPageMandatoryData(currentPage, page);
            currentPage.getContent().clickSaveButton();
    
            cy.validateToast(currentPage, page.code, false);
            currentPage.getContent().getAlertMessage()
                       .should('be.visible')
                       .and('contain', homepageCode);
    
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
      
              currentPage = currentPage.getContent().getKebabMenu('sitemap').open().openEdit();
      
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
                .then(() => pageToBeDeleted = true);
      
              currentPage = openManagementPage();
              currentPage = currentPage.getContent().getKebabMenu(page.code).open().openEdit();
      
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
                .then(() => pageToBeDeleted = true);
      
              cy.languagesController()
                .then(controller => controller.putLanguage('cs', 'Czech', true, false));
      
              currentPage = openManagementPage();
              currentPage = currentPage.getContent().getKebabMenu(page.code).open().openEdit();
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
                en: page.title.en
              };
              newPage.parentCode = homePage.code;
              cy.seoPagesController()
                .then(controller => controller.addNewPage(newPage))
                .then(() => pageToBeDeleted = true);
      
              currentPage = openManagementPage();
              currentPage = currentPage.getContent().getKebabMenu(page.code).open().openEdit();
              currentPage.getContent().getTitleInput('en').clear();
              currentPage.getContent().selectSeoLanguage(1);
              currentPage.getContent().getTitleInput('it').type(`${page.title.it}_1`);
              currentPage.getContent().getSaveButton().invoke('attr', 'disabled').should('eq', 'disabled');
              currentPage.getContent().getSaveAndDesignButton().invoke('attr', 'disabled').should('eq', 'disabled');
            });
      
        });


        describe('Delete a page', () => {

          beforeEach(() => postPage(page));
    
          it('Delete an unpublished page', () => {
            currentPage = openManagementPage();
    
            currentPage.getContent().getKebabMenu(page.code).open().clickDelete();
            currentPage.getDialog().getBody().getStateInfo()
                       .should('contain', page.code);
    
            currentPage.getDialog().confirm();
    
            currentPage.getContent().getTableRows().should('not.contain', page.title);
    
            pageToBeDeleted = false;
          });
    
          it('Delete a published page is forbidden', () => {
            cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));
    
            currentPage = openManagementPage();
    
            cy.pause();
            currentPage.getContent().getKebabMenu(page.code).getDelete()
                       .should('have.class', 'disabled');
          });
    
          it('Delete a drafted page is forbidden', () => {
            cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));
            cy.pageWidgetsController(page.code).then(controller => controller.addWidget(0, 'search_form'));
    
            currentPage = openManagementPage();
            currentPage.getContent().getKebabMenu(page.code).open().clickDelete();
            currentPage.getDialog().confirm();

            cy.pause(); //TODO delete a drafted page is NOT forbidden
    
            currentPage.getContent().getAlertMessage().should('be.visible');
          });
    
          it('Delete a page with children is forbidden', () => {
            postPage(subPage, page.code);
    
            currentPage = openManagementPage();
    
            currentPage.getContent().getKebabMenu(page.code).getDelete().should('have.class', 'disabled');
          });
    
        });



        describe('Form Validations', () => {

            describe('Page form should be not possible to save NULL title in default language (ENG-2687)', () => {
              it('There must be a page title for default language, otherwise it will not allow to save', () => {
                postPage(page);
                pageToBeDeleted = true;
      
                currentPage = openManagementPage();
                currentPage = currentPage.getContent().getKebabMenu(page.code).open().openEdit();
      
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
      
            let clonedPageToBeDeleted = false;
      
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
      
              cy.seoPagesController()
                .then(controller => controller.addNewPage(page))
                .then(() => pageToBeDeleted = true);
            });
      
            afterEach(() => {
              if (clonedPageToBeDeleted) {
                cy.pagesController()
                  .then(controller => {
                    controller.deletePage(newPage.code);
                  })
                  .then(() => {
                    clonedPageToBeDeleted = false;
                  });
              }
            });
      
            it('Cloning a page should copy all SEO details to the new page', () => {
              currentPage = openManagementPage();
              currentPage = currentPage.getContent().getKebabMenu(page.code).open().clickClone();
      
              currentPage.getContent().typeTitle(newPage.title, 'en');
              currentPage.getContent().typeTitle(newPage.title, 'it');
              currentPage.getContent().typeTitle(newPage.title, 'es');
              currentPage.getContent().clearCode();
              currentPage.getContent().typeCode(newPage.code);
              currentPage.getContent().selectPagePlacement(newPage.placement);
              currentPage = currentPage.getContent().clickSave();
      
              clonedPageToBeDeleted = true;
      
              currentPage = currentPage.getContent().getKebabMenu(newPage.code).open().openEdit();
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
              currentPage = currentPage.getContent().getKebabMenu(page.code).open().clickClone();
      
              currentPage.getContent().typeTitle(newPage.title, 'en');
              currentPage.getContent().typeTitle(newPage.title, 'it');
              currentPage.getContent().typeTitle(newPage.title, 'es');
              currentPage.getContent().clearCode();
              currentPage.getContent().typeCode(newPage.code);
              currentPage.getContent().selectPagePlacement(newPage.placement);
              currentPage = currentPage.getContent().clickSave();
      
              clonedPageToBeDeleted = true;
      
              currentPage = currentPage.getContent().getKebabMenu(newPage.code).open().openDesigner();
              currentPage.getContent().getDesigner().contains('News Archive');
            });
          });
        
      



    });

    




    const openManagementPage = () => {
        cy.visit('/');
        currentPage = new HomePage();
        currentPage = currentPage.getMenu().getPages().open();
        return currentPage.openManagement();
    };

    const addPageMandatoryData = (page, data) => {
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
    
    const saveAndValidate      = (page, data) => {
        currentPage     = page.getContent().clickSaveButton();
        pageToBeDeleted = true;
    
        cy.validateToast(currentPage);
        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('have.text', data.title.en)
        );
    };
    
    const addSeoData           = (page, seoData) => {
        page.getContent().selectSeoLanguage(0);
        page.getContent().typeSeoDescription(seoData.en.description, 'en');
        page.getContent().typeSeoKeywords(seoData.en.keywords, 'en');
        page.getContent().typeSeoFriendlyCode(seoData.en.friendlyCode, 'en');
        page.getContent().selectSeoLanguage(1);
        page.getContent().typeSeoDescription(seoData.it.description, 'it');
        page.getContent().typeSeoKeywords(seoData.it.keywords, 'it');
        page.getContent().typeSeoFriendlyCode(seoData.it.friendlyCode, 'it');
    };

    const addMetaTag           = (page, metaTag) => {
        page.getContent().selectSeoLanguage(0);
        page.getContent().typeMetaKey(metaTag.key);
        page.getContent().selectMetaType(metaTag.type);
        page.getContent().typeMetaValue(metaTag.value);
        page.getContent().clickMetaTagAddButton();
    };

    const postPage = (page, parent=null) => {
    

        page.code  = generateRandomId();
        page.title = {
          en: generateRandomId(),
          //it: generateRandomId()
        };
        newPage.code       = page.code;
        newPage.titles     = {
          en: page.title.en
        }; 
        if (parent) {
          page.parentCode = parent;
          newPage.parentCode = parent;
        } else {
          newPage.parentCode = homePage.code;
        }
        cy.seoPagesController()
          .then(controller => controller.addNewPage(newPage))
          .then(() => {
            if (parent) {
              subPageToBeDeleted = true;
            } else {pageToBeDeleted = true
          }
        });
      };

    
    const OOTB_OWNER_GROUPS   = ['Administrators', 'Free Access'];

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

    let pageToBeDeleted    = false;
    let subPageToBeDeleted = false;

});