import {DATA_TESTID, htmlElements} from "../../WebElement.js";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import ManagementPage from "./ManagementPage.js";

export default class AddPage extends Content {

  // SEO
  seoInfoContainer = `${htmlElements.div}#basic-tabs`;

  seoInfoTabs          = `${htmlElements.ul}[${DATA_TESTID}=common_SeoInfo_Tabs]`;
  titleInput           = `${htmlElements.input}[name="titles.{lang}"]`;
  seoDescriptionInput  = `${htmlElements.input}[name="seoData.seoDataByLang.{lang}.description"]`;
  seoKeywordsInput     = `${htmlElements.input}[name="seoData.seoDataByLang.{lang}.keywords"]`;
  seoFriendlyCodeInput = `${htmlElements.input}[name="seoData.seoDataByLang.{lang}.friendlyCode"]`;
  // Meta
  metaDataFormDiv      = `${htmlElements.div}[${DATA_TESTID}=common_SeoMetadataForm_div]`;
  metaKeyInput         = `${htmlElements.input}[name=metakey]`;
  metaTypeSelect       = `${htmlElements.select}[name=metatype]`;
  metaValueInput       = `${htmlElements.input}[name=metavalue]`;
  metaTagAddButton     = `${htmlElements.button}[${DATA_TESTID}=common_SeoMetadataForm_Button]`;

  codeInput = `${htmlElements.input}[name=code]`;

  pageTreeSelector = `${htmlElements.div}[${DATA_TESTID}=PageForm__PageTreeSelector]`;

  ownerGroupDiv = `${htmlElements.div}[${DATA_TESTID}=ownerGroup-typeahead]`;

  pageTemplateSelect = `${htmlElements.select}[name=pageModel]`;

  // buttons
  saveAndDesignButton = `${htmlElements.button}[${DATA_TESTID}="common_PageForm_Button"]`;
  saveButton          = `${htmlElements.button}[${DATA_TESTID}="save-page"]`;

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
               .find(this[name].replace("{lang}", lang));
  }

  getTitleInput(lang) {
    return this.getMultilangElement("titleInput", lang);
  }

  getSeoDescriptionInput(lang) {
    return this.getMultilangElement("seoDescriptionInput", lang);
  }

  getSeoKeywordsInput(lang) {
    return this.getMultilangElement("seoKeywordsInput", lang);
  }

  getSeoFriendlyCodeInput(lang) {
    return this.getMultilangElement("seoFriendlyCodeInput", lang);
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
               .find(this.pageTreeSelector)
               .children(htmlElements.div)
               .children(htmlElements.table);
  }

  getOwnerGroup() {
    return this.getContents()
               .find(this.ownerGroupDiv);
  }

  getOwnerGroupButton() {
    return this.getOwnerGroup()
               .children(htmlElements.div)
               .children(htmlElements.button);
  }

  getOwnerGroupDropdown() {
    return this.getOwnerGroup()
               .children(htmlElements.div)
               .children(htmlElements.ul);
  }

  getPageTemplateSelect() {
    return this.getContents()
               .find(this.pageTemplateSelect);
  }

  getSaveAndDesignButton() {
    return this.getContents()
               .find(this.saveAndDesignButton);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  selectSeoLanguage(langOrder) {
    this.getSeoTabs()
        .find(htmlElements.a).eq(langOrder)
        .click();
    cy.wait(1000);
  }

  typeTitle(value, lang = "en") {
    this.getTitleInput(lang).type(value);
  }

  typeSeoDescription(value, lang = "en") {
    this.getSeoDescriptionInput(lang).type(value);
  }

  typeSeoKeywords(value, lang = "en") {
    this.getSeoKeywordsInput(lang).type(value);
  }

  typeSeoFriendlyCode(value, lang = "en") {
    this.getSeoFriendlyCodeInput(lang).type(value);
  }

  typeMetaKey(value) {
    this.getMetaKeyInput().type(value);
  }

  selectMetaType(value) {
    this.getMetaTypeSelect().select(value);
  }

  typeMetaValue(value) {
    this.getMetaValueInput().type(value);
  }

  clickMetaTagAddButton() {
    this.getMetaTagAddButton().click();
  }

  typeCode(value) {
    this.getCodeInput().type(value);
  }

  clearCode() {
    this.getCodeInput().clear();
  }

  openSubPagesOnPageTreePage(pageOrder) {
    this.getPageTreeTable()
        .children(htmlElements.tbody)
        .children(htmlElements.tr).eq(pageOrder)
        .children(htmlElements.td)
        .children(htmlElements.span).eq(0)
        .click();
  }

  selectPageOnPageTreeTable(pageOrder) {
    this.getPageTreeTable()
        .children(htmlElements.tbody)
        .children(htmlElements.tr).eq(pageOrder)
        .click();
  }

  openOwnerGroupMenu() {
    this.getOwnerGroupButton().click();
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

  clickSaveAndDesignButton() {
    this.getSaveAndDesignButton().click();
    //TODO add returned page
  }

  clickSaveButton() {
    this.getSaveButton().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(ManagementPage);
  }

  fillRequiredData(enTitle, itTitle, code, pageIndex, pageTemplate) {
    this.selectSeoLanguage(0);
    this.typeTitle(enTitle, "en");
    this.selectSeoLanguage(1);
    this.typeTitle(itTitle, "it");
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
    this.typeSeoDescription(description, "it");
    this.typeSeoKeywords(keywords, "it");
    this.typeSeoFriendlyCode(friendlyCode, "it");
  }

}
