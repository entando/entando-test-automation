import {
  TEST_ID_COMPONENT_LIST_BUTTON,
  FIELD_NAME_TITLE_EN,
  TEST_ID_WIDGETFORM_SAVE_DROPDOWNBTN,
  EDIT_ACTION_CLASSNAME,
  DELETE_ACTION_CLASSNAME
} from "../../test-const/components-test-const";

import HomePage from "../../support/pageObjects/HomePage.js";

import DesignerPage   from "../../support/pageObjects/pages/designer/DesignerPage";
import MFEWidgetsPage from "../../support/pageObjects/components/mfeWidgets/MFEWidgetsPage";

const {CMS_WIDGETS, SYSTEM_WIDGETS, PAGE_WIDGETS} = DesignerPage;

const SAMPLE_BASIC_WIDGET_ID  = "my_widget";
const SAMPLE_DUPE_WIDGET_CODE = "mio_widget";

const PAGE = {
  title: "My Homepage",
  code: "my_homepage"
};

describe("Microfrontends and Widgets", () => {
  let currentPage;

  afterEach(() => {
    cy.kcLogout();
  });

  describe("Widgets CRUD", () => {
    beforeEach(() => {
      cy.kcLogin("admin").as("tokens");

      cy.visit("/");
      currentPage = new HomePage();
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
    });

    it("Adding a basic widget with icon", () => {
      cy.getByTestId(TEST_ID_COMPONENT_LIST_BUTTON).contains("Add").click();
      cy.validateUrlChanged("/widget/add");
      cy.wait(500);
      cy.fillUpWidgetForm("My Widget", SAMPLE_BASIC_WIDGET_ID);
      cy.getByTestId(TEST_ID_WIDGETFORM_SAVE_DROPDOWNBTN).click();
      cy.get(".FragmentForm__dropdown [role=menu]").contains("Save").click();
      cy.validateUrlChanged("/widget");
      cy.get("table").should("contain", SAMPLE_BASIC_WIDGET_ID);
    });

    it("Editing the widget we just made", () => {
      cy.openTableActionsByTestId(SAMPLE_BASIC_WIDGET_ID);
      cy.getVisibleActionItemByClass(EDIT_ACTION_CLASSNAME).click();
      cy.wait(500);
      cy.validateUrlChanged(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      cy.getByName(FIELD_NAME_TITLE_EN).clear();
      cy.getByName(FIELD_NAME_TITLE_EN).type("Your Widget");
      cy.getByTestId(TEST_ID_WIDGETFORM_SAVE_DROPDOWNBTN).click();
      cy.get(".FragmentForm__dropdown [role=menu]").contains("Save and continue").click();
      cy.location("pathname").should("not.eq", "/widget");
      cy.validateUrlChanged(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      cy.openPageFromMenu(["Components", "MFE & Widgets"]);
      cy.wait(500);
      cy.get("table").should("contain", "Your Widget");
    });

    it("Delete the widget we just made", () => {
      cy.openTableActionsByTestId(SAMPLE_BASIC_WIDGET_ID);
      cy.getVisibleActionItemByClass(DELETE_ACTION_CLASSNAME).click();
      cy.getModalDialogByTitle("Delete").should("be.visible");
      cy.getButtonByText("Delete").click();
      cy.get("table").should("not.contain", SAMPLE_BASIC_WIDGET_ID);
    });
  });

  describe("Widget Usages", () => {

    const selectPageFromSidebar = (pageOpen = PAGE) => {
      const currentPageContent = currentPage.getContent();
      currentPageContent.getSidebarTab("Page Tree").click();
      cy.wait(3000);
      currentPageContent.getPageTreeItem(pageOpen.title).click({force: true});
      currentPageContent.getSidebarTab("Widgets").click();
    };

    beforeEach(() => {
      cy.kcLogin("admin").as("tokens");

      cy.visit("/");
      currentPage = new HomePage();
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
    });

    describe("CMS Content Widget", () => {
      const WIDGET_FRAME = {
        frameName: "Frame 3",
        frameNum: 6
      };

      it("Basic add with widget settings", () => {
        selectPageFromSidebar();
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT, WIDGET_FRAME.frameName);

        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
        currentPage.getContent().getAddContentButton().click();
        cy.wait(3000);

        currentPage.getContent().getSelectContentModal().getCheckboxFromTitle("Sample - About Us").click({force: true});
        currentPage.getContent().getSelectContentModal().getChooseButton().click();
        cy.wait(500);

        currentPage = currentPage.getContent().confirmConfig();
        cy.wait(500);

        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Basic edit with widget settings", () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.SETTINGS, CMS_WIDGETS.CONTENT);
        cy.wait(500);

        currentPage.getContent().getChangeContentButton().click();


        cy.wait(4500);
        currentPage.getContent().getSelectContentModal().getCheckboxFromTitle("Sample Banner").click({force: true});
        currentPage.getContent().getSelectContentModal().getChooseButton().click();
        cy.wait(500);

        currentPage = currentPage.getContent().confirmConfig();
        cy.wait(500);

        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Open Widget Details from the widget dropped", () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.CONTENT);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.CONTENT.code}`);
      });

      it("Save As Widget", () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.SAVE_AS, CMS_WIDGETS.CONTENT);

        cy.validateUrlChanged(`/page/${PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT.code}/viewerConfig`);
        currentPage.getContent().fillWidgetForm("Mio Widget", SAMPLE_DUPE_WIDGET_CODE, "", "Free Access");
        currentPage.getContent().getConfigTabConfiguration().should("exist");
        currentPage.getContent().getConfigTabConfiguration().click();
        cy.wait(500);
        currentPage.getContent().getFormBody().contains("Change content").should("exist");
        currentPage = currentPage.getContent().submitCloneWidget();

        cy.wait(4500);
        cy.validateUrlChanged(`/page/configuration/${PAGE.code}`);

        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Test widget cleanup", () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.CONTENT);
        currentPage.getContent().publishPageDesign();
        cy.wait(1000);

        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByWidgetCode(
            SAMPLE_DUPE_WIDGET_CODE,
            MFEWidgetsPage.WIDGET_ACTIONS.DELETE
        );
        currentPage.getDialog().getConfirmButton().click();
        currentPage.getContent().getListArea().should("not.contain", SAMPLE_DUPE_WIDGET_CODE);
      });
    });

    describe("CMS Content List Widget", () => {
      const WIDGET_FRAME = {
        frameName: "Frame 4",
        frameNum: 7
      };

      it("Basic add with widget settings", () => {
        selectPageFromSidebar();
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT_LIST, WIDGET_FRAME.frameName);

        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
        cy.wait(5000);
        currentPage.getContent().getContentListTableRowWithTitle("Sample - About Us").contains("Add").click();
        currentPage.getContent().getContentListTableRowWithTitle("Sample Banner").contains("Add").click();
        cy.wait(500);
        currentPage.getContent().getModelIdDropdownByIndex(0).select("2-column-content");
        currentPage.getContent().getModelIdDropdownByIndex(1).select("Banner - Text, Image, CTA");
        currentPage = currentPage.getContent().confirmConfig();

        cy.wait(500);
        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Open Widget Details from the widget dropped", () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.CONTENT_LIST);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.CONTENT_LIST.code}`);
      });

      it("Save As Widget", () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.SAVE_AS, CMS_WIDGETS.CONTENT_LIST);

        cy.validateUrlChanged(`/page/${PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_LIST.code}/rowListViewerConfig`);
        currentPage.getContent().fillWidgetForm("Mio Widget", SAMPLE_DUPE_WIDGET_CODE, "", "Free Access");
        currentPage.getContent().getConfigTabConfiguration().should("exist");
        currentPage.getContent().getConfigTabConfiguration().click();
        cy.wait(500);
        currentPage.getContent().getFormBody().contains("Content list").should("exist");
        currentPage = currentPage.getContent().submitCloneWidget();

        cy.wait(4500);
        cy.validateUrlChanged(`/page/configuration/${PAGE.code}`);

        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Test widget cleanup", () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.CONTENT_LIST);
        currentPage.getContent().publishPageDesign();
        cy.wait(1000);

        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByWidgetCode(
            SAMPLE_DUPE_WIDGET_CODE,
            MFEWidgetsPage.WIDGET_ACTIONS.DELETE
        );
        currentPage.getDialog().getConfirmButton().click();
        currentPage.getContent().getListArea().should("not.contain", SAMPLE_DUPE_WIDGET_CODE);
      });
    });

    describe("CMS Content Search Query Widget", () => {
      const WIDGET_FRAME = {
        frameName: "Frame 3",
        frameNum: 6
      };

      it("Basic add with widget settings", () => {
        selectPageFromSidebar();
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT_QUERY, WIDGET_FRAME.frameName);

        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
        currentPage.getContent().getContentTypeField().select("Banner");
        cy.wait(2500);
        currentPage.getContent().getPublishSettingsAccordButton().click();
        cy.wait(500);
        currentPage.getContent().getMaxElemForItemDropdown().select("10");
        currentPage = currentPage.getContent().confirmConfig();

        cy.wait(500);
        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Open Widget Details from the widget dropped", () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.CONTENT_QUERY);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.CONTENT_QUERY.code}`);
      });

      it("Save As Widget", () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.SAVE_AS, CMS_WIDGETS.CONTENT_QUERY);

        cy.validateUrlChanged(`/page/${PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_QUERY.code}/listViewerConfig`);
        currentPage.getContent().fillWidgetForm("Mio Widget", SAMPLE_DUPE_WIDGET_CODE, "", "Free Access");
        currentPage.getContent().getConfigTabConfiguration().should("exist");
        currentPage.getContent().getConfigTabConfiguration().click();
        cy.wait(500);
        currentPage.getContent().getFormBody().contains(/^Publishing settings$/i).should("exist");
        currentPage = currentPage.getContent().submitCloneWidget();

        cy.wait(4500);
        cy.validateUrlChanged(`/page/configuration/${PAGE.code}`);

        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Test widget cleanup", () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.CONTENT_QUERY);
        currentPage.getContent().publishPageDesign();
        cy.wait(1000);

        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByWidgetCode(
            SAMPLE_DUPE_WIDGET_CODE,
            MFEWidgetsPage.WIDGET_ACTIONS.DELETE
        );
        currentPage.getDialog().getConfirmButton().click();
        currentPage.getContent().getListArea().should("not.contain", SAMPLE_DUPE_WIDGET_CODE);
      });
    });

    describe("CMS Search Form and Search Results Widgets", () => {
      const THE_PAGE = {
        title: "Sitemap",
        code: "sitemap"
      };

      const WIDGET_FRAME_1 = {
        frameName: "Frame 2",
        frameNum: 5
      };

      const WIDGET_FRAME_2 = {
        frameName: "Frame 3",
        frameNum: 6
      };

      it("Basic add", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.SEARCH_FORM, WIDGET_FRAME_1.frameName);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.SEARCH_RESULT, WIDGET_FRAME_2.frameName);
        cy.wait(500);

        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Open Widget Details from the dropped CMS Search Form widget", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.SEARCH_FORM);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.SEARCH_FORM.code}`);
      });

      it("Open Widget Details from the dropped CMS Search Results widget", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.SEARCH_RESULT);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.SEARCH_RESULT.code}`);
      });

      it("Test widget cleanup", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.SEARCH_FORM);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.SEARCH_RESULT);

        currentPage.getContent().publishPageDesign();
        cy.wait(500);
      });
    });

    describe("CMS News Archive and News Latest Widgets", () => {
      const THE_PAGE = {
        title: "Sitemap",
        code: "sitemap"
      };

      const WIDGET_FRAME_1 = {
        frameName: "Frame 2",
        frameNum: 5
      };

      const WIDGET_FRAME_2 = {
        frameName: "Frame 3",
        frameNum: 6
      };

      it("Basic add", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.NEWS_ARCHIVE, WIDGET_FRAME_1.frameName);
        cy.wait(500);
        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.NEWS_LATEST, WIDGET_FRAME_2.frameName);
        cy.wait(500);

        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Open Widget Details from the dropped CMS Search Form widget", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.NEWS_ARCHIVE);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
      });

      it("Open Widget Details from the dropped CMS Search Results widget", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.NEWS_LATEST);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.NEWS_LATEST.code}`);
      });

      it("Test widget cleanup", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.NEWS_ARCHIVE);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.NEWS_LATEST);

        currentPage.getContent().publishPageDesign();
        cy.wait(500);
      });
    });

    describe("Page Widgets - Language and Logo", () => {
      const THE_PAGE = {
        title: "Sitemap",
        code: "sitemap"
      };

      const WIDGET_FRAME_1 = {
        frameName: "Frame 2",
        frameNum: 5
      };

      const WIDGET_FRAME_2 = {
        frameName: "Frame 3",
        frameNum: 6
      };

      it("Basic add", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(PAGE_WIDGETS.LANGUAGE, WIDGET_FRAME_1.frameName);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(PAGE_WIDGETS.LOGO, WIDGET_FRAME_2.frameName);
        cy.wait(500);

        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Open Widget Details from the dropped Language widget", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, PAGE_WIDGETS.LANGUAGE);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${PAGE_WIDGETS.LANGUAGE.code}`);
      });

      it("Open Widget Details from the dropped Logo widget", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, PAGE_WIDGETS.LOGO);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${PAGE_WIDGETS.LOGO.code}`);
      });

      it("Test widget cleanup", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, PAGE_WIDGETS.LANGUAGE);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, PAGE_WIDGETS.LOGO);

        currentPage.getContent().publishPageDesign();
        cy.wait(500);
      });
    });

    describe("System Widgets - APIs and System Messages", () => {
      const THE_PAGE = {
        title: "Sitemap",
        code: "sitemap"
      };

      const WIDGET_FRAME_1 = {
        frameName: "Frame 2",
        frameNum: 5
      };

      const WIDGET_FRAME_2 = {
        frameName: "Frame 3",
        frameNum: 6
      };

      it("Basic add", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(SYSTEM_WIDGETS.APIS, WIDGET_FRAME_1.frameName);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(SYSTEM_WIDGETS.SYS_MSGS, WIDGET_FRAME_2.frameName);
        cy.wait(500);

        currentPage.getContent().getPageStatus().should("match", /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should("match", /^Published$/);
      });

      it("Open Widget Details from the dropped APIs widget", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, SYSTEM_WIDGETS.APIS);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${SYSTEM_WIDGETS.APIS.code}`);
      });

      it("Open Widget Details from the dropped System Messages widget", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, SYSTEM_WIDGETS.SYS_MSGS);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
      });

      it("Test widget cleanup", () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, SYSTEM_WIDGETS.APIS);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, SYSTEM_WIDGETS.SYS_MSGS);

        currentPage.getContent().publishPageDesign();
        cy.wait(500);
      });
    });
  });
});
