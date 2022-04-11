import {htmlElements} from '../../WebElement';

import KebabMenu from '../../app/KebabMenu';

import AppPage      from '../../app/AppPage.js';
import DeleteDialog from '../../app/DeleteDialog';
import AddPage      from './AddPage.js';
import ClonePage    from './ClonePage';
import DesignerPage from '../designer/DesignerPage';

export default class PagesKebabMenu extends KebabMenu {

  add               = '.PageTreeActionMenuButton__menu-item-add';
  edit              = '.PageTreeActionMenuButton__menu-item-edit';
  design            = '.PageTreeActionMenuButton__menu-item-configure';
  clone             = '.PageTreeActionMenuButton__menu-item-clone';
  publish           = '.PageTreeActionMenuButton__menu-item-publish';
  unpublish         = '.PageTreeActionMenuButton__menu-item-unpublish';
  details           = '.PageTreeActionMenuButton__menu-item-details';
  delete            = '.PageTreeActionMenuButton__menu-item-delete';
  preview           = '.PageTreeActionMenuButton__menu-item-preview';
  viewPublishedPage = '.PageTreeActionMenuButton__menu-item-viewPublishedPage';


  get() {
    return this.parent.getTableRow(this.code)
               .find(`${htmlElements.div}[role="none"]`)
               .children(htmlElements.div);
  }

  open() {
    this.get()
        .children(`${htmlElements.button}[id="WidgetListRow-dropown"]`)
        .click();
    return this;
  }

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
    this.getEdit().click();
    return new AppPage(AddPage);
  }

  clickPublish() {
    this.getPublish().click();
    this.parent.parent.getDialog().setBody(DeleteDialog); //TODO validate for what else this dialog is used and rename it accordingly
  }

  clickUnpublish() {
    this.getUnpublish().click();
    this.parent.parent.getDialog().setBody(DeleteDialog); //TODO validate for what else this dialog is used and rename it accordingly
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

  clickClone() {
    this.getClone().click();
    return new AppPage(ClonePage);
  }

  openDesigner() {
    this.getDesign().click();
    return new AppPage(DesignerPage);
  }

}
