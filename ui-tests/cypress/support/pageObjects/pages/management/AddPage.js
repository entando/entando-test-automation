import {DATA_TESTID, htmlElements} from "../../WebElement.js";

import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import ManagementPage from "./ManagementPage.js";

export default class AddPage extends Content {
    pageForm = `${htmlElements.div}[${DATA_TESTID}=add_PagesAddPage_Grid]`;

    inputTitle = `${htmlElements.input}[name="titles.{code}"]`;
    inputCode = `${htmlElements.input}[name=code]`;
    pageTreeSelector = `${htmlElements.div}[${DATA_TESTID}=PageForm__PageTreeSelector]`;
    pageTemplateSelector = `${htmlElements.select}[name=pageModel]`;

    ownerGroupButton = `${htmlElements.div}[${DATA_TESTID}=ownerGroup-typeahead] ${htmlElements.button}[${DATA_TESTID}=form_RenderDropdownTypeaheadInput_button]`;
    ownerGroupDropdown = `#ownerGroup`;

    // SEO
    seoInfoContainer = `${htmlElements.div}[id=basic-tabs]`;
    seoInfoTabs = `${htmlElements.ul}[${DATA_TESTID}=common_SeoInfo_Tabs]`;
    
    seoDescription = `${htmlElements.input}[name="seoData.seoDataByLang.{code}.description"]`
    seoKeywords = `${htmlElements.input}[name="seoData.seoDataByLang.{code}.keywords"]`
    seoFriendlyCode = `${htmlElements.input}[name="seoData.seoDataByLang.{code}.friendlyCode"]`

    // Meta
    metatagKey = `${htmlElements.input}[name="metakey"]`
    metatagType = `${htmlElements.input}[name="metatype"]`
    metatagValue = `${htmlElements.input}[name="metavalue"]`

    // buttons
    saveButton = `${htmlElements.button}[${DATA_TESTID}="save-page"]`;
    saveAndDesignButton = `${htmlElements.button}[${DATA_TESTID}="common_PageForm_Button"]`;

    alertMessageDiv = `${htmlElements.div}[${DATA_TESTID}=form_ErrorsAlert_Alert]`;

    getPageForm () {
        return this.parent.get()
                .find(this.pageForm);
    }

    getSeoContainer () {
        return this.parent.get()
               .find(this.seoInfoContainer);
    }

    getMultilangElement (name, langCode) {
        return this.getSeoContainer().find(this[name].replace('{code}', langCode));
    }

    getSeoTabs() {
        return this.getSeoContainer()
               .children(this.seoInfoTabs);
    }

    getAlertMessage() {
        return this.getContents()
               .find(this.alertMessageDiv);
    }

    getOwnerGroupButton() {
        return this.getContents()
               .find(this.ownerGroupButton);
    }

    clickOwnerGroupButton() {
        this.getOwnerGroupButton().click();
    }

    getOwnerGroupDropdown() {
        return this.getContents()
               .find(this.ownerGroupDropdown);
    }

    selectSeoLanguage(langOrder) {
        this.getSeoTabs().find(htmlElements.a).eq(langOrder).click();
        cy.wait(1000);
    }

    getInputTitle(lang) {
        return this.getMultilangElement('inputTitle', lang);
    }

    getSeoDescription (lang) {
        return this.getMultilangElement('seoDescription', lang);
    }

    getSeoKeywords (lang) {
        return this.getMultilangElement('seoKeywords', lang);
    }

    getSeoFriendlyCode (lang) {
        return this.getMultilangElement('seoFriendlyCode', lang);
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
