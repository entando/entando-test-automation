import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage';

describe('Page Management', () => {

  const OOTB_PAGE_TEMPLATES = [
    {value: '1-2-column', text: '1-2 Columns'},
    {value: '1-2x2-1-column', text: '1-2x2-1 Columns'},
    {value: '1-2x4-1-column', text: '1-2x4-1 Columns'},
    {value: '1-column', text: '1 Column'},
    {value: 'content-page', text: 'Content Page'},
    {value: 'home', text: 'Home Page'},
    {value: 'single_frame_page', text: 'Single Frame Page'}
  ];
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

  let pageToBeDeleted    = false;
  let subPageToBeDeleted = false;

  beforeEach(() => cy.kcLogin('admin').as('tokens'));

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
                 .should('have.length', OOTB_PAGE_TEMPLATES_TEXTS.length)
                 .then(elements => cy.validateListTexts(elements, OOTB_PAGE_TEMPLATES_TEXTS));
    });

  });

  describe('Actions', () => {

    describe('Add a new page', () => {

      beforeEach(() => {
        page.code     = generateRandomId();
        page.title    = {
          en: generateRandomId(),
          it: generateRandomId()
        };
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

            addPageMandatoryData(currentPage, page);
            addSeoData(currentPage, page.seoData);
            page.metaTags.forEach(metaTag => addMetaTag(currentPage, metaTag));

            saveAndValidate(currentPage, page);
          });
        });
      });

      it('Add a new child page', () => {
        subPage.code       = generateRandomId();
        subPage.title      = {
          en: generateRandomId(),
          it: generateRandomId()
        };
        subPage.parentCode = page.code;
        cy.pagesController()
          .then(controller => controller.addPage(page.code, page.title.en, page.ownerGroup.code, page.template, page.parentCode))
          .then(() => pageToBeDeleted = true);

        currentPage = openManagementPage();
        currentPage = currentPage.getContent().getKebabMenu(page.code).open().openAdd();
        cy.validateUrlPathname('/page/add');

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
          expect(url.pathname).eq('/page/add');
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
        const homepageCode = 'homepage';

        currentPage = openManagementPage();
        currentPage = currentPage.getContent().openAddPagePage();
        cy.validateUrlPathname('/page/add');

        page.code = homepageCode;
        addPageMandatoryData(currentPage, page);
        currentPage.getContent().clickSaveButton();

        cy.validateToast(currentPage, page.code, false);
        currentPage.getContent().getAlertMessage()
                   .should('be.visible')
                   .and('contain', homepageCode);
      });

      const addPageMandatoryData = (page, data) => {
        page.getContent().selectSeoLanguage(0);
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
      const saveAndValidate      = (page, data) => {
        currentPage     = page.getContent().clickSaveButton();
        pageToBeDeleted = true;

        cy.validateToast(currentPage);
        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('have.text', data.title.en)
        );
      };

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

      //TODO should be enable after PR #1109 gets merged
      xit('with an owner not compatible with the users', () => {
        currentPage = openManagementPage();

        // edit sitemap page
        currentPage = currentPage.getContent().getKebabMenu('sitemap').open().openEdit();

        currentPage.getContent().getOwnerGroupButton().should('be.disabled');
      });

    });

    describe('Change page position in the page tree', () => {

      before(() => {
        page.code  = generateRandomId();
        page.title = generateRandomId();

        cy.kcLogin('admin').as('tokens');
        cy.pagesController().then(controller =>
            controller.addPage(page.code, page.title, page.ownerGroup.code, page.template, page.parentCode)
        );
        cy.kcLogout();
      });

      beforeEach(() => {
        subPage.code  = generateRandomId();
        subPage.title = generateRandomId();
      });

      after(() => {
        cy.kcLogin('admin').as('tokens');
        cy.pagesController().then(controller => {
          controller.setPageStatus(page.code, 'draft');
          controller.deletePage(page.code);
        });
        cy.kcLogout();
      });

      it('Move outside page', () => {
        postPage(subPage, page.code);

        currentPage = openManagementPage();

        currentPage.getContent().toggleRowSubPages(page.code);
        currentPage.getContent().dragRow(subPage.code, homePage.code, 'bottom');
        currentPage.getDialog().confirm();

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(1).children(htmlElements.td).eq(0).should('have.text', subPage.title)
        );
      });

      it('Move inside page', () => {
        postPage(subPage, homePage.code);
        currentPage = moveSubPageInPage();

        checkPagesPosition(currentPage, page.code, subPage.title, page.title);
      });

      it('Move inside subpages is forbidden', () => {
        postPage(subPage, page.code);

        currentPage = openManagementPage();

        currentPage.getContent().toggleRowSubPages(page.code);
        currentPage.getContent().dragRow(page.code, subPage.code, 'center');
        currentPage.getDialog().confirm();

        cy.validateToast(currentPage, null, false);

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('have.text', subPage.title)
        );

        currentPage.getContent().toggleRowSubPages(page.code);
        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('have.text', page.title)
        );
      });

      it('Move free pages inside reserved pages is forbidden', () => {
        subPage.ownerGroup = {code: 'free', name: 'Free Access'};

        postPage(subPage, homePage.code);
        currentPage = moveSubPageInPage();

        cy.validateToast(currentPage, null, false);

        checkPagesPosition(currentPage, page.code, subPage.title, subPage.title);
      });

      it('Move published pages inside unpublished pages is forbidden', () => {
        postPage(subPage, homePage.code);
        cy.pagesController().then(controller => controller.setPageStatus(subPage.code, 'published'));

        currentPage = moveSubPageInPage();
        cy.validateToast(currentPage, null, false);

        checkPagesPosition(currentPage, page.code, subPage.title, subPage.title);
      });

      const moveSubPageInPage  = () => {
        currentPage = openManagementPage();

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('have.text', subPage.title)
        );

        currentPage.getContent().dragRow(subPage.code, page.code, 'center');
        currentPage.getDialog().confirm();
        cy.wait(1000); //TODO find a better way to identify when the page loaded

        return currentPage;
      };
      const checkPagesPosition = (page, parentPageCode, firstPageTitle, secondPageTitle) => {
        page.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('have.text', firstPageTitle)
        );

        //FIXME first always tries to open it, even if it is already opened
        page.getContent().toggleRowSubPages(parentPageCode);
        page.getContent().toggleRowSubPages(parentPageCode);
        page.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('have.text', secondPageTitle)
        );
      };

    });

    describe('Change page status', () => {

      beforeEach(() => postPage(page));

      it('Publish a page', () => {
        currentPage = openManagementPage();

        currentPage.getContent().getKebabMenu(page.code).open().clickPublish();
        currentPage.getDialog().confirm();

        currentPage.getContent().getTableRow(page.code).then(row =>
            cy.wrap(row).children(htmlElements.td).eq(2).children(htmlElements.i)
              .should('have.attr', 'title')
              .and('equal', 'Published')
        );
      });

      it('Unpublish a page', () => {
        cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));

        currentPage = openManagementPage();

        currentPage.getContent().getKebabMenu(page.code).open().clickUnpublish();
        currentPage.getDialog().confirm();

        currentPage.getContent().getTableRow(page.code).then(row =>
            cy.wrap(row).children(htmlElements.td).eq(2).children(htmlElements.i)
              .should('have.attr', 'title')
              .and('equal', 'Unpublished')
        );
      });

      it('Publish a subpage of an unpublished page is forbidden', () => {
        postPage(subPage, page.code);

        currentPage = openManagementPage();
        currentPage.getContent().toggleRowSubPages(page.code);

        currentPage.getContent().getKebabMenu(subPage.code).getPublish()
                   .should('have.class', 'disabled');
      });

      it('Unpublish a page with published children is forbidden', () => {
        postPage(subPage, page.code);
        cy.pagesController().then(controller => {
          controller.setPageStatus(page.code, 'published');
          controller.setPageStatus(subPage.code, 'published');
        });

        currentPage = openManagementPage();
        currentPage.getContent().toggleRowSubPages(page.code);

        currentPage.getContent().getKebabMenu(page.code).getUnpublish()
                   .should('have.class', 'disabled');
      });
    });

    describe('Non admin user', () => {
      const groupCode = 'group1';
      const groupName = 'Group1';
      const newUser = {
        username: 'user1',
        password: '12345678',
        passwordConfirm: '12345678',
        profileType: 'PFL',
        status: 'active',
        accountNotExpired: true,
        credentialsNotExpired: true,
      }
      
      beforeEach(() => {
        // create group
        cy.groupsController().then(controller => {
          controller.addGroup(groupCode, groupName);
        })

        // add new user with no permission
        cy.usersController().then(controller => {
          controller.addUserObj(newUser);
          controller.updateUser(newUser);
          controller.addAuthorities(newUser.username, groupCode, 'approver');
        });
      });

      afterEach(() => {
        cy.kcLogout();
        cy.kcLogin('admin').as('tokens');
        
        cy.usersController().then(controller => {
          controller.deleteAuthorities(newUser.username);
          controller.deleteUser(newUser.username);
        });
        
        cy.groupsController().then(controller => {
          controller.deleteGroup(groupCode);
        })
      })

      it('Unpublish a page without permission', () => {
        postPage(page);
        cy.pagesController().then(controller => {
          controller.setPageStatus(page.code, 'published');
        });
        
        // login with unauthorized user
        cy.kcLogout();
        cy.kcLogin(newUser.username).as('tokens');

        currentPage = openManagementPage();
        
        // user should not be able to see the new page
        currentPage.getContent().getTableRows().should('not.contain', page.title);
      });
    })

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
        cy.widgetsController(page.code).then(controller => controller.addWidget(0, 'search_form'));

        currentPage = openManagementPage();
        currentPage.getContent().getKebabMenu(page.code).open().clickDelete();
        currentPage.getDialog().confirm();

        currentPage.getContent().getAlertMessage().should('be.visible');
      });

      it('Delete a page with children is forbidden', () => {
        postPage(subPage, page.code);

        currentPage = openManagementPage();

        currentPage.getContent().getKebabMenu(page.code).getDelete().should('have.class', 'disabled');
      });

    });

  });

  const openManagementPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getPages().open();
    return currentPage.openManagement();
  };

  const postPage = (page, parent = null) => {
    page.code  = generateRandomId();
    page.title = generateRandomId();
    if (parent) {
      page.parentCode = parent;
    }
    cy.pagesController()
      .then(controller => controller.addPage(page.code, page.title, page.ownerGroup.code, page.template, page.parentCode))
      .then(() => {
        if (parent) {
          subPageToBeDeleted = true;
        } else {
          pageToBeDeleted = true;
        }
      });
  };

});
