import {generateRandomId} from "../../support/utils";

import {htmlElements} from "../../support/pageObjects/WebElement";

import HomePage from "../../support/pageObjects/HomePage.js";

describe("Content Types", () => {

  let currentPage;

  let contentType = {};

  beforeEach(() => cy.kcLogin("admin").as("tokens"));

  afterEach(() => cy.kcLogout());

  describe("Unreferenced", () => {

    beforeEach(() => {
      contentType.code = generateRandomContentTypeCode();
      contentType.name = generateRandomId();
    });

    it("should have the functionality to add a new content type", () => {
      currentPage = openContentTypesPage();

      cy.log(`Add content type with code ${contentType.code}`);
      currentPage = currentPage.getContent().openAddContentTypePage();
      currentPage = currentPage.getContent().addAndSaveContentType(contentType.code, contentType.name);
      currentPage.getContent().getCodeInput().should("have.value", contentType.code).and("be.disabled");
      currentPage.getContent().getNameInput().should("have.value", contentType.name);

      currentPage = currentPage.getContent().save();
      currentPage.getContent().getTableRow(contentType.code).find(htmlElements.td).eq(0).should("contain.text", contentType.name);
      currentPage.getContent().getTableRow(contentType.code).find(htmlElements.td).eq(2).should("contain.text", contentType.code);

      deleteContentType(contentType.code);
    });

    it("should have the functionality to edit a content type", () => {
      postContentType(contentType.code, contentType.name);
      currentPage = openContentTypesPage();

      cy.log(`Edit content type with code ${contentType.code}`);
      currentPage              = currentPage.getContent().getKebabMenu(contentType.code).open().openEdit();
      const newContentTypeName = generateRandomId();
      currentPage.getContent().clearName();
      currentPage.getContent().typeName(newContentTypeName);
      currentPage = currentPage.getContent().save();
      currentPage.getContent().getTableRow(contentType.code).find(htmlElements.td).eq(0).should("contain.text", newContentTypeName);

      deleteContentType(contentType.code);
    });

    it("should allow deleting a content type not referenced by a published content", () => {
      postContentType(contentType.code, contentType.name);
      currentPage = openContentTypesPage();

      cy.log(`Delete content type with code ${contentType.code}`);
      currentPage.getContent().getKebabMenu(contentType.code).open().clickDelete();
      currentPage.getDialog().confirm();
      currentPage.getContent().getTable().should("not.contain", contentType.code);
    });

  });

  describe("Referenced by published content", () => {

    let contentId;

    beforeEach(() => {
      contentType.code = generateRandomContentTypeCode();
      contentType.name = generateRandomId();

      postContentType(contentType.code, contentType.name);
      createAndPublishTestContent(contentType.code);
    });

    afterEach(() => {
      deleteContent(contentId);
      deleteContentType(contentType.code);
    });

    it("should not allow deleting a content type", () => {
      currentPage = openContentTypesPage();

      cy.log(`Delete content type with code ${contentType.code}`);
      currentPage.getContent().getKebabMenu(contentType.code).open().clickDelete();
      currentPage.getDialog().confirm();
      cy.validateToast(currentPage, false, contentType.code);
    });

    it("should allow adding an attribute", () => {
      currentPage = openContentTypesPage();

      const testAttribute = "Text";
      currentPage         = currentPage.getContent().getKebabMenu(contentType.code).open().openEdit();
      currentPage         = currentPage.getContent().openAddAttributePage(testAttribute);

      currentPage.getContent().typeCode(testAttribute);
      currentPage = currentPage.getContent().continue();
      currentPage.getContent().getAttributesTable().should("contain", testAttribute);
    });

    it("should allow updating an attribute", () => {
      currentPage         = openContentTypesPage();
      const testAttribute = {type: "Text", code: "Text"};
      cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(testAttribute));

      currentPage = currentPage.getContent().getKebabMenu(contentType.code).open().openEdit();
      currentPage = currentPage.getContent().getKebabMenu(testAttribute.code).open().openEdit();
      currentPage.getContent().clearName("en");
      const newAttributeName = "Text2";
      currentPage.getContent().typeName("en", newAttributeName);
      currentPage = currentPage.getContent().continue();
      currentPage.getContent().getAttributesTable().should("contain", newAttributeName);
    });

    const postContent   = content => cy.contentsController().then(controller => controller.postContent(content));
    const deleteContent = id => cy.contentsController().then(controller => controller.deleteContent(id));

    const createAndPublishTestContent = (typeCode) => {
      const description = "test";
      const mainGroup   = "administrators";
      const status      = "published";
      postContent({typeCode, description, mainGroup, status})
          .then((response) => {
            const {body: {payload}} = response;
            contentId               = payload[0].id;
          });
    };

  });

  describe("Attributes", () => {

    const TYPE_MONOLIST  = "Monolist";
    const TYPE_COMPOSITE = "Composite";

    const attributeCompositeTest = [
      {type: "Hypertext", code: "httext", names: {en: "Le Hyper Text"}},
      {type: "Link", code: "myLink", names: {en: "My Link"}},
      {type: "Timestamp", code: "currStamp", names: {en: "Curr Stamp"}}
    ];

    before(() => {
      contentType.code = generateRandomContentTypeCode();
      contentType.name = generateRandomId();

      cy.kcLogin("admin").as("tokens");
      cy.contentTypesController().then(controller => controller.addContentType(contentType.code, contentType.name));
      cy.kcLogout();
    });

    after(() => {
      cy.kcLogin("admin").as("tokens");
      cy.contentTypesController().then(controller => controller.deleteContentType(contentType.code));
      cy.kcLogout();
    });

    describe("List", () => {

      const TYPE_LIST = "List";

      beforeEach(() => {
        currentPage = openEditContentTypePage(contentType.code);
        currentPage = currentPage.getContent().openAddAttributePage(TYPE_LIST);
      });

      it("Un-allowed nested attribute types", () => {
        currentPage.getContent().getNestedAttributeType()
                   .should("not.contain", "Text")
                   .and("not.contain", "Longtext")
                   .and("not.contain", "Hypertext")
                   .and("not.contain", "Image")
                   .and("not.contain", "Attach")
                   .and("not.contain", "Link");
      });

      describe("Allowed nested attribute types", () => {

        const attributeListTest = [
          {type: "CheckBox", code: "checki", names: {en: "Checki"}},
          {type: "Email", code: "emaili", names: {en: "Emaili"}},
          {type: "Date", code: "dati", names: {en: "Daeti"}}
        ];

        attributeListTest.forEach(({type, code, names}) => {
          it(`${type}`, () => {
            currentPage = fillAddListAttributeForm(currentPage, contentType.code, TYPE_LIST, code, type);
            currentPage = fillEditListAttributeForm(currentPage, contentType.code, TYPE_LIST, code, names.en);
            cy.contentTypeAttributeController(contentType.code).then(controller => controller.deleteAttribute(code));
          });
        });

      });

    });

    describe("Monolist", () => {

      it("Un-allowed nested attribute types", () => {
        currentPage = openEditContentTypePage(contentType.code);
        currentPage = currentPage.getContent().openAddAttributePage(TYPE_MONOLIST);

        currentPage.getContent().getNestedAttributeType()
                   .should("not.contain", "Monolist")
                   .and("not.contain", "List");
      });

      describe("examples of nested attribute types that are allowed in Monolist attribute", () => {

        const attributeMonolistTest = [
          {type: "Text", code: "nicetext", names: {en: "Nice Text"}},
          {type: "Image", code: "myImage", names: {en: "My Image"}},
          {type: "Attach", code: "myAttach", names: {en: "My Attach"}}
        ];

        beforeEach(() => {
          currentPage = openEditContentTypePage(contentType.code);
          currentPage = currentPage.getContent().openAddAttributePage(TYPE_MONOLIST);
        });

        attributeMonolistTest.forEach(({type, code, names}) => {
          it(`${type} attribute nested`, () => {
            currentPage = fillAddListAttributeForm(currentPage, contentType.code, TYPE_MONOLIST, code, type);
            currentPage = fillEditListAttributeForm(currentPage, contentType.code, TYPE_MONOLIST, code, names.en);
            cy.contentTypeAttributeController(contentType.code).then(controller => controller.deleteAttribute(code));
          });
        });

      });

      describe("Monolist Composite", () => {

        const mainAttrCode = "mocoCode";
        const mainAttrName = "Mono compo name";

        it("Add monolist composite attribute", () => {
          currentPage = openEditContentTypePage(contentType.code);
          currentPage = currentPage.getContent().openAddAttributePage(TYPE_MONOLIST);
          currentPage = fillAddListAttributeForm(currentPage, contentType.code, TYPE_MONOLIST, mainAttrCode, TYPE_COMPOSITE);

          attributeCompositeTest.forEach(({type, code}) => {
            currentPage = addNewCompositeAttribute(currentPage, contentType.code, type, code);
          });
          currentPage = currentPage.getContent().continue();

          currentPage.getContent().getAttributesTable().should("contain", mainAttrCode);

          cy.contentTypeAttributeController(contentType.code).then(controller => controller.deleteAttribute(mainAttrCode));
        });

        it("Edit monolist composite attribute - Add sub-attribute", () => {
          const attribute = {
            type: TYPE_MONOLIST,
            code: mainAttrCode,
            nestedAttribute: {
              type: TYPE_COMPOSITE,
              code: mainAttrCode,
              compositeAttributes: attributeCompositeTest
            }
          };
          cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(attribute));
          currentPage = openEditContentTypePage(contentType.code);

          currentPage = fillEditListAttributeForm(currentPage, contentType.code, TYPE_MONOLIST, mainAttrCode, mainAttrName, true);
          currentPage = addNewCompositeAttribute(currentPage, contentType.code, "Image", "muImage");

          cy.contentTypeAttributeController(contentType.code).then(controller => controller.deleteAttribute(mainAttrCode));
        });

        it("Edit monolist composite attribute - Remove sub-attribute", () => {
          const toDelete = attributeCompositeTest.slice(0, 2);

          const attribute = {
            type: TYPE_MONOLIST,
            code: mainAttrCode,
            nestedAttribute: {
              type: TYPE_COMPOSITE,
              code: mainAttrCode,
              compositeAttributes: attributeCompositeTest
            }
          };
          cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(attribute));
          currentPage = openEditContentTypePage(contentType.code);

          currentPage = fillEditListAttributeForm(currentPage, contentType.code, TYPE_MONOLIST, mainAttrCode, mainAttrName, true);
          toDelete.forEach(({code}) => {
            deleteAttributeFromContentType(currentPage, code, contentType.code, true);
          });

          cy.contentTypeAttributeController(contentType.code).then(controller => controller.deleteAttribute(mainAttrCode));
        });

        it("Delete monolist composite attribute", () => {
          const textAttribute      = {
            type: "Text",
            code: "Text"
          };
          const compositeAttribute = {
            type: TYPE_MONOLIST,
            code: mainAttrCode,
            nestedAttribute: {
              type: TYPE_COMPOSITE,
              code: mainAttrCode,
              compositeAttributes: attributeCompositeTest
            }
          };
          cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(textAttribute));
          cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(compositeAttribute));
          currentPage = openEditContentTypePage(contentType.code);

          deleteAttributeFromContentType(currentPage, mainAttrCode, contentType.code);
        });

      });

    });

    describe("Composite", () => {

      const compositeCode = "compCode";
      const compName      = "compo name";

      it("Add composite attribute", () => {
        currentPage = openEditContentTypePage(contentType.code);
        currentPage = currentPage.getContent().openAddAttributePage(TYPE_COMPOSITE);
        currentPage = fillAddListAttributeForm(currentPage, contentType.code, TYPE_COMPOSITE, compositeCode, TYPE_COMPOSITE);

        attributeCompositeTest.forEach(({type, code}) => {
          currentPage = addNewCompositeAttribute(currentPage, contentType.code, type, code);
        });
        currentPage = currentPage.getContent().continue();

        currentPage.getContent().getAttributesTable().should("contain", compositeCode);

        cy.contentTypeAttributeController(contentType.code).then(controller => controller.deleteAttribute(compositeCode));
      });

      it("Edit composite attribute - Add sub-attribute", () => {
        const attribute = {
          type: TYPE_COMPOSITE,
          code: compositeCode,
          compositeAttributes: attributeCompositeTest
        };
        cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(attribute));
        currentPage = openEditContentTypePage(contentType.code);

        currentPage = fillEditListAttributeForm(currentPage, contentType.code, TYPE_COMPOSITE, compositeCode, compName);
        currentPage = addNewCompositeAttribute(currentPage, contentType.code, "Image", "muImage");
        currentPage = currentPage.getContent().continue();

        cy.contentTypeAttributeController(contentType.code).then(controller => controller.deleteAttribute(compositeCode));
      });

      it("Edit composite attribute - Remove sub-attribute", () => {
        const toDelete = attributeCompositeTest.slice(0, 2);

        const attribute = {
          type: TYPE_COMPOSITE,
          code: compositeCode,
          compositeAttributes: attributeCompositeTest
        };
        cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(attribute));
        currentPage = openEditContentTypePage(contentType.code);

        currentPage = fillEditListAttributeForm(currentPage, contentType.code, TYPE_COMPOSITE, compositeCode, compName);
        toDelete.forEach(({code}) => {
          deleteAttributeFromContentType(currentPage, code, contentType.code, true);
        });

        cy.contentTypeAttributeController(contentType.code).then(controller => controller.deleteAttribute(compositeCode));
      });

      it("Delete composite attribute", () => {
        const textAttribute      = {
          type: "Text",
          code: "Text"
        };
        const compositeAttribute = {
          type: TYPE_COMPOSITE,
          code: compositeCode,
          compositeAttributes: attributeCompositeTest
        };
        cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(textAttribute));
        cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(compositeAttribute));
        currentPage = openEditContentTypePage(contentType.code);

        deleteAttributeFromContentType(currentPage, compositeCode, contentType.code);
      });

    });

    const openEditContentTypePage = (contentTypeCode) => {
      currentPage = openContentTypesPage();
      return currentPage.getContent().getKebabMenu(contentTypeCode).open().openEdit();
    };

    const fillAddListAttributeForm       = (page, contentTypeCode, attributeType, codeValue, nestedAttribute) => {
      const isArrayNested = ["Monolist", "List"].includes(attributeType);

      page.getContent().typeCode(codeValue);
      if (isArrayNested) {
        page.getContent().selectNestedAttributeType(nestedAttribute);
      }
      if (nestedAttribute !== "Composite") {
        currentPage = page.getContent().continue(attributeType);
      } else {
        currentPage = page.getContent().continue(nestedAttribute);
      }
      if (isArrayNested) {
        cy.location("pathname").should("eq", `/cms/content-type/attribute/${contentTypeCode}/MonolistAdd/${codeValue}`);

        if (nestedAttribute !== "Composite") {
          currentPage = currentPage.getContent().continue();
          cy.location("pathname").should("eq", `/cms/content-types/edit/${contentTypeCode}`);

          currentPage.getContent().getAttributesTable().should("contain", codeValue);
        }
      }
      return currentPage;
    };
    const fillEditListAttributeForm      = (page, contentTypeCode, attributeType, codeValue, nameEnValue, isMonolistComposite = false) => {
      const isArrayNested = ["Monolist", "List"].includes(attributeType);

      currentPage = page.getContent().getKebabMenu(codeValue).open().openEdit();
      cy.location("pathname").should("eq", `/cms/content-type/attribute/${contentTypeCode}/edit/${codeValue}`);

      currentPage.getContent().clearName("en");
      currentPage.getContent().typeName("en", nameEnValue);
      if (!isMonolistComposite) {
        currentPage = currentPage.getContent().continue(attributeType);
      } else {
        currentPage = currentPage.getContent().continue("Composite");
      }

      if (isArrayNested) {
        if (!isMonolistComposite) {
          cy.location("pathname").should("eq", `/cms/content-type/attribute/${contentTypeCode}/MonolistAdd/${codeValue}`);

          currentPage = currentPage.getContent().continue();
          cy.location("pathname").should("eq", `/cms/content-types/edit/${contentTypeCode}`);

          cy.log("check if new name of list attribute exists");
          currentPage.getContent().getAttributesTable().should("contain", nameEnValue);
        }
      }
      return currentPage;
    };
    const deleteAttributeFromContentType = (page, codeValue, contentTypeCode, forSubAttribute = false) => {
      cy.log(`Remove attribute ${codeValue} from ${contentTypeCode}`);
      page.getContent().getKebabMenu(codeValue).open().clickDelete();
      if (!forSubAttribute) {
        page.getDialog().getBody().getStateInfo().should("contain", codeValue);
        page.getDialog().confirm();
      }
      page.getContent().getAttributesTable().should("not.contain", codeValue);
    };
    const addNewCompositeAttribute       = (page, contentTypeCode, attributeType, codeValue) => {
      cy.log(`Add new composite attribute ${attributeType} to ${contentTypeCode}`);
      currentPage = page.getContent().openAddAttributePage(attributeType);
      currentPage.getContent().typeCode(codeValue);
      currentPage = currentPage.getContent().continue("", true);
      cy.log("check if new list attribute exists");
      currentPage.getContent().getAttributesTable().should("contain", codeValue);
      return currentPage;
    };

  });

  const generateRandomContentTypeCode = () => {
    let code = "";
    for (let i = 0; i < 3; i++) {
      code += String.fromCharCode("A".charCodeAt(0) + Math.random() * 26);
    }
    return code;
  };

  const postContentType          = (code, name) => cy.contentTypesController().then(controller => controller.addContentType(code, name));
  const deleteContentType        = (code) => cy.contentTypesController().then(controller => controller.deleteContentType(code));

  const openContentTypesPage = () => {
    cy.visit("/");
    let currentPage = new HomePage();
    currentPage     = currentPage.getMenu().getContent().open();
    return currentPage.openTypes();
  };

});
