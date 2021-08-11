import {htmlElements} from '../../WebElement.js';

import Content  from '../../app/Content.js';
import AddPage  from './AddPage';
import EditPage from './EditPage';
import AppPage  from '../../app/AppPage';

export default class ManagementPage extends Content {

  contentTabs   = `${htmlElements.div}#secondary-tabs-1`;
  contentLink   = `${htmlElements.div}.Contents__main-action-button`;
  actionOptions = `${htmlElements.ul}.dropdown-menu`;
  actionOption  = `${htmlElements.li}`;

  contentsTableDiv        = `${htmlElements.div}.Contents__table`;
  contentsKebabMenu       = `${htmlElements.div}.dropdown-kebab-pf`;
  contentsKebabMenuButton = `${htmlElements.button}`;
  contentsKebabMenuAction = `${htmlElements.li}`;


  modalDeleteButton = `${htmlElements.button}#DeleteContentModal__button-delete`;

  getAddButton() {
    return this.getContents()
               .get(this.contentLink).eq(0).click()
               .find(this.actionOptions)
               .find(this.actionOption).eq(0);
  }

  getTable() {
    return this.getContents()
               .find(htmlElements.table);
  }

  getTableRowAction(code) {
    return this.getTable()
               .find(`${htmlElements.button}#actionsKebab_${code}`);
  }

  openAddContentPage() {
    this.getAddButton().click();
    cy.wait(1000);
    return new AppPage(AddPage);
  }

  openEditContentPage() {
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenu).eq(0)
        .find(this.contentsKebabMenuButton)
        .click();
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenuAction).eq(0)
        .click();
    return new AppPage(EditPage);
  }

  openKebabLastAddedContent() {
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenu).eq(0)
        .find(this.contentsKebabMenuButton)
        .click();
  }

  unpublishLastAddedContent() {
    this.openKebabLastAddedContent();
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenuAction).eq(4)
        .click();
    cy.wait(1500);

    this.parent.getDialog()
        .confirm();
    cy.wait(1000);

    return new AppPage(ManagementPage);
  }

  deleteLastAddedContent() {
    this.openKebabLastAddedContent();
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenuAction).eq(1)
        .click();
    cy.wait(1500);

    this.parent.getDialog()
        .confirm();
    cy.wait(1000);

    return new AppPage(ManagementPage);
  }

  unpublishContent(code) {
    this.getTableRowAction(code)
        .click();
    // TODO: find a way to avoid waiting for arbitrary time periods
    cy.wait(500);

    this.getTable()
        .find(htmlElements.li)
        .filter(':visible')
        .eq(4)
        .click();

    this.parent
        .getDialog()
        .getConfirmButton()
        .click();
  }
}
