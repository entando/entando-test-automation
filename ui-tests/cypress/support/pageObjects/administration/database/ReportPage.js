import Content from '../../app/Content.js';
import {htmlElements} from '../../WebElement.js';

export default class ReportPage extends Content {

  descriptionList = `${htmlElements.dl}.dl-horizontal`
  componentTable = `${htmlElements.table}.ReportDatabaseListTable__table`

  getDescriptionList() {
    return this.getContents().find(this.descriptionList);
  }

  getDescriptionData() {
    return this.getDescriptionList().children();
  }

  getComponentTable() {
    return this.getContents().find(this.componentTable);
  }

}
