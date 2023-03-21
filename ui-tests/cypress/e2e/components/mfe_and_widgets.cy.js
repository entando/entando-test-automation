import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';
import HomePage       from '../../support/pageObjects/HomePage';

describe('Microfrontends and Widgets', () => {

  describe('Main functionalities', () => {

    before(() => {
      cy.kcClientCredentialsLogin();
      cy.fixture('data/demoPage.json').then(page => {
        page.code = generateRandomId();
        cy.seoPagesController()
          .then(controller => controller.addNewPage(page))
          .then(() => cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published')));
        cy.wrap(page).as('pageToBeDeleted');
      });
    });

    beforeEach(() => {
      cy.wrap([]).as('widgetsToBeRemovedFromPage');
      cy.wrap(null).as('widgetToBeDeleted');
      cy.kcClientCredentialsLogin();
      cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
    });

    afterEach(function () {
      cy.wrap(this.pageToBeDeleted).then(page =>
          cy.get('@widgetsToBeRemovedFromPage')
            .then(widgets => {
              widgets.forEach(widget => cy.pageWidgetsController(page.code).then(controller => controller.deleteWidget(widget)));
              cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));
            })
            .then(() => cy.get('@widgetToBeDeleted').then(widget => {
              if (widget) {
                cy.widgetsController().then(controller => controller.deleteWidget(widget.code));
              }
            })));
      cy.kcTokenLogout();
    });

    after(function () {
      cy.kcClientCredentialsLogin();
      cy.wrap(this.pageToBeDeleted).then(page =>
          cy.pagesController()
            .then(controller => controller.setPageStatus(page.code, 'draft')
                                          .then(() => controller.deletePage(page.code))));
    });

    describe('Create New Widget', () => {

      beforeEach(() =>
          cy.get('@currentPage')
            .then(page => page.getMenu().getComponents().open().openMFEAndWidgets())
            .then(page => page.getContent().openAddWidgetForm()));

      it([Tag.GTS, 'ENG-2515'], 'Adding a basic widget with icon', () => {
        cy.wrap(generateRandomId()).then(widgetID =>
            cy.get('@currentPage')
              .then(page => {
                page.getContent().fillWidgetForm(generateRandomId(), widgetID);
                page.getContent().submitForm();
              })
              .then(page => {
                page.getContent().getListArea().should('contain', widgetID);
                cy.wrap({code: widgetID}).as('widgetToBeDeleted');
              }));
      });

      it([Tag.GTS, 'ENG-2515', 'ENG-4074'], 'Add a widget with existing code widget', () => {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().fillWidgetForm(generateRandomId(), 'content_viewer');
            page.getContent().clickSave();
          })
          .then(page => cy.validateToast(page, 'content_viewer', false));
      });

      it([Tag.GTS, 'ENG-2244'], 'Add a widget with invalid code', () => {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getCodeInput().then(input => {
              page.getContent().type(input, '@');
              page.getContent().blur(input);
            });
            page.getContent().getCodeInput().closest('div.form-group').invoke('attr', 'class').should('contain', 'has-error');
            page.getContent().getCodeInput().parent().next().invoke('attr', 'class').should('contain', 'help-block');
          });
      });

      it([Tag.GTS, 'ENG-2515'], 'Add a widget without choosing group and title', () => {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().editFormFields({code: 'momaco', iconUpload, customUi: '<h2>memecode</h2>'});
            page.getContent().getSaveDropdownButton().click();
            page.getContent().getRegularSaveButton().closest(htmlElements.li).invoke('attr', 'class').should('contain', 'disabled');
          });
      });

      it([Tag.FEATURE, 'ENG-4708', 'ENG-4694'], 'When creating a widget with a configUI, the property should be saved and retained', () => {
        cy.widgetsController().then(controller => controller.intercept({method: 'POST'}, 'widgetPOST', ''));
        cy.fixture('data/testConfigUi.json').then(configUi => {
          cy.wrap(generateRandomId()).then(widgetID => {
            cy.get('@currentPage')
              .then(page => {
                page.getContent().fillWidgetForm(generateRandomId(), widgetID, '<h1>Just a basic widget</h1>', 'Administrators', JSON.stringify(configUi));
                page.getContent().submitForm();
              })
              .then(page => {
                cy.wait('@widgetPOST').then(res => {
                  cy.wrap(res.response.body.payload.configUi).should('not.eq', null);
                  cy.wrap(res.response.body.payload.configUi.customElement).should('eq', configUi.customElement);
                  cy.wrap(res.response.body.payload.configUi.resources[0]).should('eq', configUi.resources[0]);
                });
                page.getContent().getListArea().should('contain', widgetID);
                cy.wrap({code: widgetID}).as('widgetToBeDeleted');
                cy.widgetsController().then(controller => controller.getWidget(widgetID)).then(response => {
                  cy.wrap(response.body.payload.configUi).should('not.eq', null);
                  cy.wrap(response.body.payload.configUi.customElement).should('eq', configUi.customElement);
                  cy.wrap(response.body.payload.configUi.resources[0]).should('eq', configUi.resources[0]);
                });
                cy.closeAllToasts(page);
                page.getContent().openEditFromKebabMenu(widgetID);
              })
              .then(page => {
                page.getContent().clickConfigTabConfigUi();
                page.getContent().getConfigUiValue().should(value => expect(value.replaceAll('\n', '').replaceAll(' ', '')).to.equal(JSON.stringify(configUi).replaceAll(' ', '')));
              });
          });
        });
      });

    });

    describe('Edit widget', () => {

      beforeEach(() => {
        cy.fixture('data/basicWidget.json').then(widget => {
          widget.code = generateRandomId();
          cy.widgetsController().then(controller => controller.addWidget(widget));
          cy.wrap(widget).as('widgetToBeDeleted');
        });
        cy.get('@currentPage')
          .then(page => page.getMenu().getComponents().open().openMFEAndWidgets());
      });

      it([Tag.GTS, 'ENG-2517'], 'Editing widget by modifying all mandatory fields', () => {
        cy.wrap(generateRandomId()).then(editedName =>
            cy.get('@widgetToBeDeleted').then(widget =>
                cy.get('@currentPage')
                  .then(page => page.getContent().openEditFromKebabMenu(widget.code))
                  .then(page => {
                    page.getContent().getTitleInput().should('have.value', widget.titles.en);
                    page.getContent().editFormFields({
                      name: editedName,
                      group: 'Free Access',
                      iconChoose
                    });
                    page.getContent().submitContinueForm(widget.code);
                  })
                  .then(page => page.getMenu().getComponents().open().openMFEAndWidgets())
                  .then(page => page.getContent().getListArea().should('contain', editedName))));
      });

      it([Tag.GTS, 'ENG-2517'], 'Editing a used widget via widget list modifying all mandatory fields', () => {
        cy.wrap(generateRandomId()).then(editedName =>
            cy.get('@widgetToBeDeleted').then(widget =>
                cy.get('@currentPage')
                  .then(page => page.getContent().openEditFromKebabMenu(widget.code))
                  .then(page => {
                    page.getContent().getTitleInput().should('have.value', widget.titles.en);
                    page.getContent().editFormFields({
                      iconUpload,
                      name: editedName,
                      group: 'Administrators'
                    });
                    page.getContent().submitForm();
                  })
                  .then(page => page.getContent().getListArea().should('contain', editedName))));
      });

    });

    describe('Editing via different section', () => {

      it([Tag.GTS, 'ENG-2517'], 'Editing a used widget via page designer modifying all mandatory fields', function () {
        cy.wrap(generateRandomId()).then(editedName =>
            cy.wrap(this.pageToBeDeleted).then(demoPage => {
              cy.fixture('data/basicWidget.json').then(widget => {
                widget.code = generateRandomId();
                cy.widgetsController().then(controller => controller.addWidget(widget));
                cy.wrap(widget).as('widgetToBeDeleted');
                cy.pageWidgetsController(demoPage.code)
                  .then(controller => controller.addWidget(FRAMENUM, widget.code))
                  .then(() => cy.pushAlias('@widgetsToBeRemovedFromPage', FRAMENUM));
                cy.get('@currentPage')
                  .then(page => page.getMenu().getPages().open().openDesigner())
                  .then(page => page.getContent().clickSidebarTab(1))
                  .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                  .then(page => page.getContent().clickSidebarTab(0))
                  .then(page => {
                    cy.get(`${htmlElements.div}#toolbar-tab-pane-0`).should('be.visible');
                    page.getContent().getDesignerGridFrameKebabMenu(2, 0, widget.code).open().openEdit();
                  })
                  .then(page => {
                    page.getContent().getTitleInput().should('have.value', widget.titles.en);
                    page.getContent().editFormFields({
                      name: editedName,
                      group: 'Free Access',
                      iconChoose
                    });
                    page.getContent().submitForm();
                  })
                  .then(page => page.getContent().getListArea().should('contain', editedName));
              });
            }));
      });

    });

    describe('Delete widget with reference', () => {

      beforeEach(() =>
          cy.fixture('data/basicWidget.json').then(widget => {
            widget.code = generateRandomId();
            cy.widgetsController().then(controller => controller.addWidget(widget));
            cy.wrap(widget).as('widgetToBeDeleted');
          }));

      it([Tag.GTS, 'ENG-2516'], 'Attempt to delete the widget with reference to a published page', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@widgetToBeDeleted').then(widget => {
              cy.pageWidgetsController(demoPage.code)
                .then(controller => controller.addWidget(FRAMENUM, widget.code))
                .then(() => cy.pushAlias('@widgetsToBeRemovedFromPage', FRAMENUM));
              cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
              cy.get('@currentPage')
                .then(page => page.getMenu().getComponents().open().openMFEAndWidgets())
                .then(page => {
                  page.getContent().clickDeleteFromKebabMenu(widget.code);
                  page.getDialog().getConfirmButton().click();
                  cy.validateToast(page, widget.code, false);
                });
            }));
      });

      it([Tag.GTS, 'ENG-2516'], 'Attempt to delete the widget with reference to an unpublished page', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@widgetToBeDeleted').then(widget => {
              cy.pageWidgetsController(demoPage.code)
                .then(controller => controller.addWidget(FRAMENUM, widget.code))
                .then(() => cy.pushAlias('@widgetsToBeRemovedFromPage', FRAMENUM));
              cy.get('@currentPage')
                .then(page => page.getMenu().getComponents().open().openMFEAndWidgets())
                .then(page => {
                  page.getContent().clickDeleteFromKebabMenu(widget.code);
                  page.getDialog().getConfirmButton().click();
                  cy.validateToast(page, widget.code, false);
                });
            }));
      });

      it([Tag.GTS, 'ENG-2516'], 'Delete a user widget', () => {
        cy.get('@widgetToBeDeleted').then(widget => {
          cy.get('@currentPage')
            .then(page => page.getMenu().getComponents().open().openMFEAndWidgets())
            .then(page => {
              page.getContent().clickDeleteFromKebabMenu(widget.code);
              page.getDialog().getConfirmButton().click();
              page.getContent().getListArea().should('not.contain', widget.code);
              cy.wrap(null).as('widgetToBeDeleted');
            });
        });
      });

    });

    const FRAMENUM   = 5;
    const iconChoose = 'fa-android';
    const iconUpload = 'cypress/fixtures/icon/Entando.svg';

  });

  describe('Role access', () => {

    beforeEach(() => {
      cy.kcClientCredentialsLogin();
      cy.wrap({}).then(role => {
        role.code        = generateRandomId();
        role.name        = generateRandomId();
        role.permissions = {
          managePages: true,
          enterBackend: true,
          superuser: false
        };
        cy.rolesController()
          .then(controller => controller.addRole(role))
          .then(() => cy.wrap(role).as('roleToBeDeleted'));
        cy.fixture('users/details/user').then(user => {
          cy.usersController().then(controller => {
            controller.addUser(user);
            controller.updateUser(user);
            controller.addAuthorities(user.username, 'administrators', role.code);
          });
          cy.kcAuthorizationCodeLogin('login/user');
          cy.userPreferencesController().then(controller => {
            // FIXME the userPreferences are not immediately available after user creation, but are immediately created on GET
            controller.getUserPreferences(user.username);
            controller.updateUserPreferences(user.username, {wizard: false});
          });
        });
      });
      cy.visit('/').then(() => HomePage.openPage());
      cy.wrap(new HomePage()).as('currentPage');
    });

    afterEach(() => {
      cy.fixture('users/details/user').then(user => {
        //FIXME deleted user, when re-created, retain user preferences
        cy.userPreferencesController().then(controller => controller.resetUserPreferences(user.username));
        cy.usersController().then(controller => {
          controller.deleteAuthorities(user.username);
          controller.deleteUser(user.username);
        });
      });
      cy.get('@roleToBeDeleted').then(roleToBeDeleted => cy.rolesController().then(controller => controller.deleteRole(roleToBeDeleted.code)));
      cy.kcTokenLogout();
    });

    it([Tag.GTS, 'ENG-2543'], 'Widgets page should not be accessible without superuser role', () => {
      cy.get('@currentPage')
        .then(page => {
          page.getMenu().get().should('not.contain', 'Components');
          cy.visit('/widget');
          cy.root().should('contain', '403');
        });
    });

  });

});
