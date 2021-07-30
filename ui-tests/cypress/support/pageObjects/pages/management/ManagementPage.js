import {DATA_TESTID, htmlElements} from "../../WebElement.js";

import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import AddPage from "./AddPage.js";
import KebabMenu from '../../app/KebabMenu'
import DeleteDialog from "../../app/DeleteDialog";

export default class ManagementPage extends Content {
    add = `[${DATA_TESTID}=button-step-5]`;
    tableContainer = `${htmlElements.div}.DDTable table`;
    pageName = `[${DATA_TESTID}=common_PageTree_span]`;
    optionsMenu = `#WidgetListRow-dropown`;
    addChild = `[aria-labelledby=WidgetListRow-dropown] li:nth-child(1) a`;
    publishChild = `[aria-labelledby=WidgetListRow-dropown] li:nth-child(5) a`;
    deleteChild = `[aria-labelledby=WidgetListRow-dropown] li:nth-child(7) a`;
    expandAll = `${htmlElements.div}.PageTree__toggler--expand`;
    errorsAlertContainer = `[${DATA_TESTID}=form_ErrorsAlert_div]`;

    getAddButton() {
        return this.get().find(this.add);
    }

    getTableContainer () {
        return this.get().find(this.tableContainer);
    }

    getTableRows() {
        return this.getTableContainer()
                    .children(htmlElements.tbody)
                    .children(htmlElements.tr);
    }

    getErrorsContainer() {
        return this.get().find(this.errorsAlertContainer);
    }

    getKebabMenu(code) {
        return new PagesKebabMenu(this, code);
    }

    getExpandAll() {
        return this.get().find(this.expandAll);
    }

    clickExpandAll() {
        this.getExpandAll().click();
    }

    getPublishChild (name) {
        return this.getOptionsMenu(name).click().parent().find(this.publishChild);
    }

    getDeleteChild (name) {
        return this.getOptionsMenu(name).click().parent().find(this.deleteChild);
    }

    clickAddChild (name) {
        this.getOptionsMenu(name).click().parent().find(this.addChild).click();
        return new AppPage(AddPage);
    }

    clickAddButton() {
        this.getAddButton().click();
        return new AppPage(AddPage);
    }
}

class PagesKebabMenu extends KebabMenu {

    getAdd() {
      return this.get()
                 .find('.PageTreeActionMenuButton__menu-item-add');
    }

    getEdit() {
      return this.get()
                 .find('.PageTreeActionMenuButton__menu-item-edit');
    }
  
    getDesign() {
      return this.get()
                 .find('.PageTreeActionMenuButton__menu-item-configure');
    }
  
    getClone() {
      return this.get()
                 .find('.PageTreeActionMenuButton__menu-item-clone');
    }
  
    getPublish() {
      return this.get()
                 .find('.PageTreeActionMenuButton__menu-item-publish');
    }
  
    getDetails() {
      return this.get()
                 .find('.PageTreeActionMenuButton__menu-item-details');
    }
  
    getDelete() {
      return this.get()
                 .find('.PageTreeActionMenuButton__menu-item-delete');
    }
  
    getPreview() {
      return this.get()
                 .find('.PageTreeActionMenuButton__menu-item-preview');
    }
  
    getViewPublishedPage() {
      return this.get()
                 .find('.PageTreeActionMenuButton__menu-item-viewPublishedPage');
    }

    openAdd() {
        this.getAdd().click();
        return new AppPage(AddPage);
    }

    openEdit() {
        this.getAdd().click();
        return new AppPage(AddPage);
    }

    clickDelete() {
        this.getDelete().click();
        this.parent.parent.getDialog().setBody(DeleteDialog);
    }
  
  }
