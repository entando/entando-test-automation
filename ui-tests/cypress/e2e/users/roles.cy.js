import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

describe('User Roles', () => {

  const ROLE_CODE_ADMIN = 'admin';
  const ROLE_NAME_ADMIN = 'Administrator';

  beforeEach(() => {
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => {
    cy.kcTokenLogout();
  });

  describe('UI', () => {

    it([Tag.GTS, 'ENG-2069'], 'Roles page', () => {
      openRolesPage()
        .then(page => {
          cy.validateUrlPathname('/role');
          page.getContent().getTitle()
              .should('be.visible')
              .and('have.text', 'Roles');
          page.getContent().getBreadCrumb().should('be.visible');
          page.getContent().getBreadCrumb().children(htmlElements.li)
              .should('have.length', 2)
              .then(elements => cy.validateListTexts(elements, ['Users', 'Roles']));
          page.getContent().getRolesTable().should('be.visible');
          page.getContent().getTableHeaders().children(htmlElements.th)
              .should('have.length', 3)
              .then(elements => cy.validateListTexts(elements, ['Name', 'Code', 'Actions']));
          page.getContent().getAddButton()
              .should('be.visible')
              .and('have.text', 'Add');
        });
    });

    it([Tag.GTS, 'ENG-2069'], 'Add role page', () => {
      openRolesPage()
        .then(page => page.getContent().openAddRolePage())
        .then(page => {
          cy.validateUrlPathname('/role/add');
          page.getContent().getTitle()
              .should('be.visible')
              .and('have.text', 'Add');
          page.getContent().getBreadCrumb().should('be.visible');
          page.getContent().getBreadCrumb().children(htmlElements.li)
              .should('have.length', 3)
              .then(elements => cy.validateListTexts(elements, ['Users', 'Roles', 'Add']));
          page.getContent().getNameInput()
              .should('be.visible')
              .and('be.empty');
          page.getContent().getCodeInput()
              .should('be.visible')
              .and('be.empty');
          page.getContent().getCancelButton()
              .should('be.visible')
              .and('have.text', 'Cancel');
          page.getContent().getSaveButton()
              .should('be.visible')
              .and('have.text', 'Save');
          validatePermissionGrid();
        });
    });

    it([Tag.GTS, 'ENG-2069'], 'Edit role page', () => {
      openRolesPage()
        .then(page => page.getContent().getKebabMenu(ROLE_CODE_ADMIN).open().openEdit())
        .then(page => {
          cy.validateUrlPathname(`/role/edit/${ROLE_CODE_ADMIN}`);
          page.getContent().getTitle()
              .should('be.visible')
              .and('have.text', 'Edit');
          page.getContent().getBreadCrumb().should('be.visible');
          page.getContent().getBreadCrumb().children(htmlElements.li)
              .should('have.length', 3)
              .then(elements => cy.validateListTexts(elements, ['Users', 'Roles', 'Edit']));
          page.getContent().getNameInput()
              .should('be.visible')
              .and('have.value', ROLE_NAME_ADMIN);
          page.getContent().getCodeInput()
              .should('be.visible')
              .and('be.disabled')
              .and('have.value', ROLE_CODE_ADMIN);
          page.getContent().getCancelButton()
              .should('be.visible')
              .and('have.text', 'Cancel');
          page.getContent().getSaveButton()
              .should('be.visible')
              .and('have.text', 'Save');
          validatePermissionGrid();
        });
    });

    it([Tag.GTS, 'ENG-2069'], 'View role details page', () => {
      openRolesPage()
        .then(page => page.getContent().getKebabMenu(ROLE_CODE_ADMIN).open().openDetails())
        .then(page => {
          cy.validateUrlPathname(`/role/view/${ROLE_CODE_ADMIN}`);
          page.getContent().getTitle()
              .should('be.visible')
              .and('have.text', 'Details');
          page.getContent().getBreadCrumb().should('be.visible');
          page.getContent().getBreadCrumb().children(htmlElements.li)
              .should('have.length', 3)
              .then(elements => cy.validateListTexts(elements, ['Configuration', 'Roles', 'Details']));
          page.getContent().getDetailsDescription().children(htmlElements.dt)
              .should('have.length', 4)
              .then(elements => cy.validateListTexts(elements, ['Code', 'Name', 'Permissions', 'Referenced users']));
          page.getContent().getDetailsDescription().children(htmlElements.dd)
              .should('have.length', 4)
              .then(elements => cy.validateListTexts(elements, [ROLE_CODE_ADMIN, ROLE_NAME_ADMIN]));
        });
    });

  });

  describe('Actions ', () => {

    beforeEach(() => {
      cy.wrap(null).as('roleToBeDeleted');
      cy.wrap({name: generateRandomId(), code: generateRandomId()}).as('sampleRole');
    });

    afterEach(() => {
      cy.get('@roleToBeDeleted').then(code => {
        if (code) cy.rolesController().then(controller => controller.deleteRole(code));
      });
    });

    it([Tag.GTS, 'ENG-2069'], 'Add a new role', () => {
      cy.get('@sampleRole').then(sampleRole => {
        openRolesPage()
          .then(page => page.getContent().openAddRolePage())
          .then(page => page.getContent().addRole(sampleRole.name, sampleRole.code))
          .then(page => {
            cy.wrap(sampleRole.code).as('roleToBeDeleted');
            page.getContent().getTableRow(sampleRole.code).children(htmlElements.td)
                .then(cells => cy.validateListTexts(cells, [sampleRole.name, sampleRole.code]));
          });
      });
    });

    it([Tag.GTS, 'ENG-2069'], 'Update an existing role', () => {
      cy.get('@sampleRole').then(sampleRole => {
        addRole(sampleRole.code, sampleRole.name);

        cy.wrap(generateRandomId()).then(editedRoleName => {
          openRolesPage()
            .then(page => page.getContent().getKebabMenu(sampleRole.code).open().openEdit())
            .then(page => {
              page.getContent().getNameInput().should('have.value', sampleRole.name);
              page.getContent().editRole(editedRoleName);
            })
            .then(page => {
              page.getContent().getTableRow(sampleRole.code).children(htmlElements.td)
                  .then(cells => cy.validateListTexts(cells, [editedRoleName, sampleRole.code]));
              page.getContent().getKebabMenu(sampleRole.code).open().openDetails();
            })
            .then(page => {
              page.getContent().getCodeValue().should('contain', sampleRole.code);
              page.getContent().getNameValue().should('contain', editedRoleName);
            });
        });
      });
    });

    it([Tag.GTS, 'ENG-2069','ENG-4070'], 'Delete an unreferenced role', () => {
      cy.get('@sampleRole').then(sampleRole => {
        addRole(sampleRole.code, sampleRole.name);

        openRolesPage()
          .then(page => {
            page.getContent().getKebabMenu(sampleRole.code).open().clickDelete();
            page.getDialog().getBody().getStateInfo().should('contain', sampleRole.code);
            page.getDialog().confirm();
            cy.wait(1000);
            page.getContent().getTableRows().should('not.contain', sampleRole.code);
            cy.wrap(null).as('roleToBeDeleted');
          });
      });
    });

    it([Tag.GTS, 'ENG-2069'], 'Deletion of an assigned role is forbidden', () => {
      openRolesPage()
        .then(page => {
          page.getContent().getTableRows().should('contain', ROLE_CODE_ADMIN);
          page.getContent().getKebabMenu(ROLE_CODE_ADMIN).open().clickDelete();
          page.getDialog().getConfirmButton().should('not.exist');
        });
    });

  });

  const openRolesPage = () => cy.get('@currentPage').then(page => page.getMenu().getUsers().open().openRoles());

  const validatePermissionGrid = () => {
    return cy.get('@currentPage')
             .then(page => {
              page.getContent().getPermissionsGrid().should('not.have.class', 'spinner');
              page.getContent().getPermissionsGrid().children(htmlElements.div)
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
              cy.wrap(page).as('currentPage');
             });
  };

  const addRole = (code, name) => {
    cy.rolesController().then(controller => controller.addRole({code: code, name: name}))
      .then(response => cy.wrap(response.body.payload.code).as('roleToBeDeleted'));
  };

});
