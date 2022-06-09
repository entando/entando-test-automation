describe('Page visibility in Portal UI', () => {

    const TEST_GROUPS = ['administrators', 'free', 'group1', 'group2'];

    const checkPermission = (permission = true) => {
        cy.kcUILogin('login/user')
        cy.fixture('data/demoPage.json').then(demoPage => {
            cy.visit(`/${demoPage.code}.page`, {portalUI: true});
            if (permission) cy.validateUrlPathname(`/${demoPage.code}.page`, {portalUI: true});
            else cy.validateUrlPathname('/login.page', {portalUI: true});
        });
    }

    before(() => {
        cy.kcAPILogin();
        TEST_GROUPS.filter(group => (group != 'administrators' && group != 'free')).forEach(group =>
            cy.groupsController().then(controller => controller.addGroup(group, group)));
        cy.fixture(`users/details/user`).then(user =>
            cy.usersController().then(controller => {
                controller.addUser(user);
                controller.updateUser(user);
            })
        );
    });

    after(() => {
        cy.kcAPILogin();
        cy.fixture(`users/details/user`).then(user =>
            cy.usersController().then(controller => controller.deleteUser(user.username)));
        TEST_GROUPS.filter(group => (group != 'administrators' && group != 'free')).forEach(group => 
            cy.groupsController().then(controller => controller.deleteGroup(group)));
    });

    TEST_GROUPS.forEach(groupPermission => {

        describe(`User with ${groupPermission} group permission`, () => {

            before(() => {
                cy.kcAPILogin();
                cy.fixture(`users/details/user`).then(user =>
                    cy.usersController().then(controller =>
                        controller.addAuthorities(user.username, groupPermission, 'admin')));
            });

            after(() => {
                cy.kcAPILogin();
                cy.fixture(`users/details/user`).then(user =>
                    cy.usersController().then(controller =>
                        controller.deleteAuthorities(user.username)));
            });

            TEST_GROUPS.forEach(ownerGroup => {

                describe(`Page with ${ownerGroup} owner group`, () => {

                    before(() => {
                        cy.kcAPILogin();
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

                    afterEach(() => cy.kcUILogout());

                    if (ownerGroup === groupPermission) {
                        it([Tag.SMOKE, 'ENG-3798'], `A user with "${groupPermission}" permission SHOULD be able to view a page with "${ownerGroup}" owner group and no join group`, () => {
                            checkPermission();
                        });
                    } else {
                        const permission = (ownerGroup === 'free' || groupPermission === 'administrators');
                        const visibility = permission ? ' ' : ' NOT '
                        
                        it([Tag.SANITY, 'ENG-3798'], `A user with "${groupPermission}" permission SHOULD${visibility}be able to view a page with "${ownerGroup}" owner group and no join group`, () => {
                            checkPermission(permission);
                        });
                    }

                    TEST_GROUPS.filter(group => (group != ownerGroup)).forEach(joinGroup => {
                        if (ownerGroup === groupPermission || joinGroup === groupPermission || (joinGroup === 'free' && (ownerGroup === 'group1' || ownerGroup === 'group2'))) {
                            it([Tag.FEATURE, 'ENG-3798'], `A user with "${groupPermission}" permission SHOULD be able to view a page with "${ownerGroup}" owner group and "${joinGroup}" join group`, () => {
                                cy.fixture('data/demoPage.json').then(demoPage => {
                                    cy.kcAPILogin();
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

});
