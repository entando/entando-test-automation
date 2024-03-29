describe('Page visibility in AppBuilder', () => {

  const TEST_GROUPS = ['administrators', 'free', 'group1', 'group2'];

  const checkPermission = (permission = true, readOnly = false) => {
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/user');
    cy.fixture('data/demoPage.json').then(demoPage => {
      cy.get('@currentPage')
        .then(page => page.getMenu().getPages().open().openManagement())
        .then(page => {
          if (!permission && !readOnly) page.getContent().getTableRow(demoPage.titles.en).should('not.exist');
          else {
            page.getContent().getTableRow(demoPage.titles.en).should('exist');
            cy.wrap(page.getContent().getKebabMenu(demoPage.titles.en).open()).then(kebabMenu => {
              if (permission) kebabMenu.openEdit(demoPage.code);
              else kebabMenu.getEdit().should('have.class', 'disabled');
            });
          }
        })
        .then(() => permission ? cy.validateUrlPathname(`/page/edit/${demoPage.code}`) : cy.validateUrlPathname('/page'));
    });
  };

  before(() => {
    cy.kcClientCredentialsLogin();
    TEST_GROUPS.filter(group => (group !== 'administrators' && group !== 'free')).forEach(group =>
      cy.groupsController().then(controller => controller.addGroup(group, group)));
    cy.fixture('users/details/user').then(user => {
      cy.usersController().then(controller => {
        controller.addUser(user);
        controller.updateUser(user);
      });
      cy.kcAuthorizationCodeLogin('login/user');
      cy.userPreferencesController().then(controller => {
        // FIXME the userPreferences are not immediately available after user creation, but are immediately created on GET
        controller.getUserPreferences(user.username);
        controller.updateUserPreferences(user.username, { wizard: false });
      });
      cy.kcTokenLogout();
    });
  });

  after(() => {
    cy.kcAuthorizationCodeLogin('login/user');
    //FIXME deleted user, when re-created, retain user preferences
    cy.fixture('users/details/user').then(user =>
      cy.userPreferencesController().then(controller => controller.resetUserPreferences(user.username)));
    cy.kcTokenLogout();
    cy.kcClientCredentialsLogin();
    cy.fixture('users/details/user')
      .then(user => cy.usersController().then(controller => controller.deleteUser(user.username)));
    TEST_GROUPS.filter(group => (group !== 'administrators' && group !== 'free')).forEach(group =>
      cy.groupsController().then(controller => controller.deleteGroup(group)));
  });

  TEST_GROUPS.forEach(groupPermission => {

    describe(`User with ${groupPermission} group permission`, () => {

      before(() => {
        cy.kcClientCredentialsLogin();
        cy.fixture('users/details/user').then(user =>
          cy.usersController().then(controller =>
            controller.addAuthorities(user.username, groupPermission, 'admin')));
      });

      after(() => {
        cy.kcClientCredentialsLogin();
        cy.fixture('users/details/user').then(user =>
          cy.usersController().then(controller =>
            controller.deleteAuthorities(user.username)));
      });

      TEST_GROUPS.forEach(ownerGroup => {

        describe(`Page with ${ownerGroup} owner group`, () => {

          before(() => {
            cy.kcClientCredentialsLogin();
            cy.fixture('data/demoPage.json').then(demoPage => {
              demoPage.ownerGroup = ownerGroup;
              cy.seoPagesController().then(controller => controller.addNewPage(demoPage));
              cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
            });
          });

          after(() =>
            cy.fixture('data/demoPage.json').then(demoPage =>
              cy.pagesController().then(controller => {
                controller.setPageStatus(demoPage.code, 'draft');
                controller.deletePage(demoPage.code);
              })
            ));

          afterEach(() => cy.kcTokenLogout());

          if (ownerGroup === groupPermission) {
            it([Tag.SMOKE, 'ENG-3797'], `A user with "${groupPermission}" permission SHOULD be able to manage a page with "${ownerGroup}" owner group and no join group`, () => checkPermission());
          } else {
            const permission = (groupPermission === 'administrators');
            const manageability = permission ? ' ' : ' NOT ';

            it([Tag.SANITY, 'ENG-3797'], `A user with "${groupPermission}" permission SHOULD${manageability}be able to manage a page with "${ownerGroup}" owner group and no join group`, () => checkPermission(permission));
          }

          TEST_GROUPS.filter(group => (group !== ownerGroup)).forEach(joinGroup => {

            if (groupPermission === ownerGroup || groupPermission === joinGroup) {

              const permission = (ownerGroup === groupPermission || groupPermission === 'administrators');
              const readOnly = (groupPermission === joinGroup);
              const manageability = permission ? ' ' : ' NOT ';

              it([Tag.FEATURE, 'ENG-3797', 'ENG-3827'], `A user with "${groupPermission}" permission SHOULD${manageability}be able to manage a page with "${ownerGroup}" owner group and "${joinGroup}" join group`, () => {
                cy.fixture('data/demoPage.json').then(demoPage => {
                  cy.kcClientCredentialsLogin();
                  demoPage.ownerGroup = ownerGroup;
                  cy.seoPagesController().then(controller => controller.setPageJoinGroups(demoPage, [joinGroup]));
                  cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
                  checkPermission(permission, readOnly);
                });
              });

            }

          });

        });

      });

    });

  });

});
