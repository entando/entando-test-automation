import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage';

describe('User Roles', () => {

  let ROLE_NAME;
  let ROLE_CODE;
  const ROLE_CODE_ADMIN = 'admin';
  const ROLE_NAME_ADMIN = 'Administrator';
  let currentPage;

  beforeEach(() => {
     ROLE_NAME       = 'k' + generateRandomId().substr(0, 9);
     ROLE_CODE       = 'k' + generateRandomId().substr(0, 9);
    cy.kcLogin('admin').as('tokens');
  });

  afterEach(() => {
    cy.kcLogout();
  });

  describe('UI', () => {

    it('Roles page', () => {
      currentPage = openRolesPage();

      cy.validateUrlPathname('/role');

      currentPage.getContent().getTitle()
                 .should('be.visible')
                 .and('have.text', 'Roles');

      currentPage.getContent().getBreadCrumb().should('be.visible');
      currentPage.getContent().getBreadCrumb().children(htmlElements.li)
                 .should('have.length', 2)
                 .then(elements => cy.validateListTexts(elements, ['Users', 'Roles']));

      currentPage.getContent().getRolesTable().should('be.visible');
      currentPage.getContent().getTableHeaders().children(htmlElements.th)
                 .should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['Name', 'Code', 'Actions']));


      currentPage.getContent().getAddButton()
                 .should('be.visible')
                 .and('have.text', 'Add');
    });

    it('Add role page', () => {
      currentPage = openRolesPage();

      currentPage = currentPage.getContent().openAddRolePage();

      cy.validateUrlPathname('/role/add');

      currentPage.getContent().getTitle()
                 .should('be.visible')
                 .and('have.text', 'Add');

      currentPage.getContent().getBreadCrumb().should('be.visible');
      currentPage.getContent().getBreadCrumb().children(htmlElements.li)
                 .should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['Users', 'Roles', 'Add']));

      currentPage.getContent().getNameInput()
                 .should('be.visible')
                 .and('be.empty');
      currentPage.getContent().getCodeInput()
                 .should('be.visible')
                 .and('be.empty');

      currentPage.getContent().getPermissionsGrid().eq(1)
                 
                 .children(htmlElements.fieldset)
                 .children('.PermissionGrid')
                 .children('.col-xs-12')
                 .children('.col-xs-4')
                 .then(elements => cy.validateListTexts(elements,
                     [
                       'Content EditingON OFF',
                       'User Profile EditingON OFF',
                       'User ManagementON OFF',
                       'Access to Administration AreaON OFF',
                       'ECR Access PermissionON OFF',
                       'Operations on CategoriesON OFF',
                       'Operations on PagesON OFF',
                       'Asset EditingON OFF',
                       'Review ManagementON OFF',
                       'All functionsON OFF',
                       'Content SupervisionON OFF',
                       'View Users and ProfilesON OFF'
                     ]
                 ));

     currentPage.getContent()
                 .getCancelButton()
                 .should('be.visible')
                 .and('have.text', 'Cancel');
      currentPage.getContent().getSaveButton()
                 .should('be.visible')
                 .and('have.text', 'Save');
    });

    it('Edit role page', () => {
      currentPage = openRolesPage();

      currentPage = currentPage.getContent().getKebabMenu(ROLE_CODE_ADMIN).openEdit();

      cy.validateUrlPathname(`/role/edit/${ROLE_CODE_ADMIN}`);

      currentPage.getContent().getTitle()
                 .should('be.visible')
                 .and('have.text', 'Edit');

      currentPage.getContent().getBreadCrumb().should('be.visible');
      currentPage.getContent().getBreadCrumb().children(htmlElements.li)
                 .should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['Users', 'Roles', 'Edit']));

      currentPage.getContent().getNameInput()
                 .should('be.visible')
                 .and('have.value', ROLE_NAME_ADMIN);
      currentPage.getContent().getCodeInput()
                 .should('be.visible')
                 .and('be.disabled')
                 .and('have.value', ROLE_CODE_ADMIN);

      currentPage.getContent().getPermissionsGrid().eq(1)
                 .children(htmlElements.fieldset)
                 .children('.PermissionGrid')
                 .children('.col-xs-12')
                 .children('.col-xs-4')
                 .then(elements => cy.validateListTexts(elements,
                     [
                       'Content EditingON OFF',
                       'User Profile EditingON OFF',
                       'User ManagementON OFF',
                       'Access to Administration AreaON OFF',
                       'ECR Access PermissionON OFF',
                       'Operations on CategoriesON OFF',
                       'Operations on PagesON OFF',
                       'Asset EditingON OFF',
                       'Review ManagementON OFF',
                       'All functionsON OFF',
                       'Content SupervisionON OFF',
                       'View Users and ProfilesON OFF'
                     ]
                 ));

      currentPage.getContent().getCancelButton()
                 .should('be.visible')
                 .and('have.text', 'Cancel');
      currentPage.getContent().getSaveButton()
                 .should('be.visible')
                 .and('have.text', 'Save');
    });

    it('View role details page', () => {
      currentPage = openRolesPage();

      currentPage = currentPage.getContent().getKebabMenu(ROLE_CODE_ADMIN).openDetails();

      cy.validateUrlPathname(`/role/view/${ROLE_CODE_ADMIN}`);

      currentPage.getContent().getTitle()
                 .should('be.visible')
                 .and('have.text', 'Details');

      currentPage.getContent().getBreadCrumb().should('be.visible');
      currentPage.getContent().getBreadCrumb().children(htmlElements.li)
                 .should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['Configuration', 'Roles', 'Details']));

      currentPage.getContent().getDetailsDescription().children(htmlElements.dt)
                 .should('have.length', 4)
                 .then(elements => cy.validateListTexts(elements, ['Code', 'Name', 'Permissions', 'Referenced users']));

      currentPage.getContent().getDetailsDescription().children(htmlElements.dd)
                 .should('have.length', 4)
                 .then(elements => cy.validateListTexts(elements, [ROLE_CODE_ADMIN, ROLE_NAME_ADMIN]));
    });

  });

  describe('Actions ', () => {

    it('Add a new role', () => {
      currentPage = openRolesPage();

      currentPage = currentPage.getContent().openAddRolePage();
      currentPage = currentPage.getContent().addRole(ROLE_NAME, ROLE_CODE);

      currentPage.getContent().getTableRow(ROLE_CODE).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [ROLE_NAME, ROLE_CODE]));

      cy.rolesController().then(controller => controller.deleteRole(ROLE_CODE));
    });

    it('Update an existing role', () => {
      const ROLE_NAME_EDIT = generateRandomId();

      cy.rolesController().then(controller => controller.addRole(ROLE_CODE, ROLE_NAME));

      currentPage = openRolesPage();

      currentPage = currentPage.getContent().getKebabMenu(ROLE_CODE).openEdit();
      currentPage = currentPage.getContent().editRole(ROLE_NAME_EDIT);

      currentPage.getContent().getTableRow(ROLE_CODE).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [ROLE_NAME_EDIT, ROLE_CODE]));

      currentPage = currentPage.getContent().getKebabMenu(ROLE_CODE).openDetails();
      currentPage.getContent().getCodeValue().should('contain', ROLE_CODE);
      currentPage.getContent().getNameValue().should('contain', ROLE_NAME_EDIT);

      cy.rolesController().then(controller => controller.deleteRole(ROLE_CODE));
    });

    it('Delete an unreferenced role', () => {
      cy.rolesController().then(controller => controller.addRole(ROLE_CODE, ROLE_NAME));

      currentPage = openRolesPage();

      currentPage.getContent().getKebabMenu(ROLE_CODE).clickDeleteRole();
      currentPage.getDialog().getBody().getStateInfo().should('contain', ROLE_CODE);

      currentPage.getDialog().confirm();
      currentPage.getContent().getTableRows().should('not.contain', ROLE_CODE);
    });

    it('Deletion of an assigned role is forbidden', () => {
      currentPage = openRolesPage();

      currentPage.getContent().getTableRows().should('contain', ROLE_CODE_ADMIN);

      currentPage.getContent().getKebabMenu(ROLE_CODE_ADMIN).clickDeleteRole();

      currentPage.getDialog().getConfirmButton().should('not.exist');
    });

  });

  const openRolesPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getUsers().open();
    return currentPage.openRoles();
  };

});
