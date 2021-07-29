import {generateRandomId} from "../../support/utils";

import {htmlElements} from "../../support/pageObjects/WebElement";

import HomePage from "../../support/pageObjects/HomePage.js";

describe("Content Types", () => {

  let currentPage;

  let contentTypeCode;
  let contentTypeName;

  beforeEach(() => {
    cy.kcLogin("admin").as("tokens");

    contentTypeCode = generateRandomContentTypeCode();
    contentTypeName = generateRandomId();
  });

  afterEach(() => {
    cy.kcLogout();
  });

  describe("Unreferenced", () => {

    it("should have the functionality to add a new content type", () => {
      currentPage = openContentTypesPage();

      cy.log(`Add content type with code ${contentTypeCode}`);
      currentPage = currentPage.getContent().addContentType();
      currentPage = currentPage.getContent().addAndSaveContentType(contentTypeCode, contentTypeName);
      currentPage.getContent().getCodeInput().should("have.value", contentTypeCode).and("be.disabled");
      currentPage.getContent().getNameInput().should("have.value", contentTypeName);

      currentPage = currentPage.getContent().save();
      currentPage.getContent().getTableRow(contentTypeCode).find(htmlElements.td).eq(0).should("contain.text", contentTypeName);
      currentPage.getContent().getTableRow(contentTypeCode).find(htmlElements.td).eq(2).should("contain.text", contentTypeCode);

      deleteContentType(contentTypeCode);
    });

    it("should have the functionality to edit a content type", () => {
      postContentType(contentTypeCode, contentTypeName);
      currentPage = openContentTypesPage();

      cy.log(`Edit content type with code ${contentTypeCode}`);
      currentPage              = currentPage.getContent().editContentType(contentTypeCode);
      const newContentTypeName = generateRandomId();
      currentPage.getContent().clearName();
      currentPage.getContent().typeName(newContentTypeName);
      currentPage = currentPage.getContent().save();
      currentPage.getContent().getTableRow(contentTypeCode).find(htmlElements.td).eq(0).should("contain.text", newContentTypeName);

      deleteContentType(contentTypeCode);
    });

    it("should allow deleting a content type not referenced by a published content", () => {
      postContentType(contentTypeCode, contentTypeName);
      currentPage = openContentTypesPage();

      cy.log(`Delete content type with code ${contentTypeCode}`);
      currentPage.getContent().deleteContentType(contentTypeCode);
      currentPage.getContent().getTable().should("not.contain", contentTypeCode);
    });

  });

  describe("Referenced by published content", () => {

    let contentId;

    beforeEach(() => {
      postContentType(contentTypeCode, contentTypeName);
      createAndPublishTestContent(contentTypeCode);
    });

    afterEach(() => {
      deleteContent(contentId);
      deleteContentType(contentTypeCode);
    });

    it("should not allow deleting a content type", () => {
      currentPage = openContentTypesPage();

      cy.log(`Delete content type with code ${contentTypeCode}`);
      currentPage.getContent().deleteContentType(contentTypeCode);
      cy.validateToast(currentPage, false, contentTypeCode);
    });

    it("should allow adding an attribute", () => {
      currentPage = openContentTypesPage();

      const testAttribute = "Text";
      currentPage         = currentPage.getContent().editContentType(contentTypeCode);
      currentPage         = currentPage.getContent().addAttribute(testAttribute);

      currentPage.getContent().typeCode(testAttribute);
      currentPage = currentPage.getContent().continue();
      currentPage.getContent().getAttributesTable().should("contain", testAttribute);
    });

    it("should allow updating an attribute", () => {
      currentPage         = openContentTypesPage();
      const testAttribute = {type: "Text", code: "Text"};
      postContentTypeAttribute(contentTypeCode, testAttribute);

      currentPage = currentPage.getContent().editContentType(contentTypeCode);
      currentPage = currentPage.getContent().getKebabMenu(testAttribute.code).open().openEdit();
      currentPage.getContent().clearName();
      const newAttributeName = "Text2";
      currentPage.getContent().typeName(newAttributeName);
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

    const CONTENT_TYPE_CODE = "BNR";
    const TYPE_MONOLIST     = "Monolist";
    const TYPE_COMPOSITE    = "Composite";

    const attributeCompositeTest = [
      {
        type: "Hypertext",
        codeValue: "httext",
        nameEnValue: "Le Hyper Text"
      },
      {
        type: "Link",
        codeValue: "myLink",
        nameEnValue: "My Link"
      },
      {
        type: "Timestamp",
        codeValue: "currStamp",
        nameEnValue: "Curr Stamp"
      }
    ];

    beforeEach(() => {
      currentPage = openContentTypeFormWith(CONTENT_TYPE_CODE);
    });

    describe("List", () => {

      const TYPE_LIST = "List";

      beforeEach(() => {
        currentPage = addNewContentTypeAttribute(currentPage, CONTENT_TYPE_CODE, TYPE_LIST);
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
          {
            type: "CheckBox",
            codeValue: "checki",
            nameEnValue: "Checki"
          },
          {
            type: "Email",
            codeValue: "emaili",
            nameEnValue: "Emaili"
          },
          {
            type: "Date",
            codeValue: "dati",
            nameEnValue: "Daeti"
          }
        ];

        attributeListTest.forEach(({type, codeValue, nameEnValue}) => {
          it(`${type}`, () => {
            currentPage = fillAddListAttributeForm(currentPage, type, codeValue, CONTENT_TYPE_CODE, TYPE_LIST);
            currentPage = fillEditListAttributeForm(currentPage, nameEnValue, codeValue, CONTENT_TYPE_CODE, TYPE_LIST);
            deleteAttributeFromContentType(currentPage, codeValue, CONTENT_TYPE_CODE);
          });
        });

      });

    });

    describe("Monolist", () => {

      beforeEach(() => {
        currentPage = addNewContentTypeAttribute(currentPage, CONTENT_TYPE_CODE, TYPE_MONOLIST);
      });

      it("Un-allowed nested attribute types", () => {
        currentPage.getContent().getNestedAttributeType()
                   .should("not.contain", "Monolist")
                   .and("not.contain", "List");
      });

      describe("examples of nested attribute types that are allowed in Monolist attribute", () => {

        const attributeMonolistTest = [
          {
            type: "Text",
            codeValue: "nicetext",
            nameEnValue: "Nice Text"
          },
          {
            type: "Image",
            codeValue: "myImage",
            nameEnValue: "My Image"
          },
          {
            type: "Attach",
            codeValue: "myAttach",
            nameEnValue: "My Attach"
          }
        ];

        attributeMonolistTest.forEach(({type, codeValue, nameEnValue}) => {
          it(`${type} attribute nested`, () => {
            currentPage = fillAddListAttributeForm(currentPage, type, codeValue, CONTENT_TYPE_CODE, TYPE_MONOLIST);
            currentPage = fillEditListAttributeForm(currentPage, nameEnValue, codeValue, CONTENT_TYPE_CODE, TYPE_MONOLIST);
            deleteAttributeFromContentType(currentPage, codeValue, CONTENT_TYPE_CODE);
          });
        });

      });

    });

    describe("Composite", () => {
      const compositeCode = "compCode";
      const compName      = "compo name";

      it("Add composite attribute", () => {
        currentPage = addNewContentTypeAttribute(currentPage, CONTENT_TYPE_CODE, TYPE_COMPOSITE);

        currentPage = fillAddListAttributeForm(currentPage, TYPE_COMPOSITE, compositeCode, CONTENT_TYPE_CODE, TYPE_COMPOSITE);
        attributeCompositeTest.forEach((subAttribute) => {
          currentPage = addNewCompositeAttribute(currentPage, subAttribute.type, subAttribute.codeValue, CONTENT_TYPE_CODE);
        });
        currentPage = currentPage.getContent().continue();
        cy.log("check if new list attribute exists");
        currentPage.getContent().getAttributesTable().should("contain", compositeCode);

        deleteAttributeFromContentType(currentPage, compositeCode, CONTENT_TYPE_CODE);
      });

      it("Edit composite attribute - Add sub-attribute", () => {
        currentPage = addNewContentTypeAttribute(currentPage, CONTENT_TYPE_CODE, TYPE_COMPOSITE);
        currentPage = fillAddListAttributeForm(currentPage, TYPE_COMPOSITE, compositeCode, CONTENT_TYPE_CODE, TYPE_COMPOSITE);
        currentPage = addNewCompositeAttribute(currentPage, attributeCompositeTest[0].type, attributeCompositeTest[0].codeValue, CONTENT_TYPE_CODE);
        currentPage = currentPage.getContent().continue();

        currentPage = fillEditListAttributeForm(currentPage, compName, compositeCode, CONTENT_TYPE_CODE, TYPE_COMPOSITE);
        currentPage = addNewCompositeAttribute(currentPage, "Image", "muImage", CONTENT_TYPE_CODE);
        currentPage = currentPage.getContent().continue();

        deleteAttributeFromContentType(currentPage, compositeCode, CONTENT_TYPE_CODE);
      });

      it("Edit composite attribute - Remove sub-attribute", () => {
        currentPage = addNewContentTypeAttribute(currentPage, CONTENT_TYPE_CODE, TYPE_COMPOSITE);
        currentPage = fillAddListAttributeForm(currentPage, TYPE_COMPOSITE, compositeCode, CONTENT_TYPE_CODE, TYPE_COMPOSITE);
        attributeCompositeTest.forEach((subAttribute) => {
          currentPage = addNewCompositeAttribute(currentPage, subAttribute.type, subAttribute.codeValue, CONTENT_TYPE_CODE);
        });
        currentPage = currentPage.getContent().continue();

        const toDelete = attributeCompositeTest.slice(0, 2);

        currentPage = fillEditListAttributeForm(currentPage, compName, compositeCode, CONTENT_TYPE_CODE, TYPE_COMPOSITE);
        toDelete.forEach((attr) => {
          deleteAttributeFromContentType(currentPage, attr.codeValue, CONTENT_TYPE_CODE, true);
        });

        currentPage = currentPage.getContent().continue();

        deleteAttributeFromContentType(currentPage, compositeCode, CONTENT_TYPE_CODE);
      });

      it("Delete composite attribute", () => {
        currentPage = addNewContentTypeAttribute(currentPage, CONTENT_TYPE_CODE, TYPE_COMPOSITE);
        currentPage = fillAddListAttributeForm(currentPage, TYPE_COMPOSITE, compositeCode, CONTENT_TYPE_CODE, TYPE_COMPOSITE);
        currentPage = addNewCompositeAttribute(currentPage, attributeCompositeTest[0].type, attributeCompositeTest[0].codeValue, CONTENT_TYPE_CODE);
        currentPage = currentPage.getContent().continue();

        deleteAttributeFromContentType(currentPage, compositeCode, CONTENT_TYPE_CODE);
      });

    });

    describe("Monolist Composite", () => {

      const mainAttrCode = "mocoCode";
      const mainAttrName = "Mono compo name";

      it("Add monolist composite attribute", () => {
        currentPage = addNewContentTypeAttribute(currentPage, CONTENT_TYPE_CODE, TYPE_MONOLIST);
        currentPage = fillAddListAttributeForm(currentPage, TYPE_COMPOSITE, mainAttrCode, CONTENT_TYPE_CODE, TYPE_MONOLIST);

        attributeCompositeTest.forEach((subAttribute) => {
          currentPage = addNewCompositeAttribute(
              currentPage,
              subAttribute.type,
              subAttribute.codeValue,
              CONTENT_TYPE_CODE
          );
        });
        currentPage = currentPage.getContent().continue();

        cy.log("check if new list attribute exists");
        currentPage.getContent().getAttributesTable().should("contain", mainAttrCode);

        deleteAttributeFromContentType(currentPage, mainAttrCode, CONTENT_TYPE_CODE);
      });

      it("Edit monolist composite attribute - Add sub-attribute", () => {
        currentPage = addNewContentTypeAttribute(currentPage, CONTENT_TYPE_CODE, TYPE_MONOLIST);
        currentPage = fillAddListAttributeForm(currentPage, TYPE_COMPOSITE, mainAttrCode, CONTENT_TYPE_CODE, TYPE_MONOLIST);
        currentPage = addNewCompositeAttribute(currentPage, attributeCompositeTest[0].type, attributeCompositeTest[0].codeValue, CONTENT_TYPE_CODE);
        currentPage = currentPage.getContent().continue();

        currentPage = fillEditListAttributeForm(currentPage, mainAttrName, mainAttrCode, CONTENT_TYPE_CODE, TYPE_MONOLIST, true);
        currentPage = addNewCompositeAttribute(currentPage, "Image", "muImage", CONTENT_TYPE_CODE);

        currentPage = currentPage.getContent().continue();

        deleteAttributeFromContentType(currentPage, mainAttrCode, CONTENT_TYPE_CODE);
      });

      it("Edit monolist composite attribute - Remove sub-attribute", () => {
        currentPage = addNewContentTypeAttribute(currentPage, CONTENT_TYPE_CODE, TYPE_MONOLIST);
        currentPage = fillAddListAttributeForm(currentPage, TYPE_COMPOSITE, mainAttrCode, CONTENT_TYPE_CODE, TYPE_MONOLIST);

        attributeCompositeTest.forEach((subAttribute) => {
          currentPage = addNewCompositeAttribute(currentPage, subAttribute.type, subAttribute.codeValue, CONTENT_TYPE_CODE);
        });
        currentPage = currentPage.getContent().continue();

        const toDelete = attributeCompositeTest.slice(0, 2);

        currentPage = fillEditListAttributeForm(currentPage, mainAttrName, mainAttrCode, CONTENT_TYPE_CODE, TYPE_MONOLIST, true);
        toDelete.forEach((attr) => {
          deleteAttributeFromContentType(currentPage, attr.codeValue, CONTENT_TYPE_CODE, true);
        });

        currentPage = currentPage.getContent().continue(TYPE_MONOLIST);
        currentPage = currentPage.getContent().continue();

        deleteAttributeFromContentType(currentPage, mainAttrCode, CONTENT_TYPE_CODE);
      });

      it("Delete monolist composite attribute", () => {
        currentPage = addNewContentTypeAttribute(currentPage, CONTENT_TYPE_CODE, TYPE_MONOLIST);
        currentPage = fillAddListAttributeForm(currentPage, TYPE_COMPOSITE, mainAttrCode, CONTENT_TYPE_CODE, TYPE_MONOLIST);
        currentPage = addNewCompositeAttribute(currentPage, attributeCompositeTest[0].type, attributeCompositeTest[0].codeValue, CONTENT_TYPE_CODE);
        currentPage = currentPage.getContent().continue();

        deleteAttributeFromContentType(currentPage, mainAttrCode, CONTENT_TYPE_CODE);
      });

    });

    const openContentTypeFormWith = (contentTypeCode) => {
      cy.log(`Edit content type ${contentTypeCode}`);
      currentPage = openContentTypesPage();
      currentPage = currentPage.getContent().editContentType(contentTypeCode);
      cy.location("pathname").should("eq", `/cms/content-types/edit/${contentTypeCode}`);
      return currentPage;
    };

    const addNewContentTypeAttribute = (page, contentTypeCode, attributeType) => {
      cy.log(`Add new content type attribute ${attributeType} to ${contentTypeCode}`);
      currentPage = page.getContent().addAttribute(attributeType);
      cy.location("pathname").should("eq", `/cms/content-type/attribute/${contentTypeCode}/add`);
      return currentPage;
    };

    const fillAddListAttributeForm       = (page, nestedAttribute, codeValue, contentTypeCode, attributeType = "List") => {
      const isArrayNested = ["Monolist", "List"].includes(attributeType);
      cy.log(`Add a nested attribute ${attributeType} with attribute ${codeValue} for ${contentTypeCode}`);
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

          cy.log("check if new list attribute exists");
          currentPage.getContent().getAttributesTable().should("contain", codeValue);
        }
      }
      return currentPage;
    };
    const fillEditListAttributeForm      = (page, nameEnValue, codeValue, contentTypeCode, attributeType = "List", isMonolistComposite = false) => {
      const isArrayNested = ["Monolist", "List"].includes(attributeType);
      cy.log(`Edit attribute ${codeValue} for ${contentTypeCode}`);

      currentPage = page.getContent().getKebabMenu(codeValue).open().openEdit();
      cy.location("pathname").should("eq", `/cms/content-type/attribute/${contentTypeCode}/edit/${codeValue}`);

      currentPage.getContent().clearName();
      currentPage.getContent().typeName(nameEnValue);
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
    const addNewCompositeAttribute       = (page, attributeType, codeValue, contentTypeCode) => {
      cy.log(`Add new composite attribute ${attributeType} to ${contentTypeCode}`);
      currentPage = page.getContent().addAttribute(attributeType);
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

  const postContentType          = (code, name) => cy.contentTypesController().then(controller => controller.postContentType(code, name));
  const postContentTypeAttribute = (code, attribute) => cy.contentTypesController().then(controller => controller.postContentTypeAttribute(code, attribute));
  const deleteContentType        = (code) => cy.contentTypesController().then(controller => controller.deleteContentType(code));

  const openContentTypesPage = () => {
    cy.visit("/");
    let currentPage = new HomePage();
    currentPage     = currentPage.getMenu().getContent().open();
    return currentPage.openTypes();
  };

});
