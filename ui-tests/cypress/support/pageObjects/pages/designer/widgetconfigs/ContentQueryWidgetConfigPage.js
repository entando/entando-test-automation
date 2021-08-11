import {htmlElements}   from '../../../WebElement';
import WidgetConfigPage from '../WidgetConfigPage';

export default class ContentQueryWidgetConfigPage extends WidgetConfigPage {

  ACCORD_PUBLISHING   = 0;
  ACCORD_FILTERS      = 1;
  ACCORD_EXTRAOPTIONS = 2;
  ACCORD_FRONTEND     = 3;

  accordToggleButton = `${htmlElements.div}.SectionTitle[role=button]`;
  accordPanel        = `${htmlElements.div}.ReactCollapse--collapse`;

  getContentTypeField() {
    return this.getMainContainer().find('[name="contentType"]');
  }

  getAccordionByOrder(accordNum) {
    return this.getMainContainer().find('form')
               .children(htmlElements.div).eq(1)
               .find(htmlElements.fieldset).eq(accordNum);
  }

  getPublishSettingsAccordButton() {
    return this.getAccordionByOrder(this.ACCORD_PUBLISHING)
               .find(this.accordToggleButton);
  }

  getFiltersAccordButton() {
    return this.getAccordionByOrder(this.ACCORD_FILTERS)
               .find(this.accordToggleButton);
  }

  getExtraOptionsAccordButton() {
    return this.getAccordionByOrder(this.ACCORD_EXTRAOPTIONS)
               .find(this.accordToggleButton);
  }

  getFrontendFiltersAccordButton() {
    return this.getAccordionByOrder(this.ACCORD_FRONTEND)
               .find(this.accordToggleButton);
  }

  getMaxElemForItemDropdown() {
    return this.getAccordionByOrder(this.ACCORD_PUBLISHING)
               .find(this.accordPanel)
               .find('[name="maxElemForItem"]');
  }

  getMaxTotalElemDropdown() {
    return this.getAccordionByOrder(this.ACCORD_PUBLISHING)
               .find(this.accordPanel)
               .find('[name="maxElements"]');
  }
}
