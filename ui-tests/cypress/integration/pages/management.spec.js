import {generateRandomId} from "../../support/utils";

import {htmlElements} from "../../support/pageObjects/WebElement";

import HomePage from "../../support/pageObjects/HomePage";

describe("Page Management", () => {

  const OOTB_PAGE_TEMPLATES = [
    {value: "1-2-column", text: "1-2 Columns"},
    {value: "1-2x2-1-column", text: "1-2x2-1 Columns"},
    {value: "1-2x4-1-column", text: "1-2x4-1 Columns"},
    {value: "1-column", text: "1 Column"},
    {value: "content-page", text: "Content Page"},
    {value: "home", text: "Home Page"},
    {value: "single_frame_page", text: "Single Frame Page"}
  ];
  const OOTB_OWNER_GROUPS   = ["Administrators", "Free Access"];

  let currentPage;

  beforeEach(() => cy.kcLogin("admin").as("tokens"));

  afterEach(() => cy.kcLogout());

  describe("UI", () => {

    it("Add page", () => {
      const OOTB_PAGE_TEMPLATES_TEXTS = OOTB_PAGE_TEMPLATES.map(template => template.text);
      OOTB_PAGE_TEMPLATES_TEXTS.unshift("Choose an option");

      currentPage = openManagementPage();
      currentPage = currentPage.getContent().openAddPagePage();
      cy.location("pathname").should("eq", "/page/add");

      currentPage.getContent().openOwnerGroupMenu();
      currentPage.getContent().getOwnerGroupDropdown().children(htmlElements.li)
                 .should("have.length", OOTB_OWNER_GROUPS.length)
                 .then(elements => cy.validateListTexts(elements, OOTB_OWNER_GROUPS));

      currentPage.getContent().getPageTemplateSelect().children(htmlElements.option)
                 .should("have.length", OOTB_PAGE_TEMPLATES_TEXTS.length)
                 .then(elements => cy.validateListTexts(elements, OOTB_PAGE_TEMPLATES_TEXTS));
    });

  });

  describe("Actions", () => {

    describe("Add a new page", () => {

      let page       = {};
      let parentPage = {};

      let pageToBeDeleted   = false;
      let parentToBeDeleted = false;

      beforeEach(() =>
          page = {
            title: {
              en: generateRandomId(),
              it: generateRandomId()
            },
            code: generateRandomId(),
            pageTree: 0,
            ownerGroup: "Administrators",
            template: "1-2-column",
            seoData: {
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
            },
            metaTags: [
              {
                key: generateRandomId(),
                type: "name",
                value: generateRandomId()
              },
              {
                key: generateRandomId(),
                type: "http-equiv",
                value: generateRandomId()
              },
              {
                key: generateRandomId(),
                type: "property",
                value: generateRandomId()
              }
            ]
          }
      );

      afterEach(() => {
        if (pageToBeDeleted) {
          cy.pagesController()
            .then(controller => {
              controller.setPageStatus(page.code, "draft");
              controller.deletePage(page.code);
            })
            .then(() => pageToBeDeleted = false);
        }
        if (parentToBeDeleted) {
          cy.pagesController()
            .then(controller => {
              controller.setPageStatus(parentPage.code, "draft");
              controller.deletePage(parentPage.code);
            })
            .then(() => parentToBeDeleted = false);
        }
      });

      describe("Add a new page without SEO attributes", () => {
        OOTB_PAGE_TEMPLATES.map(template => template.value).forEach(template => {
          it(`Add ${template} template`, () => {
            page.template = template;
            currentPage   = openManagementPage();
            currentPage   = currentPage.getContent().openAddPagePage();
            cy.location("pathname").should("eq", "/page/add");

            addPageMandatoryData(currentPage, page);
            saveAndValidate(currentPage, page);
          });
        });
      });

      describe("Add a new page with SEO Attributes", () => {
        OOTB_PAGE_TEMPLATES.map(template => template.value).forEach(template => {
          it(`Add ${template} template`, () => {
            page.template = template;
            currentPage   = openManagementPage();
            currentPage   = currentPage.getContent().openAddPagePage();
            cy.location("pathname").should("eq", "/page/add");

            addPageMandatoryData(currentPage, page);
            addSeoData(currentPage, page.seoData);
            page.metaTags.forEach(metaTag => addMetaTag(currentPage, metaTag));

            saveAndValidate(currentPage, page);
          });
        });
      });

      it("Add a new child page", () => {
        parentPage = {
          code: generateRandomId(),
          title: generateRandomId(),
          parentCode: "homepage",
          ownerGroup: "administrators",
          template: "1-2-column"
        };
        cy.pagesController()
          .then(controller => controller.addPage(parentPage.code, parentPage.title, parentPage.ownerGroup, parentPage.template, parentPage.parentCode))
          .then(() => parentToBeDeleted = true);

        currentPage = openManagementPage();
        currentPage = currentPage.getContent().getKebabMenu(parentPage.code).open().openAdd();
        cy.location("pathname").should("eq", "/page/add");

        page.pageTree = null;
        addPageMandatoryData(currentPage, page);
        currentPage     = currentPage.getContent().clickSaveButton();
        pageToBeDeleted = true;

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", parentPage.title)
        );

        currentPage.getContent().toggleRowSubPages(parentPage.code);
        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title.en)
        );
      });

      it("Adding a new page with non existing parent code is forbidden", () => {
        cy.visit("/page/add?parentCode=non-existing-page");
        cy.wait(3000);

        // should redirect back to /page/add when parentCode does not exist
        cy.location().should(url => {
          expect(url.pathname).eq("/page/add");
          expect(url.search).eq("");
        });
      });

      it("Adding a new page with empty fields is forbidden", () => {
        currentPage = openManagementPage();
        currentPage = currentPage.getContent().openAddPagePage();
        cy.location("pathname").should("eq", "/page/add");

        currentPage.getContent().getSaveAndDesignButton().should("be.disabled");
        currentPage.getContent().getSaveButton().should("be.disabled");
      });

      it("Adding a new page without mandatory fields is forbidden", () => {
        currentPage = openManagementPage();
        currentPage = currentPage.getContent().openAddPagePage();
        cy.location("pathname").should("eq", "/page/add");

        addPageMandatoryData(currentPage, page);
        currentPage.getContent().getSaveAndDesignButton().should("not.be.disabled");
        currentPage.getContent().getSaveButton().should("not.be.disabled");

        currentPage.getContent().clearCode();
        currentPage.getContent().getSaveAndDesignButton().should("be.disabled");
        currentPage.getContent().getSaveButton().should("be.disabled");
      });

      it("Adding a new page with existing code is forbidden", () => {
        const homepageCode = "homepage";

        currentPage = openManagementPage();
        currentPage = currentPage.getContent().openAddPagePage();
        cy.location("pathname").should("eq", "/page/add");

        page.code = homepageCode;
        addPageMandatoryData(currentPage, page);
        currentPage.getContent().clickSaveButton();

        cy.validateToast(currentPage, page.code, false);
        currentPage.getContent().getAlertMessage()
                   .should("be.visible")
                   .and("contain", homepageCode);
      });

      const addPageMandatoryData = (page, data) => {
        page.getContent().selectSeoLanguage(0);
        page.getContent().typeTitle(data.title.en, "en");

        page.getContent().selectSeoLanguage(1);
        page.getContent().typeTitle(data.title.it, "it");

        page.getContent().clearCode();
        page.getContent().typeCode(data.code);

        if (data.pageTree !== null) {
          page.getContent().selectPageOnPageTreeTable(data.pageTree);
        }

        page.getContent().selectOwnerGroup(data.ownerGroup);

        page.getContent().selectPageTemplate(data.template);
      };
      const addSeoData           = (page, seoData) => {
        page.getContent().selectSeoLanguage(0);
        page.getContent().typeSeoDescription(seoData.en.description, "en");
        page.getContent().typeSeoKeywords(seoData.en.keywords, "en");
        page.getContent().typeSeoFriendlyCode(seoData.en.friendlyCode, "en");
        page.getContent().selectSeoLanguage(1);
        page.getContent().typeSeoDescription(seoData.it.description, "it");
        page.getContent().typeSeoKeywords(seoData.it.keywords, "it");
        page.getContent().typeSeoFriendlyCode(seoData.it.friendlyCode, "it");
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
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", data.title.en)
        );
      };

    });

    describe("Search a page", () => {

      const page = {
        code: "homepage",
        name: "Home"
      };

      beforeEach(() => currentPage = openManagementPage());

      it("Search by name", () => {
        currentPage.getContent().selectSearchOption(0);
        currentPage.getContent().typeSearch(page.name);
        currentPage = currentPage.getContent().clickSearchButton();

        currentPage.getContent().getTableRows()
                   .should("have.length", 2)
                   .each(row => cy.wrap(row).children(htmlElements.td).eq(2).should("contain", page.name));
      });

      it("Search by code", () => {
        currentPage.getContent().selectSearchOption(1);
        currentPage.getContent().typeSearch(page.code);
        currentPage = currentPage.getContent().clickSearchButton();

        currentPage.getContent().getTableRows()
                   .should("have.length", 2)
                   .each(row => cy.wrap(row).children(htmlElements.td).eq(0).should("contain", page.code));
      });

    });

    describe("Update an existing page", () => {

      //TODO should be enable after PR #1109 gets merged
      xit("with an owner not compatible with the users", () => {
        currentPage = openManagementPage();

        // edit sitemap page
        currentPage = currentPage.getContent().getKebabMenu("sitemap").open().openEdit();

        currentPage.getContent().getOwnerGroupButton().should("be.disabled");
      });

    });

    describe("Change page position in the page tree", () => {

      const homepageCode = "homepage";

      const parentPage = {
        code: generateRandomId(),
        title: generateRandomId(),
        parentCode: homepageCode,
        ownerGroup: "administrators",
        template: "1-2-column"
      };

      let page            = {};
      let pageToBeDeleted = false;

      before(() => {
        cy.kcLogin("admin").as("tokens");
        cy.pagesController().then(controller =>
            controller.addPage(parentPage.code, parentPage.title, parentPage.ownerGroup, parentPage.template, parentPage.parentCode)
        );
        cy.kcLogout();
      });

      beforeEach(() => {
        page = {
          code: generateRandomId(),
          title: generateRandomId(),
          ownerGroup: "administrators",
          template: "1-2-column"
        };
      });

      afterEach(() => {
        if (pageToBeDeleted) {
          cy.pagesController()
            .then(controller => {
              controller.setPageStatus(page.code, "draft");
              controller.deletePage(page.code);
            })
            .then(() => pageToBeDeleted = false);
        }
      });

      after(() => {
        cy.kcLogin("admin").as("tokens");
        cy.pagesController().then(controller => {
          controller.setPageStatus(parentPage.code, "draft");
          controller.deletePage(parentPage.code);
        });
        cy.kcLogout();
      });

      it("Move outside page", () => {
        cy.pagesController()
          .then(controller => controller.addPage(page.code, page.title, page.ownerGroup, page.template, parentPage.code))
          .then(() => pageToBeDeleted = true);

        currentPage = openManagementPage();


        currentPage.getContent().toggleRowSubPages(parentPage.code);
        currentPage.getContent().dragRow(page.code, "homepage", "bottom");
        currentPage.getDialog().confirm();

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(1).children(htmlElements.td).eq(0).should("have.text", page.title)
        );
      });

      it("Move inside page", () => {
        cy.pagesController()
          .then(controller => controller.addPage(page.code, page.title, page.ownerGroup, page.template, homepageCode))
          .then(() => pageToBeDeleted = true);

        currentPage = openManagementPage();

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title)
        );

        currentPage.getContent().dragRow(page.code, parentPage.code, "center");
        currentPage.getDialog().confirm();

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title)
        );

        //FIXME first always tries to open it, even if it is already opened
        currentPage.getContent().toggleRowSubPages(parentPage.code);
        currentPage.getContent().toggleRowSubPages(parentPage.code);
        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", parentPage.title)
        );
      });

      it("Move inside subpages is forbidden", () => {
        cy.pagesController()
          .then(controller => controller.addPage(page.code, page.title, page.ownerGroup, page.template, parentPage.code))
          .then(() => pageToBeDeleted = true);

        currentPage = openManagementPage();


        currentPage.getContent().toggleRowSubPages(parentPage.code);
        currentPage.getContent().dragRow(parentPage.code, page.code, "center");
        currentPage.getDialog().confirm();

        cy.validateToast(currentPage, null, false);

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title)
        );

        currentPage.getContent().toggleRowSubPages(parentPage.code);
        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", parentPage.title)
        );
      });

      it("Move free pages inside reserved pages is forbidden", () => {
        page.ownerGroup = "free";

        cy.pagesController()
          .then(controller => controller.addPage(page.code, page.title, page.ownerGroup, page.template, homepageCode))
          .then(() => pageToBeDeleted = true);

        currentPage = openManagementPage();

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title)
        );

        currentPage.getContent().dragRow(page.code, parentPage.code, "center");
        currentPage.getDialog().confirm();

        cy.validateToast(currentPage, null, false);

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title)
        );

        //FIXME first always tries to open it, even if it is already opened
        currentPage.getContent().toggleRowSubPages(parentPage.code);
        currentPage.getContent().toggleRowSubPages(parentPage.code);
        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title)
        );
      });

      it("Move published pages inside unpublished pages is forbidden", () => {
        cy.pagesController()
          .then(controller => {
            controller.addPage(page.code, page.title, page.ownerGroup, page.template, homepageCode);
            controller.setPageStatus(page.code, "published");
          })
          .then(() => pageToBeDeleted = true);

        currentPage = openManagementPage();

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title)
        );

        currentPage.getContent().dragRow(page.code, parentPage.code, "center");
        currentPage.getDialog().confirm();

        cy.validateToast(currentPage, null, false);

        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title)
        );

        //FIXME first always tries to open it, even if it is already opened
        currentPage.getContent().toggleRowSubPages(parentPage.code);
        currentPage.getContent().toggleRowSubPages(parentPage.code);
        currentPage.getContent().getTableRows().then(rows =>
            cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title)
        );
      });

    });

    describe("Change page status", () => {

      const page = {
        code: generateRandomId(),
        title: generateRandomId(),
        parentCode: "homepage",
        ownerGroup: "administrators",
        template: "1-2-column"
      };

      let childPage        = {};
      let childToBeDeleted = false;

      beforeEach(() => {
        cy.pagesController().then(controller =>
            controller.addPage(page.code, page.title, page.ownerGroup, page.template, page.parentCode)
        );
      });

      afterEach(() => {
        if (childToBeDeleted) {
          cy.pagesController()
            .then(controller => {
              controller.setPageStatus(childPage.code, "draft");
              controller.deletePage(childPage.code);
            })
            .then(() => childToBeDeleted = false);
        }
        cy.pagesController()
          .then(controller => {
            controller.setPageStatus(page.code, "draft");
            controller.deletePage(page.code);
          });
      });

      it("Publish a page", () => {
        currentPage = openManagementPage();

        currentPage.getContent().getKebabMenu(page.code).open().clickPublish();
        currentPage.getDialog().confirm();

        currentPage.getContent().getTableRow(page.code).then(row =>
            cy.wrap(row).children(htmlElements.td).eq(2).children(htmlElements.i)
              .should("have.attr", "title")
              .and("equal", "Published")
        );
      });

      it("Unpublish a page", () => {
        cy.pagesController().then(controller => controller.setPageStatus(page.code, "published"));

        currentPage = openManagementPage();

        currentPage.getContent().getKebabMenu(page.code).open().clickUnpublish();
        currentPage.getDialog().confirm();

        currentPage.getContent().getTableRow(page.code).then(row =>
            cy.wrap(row).children(htmlElements.td).eq(2).children(htmlElements.i)
              .should("have.attr", "title")
              .and("equal", "Unpublished")
        );
      });

      it("Publish a subpage of an unpublished page is forbidden", () => {
        childPage = {
          code: generateRandomId(),
          title: generateRandomId(),
          parentCode: page.code,
          ownerGroup: "administrators",
          template: "1-2-column"
        };
        cy.pagesController()
          .then(controller => controller.addPage(childPage.code, childPage.title, childPage.ownerGroup, childPage.template, childPage.parentCode))
          .then(() => childToBeDeleted = true);

        currentPage = openManagementPage();
        currentPage.getContent().toggleRowSubPages(page.code);

        currentPage.getContent().getKebabMenu(childPage.code).getPublish()
                   .should("have.class", "disabled");
      });

    });

    describe("Delete a page", () => {

      const page = {
        code: generateRandomId(),
        title: generateRandomId(),
        parentCode: "homepage",
        ownerGroup: "administrators",
        template: "1-2-column"
      };

      let childPage        = {};
      let childToBeDeleted = false;
      let pageToBeDeleted  = false;

      beforeEach(() => {
        cy.pagesController().then(controller =>
            controller.addPage(page.code, page.title, page.ownerGroup, page.template, page.parentCode)
        );
      });

      afterEach(() => {
        if (childToBeDeleted) {
          cy.pagesController()
            .then(controller => {
              controller.setPageStatus(childPage.code, "draft");
              controller.deletePage(childPage.code);
            })
            .then(() => childToBeDeleted = false);
        }
        if (pageToBeDeleted) {
          cy.pagesController()
            .then(controller => {
              controller.setPageStatus(page.code, "draft");
              controller.deletePage(page.code);
            })
            .then(() => pageToBeDeleted = false);
        }
      });

      it("Delete an unpublished page", () => {
        // try to delete unpublished page
        currentPage = openManagementPage();

        currentPage.getContent().getKebabMenu(page.code).open().clickDelete();
        currentPage.getDialog().getBody().getStateInfo()
                   .should("contain", page.code);

        currentPage.getDialog().confirm();

        currentPage.getContent().getTableRows().should("not.contain", page.title);
      });

      it("Delete a published page is forbidden", () => {
        cy.pagesController()
          .then(controller => controller.setPageStatus(page.code, "published"))
          .then(() => pageToBeDeleted = true);

        currentPage = openManagementPage();

        cy.pause();
        currentPage.getContent().getKebabMenu(page.code).getDelete()
                   .should("have.class", "disabled");
      });

      it("Delete a drafted page is forbidden", () => {
        cy.pagesController()
          .then(controller => {
            controller.setPageStatus(page.code, "published");
            controller.addWidgetToPage(page.code, 0, "search_form");
          })
          .then(() => pageToBeDeleted = true);

        currentPage = openManagementPage();
        currentPage.getContent().getKebabMenu(page.code).open().clickDelete();
        currentPage.getDialog().confirm();

        currentPage.getContent().getAlertMessage().should("be.visible");
      });

      it("Delete a page with children is forbidden", () => {
        pageToBeDeleted  = true;
        childPage = {
          code: generateRandomId(),
          title: generateRandomId(),
          parentCode: page.code,
          ownerGroup: "administrators",
          template: "1-2-column"
        };
        cy.pagesController()
          .then(controller => controller.addPage(childPage.code, childPage.title, childPage.ownerGroup, childPage.template, childPage.parentCode))
          .then(() => childToBeDeleted = true);

        currentPage = openManagementPage();

        currentPage.getContent().getKebabMenu(page.code).getDelete().should("have.class", "disabled");
      });

    });

  });

  const openManagementPage = () => {
    cy.visit("/");
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getPages().open();
    return currentPage.openManagement();
  };

});
