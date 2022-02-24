import AppPage from '../../app/AppPage';
import Content from '../../app/Content';
import { htmlElements } from '../../WebElement';
import Languages_LabelsPage from './Languages_LabelsPage';

export default class AddLabelPage extends Content {
  getForm() {
    return this.get().find(htmlElements.form);
  }

  getCodeTextField() {
    return this.getForm().find(`${htmlElements.input}[name=key]`);
  }

  getLanguageTextField(code) {
    return this.getForm().find(`${htmlElements.textarea}[name="titles.${code}"]`);
  }

  getSubmit() {
    return this.getForm().find(`${htmlElements.button}[type=submit]`);
  }

  typeCodeTextField(value) {
    this.getCodeTextField().clear().type(value);
  }

  typeLanguageTextField(code, value) {
    this.getLanguageTextField(code).clear().type(value);
  }

  submitForm() {
    this.getSubmit().click();
    return new AppPage(Languages_LabelsPage);
  }

  navigateToLanguagesAndLabelsFromBreadcrumb() {
    this.getBreadCrumb().children(htmlElements.li).eq(1).click();
    return new AppPage(Languages_LabelsPage);
  }
}