import { DialogContent } from '../../../app/Dialog';
import { htmlElements } from '../../../WebElement';
import AttributeFormField from '../AttributeFormField';

export class LinkDialog extends DialogContent {
  typeSelected  = 1;
  pageTreeTable = `${htmlElements.table}.PageTreeSelector`;
  expandAll     = `${htmlElements.div}.PageTreeSelector__button--expand`;
  contentSearch = `${htmlElements.div}.ContentSearch`;
  contentsBody = `${htmlElements.div}.Contents__body`;
  contentTable  = `${htmlElements.table}.Contents__table-element`;

  getTabArea() {
    return this.get().find('ul[role="tablist"]');
  }

  getTabBlock() {
    return this.get().find('div.tab-content');
  }

  getTabURL() {
    return this.getTabBlock().find('#LinkConfigModal-Tabs-pane-url');
  }

  getTabPage() {
    return this.getTabBlock().find('#LinkConfigModal-Tabs-pane-page');
  }

  getTabContent() {
    return this.getTabBlock().find('#LinkConfigModal-Tabs-pane-content');
  }

  getTabBlockByTypeSelected() {
    switch(this.typeSelected) {
      default:
      case 1:
        return this.getTabURL();
      case 2:
        return this.getTabPage();
      case 3:
        return this.getTabContent();
    }
  }

  clickTabByDestType(destType) {
    this.typeSelected = destType;
    return this.getTabArea().children('li').eq(destType - 1)
      .children(htmlElements.a).click();
  }

  setUrlValue(value) {
    this.getTabURL().find('input[name="url"]').type(value);
  }

  getPageTreeTable() {
    return this.getTabPage().find(this.pageTreeTable);
  }

  getExpandAll() {
    return this.getPageTreeTable()
               .children(htmlElements.thead)
               .find(this.expandAll);
  }

  getPageTreeRowByPageName(name) {
    return this.getPageTreeTable().contains(name).closest(htmlElements.tr);
  }

  setPageValue(pageName) {
    this.getExpandAll();
    this.getPageTreeRowByPageName(pageName).click();
  }

  getContentSearchArea() {
    return this.getTabContent().find(this.contentSearch);
  }

  getContentTable() {
    return this.getTabContent().find(this.contentsBody).find(this.contentTable);
  }

  getContentRowRadio(contentId) {
    return this.getContentTable().find(`input#content${contentId}`);
  }

  setContentValue(contentId) {
    cy.wait(1000); //wait for the content to finish loading
    this.getContentRowRadio(contentId).click();
  }

  setAttributeRelValue(value) {
    this.getTabBlockByTypeSelected().find('input[name="attributes.rel"]').type(value);
  }

  setAttributesTargetValue(value) {
    this.getTabBlockByTypeSelected().find('input[name="attributes.target"]').type(value);
  }

  setAttributeshrefLangValue(value) {
    this.getTabBlockByTypeSelected().find('input[name="attributes.hreflang"]').type(value);
  }

  confirm() {
    this.getTabBlockByTypeSelected().find(htmlElements.button)
      .then(el => el.length ? el[el.length - 1] : el).click();
  }
}

export default class LinkAttribute extends AttributeFormField {
  constructor(parent, attributeIndex, lang = 'en') {
    super(parent, 'Link', attributeIndex, lang);
  }

  getAddButton() {
    return this.getContents().find(htmlElements.button);
  }

  getTextInput() {
    return this.getContents().find(`input[name="${this.prefix}.values.${this.lang}"]`);
  }

  getEditButton() {
    return this.getContents().find('div.panel-body').children('div.text-right').children('button.btn-default');
  }

  getDeleteButton() {
    return this.getContents().find('div.panel-body').children('div.text-right').children('button.btn-danger');
  }

  setLinkInfo(link) {
    this.setDialogBodyWithClass(LinkDialog);
    const { destType, rel, target, hreflang } = link;
    this.getDialogBodyOfAttribute().clickTabByDestType(destType);

    switch(destType) {
      case 1:
      default:
        this.getDialogBodyOfAttribute().setUrlValue(link.urlDest);
        break;
      case 2:
        this.getDialogBodyOfAttribute().setPageValue(link.pageDest);
        break;
      case 3:
        this.getDialogBodyOfAttribute().setContentValue(link.contentDest);
        break;
    }
    if (link.rel) {
      this.getDialogBodyOfAttribute().setAttributeRelValue(rel);
    }
    if (link.target) {
      this.getDialogBodyOfAttribute().setAttributesTargetValue(target);
    }
    if (link.hreflang) {
      this.getDialogBodyOfAttribute().setAttributeshrefLangValue(hreflang);
    }
    this.getDialogBodyOfAttribute().confirm();
  }

  setValue({ link, value }) {
    if (this.lang === 'en') {
      this.getAddButton().click();
      this.setLinkInfo(link);
    }
    this.getTextInput().type(value);
  } 

  editValue({ link, value }) {
    if (link && this.lang === 'en') {
      this.getEditButton().click();
      this.setLinkInfo(link);
    }
    this.getTextInput().clear().type(value);
  }
}
