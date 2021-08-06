import {generateRandomId} from "../../support/utils";

import {htmlElements} from "../../support/pageObjects/WebElement";

import HomePage from "../../support/pageObjects/HomePage";

describe("Page Management", () => {

  let currentPage;

  beforeEach(() => cy.kcLogin("admin").as("tokens"));

  afterEach(() => cy.kcLogout());

  describe("Add a new page", () => {

    let page            = {};
    let pageToBeDeleted = false;

    beforeEach(() => {
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
      };

      currentPage = openManagementPage();
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

    it("Add a new page without SEO attributes", () => {
      currentPage = currentPage.getContent().openAddPagePage();
      cy.location("pathname").should("eq", "/page/add");

      addPageMandatoryData(currentPage, page);
      currentPage = currentPage.getContent().clickSaveButton();
      pageToBeDeleted = true;

      cy.validateToast(currentPage);
      currentPage.getContent().getTableRows().then(rows =>
          cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title.en)
      );
    });

    it("Add a new page with SEO Attributes", () => {
      currentPage = currentPage.getContent().openAddPagePage();
      cy.location("pathname").should("eq", "/page/add");

      addPageMandatoryData(currentPage, page);
      addSeoData(currentPage, page.seoData);
      page.metaTags.forEach(metaTag => addMetaTag(currentPage, metaTag));
      currentPage = currentPage.getContent().clickSaveButton();
      pageToBeDeleted = true;

      cy.validateToast(currentPage);
      currentPage.getContent().getTableRows().then(rows =>
          cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should("have.text", page.title.en)
      );
    });

    it("Adding a new page with existing code is forbidden", () => {
      currentPage = currentPage.getContent().openAddPagePage();
      cy.location("pathname").should("eq", "/page/add");

      page.code = "my_homepage";
      addPageMandatoryData(currentPage, page);
      currentPage.getContent().clickSaveButton();

      cy.validateToast(currentPage, page.code, false);
    });

    const addPageMandatoryData = (page, data) => {
      page.getContent().selectSeoLanguage(0);
      page.getContent().typeTitle(data.title.en, "en");

      page.getContent().selectSeoLanguage(1);
      page.getContent().typeTitle(data.title.it, "it");

      page.getContent().clearCode();
      page.getContent().typeCode(data.code);

      page.getContent().selectPageOnPageTreeTable(data.pageTree);

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

    beforeEach(() => {
      cy.pagesController().then(controller =>
          controller.addPage(page.code, page.title, page.ownerGroup, page.template, page.parentCode)
      );
    });

    afterEach(() => {
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

  });

  const openManagementPage = () => {
    cy.visit("/");
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getPages().open();
    return currentPage.openManagement();
  };

});
