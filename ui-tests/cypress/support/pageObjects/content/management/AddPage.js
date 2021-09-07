import {htmlElements}          from '../../WebElement';
import Content                 from '../../app/Content.js';
import AppPage                 from '../../app/AppPage.js';
import ManagementPage          from './ManagementPage';
import DropDownButton          from './DropDownButton';
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

  contentDescriptionInput = `${htmlElements.input}#description`;
  contentGroupFormBody    = `${htmlElements.div}.GroupsFormBody.EditContentForm__outer-fieldset`;
  contentGroupInput       = `${htmlElements.div}.DropdownTypeahead`;
  contentTitleAttrInput   = `.RenderTextInput`;
  contentAttrsEnTab       = `${htmlElements.a}#content-attributes-tabs-tab-en`;
  contentAttrsItTab       = `${htmlElements.a}#content-attributes-tabs-tab-it`;
  contentTitleAttrInputIt = `attributes[0].values.it`;
  contentAttrEnPane       = `${htmlElements.div}#content-attributes-tabs-pane-en`;
  contentAttrItPane       = `${htmlElements.div}#content-attributes-tabs-pane-it`;
  groupsFormSection       = `${htmlElements.div}.GroupsFormBody`;

  static get BASIC_ATTRIBUTES() {
    return AddPage.ATTRIBUTES.filter(attribute => !AddPage.COMPLEX_ATTRIBUTES.includes(attribute));
  }

  getTitleAttrItInput() {
    return this.getContents().get(this.contentAttrItPane)
               .find(this.contentTitleAttrInput).eq(0);
  }

  getTitleAttrEnInput() {
    return this.getContents().get(this.contentAttrEnPane)
               .find(this.contentTitleAttrInput).eq(0);
  }

  getDescriptionInput() {
    return this.getContents()
               .find(this.contentDescriptionInput);
  }

  getGroupDropdown() {
    return this.getContents()
               .find(this.contentGroupFormBody)
               .find(this.contentGroupInput).eq(0)
               .children(htmlElements.div).eq(1);
  }

  getEnLanguageTab() {
    return this.getContents().find(this.contentAttrsEnTab);
  }

  getItLanguageTab() {
    return this.getContents().find(this.contentAttrsItTab);
  }

  getSaveDropDownButton() {
    return new DropDownButton(this);
  }

  getSaveDropDownListItems() {
    return this.getSaveDropDownButton().open();
  }

  getSaveAction() {
    // 0 is the Save action number
    return this.getSaveDropDownListItems().get(0);
  }

  getOwnerGroup() {
    return this.getContents()
               .get(this.groupsFormSection)
               .find(htmlElements.input)
               .eq(0);
  }

  getSaveApproveAction() {
    return this.getSaveDropDownListItems().get(2);
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

  submitForm() {
    this.getSaveAction().click();
    cy.wait(1000);
    return new AppPage(ManagementPage);
  }

  submitApproveForm() {
    this.getSaveApproveAction().click();
    cy.wait(1000);
    return new AppPage(ManagementPage);
  }

  fillBeginContent(description, group = 'Free Access', append = false) {
    this.getGroupDropdown().click({scrollBehavior: 'center'});
    cy.wait(500);
    this.getGroupDropdown().contains(group).click({scrollBehavior: 'center'});
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

  fillAttributes(attributeValues, lang = 'en') {
    if (lang === 'it') {
      this.getItLanguageTab().click();
    } else {
      this.getEnLanguageTab().click();
    }
    cy.wait(500);
    attributeValues.forEach(({ type, value }, idx) => {
      switch(type) {
        case 'Text':
        case 'Longtext':
        case 'Monotext':
        case 'Email':
        case 'Number': {
          const field = new TextAttribute(this, idx, type, lang);
          field.expand()
            .setValue(value);
          break;
        }
        case 'Boolean': {
          const field = new BooleanAttribute(this, idx);
          field.expand()
            .setValue(value);
          break;
        }
        case 'CheckBox': {
          const field = new CheckboxAttribute(this, idx);
          field.expand()
            .setValue(value);
          break;
        }
        case 'Date': {
          const field = new DateAttribute(this, idx);
          field.expand()
            .setValue(value);
          break;
        }
        case 'ThreeState': {
          const field = new ThreeStateAttribute(this, idx);
          field.expand()
            .setValue(value);
          break;
        }
        case 'Enumerator':
        case 'EnumeratorMap': {
          const field = new EnumeratorAttribute(this, idx, type === 'EnumeratorMap');
          field.expand()
            .setValue(value);
          break;
        }
        case 'Hypertext': {
          const field = new HypertextAttribute(this, idx, lang);
          field.expand()
            .setValue(value);
          break;
        } 
        case 'Link': {
          const field = new LinkAttribute(this, idx, lang);
          field.expand()
            .setValue(value);
          break;
        }
        case 'Timestamp': {
          const field = new TimestampAttribute(this, idx, lang);
          field.expand()
            .setValue(value);
          break;
        }
        case 'Attach':
        case 'Image': {
          const field = new AssetAttribute(this, idx, type, lang);
          field.expand()
            .setValue(value);
          break;
        }
        case 'Composite': {
          const field = new CompositeAttribute(this, idx, lang);
          field.expand()
            .setValue(value);
          break;
        }
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

    return new AppPage(ContentWidgetConfigPage);
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
    cy.wait(1000);
    return new AppPage(ManagementPage);
  }

}
