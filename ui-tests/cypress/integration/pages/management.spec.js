import {generateRandomId} from "../../support/utils";

import {htmlElements} from "../../support/pageObjects/WebElement";

import {
  PAGE_WITHOUT_SEO_DATA,
  PAGE_FREE_OWNER_GROUP
} from "../../mocks/pages";

import HomePage from "../../support/pageObjects/HomePage";

describe("Page Management", () => {

  const languages = ["en", "it"];

  let currentPage;

  beforeEach(() => {
    cy.kcLogin("admin").as("tokens");
    currentPage = openManagementPage();
  });

  afterEach(() => {
    cy.kcLogout();
  });

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
    it("Should move the page in the right place according the place chosen in the tree (Above)", () => {
      cy.openPageFromMenu(["Pages", "Management"]);
      cy.expandAllPageTreeFolders();
      cy.dragAndDropPageAbove("Sitemap", "Error page");
      cy.dragAndDropPageBelow("Error page", "Sitemap");
    });

    it("Should move the page in the right place according the place chosen in the tree (Below)", () => {
      cy.openPageFromMenu(["Pages", "Management"]);
      cy.expandAllPageTreeFolders();
      cy.dragAndDropPageBelow("Sitemap", "My Homepage");
      cy.dragAndDropPageAbove("My Homepage", "Sitemap");
    });

    it("Should forbid to move a page with free owner group under a reserved page", () => {
      cy.addPage(PAGE_WITHOUT_SEO_DATA, languages);
      cy.closeToastNotification();
      cy.openPageFromMenu(["Pages", "Management"]);
      cy.expandAllPageTreeFolders();
      cy.dragAndDropPageInto("Search Result", PAGE_WITHOUT_SEO_DATA.titles.en);
      cy.validateToastNotificationError("Cannot move a free page under a reserved page");
      cy.closeToastNotification();
      cy.deletePage(PAGE_WITHOUT_SEO_DATA.code);
    });

    it("Should forbid to move a published page under a no published page", () => {
      cy.addPage(PAGE_FREE_OWNER_GROUP, languages);
      cy.closeToastNotification();
      cy.openPageFromMenu(["Pages", "Management"]);
      cy.expandAllPageTreeFolders();
      cy.wait(1000);
      cy.dragAndDropPageInto("Service", PAGE_FREE_OWNER_GROUP.titles.en);
      cy.validateToastNotificationError("Can not move a published page under an unpublished page");
      cy.deletePage(PAGE_FREE_OWNER_GROUP.code);
    });

    it("Should forbid to move a published page under his published child page", () => {
      cy.openPageFromMenu(["Pages", "Management"]);
      cy.expandAllPageTreeFolders();
      cy.wait(1000);
      cy.dragAndDropPageInto("Service", "Login");
      cy.validateToastNotificationError("The page 'login' can not be the parent of 'service' because he is one of his child");
    });
  });

  describe("Change page status", () => {
    it("Should publish and unpublish a page", () => {
      cy.openPageFromMenu(["Pages", "Management"]);
      cy.unpublishPageAction("login");
      cy.getPageStatusInPageTree("Login").should("match", new RegExp("^Unpublished$"));
      cy.publishPageAction("login");
      cy.getPageStatusInPageTree("Login").should("match", new RegExp("^Published$"));
    });
  });

  const openManagementPage = () => {
    cy.visit("/");
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getPages().open();
    return currentPage.openManagement();
  };

});
