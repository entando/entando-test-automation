import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content   from '../../app/Content';

export default class Languages_LabelsPage extends Content {

  labelsTabLink = `${htmlElements.a}[${DATA_TESTID}=list_LabelsAndLanguagesPage_MenuItem]`;
  labelSearchFormField = `${htmlElements.input}[${DATA_TESTID}=list_LabelSearchForm_Field]`;
  searchFormSubmit = `${htmlElements.button}[${DATA_TESTID}=list_LabelSearchForm_Button]`;
  displayedLabelRow = `${htmlElements.tr}[${DATA_TESTID}=list_LabelsTable_tr]`;
  displayedLabelsTable = `${htmlElements.table}[${DATA_TESTID}=list_LabelsTable_table]`;
  displayedLabelsTab = `${htmlElements.div}[id=labels-tabs-pane-0]`;

  getLabelsTabLink() {
    return this.getContents().find(this.labelsTabLink).eq(1);
  }

  getLabelSearchForm() {
    return this.getContents().find(this.labelSearchFormField)
  }

  getSearchSubmitButton() {
    return this.getContents().find(this.searchFormSubmit)
  }

  getDisplayedLabelsTab() {
    return this.getContents().find(this.displayedLabelsTab)
  }

  getDisplayedLabelsTable() {
    return this.getDisplayedLabelsTab().find(this.displayedLabelsTable)
  }

  getDisplayedLabelsCount() {
    return this.getDisplayedLabelsTable().find(this.displayedLabelRow)
  }
}
