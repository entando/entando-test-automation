import {htmlElements, WebElement} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

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
import AppPage from '../../app/AppPage';
import ContentWidgetConfigPage from '../../pages/designer/widgetconfigs/ContentWidgetConfigPage';
import { Dialog } from '../../app/Dialog';

export default class AddPage extends AppContent {

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

  static openPage(button, contentType, editPage = false) {
    cy.contentTypesController().then(controller => controller.intercept({method: 'GET'}, 'addContentPageLoadingGET', `/${contentType}`));
    cy.contentSettingsController().then(controller => controller.intercept({method: 'GET'}, 'contentSettingsGET'));
    cy.categoriesController().then(controller => controller.intercept({method: 'GET'}, 'categoriesLoadingGET', '?parentCode=home'));
    cy.groupsController().then(controller => controller.intercept({method: 'GET'}, 'groupsLoadingGET', '?page=1&pageSize=0'));
    cy.get(button).click();
    cy.wait(['@contentSettingsGET', '@categoriesLoadingGET', '@groupsLoadingGET']);
    if (!editPage) cy.wait(['@addContentPageLoadingGET', '@addContentPageLoadingGET']);
  }

  static get BASIC_ATTRIBUTES() {
    return AddPage.ATTRIBUTES.filter(attribute => !AddPage.COMPLEX_ATTRIBUTES.includes(attribute));
  }

  getItContentPane() {
    return this.getContents().get(this.contentAttrItPane);
  }

  getTitleAttrItInput() {
    return this.getItContentPane()
               .find(this.contentTitleAttrInput).eq(0);
  }

  getEnContentPane() {
    return this.getContents().get(this.contentAttrEnPane);
  }

  getTitleAttrEnInput() {
    return this.getEnContentPane()
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

  getContentAttributesLanguageTab(lang) {
    return this.getContents().find(`${htmlElements.a}#content-attributes-tabs-tab-${lang}`);
  }

  getCopyToLangBtn() {
    return this.getContents()
               .get(this.contentAttrEnPane)
               .find('.text-right > button.btn-default')
               .eq(0);
  }

  getSaveDropDownButton() {
    return new DropDownButton(this);
  }

  getSaveDropDownListItems() {
    return this.getSaveDropDownButton().open();
  }

  getOwnerGroup() {
    return this.getContents()
               .get(this.groupsFormSection)
               .find(htmlElements.input)
               .eq(0);
  }

  getSaveAction() {
    // 0 is the Save action number
    return this.getSaveDropDownListItems().get(0);
  }

  getSaveContinueAction() {
    return this.getSaveDropDownListItems().get(1);
  }

  getSaveApproveAction(confirmTranslation = false) {
    if (confirmTranslation) {
      this.parent.getDialog().setBody(Dialog);
    }
    return this.getSaveDropDownListItems().get(2);
  }

  typeAttrTitleIt(title) {
    return this.getTitleAttrItInput().then(input => this.type(input, title));
  }

  typeAttrTitleEn(title) {
    return this.getTitleAttrEnInput().then(input => this.type(input, title));
  }

  clearOwnerGroup() {
    return this.getOwnerGroup().then(input => this.clear(input));
  }

  copyToAllLanguages() {
    return this.getCopyToLangBtn().then(button => this.click(button));
  }

  submitForm(confirmTranslation = false) {
    if (confirmTranslation) {
      this.getSaveAction().click();
      this.parent.getDialog().setBody(Dialog);
      this.parent.getDialog().getFooter().children(htmlElements.button).eq(1).then(button => ManagementPage.openPage(button));
    } else this.getSaveAction().then(button => ManagementPage.openPage(button));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

  submitApproveForm(confirmTranslation = false) {
    if (confirmTranslation) {
      this.getSaveApproveAction().click();
      this.parent.getDialog().setBody(Dialog);
      this.parent.getDialog().getFooter().children(htmlElements.button).eq(1).then(button => ManagementPage.openPage(button));
    } else this.getSaveApproveAction().then(button => ManagementPage.openPage(button));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

  fillBeginContent(description, group = 'Free Access', append = false) {
    this.getGroupDropdown().click({scrollBehavior: 'center'});
    this.getGroupDropdown().contains(group).click({scrollBehavior: 'center'});
    return this.getDescriptionInput().then(input => this.type(input, description, append));
  }

  fillBasicContentFields({description, titleEn, titleIt, group}, append = false) {
    this.fillBeginContent(description, group, append);
    this.typeAttrTitleEn(titleEn);
    this.getContentAttributesLanguageTab('it').click();
    return this.typeAttrTitleIt(titleIt);
  }

  getAttributeByTypeIndex(type, idx, lang = 'en', fckeditor = false) {
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
        return new HypertextAttribute(this, idx, lang, fckeditor);
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

  fillAttributes(attributeValues, options, fckeditor = false) {
    const { lang, editMode } = { lang: 'en', editMode: false, ...options };
    this.getContentAttributesLanguageTab(lang).click();
    attributeValues.forEach(({ type, value, nestedType }, idx) => {
      const field = this.getAttributeByTypeIndex(type, idx, lang, fckeditor);
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
    return cy.get('@currentPage');
  }

  addContentFromContentWidgetConfig(titleEn, titleIt, description, useApprove = false, group = 'Free Access', append = false) {
    this.fillBasicContentFields({titleEn, titleIt, description, group}, append);
    if (useApprove) {
      this.getSaveApproveAction().click()
    } else {
      this.getSaveAction().click();
    }

    cy.wait(3000);
    return cy.wrap(new AppPage(ContentWidgetConfigPage)).as('currentPage');
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
    this.getDescriptionInput().then(input => this.type(input, description, append))
    return this.submitForm();
  }

}

class ActionItems extends WebElement {

  contentSaveButtonUl         = `${htmlElements.ul}`;
  contentSaveButtonWrapper    = `${htmlElements.div}.StickySave__row--top`;
  contentSaveButtonSaveAction = `${htmlElements.li}`;

  get(action = 0) {
    return this.parent.get()
               .children().find(this.contentSaveButtonWrapper).find(this.contentSaveButtonUl)
               .find(this.contentSaveButtonSaveAction).eq(action);
  }

  click(action = 0) {
    this.get(action).click();
    return cy.get('@currentPage');
  }

}


class DropDownButton extends WebElement {

  contentSaveButton = `${htmlElements.button}#saveopts`;

  get() {
    return this.parent.get()
               .children()
               .find(this.contentSaveButton);
  }

  open() {
    this.get().invoke('attr', 'aria-expanded')
        .then(expanded => {
          const isExpanded = (expanded === 'true');
          if (isExpanded === false) {
            this.get().click();
          }
        })
    return new ActionItems();
  }

}
