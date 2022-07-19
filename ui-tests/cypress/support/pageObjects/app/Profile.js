import {htmlElements} from '../WebElement.js';

import AppContent from './AppContent';

export default class Profile extends AppContent {

  tabs           = `${htmlElements.ul}.nav-tabs`;
  accountTab     = `${htmlElements.a}#my-profile-tabs-tab-account`;
  profileTab     = `${htmlElements.a}#my-profile-tabs-tab-profile`;
  preferencesTab = `${htmlElements.a}#my-profile-tabs-tab-preferences`;
  tabContent     = `${htmlElements.div}.tab-content`;
  accountModal   = `#myprofile-account`;
  legend         = `${htmlElements.legend}:visible > span`;

  // account tab
  usernameInput        = `#my-profile-tabs-pane-account ${htmlElements.input}[type=text]`;
  passwordInput        = `#my-profile-tabs-pane-account ${htmlElements.input}[type=password]`;
  changePasswordButton = `#my-profile-tabs-pane-account ${htmlElements.button}.btn-primary`;

  // account modal
  oldPassword              = `${htmlElements.input}[name=oldPassword]`;
  newPassword              = `${htmlElements.input}[name=newPassword]`;
  confirmPassword          = `${htmlElements.input}[name=newPasswordConfirm]`;
  accountModalSaveButton   = `${htmlElements.button}#savebtn`;
  accountModalCancelButton = `${htmlElements.button}.btn-cancel`;

  // profile tab
  uploadImageButton   = `${htmlElements.div}.ProfileImageUploader ${htmlElements.button}.dropdown-toggle`;
  profileImage        = `${htmlElements.div}.ProfileImageUploader ${htmlElements.img}`;
  profileImageInput   = `${htmlElements.div}.ProfileImageUploader ${htmlElements.input}[type=file]`;
  dropdownMenu        = `${htmlElements.div}.ProfileImageUploader ${htmlElements.ul}.dropdown-menu`;
  fullNameInput       = `${htmlElements.input}[name=fullname]`;
  emailInput          = `${htmlElements.input}[name=email]`;
  profileEditButton   = `#my-profile-tabs-pane-profile ${htmlElements.button}[type=button].btn-primary`;
  profileSaveButton   = `#my-profile-tabs-pane-profile ${htmlElements.button}[type=submit]`;
  profileCancelButton = `#my-profile-tabs-pane-profile ${htmlElements.button}.btn-default`;

  // preferences tab
  wizardSwitch                   = `${htmlElements.div}[aria-labelledby=switch-wizard] ${htmlElements.div}.bootstrap-switch`;
  missingTranslationSwitch       = `${htmlElements.div}[aria-labelledby=switch-translationWarning] ${htmlElements.div}.bootstrap-switch`;
  loadOnPageSelectSwitch         = `${htmlElements.div}[aria-labelledby=switch-loadOnPageSelect] ${htmlElements.div}.bootstrap-switch`;
  defaultPageOwnerSelect         = `${htmlElements.select}[name=defaultPageOwnerGroup]`;
  formControlSelect              = `${htmlElements.select}[class="form-control"]`;
  defaultPageJoinGroupsButton    = `${htmlElements.button}.MultiSelectRenderer__add-btn`;
  defaultContentOwnerGroupSelect = `${htmlElements.select}[name=defaultContentOwnerGroup]`;
  defaultContentJoinGroupButton  = `${htmlElements.button}.MultiSelectRenderer__add-btn`;
  defaultWidgetOwnerGroupSelect  = `${htmlElements.select}[name=defaultWidgetOwnerGroup]`;
  settingsSaveBtn                = `${htmlElements.button}[type=submit]`;

  static openPage(button) {
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesPageLoadingGET', '?*'));
    cy.myProfileTypeController().then(controller => controller.intercept({method: 'GET'}, 'myProfileTypePageLoadingGET'));
    cy.myUserProfileController().then(controller => controller.intercept({method: 'GET'}, 'myUserProfilePageLoadingGET'));
    cy.get(button).click();
    cy.wait(['@languagesPageLoadingGET', '@myProfileTypePageLoadingGET', '@myUserProfilePageLoadingGET']);
  }

  getContents() {
    return this.get();
  }

  getTitle() {
    return this.getContents()
               .children(htmlElements.div).eq(0)
               .find(htmlElements.h1);
  }

  getTabContent() {
    return this.getContents().find(this.tabContent);
  }

