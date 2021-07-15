import {TEST_ID_KEY, htmlElements} from "../../WebElement.js";

import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import ManagementPage from "./ManagementPage.js";

export default class AddPage extends Content {
    pageForm = `${htmlElements.div}[${TEST_ID_KEY}=add_PagesAddPage_Grid]`;

    inputTitle = `${htmlElements.input}[name="titles.en"]`;
    inputTitleIt = `${htmlElements.input}[name="titles.it"]`;
    inputCode = `${htmlElements.input}[name=code]`;
    pageTreeSelector = `${htmlElements.div}[${TEST_ID_KEY}=PageForm__PageTreeSelector]`;
    pageTemplateSelector = `${htmlElements.select}[name=pageModel]`;

    // SEO
    seoInfoContainer = `${htmlElements.div}[id=basic-tabs]`;
    seoInfoTabs = `${htmlElements.ul}[${TEST_ID_KEY}=common_SeoInfo_Tabs]`;
    seoDescription = `${htmlElements.input}[name="seoData.seoDataByLang.en.description"]`
    seoDescriptionIt = `${htmlElements.input}[name="seoData.seoDataByLang.it.description"]`
    seoKeywords = `${htmlElements.input}[name="seoData.seoDataByLang.en.keywords"]`
    seoKeywordsIt = `${htmlElements.input}[name="seoData.seoDataByLang.it.keywords"]`
    seoFriendlyCode = `${htmlElements.input}[name="seoData.seoDataByLang.en.friendlyCode"]`
    seoFriendlyCodeIt = `${htmlElements.input}[name="seoData.seoDataByLang.it.friendlyCode"]`

    // Meta
    metatagKey = `${htmlElements.input}[name="metakey"]`
    metatagType = `${htmlElements.input}[name="metatype"]`
    metatagValue = `${htmlElements.input}[name="titles.en"]`

    // buttons
    saveButton = `${htmlElements.button}[${TEST_ID_KEY}="save-page"]`;
    saveAndDesignButton = `${htmlElements.button}[${TEST_ID_KEY}="common_PageForm_Button"]`;

    getPageForm () {
        return this.parent.get()
                .find(this.pageForm);
    }

    getSeoContainer () {
        return this.parent.get()
               .find(this.seoInfoContainer);
    }

    getSeoTabs() {
        return this.getSeoContainer()
               .children(this.seoInfoTabs);
    }

    selectSeoLanguage(langOrder) {
        this.getSeoTabs().find(htmlElements.a).eq(langOrder).click();
        cy.wait(1000);
    }

    getInputTitle(lang) {
        return this.getSeoContainer().find(lang === 'it' ? this.inputTitleIt : this.inputTitle);
    }

    getSeoDescription (lang) {
        return this.getSeoContainer().find(lang === 'it' ? this.seoDescriptionIt : this.seoDescription);
    }

    getSeoKeywords (lang) {
        return this.getSeoContainer().find(lang === 'it' ? this.seoKeywordsIt : this.seoKeywords);
    }

    getSeoFriendlyCode (lang) {
        return this.getSeoContainer().find(lang === 'it' ? this.seoFriendlyCodeIt : this.seoFriendlyCode);
    }

    setSeoDescription (value, lang = 'en') {
        this.getSeoDescription(lang).type(value)
    }

    setSeoKeywords (value, lang = 'en') {
        this.getSeoKeywords(lang).type(value);
    }

    setSeoFriendlyCode (value, lang = 'en') {
        this.getSeoFriendlyCode(lang).type(value);
    }

    setInputTitle(value, lang = 'en') {
        this.getInputTitle(lang).type(value);
    }

    getCode() {
        return this.getPageForm().find(this.inputCode);
    }

    setCode(value) {
        this.getCode().type(value);
    }
    
    getPageTreeSelector() {
        return this.getPageForm().find(this.pageTreeSelector);
    }

    selectPageOnTreeSelector(page) {
        this.getPageTreeSelector().find('tbody tr').eq(page).click();
    }

    getPageTemplateSelector() {
        return this.getPageForm().find(this.pageTemplateSelector)
    }

    selectPageTemplate(value) {
        this.getPageTemplateSelector().select(value);
    }

    getSaveButton() {
        return this.getPageForm().find(this.saveButton)
    }

    getSaveAndDesignButton() {
        return this.getPageForm().find(this.saveAndDesignButton)
    }

    clickSaveButton () {
        this.getSaveButton().click();
        return new AppPage(ManagementPage);
    }

    fillRequiredData(enTitle, itTitle, code, pageIndex, pageTemplate) {
        this.selectSeoLanguage(0);
        this.setInputTitle(enTitle, 'en');
        this.selectSeoLanguage(1);
        this.setInputTitle(itTitle, 'it');
        this.getCode().clear();
        this.setCode(code);
        if (pageIndex !== undefined) {
            this.selectPageOnTreeSelector(pageIndex);
        }
        this.selectPageTemplate(pageTemplate);
    }

    fillSeoData(description, keywords, friendlyCode) {
        this.selectSeoLanguage(0);
        this.setSeoDescription(description);
        this.setSeoKeywords(keywords);
        this.setSeoFriendlyCode(friendlyCode);
        this.selectSeoLanguage(1);
        this.setSeoDescription(description, 'it');
        this.setSeoKeywords(keywords, 'it');
        this.setSeoFriendlyCode(friendlyCode, 'it');
    }
}