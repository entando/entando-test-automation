import Content from './Content.js';

import {DATA_TESTID, htmlElements} from '../WebElement.js';

export default class Profile extends Content {
    tabs = `${htmlElements.ul}[${DATA_TESTID}=my-profile_MyProfilePage_Tabs]`;
    accountTab = `${htmlElements.a}#my-profile-tabs-tab-account`;
    profileTab = `${htmlElements.a}#my-profile-tabs-tab-profile`;
    preferencesTab = `${htmlElements.a}#my-profile-tabs-tab-preferences`;
    tabContent = `${htmlElements.div}.tab-content`;
    accountModal = `#myprofile-account`;
    legend = `${htmlElements.legend}:visible > span`;

    // account tab
    usernameInput = `#my-profile-tabs-pane-account ${htmlElements.input}[type=text]`;
    passwordInput = `#my-profile-tabs-pane-account ${htmlElements.input}[type=password]`;
    changePasswordButton = `#my-profile-tabs-pane-account ${htmlElements.button}.btn-primary`;

    // account modal
    oldPassword = `${htmlElements.input}[name=oldPassword]`;
    newPassword = `${htmlElements.input}[name=newPassword]`;
    confirmPassword = `${htmlElements.input}[name=newPasswordConfirm]`;
    accountModalSaveButton = `${htmlElements.button}#savebtn`;
    accountModalCancelButton = `${htmlElements.button}.btn-cancel`;

    // profile tab
    uploadImageButton = `${htmlElements.div}.ProfileImageUploader ${htmlElements.button}.dropdown-toggle`;
    profileImage = `${htmlElements.div}.ProfileImageUploader ${htmlElements.img}`;
    profileImageInput = `${htmlElements.div}.ProfileImageUploader ${htmlElements.input}[type=file]`;
    dropdownMenu = `${htmlElements.div}.ProfileImageUploader ${htmlElements.ul}.dropdown-menu`
    fullNameInput = `${htmlElements.input}[name=fullname]`;
    emailInput = `${htmlElements.input}[name=email]`;
    profileEditButton = `#my-profile-tabs-pane-profile ${htmlElements.button}[type=button].btn-primary`;
    profileSaveButton = `#my-profile-tabs-pane-profile ${htmlElements.button}[type=submit]`;
    profileCancelButton = `#my-profile-tabs-pane-profile ${htmlElements.button}.btn-default`;

    // preferences tab
    wizardSwitch = `${htmlElements.div}[aria-labelledby=switch-wizard] ${htmlElements.div}.bootstrap-switch`;
    missingTranslationSwitch = `${htmlElements.div}[aria-labelledby=switch-translationWarning] ${htmlElements.div}.bootstrap-switch`;
    loadOnPageSelectSwitch = `${htmlElements.div}[aria-labelledby=switch-loadOnPageSelect] ${htmlElements.div}.bootstrap-switch`;
    defaultPageOwnerSelect = `${htmlElements.select}[name=defaultPageOwnerGroup]`;
    defaultPageJoinGroupsSelect = `${htmlElements.select}[name=defaultPageJoinGroups]`;
    defaultPageJoinGroupsButton = `${htmlElements.button}.MultiSelectRenderer__add-btn`;
    defaultContentOwnerGroupSelect = `${htmlElements.select}[name=defaultContentOwnerGroup]`;
    defaultContentJoinGroupSelect = `${htmlElements.select}[name=defaultContentJoinGroups]`;
    defaultContentJoinGroupButton = `${htmlElements.button}.MultiSelectRenderer__add-btn`;
    defaultWidgetOwnerGroupSelect = `${htmlElements.select}[name=defaultWidgetOwnerGroup]`;
    settingsSaveBtn = `${htmlElements.button}[type=submit]`;

    selectTab(tab) {
        const tabs = {
            'account': this.accountTab,
            'profile': this.profileTab,
            'preferences': this.preferencesTab
        }
        this.getContents().find(tabs[tab]).click();
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

    clickChangePasswordButton() {
        this.getTabContent().find(this.changePasswordButton).click();
    }

    typeCurrentPassword(value) {
        this.getAccountModal().find(this.oldPassword).type(value);
    }

    typeNewPassword(value) {
        this.getAccountModal().find(this.newPassword).type(value);
    }

    typeConfirmNewPassword(value) {
        this.getAccountModal().find(this.confirmPassword).type(value);
    }

    clickChangePasswordSaveButton() {
        this.getAccountModal().find(this.accountModalSaveButton).click();
    }

    clickChangePasswordCancelButton() {
        this.getAccountModal().find(this.accountModalCancelButton).click();
    }

    clickProfileEditButton() {
        this.getTabContent().find(this.profileEditButton).click();
    }

    clickProfileSaveButton() {
        this.getTabContent().find(this.profileSaveButton).click();
    }

    clickProfileCancelButton() {
        this.getTabContent().find(this.profileCancelButton).click();
    }

    typeFullNameInput(value) {
        this.getTabContent().find(this.fullNameInput).clear().type(value);
    }

    typeEmailInput(value) {
        this.getTabContent().find(this.emailInput).clear().type(value);
    }

    clickUploadImageButton() {
        this.getTabContent().find(this.uploadImageButton).click();
    }

    getProfileDropdown() {
        return this.getTabContent().find(this.dropdownMenu);
    }

    getProfileImage() {
        return this.getTabContent().find(this.profileImage);
    }

    uploadProfileImage(...fileName) {
        this.getTabContent().find(this.profileImageInput).selectFile(fileName);
    }

    toggleWelcomeWizard() {
        this.getTabContent().find(this.wizardSwitch).click();
    }

    toggleMissingTranslationWizard() {
        this.getTabContent().find(this.missingTranslationSwitch).click();
    }

    toggleLoadOnPageSelectSwitch() {
        this.getTabContent().find(this.loadOnPageSelectSwitch).click();
    }

    selectDefaultPageOwner(value) {
        this.getTabContent().find(this.defaultPageOwnerSelect).select(value);
    }

    selectDefaultPageJoinGroups(value) {
        this.getTabContent().find(this.defaultPageJoinGroupsSelect).select(value);
        this.getTabContent().find(this.defaultPageJoinGroupsSelect).parent().find(this.defaultPageJoinGroupsButton).click();
    }

    selectDefaultContentOwnerGroup(value) {
        this.getTabContent().find(this.defaultContentOwnerGroupSelect).select(value);
    }

    selectDefaultContentJoinGroups(value) {
        this.getTabContent().find(this.defaultContentJoinGroupSelect).select(value);
        this.getTabContent().find(this.defaultContentJoinGroupSelect).parent().find(this.defaultContentJoinGroupButton).click();
    }

    selectWidgetOwnerGroup(value) {
        this.getTabContent().find(this.defaultWidgetOwnerGroupSelect).select(value);
    }

    clickSettingsSaveBtn() {
        this.getTabContent().find(this.settingsSaveBtn).click();
    }

}
