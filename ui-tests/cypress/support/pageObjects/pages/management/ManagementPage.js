import {DATA_TESTID, htmlElements} from "../../WebElement.js";

import Content   from "../../app/Content.js";
import KebabMenu from "../../app/KebabMenu";

import AppPage      from "../../app/AppPage.js";
import DeleteDialog from "../../app/DeleteDialog";

import AddPage from "./AddPage.js";

export default class ManagementPage extends Content {

  tableContainer = `${htmlElements.div}.DDTable`;
  expandAll      = `${htmlElements.div}.PageTree__toggler--expand`;

  addButton = `${htmlElements.button}[${DATA_TESTID}=button-step-5]`;

  getTableContainer() {
    return this.get()
               .find(this.tableContainer)
               .children(htmlElements.table);
  }

  getExpandAll() {
    return this.getTableContainer()
               .children(htmlElements.thead)
               .find(this.expandAll);
  }

  getTableRows() {
    return this.getTableContainer()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new PagesKebabMenu(this, code);
  }

  getAddButton() {
    return this.get()
               .find(this.addButton);
  }

  clickExpandAll() {
    this.getExpandAll()
        .click();
  }

  openAddPagePage() {
    this.getAddButton().click();
    return new AppPage(AddPage);
  }

}

class PagesKebabMenu extends KebabMenu {

  add               = ".PageTreeActionMenuButton__menu-item-add";
  edit              = ".PageTreeActionMenuButton__menu-item-edit";
  design            = ".PageTreeActionMenuButton__menu-item-configure";
  clone             = ".PageTreeActionMenuButton__menu-item-clone";
  publish           = ".PageTreeActionMenuButton__menu-item-publish";
  unpublish         = ".PageTreeActionMenuButton__menu-item-unpublish";
  details           = ".PageTreeActionMenuButton__menu-item-details";
  delete            = ".PageTreeActionMenuButton__menu-item-delete";
  preview           = ".PageTreeActionMenuButton__menu-item-preview";
  viewPublishedPage = ".PageTreeActionMenuButton__menu-item-viewPublishedPage";

  getAdd() {
    return this.get()
               .find(this.add);
  }

  getEdit() {
    return this.get()
               .find(this.edit);
  }

  getDesign() {
    return this.get()
               .find(this.design);
  }

  getClone() {
    return this.get()
               .find(this.clone);
  }

  getPublish() {
    return this.get()
               .find(this.publish);
  }

  getUnpublish() {
    return this.get()
               .find(this.unpublish);
  }

  getDetails() {
    return this.get()
               .find(this.details);
  }

  getDelete() {
    return this.get()
               .find(this.delete);
  }

  getPreview() {
    return this.get()
               .find(this.preview);
  }

  getViewPublishedPage() {
    return this.get()
               .find(this.viewPublishedPage);
  }

  openAdd() {
    this.getAdd().click();
    return new AppPage(AddPage);
  }

  openEdit() {
    this.getAdd().click();
    return new AppPage(AddPage);
  }

  clickPublish() {
    this.getPublish().click();
    this.parent.parent.getDialog().setBody(DeleteDialog); //TODO validate for what else this dialog is used and rename it accordingly
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
