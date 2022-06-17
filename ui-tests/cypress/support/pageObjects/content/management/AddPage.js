import {htmlElements} from '../../WebElement';

import AdminContent from '../../app/AdminContent.js';

import AdminPage           from '../../app/AdminPage.js';
import ManagementPage      from './ManagementPage';
import TextAttribute       from './attribute-fields/TextAttribute';
import HypertextAttribute  from './attribute-fields/HypertextAttribute';
import AssetAttribute      from './attribute-fields/AssetAttribute';
import CompositeAttribute  from './attribute-fields/CompositeAttribute';
import BooleanAttribute    from './attribute-fields/BooleanAttribute';
import EnumeratorAttribute from './attribute-fields/EnumeratorAttribute';
import ThreeStateAttribute from './attribute-fields/ThreeStateAttribute';
import CheckboxAttribute   from './attribute-fields/CheckboxAttribute';
import DateAttribute       from './attribute-fields/DateAttribute';
import TimestampAttribute  from './attribute-fields/TimestampAttribute';
import LinkAttribute       from './attribute-fields/LinkAttribute';
import ListAttribute       from './attribute-fields/ListAttribute';

export default class AddPage extends AdminContent {

  form = `${htmlElements.form}#configureMainGroup`;

  contentTitleAttrEnInput = `${htmlElements.input}[name="Text:en_title"]`;
  contentTitleAttrItInput = `${htmlElements.input}[name="Text:it_title"]`;
  contentAttrsEnTab       = `${htmlElements.a}#content-attributes-tabs-tab-en`;
  contentAttrsItTab       = `${htmlElements.a}[href="#it_tab"]`;
  contentAttrEnPane       = `${htmlElements.div}#en_tab`;
  contentAttrItPane       = `${htmlElements.div}#it_tab`;
  stickyToolbar           = `${htmlElements.div}#sticky-toolbar`;


