import {htmlElements} from '../../../WebElement';

import AttributeFormField from '../AttributeFormField';

import AdminContent from '../../../app/AdminContent';
import AdminPage from '../../../app/AdminPage';

export class LinkDialog extends AdminContent {

  typeSelected  = 1;
  pageTreeTable = `${htmlElements.table}.PageTreeSelector`;
  expandAll     = `${htmlElements.div}.PageTreeSelector__button--expand`;
  content       = `${htmlElements.form}#entandoSearch`;
  contentTable  = `${htmlElements.table}#contentListTable`;

  get() {
    return this.parent.get();
  }

  getTabArea() {
    return this.get().find(`${htmlElements.ul}#tab-togglers`);
  }

  getTabURL() {
    return this.get().find(`${htmlElements.form}#configUrlLink`);
  }

  getTabPage() {
    return this.get().find(`#LinkConfigModal-Tabs-pane-page`);
  }

  getTabContent() {
    return this.get().find(`${htmlElements.div}#content-link`);
  }

  getTabBlockByTypeSelected() {
    switch (this.typeSelected) {
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
    return this.getTabArea().children(htmlElements.li).eq(destType - 1)
               .children(htmlElements.a).click();
  }

  setUrlValue(value) {
    this.getTabURL().find(`${htmlElements.input}[name="url"]`).type(value);
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
    return this.getTabContent().find(this.content).eq(0);
  }

  getContentTable() {
    return this.getTabContent().find(this.content).eq(1).find(this.contentTable);
  }

  getContentRowRadio(contentId) {
    return this.getContentTable().find(`${htmlElements.input}#contentId_${contentId}`);
  }

  setContentValue(contentId) {
    this.getContentRowRadio(contentId).click();
  }

  setAttributeRelValue(value) {
    this.getTabBlockByTypeSelected().find(`${htmlElements.input}#linkAttributeRel`).type(value);
  }

  setAttributesTargetValue(value) {
    this.getTabBlockByTypeSelected().find(`${htmlElements.input}#linkAttributeTarget`).type(value);
  }

  setAttributeshrefLangValue(value) {
    this.getTabBlockByTypeSelected().find(`${htmlElements.input}#linkAttributeHRefLang`).type(value);
  }

  confirm() {
    this.getTabBlockByTypeSelected().find(htmlElements.button)
        .then(el => el.length ? el[el.length - 1] : el).click();
  }
}

export default class LinkAttribute extends AttributeFormField {
  constructor(parent, attributeIndex, lang = 'en', composite = false) {
    super(parent, 'Link', attributeIndex, lang);
    this.composite = composite;
  }

  getAddButton() {
    return this.getContents().find(htmlElements.button);
  }

  getTextInput() {
    const textInput = (this.composite ? `Composite:Link:${this.lang}_Composite_Link` : `Link:${this.lang}_Link`)
    return this.getContents().find(`${htmlElements.input}[name="${textInput}"]`);
  }

  getEditButton() {
    return this.getContents().find(`${htmlElements.div}.panel-body`).children(`${htmlElements.div}.text-right`).children(`${htmlElements.button}.btn-default`);
  }

  getDeleteButton() {
    return this.getContents().find(`${htmlElements.div}.panel-body`).children(`${htmlElements.div}.text-right`).children(`${htmlElements.button}.btn-danger`);
  }

  setLinkInfo(link) {
    cy.wrap(new AdminPage(LinkDialog)).then(page => {
      const { destType, rel, target, hrefLang } = link;
      page.getContent().clickTabByDestType(destType);

      switch (destType) {
        case 1:
        default:
          page.getContent().setUrlValue(link.urlDest);
          break;
        case 2:
          page.getContent().setPageValue(link.pageDest);
          break;
        case 3:
          page.getContent().setContentValue(link.contentDest);
          break;
      }
      if (link.rel) {
        page.getContent().setAttributeRelValue(rel);
      }
      if (link.target) {
        page.getContent().setAttributesTargetValue(target);
      }
      if (link.hrefLang) {
        page.getContent().setAttributeshrefLangValue(hrefLang);
      }
      page.getContent().confirm();
    });

  }

  setValue({link, value}) {
    if (this.lang === 'en') {
      this.getAddButton().click();
      this.setLinkInfo(link);
    }
    this.getTextInput().type(value);
  }

  editValue({link, value}) {
    if (link && this.lang === 'en') {
      this.getEditButton().click();
      this.setLinkInfo(link);
    }
    this.getTextInput().then(input => this.parent.type(input, value));
  }
}
