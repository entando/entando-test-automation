import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import ManagementPage from './ManagementPage.js';
import DesignerPage   from '../designer/DesignerPage.js';

export default class AddPage extends AppContent {

  // SEO
  seoInfoContainer = `${htmlElements.div}.SeoInfo`;

  seoInfoTabs          = `${htmlElements.ul}[role="tablist"]`;
  titleInput           = `${htmlElements.input}[name="titles.{lang}"]`;
  seoDescriptionInput  = `${htmlElements.input}[name="seoData.seoDataByLang.{lang}.description"]`;
  seoKeywordsInput     = `${htmlElements.input}[name="seoData.seoDataByLang.{lang}.keywords"]`;
  seoFriendlyCodeInput = `${htmlElements.input}[name="seoData.seoDataByLang.{lang}.friendlyCode"]`;
  // Meta
  metaDataFormDiv      = `${htmlElements.div}.SeoInfo__addmetadata`;
  metaKeyInput         = `${htmlElements.input}[name="metakey"]`;
  metaTypeSelect       = `${htmlElements.select}[name=metatype]`;
  metaValueInput       = `${htmlElements.input}[name=metavalue]`;
  metaTagAddButton     = `${htmlElements.button}[type="submit"]`;

  codeInput = `${htmlElements.input}[name=code]`;

  pageTreeSelector = `${htmlElements.table}.PageTreeSelector`;

  ownerGroupDiv = `${htmlElements.div}[class="DropdownTypeahead form-group"]`;

  pageTemplateSelect = `${htmlElements.select}.form-control.RenderSelectInput`;

  // buttons
  saveAndDesignButton = `${htmlElements.button}.PageForm__save-and-configure-btn`;
  saveButton          = `${htmlElements.button}.PageForm__save-btn`;

  getSeoContainer() {
    return this.getContents()
               .find(this.seoInfoContainer);
  }

  getSeoTabs() {
    return this.getSeoContainer()
               .children(this.seoInfoTabs);
  }

  getMultilangElement(name, lang) {
    return this.getSeoContainer()
               .find(this[name].replace('{lang}', lang));
  }

  getTitleInput(lang) {
    return this.getMultilangElement('titleInput', lang);
  }

  getSeoDescriptionInput(lang) {
    return this.getMultilangElement('seoDescriptionInput', lang);
  }

  getSeoKeywordsInput(lang) {
    return this.getMultilangElement('seoKeywordsInput', lang);
  }

  getSeoFriendlyCodeInput(lang) {
    return this.getMultilangElement('seoFriendlyCodeInput', lang);
  }

  getMetadataFormDiv() {
    return this.getSeoContainer()
               .find(this.metaDataFormDiv);
  }

  getMetaKeyInput() {
    return this.getMetadataFormDiv()
               .find(this.metaKeyInput);
  }

  getMetaTypeSelect() {
    return this.getMetadataFormDiv()
               .find(this.metaTypeSelect);
  }

  getMetaValueInput() {
    return this.getMetadataFormDiv()
               .find(this.metaValueInput);
  }

  getMetaTagAddButton() {
    return this.getMetadataFormDiv()
               .find(this.metaTagAddButton);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getPageTreeTable() {
    return this.getContents()
               .find(this.pageTreeSelector);
  }

  getOwnerGroup() {
    return this.getContents()
               .find(this.ownerGroupDiv).eq(0);
  }

  getOwnerGroupButton() {
    return this.getOwnerGroup()
               .find(`${htmlElements.div}.rbt.app-tour-step-9`)
               .find(`${htmlElements.button}.DropdownTypeahead__toggle-button`);
  }

  getOwnerGroupDropdown() {
    return this.getOwnerGroup()
               .find(`${htmlElements.div}[tabindex="-1"]`)
               .children(htmlElements.ul);
  }

  getPageTemplateSelect() {
    return this.getContents()
               .find(`${htmlElements.div}.form-group`)
               .find(this.pageTemplateSelect).eq(1);
  }

  getSaveAndDesignButton() {
    return this.getContents()
               .find(this.saveAndDesignButton);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  clickSaveAndDesignButton() {
    this.getSaveAndDesignButton().click();
    return new AppPage(DesignerPage);
  }

  clickSaveButton() {
    this.getSaveButton().click();
    return new AppPage(ManagementPage);
  }

  clickMetaTagAddButton() {
    this.getMetaTagAddButton().click();
  }

  clearCode() {
    this.getCodeInput().clear();
  }

  fillRequiredData(enTitle, itTitle, code, pageIndex, pageTemplate) {
    this.selectSeoLanguage(0);
    this.typeTitle(enTitle, 'en');
    this.selectSeoLanguage(1);
    this.typeTitle(itTitle, 'it');
    this.getCodeInput().clear();
    this.typeCode(code);
    if (pageIndex !== undefined) {
      this.selectPageOnPageTreeTable(pageIndex);
    }
    this.selectPageTemplate(pageTemplate);
  }

  fillSeoData(description, keywords, friendlyCode) {
    this.selectSeoLanguage(0);
    this.typeSeoDescription(description);
    this.typeSeoKeywords(keywords);
    this.typeSeoFriendlyCode(friendlyCode);
    this.selectSeoLanguage(1);
    this.typeSeoDescription(description, 'it');
    this.typeSeoKeywords(keywords, 'it');
    this.typeSeoFriendlyCode(friendlyCode, 'it');
  }

  openSubPagesOnPageTreePage(pageOrder) {
    this.getPageTreeTable()
        .children(htmlElements.tbody)
        .children(htmlElements.tr).eq(pageOrder)
        .children(htmlElements.td)
        .children(htmlElements.span).eq(0)
        .click();
  }

  openOwnerGroupMenu() {
    this.getOwnerGroupButton().click();
  }

  selectMetaType(value) {
    this.getMetaTypeSelect().select(value);
  }

  selectOwnerGroup(value) {
    this.openOwnerGroupMenu();
    this.getOwnerGroupDropdown()
        .find(`${htmlElements.li}[aria-label=${value}]`)
        .click();
  }

  selectPageTemplate(value) {
    this.getPageTemplateSelect()
        .select(value);
  }

  selectPageOnPageTreeTable(pageOrder) {
    this.getPageTreeTable()
        .children(htmlElements.tbody)
        .children(htmlElements.tr).eq(pageOrder)
        .click();
  }

  selectSeoLanguage(langOrder) {
    this.getSeoTabs()
        .find(htmlElements.a).eq(langOrder)
        .click();
  }

  typeCode(value) {
    this.getCodeInput().type(value);
  }

  typeMetaKey(value) {
    this.getMetaKeyInput().type(value);
  }

  typeMetaValue(value) {
    this.getMetaValueInput().type(value);
  }

  typeSeoDescription(value, lang = 'en') {
    this.getSeoDescriptionInput(lang).type(value);
  }

  typeSeoFriendlyCode(value, lang = 'en') {
    this.getSeoFriendlyCodeInput(lang).type(value);
  }

  typeSeoKeywords(value, lang = 'en') {
    this.getSeoKeywordsInput(lang).type(value);
  }

  typeTitle(value, lang = 'en') {
    this.getTitleInput(lang).type(value);
  }

}