  //FIXME AdminConsole is not built on REST APIs
  static openPage(button) {
    cy.contentsAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'addContentPageLoadingGET', '/createNew.action?*'));
    cy.get(button).click();
    cy.wait('@addContentPageLoadingGET');
  }

  //FIXME AdminConsole is not built on REST APIs
  static reloadPage(button) {
    cy.contentsAdminConsoleController().then(controller => controller.intercept({method: 'POST'}, 'addContentPageReloadingPOST', '/entryContent.action'));
    cy.get(button).click();
    cy.wait('@addContentPageReloadingPOST');
  }

  //FIXME AdminConsole is not built on REST APIs
  static editPage(button, code) {
    cy.contentsAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'editContentPageReloadingGET', `/edit.action?contentId=${code}`));
    cy.get(button).click({force: true});
    cy.wait('@editContentPageReloadingGET');
  }

  getContents() {
    return this.get()
               .children(`${htmlElements.div}#main`);
  }

  getForm() {
    return this.getContents().children(htmlElements.form);
  }

  getInfo() {
    return this.getForm().children(`${htmlElements.div}.form-horizontal`);
  }

  getVersion() {
    return this.getInfo().children(`${htmlElements.div}.form-group`).eq(0);
  }

  getContentType() {
    return this.getInfo().children(`${htmlElements.div}.form-group`).eq(1);
  }

  getContentDescription() {
    return this.getInfo().children(`${htmlElements.div}.form-group`).eq(2);
  }

  getContentDescriptionInput() {
    return this.getContentDescription().find(`${htmlElements.input}#contentDescription`);
  }

  getOwnerGroup() {
    return this.getForm().children(`${htmlElements.div}.form-group`).eq(0);
  }

  getOwnerGroupSelect() {
    return this.getOwnerGroup().find(`${htmlElements.select}#contentMainGroup`);
  }

  getOwnerGroupSetGroupButton() {
    return this.getOwnerGroup().find(`${htmlElements.button}[name="entandoaction:configureMainGroup"]`);
  }

  getViewOnlyGroups() {
    return this.getForm().children(`${htmlElements.div}.form-group`).eq(1);
  }

  getCategories() {
    return this.getForm().children(`${htmlElements.div}.form-group`).eq(2);
  }

  getContentAttributesLanguageTabs() {
    return this.getForm().children(`${htmlElements.ul}#tab-togglers`);
  }

  getContentAttributesLanguageTab(lang) {
    return this.getContentAttributesLanguageTabs().find(`${htmlElements.a}[href="#${lang}_tab"]`);
  }

  getContentAttributesContent() {
    return this.getForm()
               .children(`${htmlElements.div}#tab-container`)
               .children(`${htmlElements.div}.active`);
  }

  getContentAttributesContentAttribute(attribute) {
    return this.getContentAttributesContent()
               .children(`${htmlElements.div}[id^=contentedit_][id$=_${attribute}]`);
  }

  getContentAttributesContentAttributeInput(attribute) {
    return this.getContentAttributesContentAttribute(attribute)
               .find(`${htmlElements.input}[id^="Text:"][id$=_${attribute}]`);
  }

  getContentInfo() {
    return this.getForm().children(`${htmlElements.div}#info`);
  }

  getToolbar() {
    return this.getForm().children(`${htmlElements.div}#sticky-toolbar`);
  }

  getToolbarActions() {
    return this.getToolbar().find(`${htmlElements.div}.toolbar-pf-actions`);
  }

  getSaveButton() {
    return this.getToolbarActions().find(`${htmlElements.button}[name="entandoaction:save"]`);
  }

  clickOwnerGroupSetGroupButton() {
    this.getOwnerGroupSetGroupButton().then(button => AddPage.reloadPage(button));
    return cy.wrap(new AdminPage(AddPage)).as('currentPage');
  }

  save() {
    this.getSaveButton().then(button => ManagementPage.savePage(button));
    return cy.wrap(new AdminPage(ManagementPage)).as('currentPage');
  }

  // ----- old -----

  getTitleAttrItInput() {
    return this.getContents().get(this.contentAttrItPane)
               .find(this.contentTitleAttrItInput).eq(0);
  }

  getTitleAttrEnInput() {
    return this.getContents().get(this.contentAttrEnPane)
               .find(this.contentTitleAttrEnInput);
  }

  getEnLanguageTab() {
    return this.getContents().find(this.contentAttrsEnTab);
  }

  getItLanguageTab() {
    return this.getContents().find(this.contentAttrsItTab);
  }

  getCopyToLangBtn() {
    return this.getContents()
               .get(this.contentAttrEnPane)
               .find('.text-right > button.btn-default')
               .eq(0);
  }

  getStickyToolbar() {
    return this.getContents()
               .find(this.stickyToolbar);
  }

  getSaveAction() {
    return this.getStickyToolbar()
               .find(`${htmlElements.button}[name="entandoaction:save"]`);
  }

  getSaveApproveAction() {
    return this.getStickyToolbar()
               .find(`${htmlElements.button}[name="entandoaction:saveAndApprove"]`);
  }

  typeAttrTitleIt(input) {
    this.getTitleAttrItInput().type(input);
  }

  typeAttrTitleEn(input) {
    this.getTitleAttrEnInput().type(input);
  }

  typeDescription(input) {
    this.getContentDescriptionInput().type(input);
  }

  clearDescription() {
    this.getContentDescriptionInput().clear();
  }

  copyToAllLanguages() {
    this.getCopyToLangBtn().click();
  }

  submitForm(confirmTranslation = false) {
    this.getSaveAction().click();
    if (confirmTranslation) {
      this.parent.getDialog().getFooter().children(htmlElements.button).eq(1).click();
    }
    return cy.wrap(new AdminPage(ManagementPage)).as('currentPage');
  }

  submitApproveForm(confirmTranslation = false) {
    this.getSaveApproveAction().then(button => ManagementPage.savePage(button));
    if (confirmTranslation) {
      this.parent.getDialog().getFooter().children(htmlElements.button).eq(1).click();
    }
    return cy.wrap(new AdminPage(ManagementPage)).as('currentPage');
  }

  fillBeginContent(description, group = 'Free Access', append = false) {
    this.getOwnerGroupSelect().then(input => this.select(input, group));
    this.getOwnerGroupSetGroupButton().then(button => this.click(button));
    this.getContentDescriptionInput().then(input => this.type(input, description, append));
    return cy.get('@currentPage');
  }

  fillBasicContentFields({description, titleEn, titleIt, group}, append = false) {
    this.fillBeginContent(description, group, append);
    this.typeAttrTitleEn(titleEn);
    this.getItLanguageTab().click();
    this.typeAttrTitleIt(titleIt);
  }

  getAttributeByTypeIndex(type, idx, lang = 'en') {
    switch (type) {
      case 'Text':
      case 'Longtext':
      case 'Monotext':
      case 'Email':
      case 'Number':
        return new TextAttribute(this, idx, type, lang);
      case 'Boolean':
        return new BooleanAttribute(this, idx);
      case 'CheckBox':
        return new CheckboxAttribute(this, idx);
      case 'Date':
        return new DateAttribute(this, idx);
      case 'ThreeState':
        return new ThreeStateAttribute(this, idx);
      case 'Enumerator':
      case 'EnumeratorMap':
        return new EnumeratorAttribute(this, idx, type === 'EnumeratorMap');
      case 'Hypertext':
        return new HypertextAttribute(this, idx, lang);
      case 'Link':
        return new LinkAttribute(this, idx, lang);
      case 'Timestamp':
        return new TimestampAttribute(this, idx);
      case 'Attach':
      case 'Image':
        return new AssetAttribute(this, idx, type, lang);
      case 'Composite':
        return new CompositeAttribute(this, idx, lang);
      case 'List':
      case 'Monolist':
        return new ListAttribute(this, idx, lang, type === 'Monolist');
      default:
        return null;
    }
  }

  fillAttributes(attributeValues, options, assetId = null) {
    const {lang, editMode} = {lang: 'en', editMode: false, ...options};
    this.getContentAttributesLanguageTab(lang).click();
    attributeValues.forEach(({type, value, nestedType}, idx) => {
      const field = this.getAttributeByTypeIndex(type, idx, lang);
      if (field === null) return;
      if (['List', 'Monolist'].includes(type)) field.setAttributeType(nestedType);
      if ('Hypertext'.includes(type)) field.getInput().click();
      if (editMode) field.editValue(value);
      else if (assetId) field.setValue(value, assetId);
      else field.setValue(value);
    });
    cy.wrap(new AdminPage(AddPage)).as('currentPage');
  }

  addContentFromContentWidgetConfig(titleEn, titleIt, description, useApprove = false, group = 'Free Access', append = false) {
    this.fillBasicContentFields({titleEn, titleIt, description, group}, append);
    if (useApprove) return this.submitApproveForm();
    else return this.submitForm();
  }

  addContent(titleEn, titleIt, description, useApprove = false, group = 'Free Access', append = false) {
    this.fillBasicContentFields({titleEn, titleIt, description, group}, append);
    if (useApprove) {
      return this.submitApproveForm();
    } else {
      return this.submitForm();
    }
  }

  editContent(description, append = false) {
    if (!append) {
      this.clearDescription();
    }
    this.typeDescription(description);
    return this.submitForm();
  }

}
