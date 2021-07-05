import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

import {SubMenu} from "../app/MenuElement.js";

import AppPage from "../app/AppPage.js";

import ManagementPage from "./management/ManagementPage";
import RolesPage from "./roles/RolesPage.js";
import GroupsPage from "./groups/GroupsPage";
import ProfileTypesPage from "./profileTypes/ProfileTypesPage";
import RestrictionsPage from "./restrictions/RestrictionsPage";

export default class UsersMenu extends SubMenu {

  get() {
    return this.parent.get()
               .children(htmlElements.ul)
               .children(htmlElements.li).eq(4);
  }

  getManagement() {
    return this.getElements()
               .children(htmlElements.li).eq(0);
  }

  getRoles() {
    return this.getElements()
               .children(htmlElements.li).eq(1);
  }

  getGroups() {
    return this.getElements()
               .children(htmlElements.li).eq(2);
  }

  getProfileTypes() {
    return this.getElements()
               .children(htmlElements.li).eq(3);
  }

  getRestrictions() {
    return this.getElements()
               .children(htmlElements.li).eq(4);
  }

  openManagement() {
    this.getManagement().click();
    return new AppPage(ManagementPage);
  }

  openRoles() {
    this.getRoles().click();
    return new AppPage(RolesPage);
  }

  openGroups() {
    this.getGroups().click();
    return new AppPage(GroupsPage);
  }

  openProfileTypes() {
    this.getProfileTypes().click();
    return new AppPage(ProfileTypesPage);
  }

  openRestrictions() {
    this.getRestrictions().click();
    return new AppPage(RestrictionsPage);
  }

}