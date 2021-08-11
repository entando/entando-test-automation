import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content from '../../app/Content';

import AppPage from '../../app/AppPage';

import ManagementPage      from './ManagementPage';
import AuthorizationDialog from './AuthorizationDialog';

export default class AuthorizationPage extends Content {

  addButton  = `${htmlElements.button}[${DATA_TESTID}=UserAuthorityTable__addButton]`;
  table      = `${htmlElements.table}[${DATA_TESTID}=UserAuthorityTable__table]`;
  tableAlert = `${htmlElements.div}[${DATA_TESTID}=authority_UserAuthorityTable_Alert]`;
  saveButton = `${htmlElements.button}[${DATA_TESTID}=UserAuthorityPageForm__saveButton]`;

  getTitle() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .find(htmlElements.h1);
  }

  getAddButton() {
    return this.get()
               .find(this.addButton);
  }

  getAuthorityTable() {
    return this.getContents()
               .find(this.table);
  }

  getTableHeaders() {
    return this.getAuthorityTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getTableRows() {
    return this.getAuthorityTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableAlert() {
    return this.get()
               .find(this.tableAlert);
  }

  getSaveButton() {
    return this.get()
               .find(this.saveButton);
  }

  addAuthorization() {
    this.getAddButton().click();
    this.parent.getDialog().setBody(AuthorizationDialog);
  }

  save() {
    this.getSaveButton().click();
    return new AppPage(ManagementPage);
  }

}
