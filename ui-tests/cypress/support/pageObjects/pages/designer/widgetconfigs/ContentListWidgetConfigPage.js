import WidgetConfigPage from '../WidgetConfigPage';

export default class ContentListWidgetConfigPage extends WidgetConfigPage {

  getContentListTableBody() {
    return this.getMainContainer().find('.Contents__body');
  }

  getContentListTableRowWithTitle(title) {
    return this.getContentListTableBody().find('td').contains(title).siblings();
  }

  getAddButtonFromTableRowWithTitle(title) {
    return this.getContentListTableRowWithTitle(title)
      .find('button.btn.btn-default').contains(/^Add$/);
  }

  getModelIdDropdownByIndex(idx) {
    return this.getMainContainer().find(`[name="contents[${idx}].modelId"]`);
  }
}
