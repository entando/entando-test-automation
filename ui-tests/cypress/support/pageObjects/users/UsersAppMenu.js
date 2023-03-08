import {SubMenu} from '../app/MenuElement.js';

import AppPage from '../app/AppPage.js';

import ManagementPage   from './management/ManagementPage';
import RolesPage        from './roles/RolesPage.js';
import GroupsPage       from './groups/GroupsPage';
import ProfileTypesPage from './profileTypes/ProfileTypesPage';
import RestrictionsPage from './restrictions/RestrictionsPage';

export default class UsersAppMenu extends SubMenu {

  open() {
    this.click();
    return this;
  }

  get() {
    return this.parent.get().find('[data-id="users"]');
  }

  getSubmenu() {
    return this.get().find('[data-id="menu"]');
  }

  getManagement() {
    return this.getSubmenu().find('[data-id="users-management"]');
  }

  getRoles() {
    return this.getSubmenu().find('[data-id="users-roles"]');
  }

  getGroups() {
    return this.getSubmenu().find('[data-id="users-groups"]');
  }

  getProfileTypes() {
    return this.getSubmenu().find('[data-id="users-profile-types"]');
  }

  getRestrictions() {
    return this.getSubmenu().find('[data-id="users-restrictions"]');
  }

  getCollapseButton() {
    return this.getSubmenu().find('[data-back="back"]');
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
