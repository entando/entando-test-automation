describe('Page visibility in Portal UI', () => {

  const TEST_GROUPS = ['administrators', 'free', 'group1', 'group2'];

  const checkPermission = (permission = true) => {
    cy.kcAuthorizationCodeLogin('login/user');
    cy.fixture('data/demoPage.json').then(demoPage => {
      cy.visit(`/${demoPage.code}.page`, {portalUI: true});
      if (permission) cy.validateUrlPathname(`/${demoPage.code}.page`, {portalUI: true});
      else cy.validateUrlPathname('/login.page', {portalUI: true});
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
        controller.updateUserPreferences(user.username, {wizard: false});
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
            it([Tag.SMOKE, 'ENG-3798'], `A user with "${groupPermission}" permission SHOULD be able to view a page with "${ownerGroup}" owner group and no join group`, () => checkPermission());
          } else {
            const permission = (ownerGroup === 'free' || groupPermission === 'administrators');
            const visibility = permission ? ' ' : ' NOT ';

            it([Tag.SANITY, 'ENG-3798', 'ENG-3889'], `A user with "${groupPermission}" permission SHOULD${visibility}be able to view a page with "${ownerGroup}" owner group and no join group`, () => checkPermission(permission));
          }

          TEST_GROUPS.filter(group => (group !== ownerGroup)).forEach(joinGroup => {
            if (ownerGroup === groupPermission || joinGroup === groupPermission || (joinGroup === 'free' && (ownerGroup === 'group1' || ownerGroup === 'group2'))) {
              it([Tag.FEATURE, 'ENG-3798'], `A user with "${groupPermission}" permission SHOULD be able to view a page with "${ownerGroup}" owner group and "${joinGroup}" join group`, () => {
                cy.fixture('data/demoPage.json').then(demoPage => {
                  cy.kcClientCredentialsLogin();
                  demoPage.ownerGroup = ownerGroup;
                  cy.seoPagesController().then(controller => controller.setPageJoinGroups(demoPage, [joinGroup]));
                  cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
                  checkPermission();
                });
              });
            }
          });

        });

      });

    });

    describe(`User without role with ${groupPermission} group permission`, () => {

      before(() => {
        cy.kcClientCredentialsLogin();
        cy.fixture('users/details/user').then(user =>
            cy.usersController().then(controller =>
                controller.addAuthorities(user.username, groupPermission, null)));
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
            it([Tag.SMOKE, 'ENG-3966'], `A user with "${groupPermission}" permission SHOULD be able to view a page with "${ownerGroup}" owner group and no join group`, () => checkPermission());
          } else {
            const permission = (ownerGroup === 'free' || groupPermission === 'administrators');
            const visibility = permission ? ' ' : ' NOT ';

            it([Tag.SANITY, 'ENG-3966'], `A user with "${groupPermission}" permission SHOULD${visibility}be able to view a page with "${ownerGroup}" owner group and no join group`, () => checkPermission(permission));
          }

          TEST_GROUPS.filter(group => (group !== ownerGroup)).forEach(joinGroup => {
            if (ownerGroup === groupPermission || joinGroup === groupPermission || (joinGroup === 'free' && (ownerGroup === 'group1' || ownerGroup === 'group2'))) {
              it([Tag.FEATURE, 'ENG-3966'], `A user with "${groupPermission}" permission SHOULD be able to view a page with "${ownerGroup}" owner group and "${joinGroup}" join group`, () => {
                cy.fixture('data/demoPage.json').then(demoPage => {
                  cy.kcClientCredentialsLogin();
                  demoPage.ownerGroup = ownerGroup;
                  cy.seoPagesController().then(controller => controller.setPageJoinGroups(demoPage, [joinGroup]));
                  cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
                  checkPermission();
                });
              });
            }
          });

        });

      });

    });

  });

  describe(`User without group permission`, () => {

    before(() => {
      cy.kcClientCredentialsLogin();
      cy.fixture('users/details/user').then(user =>
          cy.usersController().then(controller =>
              controller.addAuthorities(user.username, null, 'admin')));
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

        const permission = ownerGroup === 'free';
        const visibility = permission ? ' ' : ' NOT ';

        it([Tag.SANITY, 'ENG-3966'], `A user without group permission SHOULD${visibility}be able to view a page with "${ownerGroup}" owner group and no join group`, () => checkPermission(permission));

      });

    });

  });

});
