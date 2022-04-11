import {htmlElements}          from '../../WebElement';
import Content                 from '../../app/Content.js';
import AdminPage                 from '../../app/AdminPage.js';
import ManagementPage          from './ManagementPage';
import ContentWidgetConfigPage from '../../pages/designer/widgetconfigs/ContentWidgetConfigPage';
import TextAttribute           from './attribute-fields/TextAttribute';
import HypertextAttribute from './attribute-fields/HypertextAttribute';
import AssetAttribute from './attribute-fields/AssetAttribute';
import CompositeAttribute from './attribute-fields/CompositeAttribute';
import BooleanAttribute from './attribute-fields/BooleanAttribute';
import EnumeratorAttribute from './attribute-fields/EnumeratorAttribute';
import ThreeStateAttribute from './attribute-fields/ThreeStateAttribute';
import CheckboxAttribute from './attribute-fields/CheckboxAttribute';
import DateAttribute from './attribute-fields/DateAttribute';
import TimestampAttribute from './attribute-fields/TimestampAttribute';
import LinkAttribute from './attribute-fields/LinkAttribute';
import ListAttribute from './attribute-fields/ListAttribute';

export default class AddPage extends Content {

  static ATTRIBUTES = [
    'Attach',
    'Boolean',
    'CheckBox',
    'Date',
    'Email',
    'Hypertext',
    'Image',
    'Link',
    'Longtext',
    'Monotext',
    'Number',
    'Text',
    'ThreeState',
    'Timestamp',
    'Composite',
    'List',
    'Monolist',
  ];

  static COMPLEX_ATTRIBUTES = [
    'Composite',
    'List',
    'Monolist',
  ];

  static MULTILANG_ATTRIBUTES = [
    'Text',
    'Image',
    'Longtext',
    'Hypertext',
    'Attach',
  ];

  contentDescriptionInput = `${htmlElements.input}#contentDescription`;
  contentGroupFormBody    = `${htmlElements.div}.form-group`;
  contentGroupInput       = `${htmlElements.select}#contentMainGroup`;
  setGroupButton          = `${htmlElements.button}[name="entandoaction:configureMainGroup"]`;
  contentTitleAttrEnInput = `${htmlElements.input}[name="Text:en_title"]`;
  contentTitleAttrItInput = `${htmlElements.input}[name="Text:it_title"]`;
  contentAttrsEnTab       = `${htmlElements.a}#content-attributes-tabs-tab-en`;
  contentAttrsItTab       = `${htmlElements.a}[href="#it_tab"]`;
  contentTitleAttrInputIt = `attributes[0].values.it`;
  contentAttrEnPane       = `${htmlElements.div}#en_tab`;
  contentAttrItPane       = `${htmlElements.div}#it_tab`;
  groupsFormSection       = `${htmlElements.div}.GroupsFormBody`;
  stickyToolbar           = `${htmlElements.div}#sticky-toolbar`;

  static get BASIC_ATTRIBUTES() {
    return AddPage.ATTRIBUTES.filter(attribute => !AddPage.COMPLEX_ATTRIBUTES.includes(attribute));
  }

  getTitleAttrItInput() {
    return this.getContents().get(this.contentAttrItPane)
               .find(this.contentTitleAttrItInput).eq(0);
  }

  getTitleAttrEnInput() {
    return this.getContents().get(this.contentAttrEnPane)
               .find(this.contentTitleAttrEnInput);
  }

  getDescriptionInput() {
    return this.getContents()
               .find(this.contentDescriptionInput);
  }

  getGroupDropdown() {
    return this.getContents()
               .find(this.contentGroupFormBody)
               .find(this.contentGroupInput);
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

  getOwnerGroup() {
    return this.getContents()
               .get(this.groupsFormSection)
               .find(htmlElements.input)
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

  getSaveContinueAction() {
    return this.getStickyToolbar()
               .find(`${htmlElements.button}#edit-saveAndContinue`);
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
    this.getDescriptionInput().type(input);
  }

  clearDescription() {
    this.getDescriptionInput().clear();
  }

  clearOwnerGroup() {
    this.getOwnerGroup().clear();
  }

  copyToAllLanguages() {
    this.getCopyToLangBtn().click();
  }

  submitForm(confirmTranslation = false) {
    this.getSaveAction().click();
    if (confirmTranslation) {
      this.parent.getDialog().getFooter().children(htmlElements.button).eq(1).click();
    }
    return new AdminPage(ManagementPage);
  }

  submitApproveForm(confirmTranslation = false) {
    this.getSaveApproveAction().click();
    if (confirmTranslation) {
      this.parent.getDialog().getFooter().children(htmlElements.button).eq(1).click();
    }
    return new AdminPage(ManagementPage);
  }

  getSetGroupButton() {
    return this.getGroupDropdown().parent().find(this.setGroupButton);
  }

  fillBeginContent(description, group = 'Free Access', append = false) {
    this.getGroupDropdown().select(group);
    this.getSetGroupButton().click();
    if (!append) {
      this.clearDescription();
    }
    this.typeDescription(description);
    return this;
  }

  fillBasicContentFields({description, titleEn, titleIt, group}, append = false) {
    this.fillBeginContent(description, group, append);
    this.typeAttrTitleEn(titleEn);
    this.getItLanguageTab().click();
    this.typeAttrTitleIt(titleIt);
  }

  getAttributeByTypeIndex(type, idx, lang = 'en') {
    switch(type) {
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

  fillAttributes(attributeValues, options) {
    const { lang, editMode } = { lang: 'en', editMode: false, ...options };
    if (lang === 'it') {
      this.getItLanguageTab().click();
    } else {
      this.getEnLanguageTab().click();
    }
    cy.wait(500);
    attributeValues.forEach(({ type, value, nestedType }, idx) => {
      const field = this.getAttributeByTypeIndex(type, idx, lang);
      if (field === null) {
        return;
      }
      if (['List', 'Monolist'].includes(type)) {
        field.setAttributeType(nestedType);
      }
      field.expand();
      if (editMode) {
        field.editValue(value);
      } else {
        field.setValue(value);
      }
    });
    return this;
  }

  addContentFromContentWidgetConfig(titleEn, titleIt, description, useApprove = false, group = 'Free Access', append = false) {
    this.fillBasicContentFields({titleEn, titleIt, description, group}, append);
    if (useApprove) {
      this.submitApproveForm();
    } else {
      this.submitForm();
    }

    return new AdminPage(ContentWidgetConfigPage);
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
    this.submitForm();
    return new AdminPage(ManagementPage);
  }

}
