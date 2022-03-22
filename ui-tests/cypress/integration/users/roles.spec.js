import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage';

describe([Tag.GTS], 'User Roles', () => {

  const ROLE_NAME       = generateRandomId();
  const ROLE_CODE       = generateRandomId();
  const ROLE_CODE_ADMIN = 'admin';
  const ROLE_NAME_ADMIN = 'Administrator';
  let currentPage;

  beforeEach(() => {
    cy.kcAPILogin();
    cy.rolesController().then(controller => controller.intercept({method: 'GET'}, 'loadedTable', '?page=1&pageSize=10'));
    cy.permissionsController().then(controller => controller.intercept({method: 'GET'}, 'loadedAddEdit', '?page=1&pageSize=0'));
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.kcUILogout();
  });

  describe('UI', () => {

    beforeEach(() => {
      cy.rolesController().then(controller => controller.intercept({method: 'GET'}, 'loadedDetails', `/${ROLE_CODE_ADMIN}/userreferences?page=1&pageSize=10`));
    });

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

      currentPage = openAddRolePage();

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

      currentPage.getContent().getCancelButton()
                 .should('be.visible')
                 .and('have.text', 'Cancel');
      currentPage.getContent().getSaveButton()
                 .should('be.visible')
                 .and('have.text', 'Save');

      validatePermissionGrid();
    });

    it('Edit role page', () => {
      currentPage = openRolesPage();

      currentPage = openEdit(ROLE_CODE_ADMIN);

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

      currentPage.getContent().getCancelButton()
                 .should('be.visible')
                 .and('have.text', 'Cancel');
      currentPage.getContent().getSaveButton()
                 .should('be.visible')
                 .and('have.text', 'Save');

      validatePermissionGrid();
    });

    it('View role details page', () => {
      currentPage = openRolesPage();

      currentPage = openDetails(ROLE_CODE_ADMIN);

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

    beforeEach(() => {
      cy.wrap(null).as('roleToBeDeleted');
      cy.rolesController().then(controller => controller.intercept({method: 'GET'}, 'loadedDetails', `/${ROLE_CODE}/userreferences?page=1&pageSize=10`));
    });

    afterEach(() => {
      cy.get('@roleToBeDeleted').then(code => {
        if (code) cy.rolesController().then(controller => controller.deleteRole(code));
      });
    });

    it('Add a new role', () => {
      currentPage = openRolesPage();

      currentPage = openAddRolePage();

      currentPage = currentPage.getContent().addRole(ROLE_NAME, ROLE_CODE);
      cy.wrap(ROLE_CODE).as('roleToBeDeleted');
      cy.wait('@loadedTable');

      currentPage.getContent().getTableRow(ROLE_CODE).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [ROLE_NAME, ROLE_CODE]));
    });

    it('Update an existing role', () => {
      const ROLE_NAME_EDIT = generateRandomId();

      addRole(ROLE_CODE, ROLE_NAME);

      currentPage = openRolesPage();

      currentPage = openEdit(ROLE_CODE);
      currentPage.getContent().getNameInput().should('have.value', ROLE_NAME);
      currentPage = currentPage.getContent().editRole(ROLE_NAME_EDIT);
      cy.wait('@loadedTable');

      currentPage.getContent().getTableRow(ROLE_CODE).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [ROLE_NAME_EDIT, ROLE_CODE]));

      currentPage = openDetails(ROLE_CODE);
      currentPage.getContent().getCodeValue().should('contain', ROLE_CODE);
      currentPage.getContent().getNameValue().should('contain', ROLE_NAME_EDIT);
    });

    it('Delete an unreferenced role', () => {
      addRole(ROLE_CODE, ROLE_NAME);

      currentPage = openRolesPage();

      currentPage.getContent().getKebabMenu(ROLE_CODE).open().clickDelete();
      currentPage.getDialog().getBody().getStateInfo().should('contain', ROLE_CODE);

      currentPage.getDialog().confirm();
      currentPage.getContent().getTableRows().should('not.contain', ROLE_CODE);
      cy.wrap(null).as('roleToBeDeleted');
    });

    it('Deletion of an assigned role is forbidden', () => {
      currentPage = openRolesPage();

      currentPage.getContent().getTableRows().should('contain', ROLE_CODE_ADMIN);

      currentPage.getContent().getKebabMenu(ROLE_CODE_ADMIN).open().clickDelete();

      currentPage.getDialog().getConfirmButton().should('not.exist');
    });

  });

  const openRolesPage = () => {
    cy.wait('@loadedAddEdit');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getUsers().open();
    currentPage = currentPage.openRoles();
    cy.wait('@loadedTable');
    return currentPage;
  };

  const openAddRolePage = () => {
    currentPage = currentPage.getContent().openAddRolePage();
    cy.validateUrlPathname('/role/add');
    cy.wait('@loadedAddEdit');
    return currentPage;
  };

  const openEdit = (code) => {
    currentPage = currentPage.getContent().getKebabMenu(code).open().openEdit();
    cy.validateUrlPathname(`/role/edit/${code}`);
    cy.wait('@loadedAddEdit');
    return currentPage;
  };

  const openDetails = (code) => {
    currentPage = currentPage.getContent().getKebabMenu(code).open().openDetails();
    cy.validateUrlPathname(`/role/view/${code}`);
    cy.wait('@loadedDetails');
    return currentPage;
  };

  const validatePermissionGrid = () => {
    currentPage.getContent().getPermissionsGrid().should('not.have.class', 'spinner');
    currentPage.getContent().getPermissionsGrid().children(htmlElements.div)
               .should('have.length', 12)
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
  };

  const addRole = (code, name) => {
    cy.rolesController().then(controller => controller.addRole({code: code, name: name}))
      .then(response => cy.wrap(response.body.payload.code).as('roleToBeDeleted'));
  };

});
