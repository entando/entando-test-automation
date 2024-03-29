import {htmlElements} from '../WebElement.js';

import {SubMenu} from '../app/MenuElement.js';

import AppPage from '../app/AppPage.js';

import ManagementPage   from './management/ManagementPage';
import RolesPage        from './roles/RolesPage.js';
import GroupsPage       from './groups/GroupsPage';
import ProfileTypesPage from './profileTypes/ProfileTypesPage';
import RestrictionsPage from './restrictions/RestrictionsPage';

export default class UsersAdminMenu extends SubMenu {

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
    this.getManagement().then(button => ManagementPage.openPage(button, false));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

  openRoles() {
    this.getRoles().then(button => RolesPage.openPage(button, false));
    return cy.wrap(new AppPage(RolesPage)).as('currentPage');
  }

  openGroups() {
    this.getGroups().then(button => GroupsPage.openPage(button));
    return cy.wrap(new AppPage(GroupsPage)).as('currentPage');
  }

  openProfileTypes() {
    this.getProfileTypes().then(button => ProfileTypesPage.openPage(button));
    return cy.wrap(new AppPage(ProfileTypesPage)).as('currentPage');
  }

  openRestrictions() {
    this.getRestrictions().click();
    return new AppPage(RestrictionsPage);
  }

}