  getLegend() {
    return this.getTabContent().find(this.legend);
  }

  getAccountModal() {
    return cy.get(this.accountModal);
  }

  selectTab(tab) {
    const tabs = {
      'account': this.accountTab,
      'profile': this.profileTab,
      'preferences': this.preferencesTab
    };
    this.getContents().find(tabs[tab]).click();
    return cy.get('@currentPage');
  }

  clickChangePasswordButton() {
    this.getTabContent().find(this.changePasswordButton).click();
    return cy.get('@currentPage');
  }

  typeCurrentPassword(value) {
    this.getAccountModal().find(this.oldPassword).type(value);
    return cy.get('@currentPage');
  }

  typeNewPassword(value) {
    this.getAccountModal().find(this.newPassword).type(value);
    return cy.get('@currentPage');
  }

  typeConfirmNewPassword(value) {
    this.getAccountModal().find(this.confirmPassword).type(value);
    return cy.get('@currentPage');
  }

  clickChangePasswordSaveButton() {
    this.getAccountModal().find(this.accountModalSaveButton).click();
    return cy.get('@currentPage');
  }

  clickChangePasswordCancelButton() {
    this.getAccountModal().find(this.accountModalCancelButton).click();
  }

  getProfileEditButton() {
    return this.getTabContent().find(this.profileEditButton);
  }

  clickProfileEditButton() {
    this.getProfileEditButton().click();
    return cy.get('@currentPage');
  }

  clickProfileSaveButton() {
    this.getTabContent().find(this.profileSaveButton).click();
    return cy.get('@currentPage');
  }

  clickProfileCancelButton() {
    this.getTabContent().find(this.profileCancelButton).click();
  }

  typeFullNameInput(value) {
    this.getTabContent().find(this.fullNameInput).clear().type(value);
    return cy.get('@currentPage');
  }

  typeEmailInput(value) {
    this.getTabContent().find(this.emailInput).clear().type(value);
    return cy.get('@currentPage');
  }

  clickUploadImageButton() {
    this.getTabContent().find(this.uploadImageButton).click();
    return cy.get('@currentPage');
  }

  getProfileDropdown() {
    return this.getTabContent().find(this.dropdownMenu);
  }

  getProfileImage() {
    return this.getTabContent().find(this.profileImage);
  }

  uploadProfileImage(...fileName) {
    this.getTabContent().find(this.profileImageInput).selectFile(fileName, {force: true});
    return cy.get('@currentPage');
  }

  toggleWelcomeWizard() {
    this.getTabContent().find(this.wizardSwitch).click();
    return cy.get('@currentPage');
  }

  toggleMissingTranslationWizard() {
    this.getTabContent().find(this.missingTranslationSwitch).click();
  }

  toggleLoadOnPageSelectSwitch() {
    this.getTabContent().find(this.loadOnPageSelectSwitch).click();
    return cy.get('@currentPage');
  }

  selectDefaultPageOwner(value) {
    this.getTabContent().find(this.defaultPageOwnerSelect).select(value);
    return cy.get('@currentPage');
  }

  getSelectDefaultPageJoinGroups() {
    return this.getTabContent().find(this.formControlSelect).eq(0);
  }

  selectDefaultPageJoinGroups(value) {
    this.getSelectDefaultPageJoinGroups().select(value);
    this.getSelectDefaultPageJoinGroups().parent().find(this.defaultPageJoinGroupsButton).click();
    return cy.get('@currentPage');
  }

  selectDefaultContentOwnerGroup(value) {
    this.getTabContent().find(this.defaultContentOwnerGroupSelect).select(value);
    return cy.get('@currentPage');
  }

  getSelectDefaultContentJoinGroups() {
    return this.getTabContent().find(this.formControlSelect).eq(1);
  }

  selectDefaultContentJoinGroups(value) {
    this.getSelectDefaultContentJoinGroups().select(value);
    this.getSelectDefaultContentJoinGroups().parent().find(this.defaultContentJoinGroupButton).click();
    return cy.get('@currentPage');
  }

  selectWidgetOwnerGroup(value) {
    this.getTabContent().find(this.defaultWidgetOwnerGroupSelect).select(value);
    return cy.get('@currentPage');
  }

  getSettingsSaveBtn() {
    return this.getTabContent().find(this.settingsSaveBtn);
  }

  clickSettingsSaveBtn() {
    this.getSettingsSaveBtn().click();
    return cy.get('@currentPage');
  }

}
