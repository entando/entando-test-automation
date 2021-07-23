import {DATA_TESTID, htmlElements} from "../../WebElement";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import ManagementPage from "./ManagementPage.js";

export default class ViewProfilePage extends Content {

  table      = `${htmlElements.table}[${DATA_TESTID}=DetailUserTable__table]`;
  backButton = `${htmlElements.button}[${DATA_TESTID}=DetailUserTable__backButton]`;

  getDetailsTable() {
    return this.getContents()
               .find(this.table);
  }

  getTableRows() {
    return this.getDetailsTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getBackButton() {
    return this.getContents()
               .find(this.backButton);
  }

  goBack() {
    this.getBackButton().click();
    return new AppPage(ManagementPage);
  }

}
