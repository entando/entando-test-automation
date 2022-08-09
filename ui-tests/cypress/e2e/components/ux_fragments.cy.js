import {loremIpsum}                              from 'lorem-ipsum';
import {generateRandomId, getArrayRandomElement} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

describe('UX Fragments', () => {

  beforeEach(() => {
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => cy.kcTokenLogout());

  describe('Page structure', () => {

    it([Tag.SMOKE, 'ENG-3522', 'ENG-3918'], 'UXFragments page is displayed', () => {
      openUXFragmentsPage()
          .then(page => {
            page.getContent().getTable().should('exist').and('be.visible');
            page.getContent().getTableHeaders().should('have.length', 4)
                .then(elements => cy.validateListTexts(elements, ['Code', 'Widget type', 'Plugin', 'Actions']));

            page.getContent().getPagination().get().should('exist').and('be.visible');
            page.getContent().getPagination().getInput().should('have.value', 1);

            page.getContent().getSearchForm().should('exist').and('be.visible');
            page.getContent().getAddButton().should('exist').and('be.visible');
          });
    });

    it([Tag.SMOKE, 'ENG-3522'], 'AddPage is displayed', () => {
      openAddFragmentPage()
          .then(page => {
            cy.validateUrlPathname('/fragment/add');
            fragmentPageStructureValidation(page);
          });
    });

    describe('Existing fragment', () => {

      before(() => {
        cy.kcClientCredentialsLogin();
        generateRandomFragment().then(fragment =>
            cy.fragmentsController()
              .then(controller => controller.addFragment(fragment))
              .then(response => Cypress.env('fragmentToBeDeleted', response.body.payload)));
      });

      after(() => {
        cy.kcClientCredentialsLogin();
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragmentToBeDeleted =>
            cy.fragmentsController().then(controller => controller.deleteFragment(fragmentToBeDeleted.code)));
      });

      it([Tag.SMOKE, 'ENG-3522'], 'Actions dropdown is displayed', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openUXFragmentsPage()
                .then(page => {
                  const kebabMenu = page.getContent().getKebabMenu(fragment.code).open();
                  kebabMenu.getDropdown().should('be.visible');
                  kebabMenu.getEdit()
                           .should('be.visible')
                           .should('have.text', `Edit ${fragment.code}`);
                  kebabMenu.getClone()
                           .should('be.visible')
                           .should('have.text', `Clone ${fragment.code}`);
                  kebabMenu.getDetails()
                           .should('be.visible')
                           .should('have.text', `Details for: ${fragment.code}`);
                  kebabMenu.getDelete()
                           .should('be.visible')
                           .should('have.text', 'Delete');
                }));
      });

      it([Tag.SMOKE, Tag.FEATURE, 'ENG-3522'], 'Edit page is displayed', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openEditFragmentPage(fragment.code)
                .then(page => {
                  if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('SMOKE')) {
                    cy.validateUrlPathname(`/fragment/edit/${fragment.code}`);
                    fragmentPageStructureValidation(page);
                  }
                  if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('FEATURE')) {
                    page.getContent().getCodeInput()
                        .should('be.disabled')
                        .and('have.value', fragment.code);
                    page.getContent().getGuiCodeInput().should('have.text', fragment.guiCode);
                  }
                }));
      });

      it([Tag.SMOKE, Tag.FEATURE, 'ENG-3522', 'ENG-3665'], 'Clone page is displayed', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openCloneFragmentPage(fragment.code)
                .then(page => {
                  if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('SMOKE')) {
                    cy.validateUrlPathname(`/fragment/clone/${fragment.code}`);
                    fragmentPageStructureValidation(page);
                  }
                  if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('FEATURE')) {
                    page.getContent().getGuiCodeInput().should('have.text', fragment.guiCode);
                  }
                }));
      });

      it([Tag.SMOKE, 'ENG-3522'], 'Details page is displayed', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openFragmentDetailsPage(fragment.code)
                .then(page => {
                  cy.validateUrlPathname(`/fragment/view/${fragment.code}`);
                  page.getContent().getFragmentTable()
                      .should('exist').and('be.visible');
                  page.getContent().getEditButton()
                      .should('exist').and('be.visible');
                  page.getContent().getReferencedUxFragments()
                      .should('exist').and('be.visible')
                      .and('contain.text', 'Referenced UX fragments');
                  page.getContent().getReferencedPageTemplates()
                      .should('exist').and('be.visible')
                      .and('contain.text', 'Referenced page templates');
                  page.getContent().getReferencedWidgetTypes()
                      .should('exist').and('be.visible')
                      .and('contain.text', 'Referenced widget types');
                }));
      });

      it([Tag.FEATURE, 'ENG-3522'], 'Navigate from detailsPage to EditPage', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openFragmentDetailsPage(fragment.code)
                .then(page => page.getContent().openEdit(fragment.code))
                .then(page => {
                  fragmentPageStructureValidation(page);
                  page.getContent().getCodeInput()
                      .should('be.disabled')
                      .and('have.value', fragment.code);
                  page.getContent().getGuiCodeInput().should('have.text', fragment.guiCode);
                }));
      });

    });

    const fragmentPageStructureValidation = (currentPage) => {
      cy.wrap(currentPage)
        .then(page => {
          page.getContent().getCodeInput().should('exist').and('be.visible');
          page.getContent().getGuiCodeInput().should('exist').and('be.visible');

          page.getContent().getGuiCodeSelector()
              .should('exist').and('be.visible')
              .and('have.text', 'Gui code');
          page.getContent().getDefaultGuiCodeSelector()
              .should('exist').and('be.visible')
              .and('have.text', 'Default gui code');

          page.getContent().getCancelButton().should('exist').and('be.visible');
          page.getContent().getSaveButton().should('exist').and('be.visible');
        });
    };

  });

  describe('Pagination', () => {

    it([Tag.SANITY, 'ENG-3522'], 'Fragments list with proper pagination', () => {
      openUXFragmentsPage()
          .then(page => {
            page.getContent().getTableRows().should('exist').and('be.visible');
            page.getContent().getPagination().getPageSizeDropdown().should('have.text', '10 ');
            page.getContent().getTableRows().should('have.length', 10);
            page.getContent().getPagination().getInput().should('have.value', 1);
          });
    });

    it([Tag.SANITY, 'ENG-3522'], 'Next Page', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getPagination().navigateToNextPage())
          .then(page => page.getContent().getPagination().getInput().should('have.value', 2));
    });

    //FIXME > TODO when input page field is fixed, than generalize with a navigateRandomPage
    it([Tag.SANITY, 'ENG-3522'], 'Previous Page', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getPagination().navigateToLastPage())
          .then(page => page.getContent().getPagination().navigateToPreviousPage())
          .then(page => page.getContent().getPagination().getInput().should('have.value', 6));
    });

    //FIXME > TODO when input page field is fixed, than generalize with a navigateRandomPage
    it([Tag.SANITY, 'ENG-3522'], 'First Page', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getPagination().navigateToLastPage())
          .then(page => page.getContent().getPagination().navigateToFirstPage())
          .then(page => page.getContent().getPagination().getInput().should('have.value', 1));
    });

    it([Tag.SANITY, 'ENG-3522'], 'Last Page', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getPagination().navigateToLastPage())
          .then(page => page.getContent().getPagination().getInput().should('have.value', 7));
    });

    it([Tag.SANITY, 'ENG-3522', 'ENG-3660'], 'Page field', () => {
      cy.wrap(Math.floor(Math.random() * 4) + 2).then(randomPage =>
          openUXFragmentsPage()
              .then(page => page.getContent().getPagination().navigateToPage(randomPage))
              .then(page => page.getContent().getPagination().getItemsCurrent().should('have.text', `${randomPage * 10 - 9}-${randomPage * 10}`)));
    });

  });

  describe('Fragments Browsing', () => {

    it([Tag.FEATURE, 'ENG-3522'], 'Search with fragment code', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, 'search_form')))
          .then(page => page.getContent().clickSearchSubmitButton())
          .then(page => {
            page.getContent().getTableRows().should('have.length', 1)
                .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', 'search_form'));
            page.getContent().getPagination().getItemsCurrent().should('have.text', '1-1');
            page.getContent().getPagination().getItemsTotal().should('have.text', '1');
          });
    });

    it([Tag.FEATURE, 'ENG-3522', 'ENG-3661'], 'Search with widget filter', () => {
      cy.fixture('data/uxFragments.json').then(fragments => Object.entries(fragments))
        .then(fragments => fragments.filter(fragment => fragment[1].widgetType !== ''))
          //FIXME this two widget types are not listed in search select
        .then(fragments => fragments.filter(fragment => fragment[1].widgetType !== 'userprofile_editCurrentUser_password' && fragment[1].widgetType !== 'userprofile_editCurrentUser_profile'))
        .then(fragments => {
          cy.fixture('data/uxFragmentsWidgetTypes.json')
            .then(widgetTypes => widgetTypes.find(widgetType => widgetType.code === getArrayRandomElement(fragments)[1].widgetType))
            .then(widgetType =>
                openUXFragmentsPage()
                    .then(page => page.getContent().getWidgetFilter().then(select => page.getContent().select(select, widgetType.name)))
                    .then(page => page.getContent().clickSearchSubmitButton())
                    .then(page => {
                      const selectedFragments = fragments.filter(fragment => fragment[1].widgetType === widgetType.code);
                      page.getContent().getTableRows().should('have.length', Math.min(selectedFragments.length, 10))
                          .each(row => cy.get(row).children(htmlElements.td).eq(2).should('have.text', widgetType.name));
                      page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', `1-${Math.min(selectedFragments.length, 10)}`);
                      page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', `${selectedFragments.length}`);
                    }));
        });
    });

    it([Tag.FEATURE, 'ENG-3522'], 'Search with plugin filter', () => {
      cy.fixture('data/uxFragments.json').then(fragments => Object.entries(fragments))
        .then(fragments => fragments.filter(fragment => fragment[1].plugin !== ''))
        .then(fragments => {
          cy.log(fragments);
          cy.fixture('data/uxFragmentsPlugins.json')
            .then(plugins => plugins.find(plugin => plugin.code === getArrayRandomElement(fragments)[1].plugin))
            .then(plugin =>
                openUXFragmentsPage()
                    .then(page => page.getContent().getPluginFilter().then(select => page.getContent().select(select, plugin.name)))
                    .then(page => page.getContent().clickSearchSubmitButton())
                    .then(page => {
                      const selectedFragments = fragments.filter(fragment => fragment[1].plugin === plugin.code);
                      page.getContent().getTableRows().should('have.length', Math.min(selectedFragments.length, 10))
                          .each(row => cy.get(row).children(htmlElements.td).eq(4).should('have.text', plugin.name));
                      page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', `1-${Math.min(selectedFragments.length, 10)}`);
                      page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', `${selectedFragments.length}`);
                    }));
        });
    });

    it([Tag.FEATURE, 'ENG-3522'], 'Search with fragment code and widget filter', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, 'search')))
          .then(page => page.getContent().getWidgetFilter().then(select => page.getContent().select(select, 'Search Form')))
          .then(page => page.getContent().clickSearchSubmitButton())
          .then(page => {
            page.getContent().getTableRows().should('have.length', 1)
                .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', 'search'))
                .each(row => cy.get(row).children(htmlElements.td).eq(2).should('have.text', 'Search Form'));
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '1-1');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '1');
          });
    });

    it([Tag.FEATURE, 'ENG-3522'], 'Search with fragment code and plugin filter', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, 'search')))
          .then(page => page.getContent().getPluginFilter().then(select => page.getContent().select(select, 'jacms')))
          .then(page => page.getContent().clickSearchSubmitButton())
          .then(page => {
            page.getContent().getTableRows().should('have.length', 2)
                .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', 'search'))
                .each(row => cy.get(row).children(htmlElements.td).eq(4).should('have.text', 'jacms'));
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '1-2');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '2');
          });
    });

    it([Tag.FEATURE, 'ENG-3522'], 'Search with widget and plugin filter', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getWidgetFilter().then(select => page.getContent().select(select, 'Search Form')))
          .then(page => page.getContent().getPluginFilter().then(select => page.getContent().select(select, 'jacms')))
          .then(page => page.getContent().clickSearchSubmitButton())
          .then(page => {
            page.getContent().getTableRows().should('have.length', 1)
                .each(row => cy.get(row).children(htmlElements.td).then(cells => {
                  cy.get(cells).eq(2).should('have.text', 'Search Form');
                  cy.get(cells).eq(4).should('have.text', 'jacms');
                }));
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '1-1');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '1');
          });
    });

    it([Tag.FEATURE, 'ENG-3522'], 'Search with fragment code and filters', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, 'search')))
          .then(page => page.getContent().getWidgetFilter().then(select => page.getContent().select(select, 'Search Form')))
          .then(page => page.getContent().getPluginFilter().then(select => page.getContent().select(select, 'jacms')))
          .then(page => page.getContent().clickSearchSubmitButton())
          .then(page => {
            page.getContent().getTableRows().should('have.length', 1)
                .then(row => cy.get(row).children(htmlElements.td).then(cells => {
                  cy.get(cells).eq(0).should('contain', 'search');
                  cy.get(cells).eq(2).should('contain', 'Search Form');
                  cy.get(cells).eq(4).should('contain', 'jacms');
                }));
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '1-1');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '1');
          });
    });

    it([Tag.FEATURE, 'ENG-3522', 'ENG-4076'], 'Search with non-existing fragment code', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, generateRandomId())))
          .then(page => page.getContent().clickSearchSubmitButton())
          .then(page => {
            page.getContent().getTableRows().should('have.length', 0);
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '0-0');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '0');
          });
    });

    it([Tag.FEATURE, 'ENG-3522', 'ENG-3662', 'ENG-4075'], 'Search with non-existing filters pair', () => {
      openUXFragmentsPage()
          .then(page => page.getContent().getWidgetFilter().then(select => page.getContent().select(select, 'Sitemap')))
          .then(page => page.getContent().getPluginFilter().then(select => page.getContent().select(select, 'jpseo')))
          .then(page => page.getContent().clickSearchSubmitButton())
          .then(page => {
            page.getContent().getTableRows().should('have.length', 0);
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '0-0');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '0');
          });
    });

  });

  describe('Breadcrumb checks', () => {

    it([Tag.FEATURE, 'ENG-3522'], 'Breadcrumb in add Page', () => {
      openAddFragmentPage()
          .then(page => page.getContent().goToFragmentsViaBreadCrumb())
          .then(() => cy.validateUrlPathname('/fragment'));
    });

    describe('Existing fragment', () => {

      before(() => {
        cy.kcClientCredentialsLogin();
        generateRandomFragment().then(fragment =>
            cy.fragmentsController()
              .then(controller => controller.addFragment(fragment))
              .then(response => Cypress.env('fragmentToBeDeleted', response.body.payload)));
      });

      after(() => {
        cy.kcClientCredentialsLogin();
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragmentToBeDeleted =>
            cy.fragmentsController().then(controller => controller.deleteFragment(fragmentToBeDeleted.code)));
      });

      it([Tag.FEATURE, 'ENG-3522'], 'Breadcrumb in edit Page', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openEditFragmentPage(fragment.code)
                .then(page => page.getContent().goToFragmentsViaBreadCrumb())
                .then(() => cy.validateUrlPathname('/fragment')));
      });

      it([Tag.FEATURE, 'ENG-3522'], 'BreadCrumb in clone page', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openCloneFragmentPage(fragment.code)
                .then(page => page.getContent().goToFragmentsViaBreadCrumb())
                .then(() => cy.validateUrlPathname('/fragment')));
      });

      it([Tag.FEATURE, 'ENG-3522', 'ENG-4077'], 'BreadCrumb in details page', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openFragmentDetailsPage(fragment.code)
                .then(page => page.getContent().goToFragmentsViaBreadCrumb())
                .then(() => cy.validateUrlPathname('/fragment')));
      });

    });

  });

  describe('Actions', () => {

    beforeEach(() => cy.wrap([]).as('fragmentsToBeDeleted'));

    afterEach(() => cy.get('@fragmentsToBeDeleted').then(fragmentsToBeDeleted =>
        fragmentsToBeDeleted.forEach(fragment => cy.fragmentsController().then(controller => controller.deleteFragment(fragment.code)))));

    it([Tag.SANITY, 'ENG-3522'], 'Adding a fragment', () => {
      generateRandomFragment().then(fragment =>
          openAddFragmentPage()
              .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code)))
              .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragment.guiCode)))
              .then(page => page.getContent().save())
              .then(page => {
                cy.unshiftAlias('@fragmentsToBeDeleted', fragment);
                cy.validateToast(page);
                page.getContent().getTableRow(fragment.code).should('be.visible')
                    .children(htmlElements.td).eq(0).should('have.text', fragment.code);
              }));
    });

    it([Tag.FEATURE, 'ENG-3522'], 'Adding a fragment with Save and Continue option', () => {
      generateRandomFragment().then(fragment =>
          openAddFragmentPage()
              .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code)))
              .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragment.guiCode)))
              .then(page => page.getContent().saveAndContinue())
              .then(page => {
                cy.unshiftAlias('@fragmentsToBeDeleted', fragment);
                cy.validateToast(page);
                cy.validateUrlPathname(`/fragment/edit/${fragment.code}`);
                page.getMenu().getComponents().open().openUXFragments();
              })
              .then(page => page.getContent().getTableRow(fragment.code).should('be.visible')
                                .children(htmlElements.td).eq(0).should('have.text', fragment.code)));
    });

    describe('Existing fragment', () => {

      beforeEach(() => generateRandomFragment().then(fragment =>
          cy.fragmentsController()
            .then(controller => controller.addFragment(fragment))
            .then(response => cy.unshiftAlias('@fragmentsToBeDeleted', response.body.payload))));

      it([Tag.SANITY, 'ENG-3522'], 'Searching a fragment', () => {
        cy.get('@fragmentsToBeDeleted').then(fragments => fragments[0]).then(fragment =>
            openUXFragmentsPage()
                .then(page => page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, fragment.code)))
                .then(page => page.getContent().clickSearchSubmitButton())
                .then(page =>
                    page.getContent().getTableRows().should('have.length', 1)
                        .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', fragment.code))));
      });

      it([Tag.SANITY, 'ENG-3522'], 'Editing a fragment', () => {
        cy.get('@fragmentsToBeDeleted').then(fragments => fragments[0]).then(fragment =>
            openEditFragmentPage(fragment.code)
                .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, loremIpsum())))
                .then(page => page.getContent().save())
                .then(page => {
                  cy.validateToast(page);
                  page.getContent().getTableRow(fragment.code).should('be.visible')
                      .children(htmlElements.td).eq(0).should('have.text', fragment.code);
                }));
      });

      it([Tag.FEATURE, 'ENG-3522'], 'Editing a fragment with Save and Continue option', () => {
        cy.get('@fragmentsToBeDeleted').then(fragments => fragments[0]).then(fragment =>
            openEditFragmentPage(fragment.code)
                .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, loremIpsum())))
                .then(page => page.getContent().saveAndContinue(fragment.code))
                .then(page => {
                  cy.validateToast(page);
                  cy.validateUrlPathname(`/fragment/edit/${fragment.code}`);
                  page.getMenu().getComponents().open().openUXFragments();
                })
                .then(page => page.getContent().getTableRow(fragment.code).should('be.visible')
                                  .children(htmlElements.td).eq(0).should('have.text', fragment.code)));
      });

      it([Tag.SANITY, 'ENG-3522'], 'Cloning a fragment', () => {
        generateRandomFragment().then(fragment =>
            cy.get('@fragmentsToBeDeleted').then(fragments => fragments[0]).then(originalFragment =>
                openCloneFragmentPage(originalFragment.code)
                    .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code)))
                    .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragment.guiCode)))
                    .then(page => page.getContent().save())
                    .then(page => {
                      cy.unshiftAlias('@fragmentsToBeDeleted', fragment);
                      cy.validateToast(page);
                      page.getContent().getTableRow(fragment.code).should('be.visible')
                          .children(htmlElements.td).eq(0).should('have.text', fragment.code);
                    })));
      });

      it([Tag.FEATURE, 'ENG-3522'], 'Cloning a fragment with Save and Continue option', () => {
        generateRandomFragment().then(fragment =>
            cy.get('@fragmentsToBeDeleted').then(fragments => fragments[0]).then(originalFragment =>
                openCloneFragmentPage(originalFragment.code)
                    .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code)))
                    .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragment.guiCode)))
                    .then(page => page.getContent().saveAndContinue())
                    .then(page => {
                      cy.unshiftAlias('@fragmentsToBeDeleted', fragment);
                      cy.validateToast(page);
                      cy.validateUrlPathname(`/fragment/edit/${fragment.code}`);
                      page.getMenu().getComponents().open().openUXFragments();
                    })
                    .then(page => page.getContent().getTableRow(fragment.code).should('be.visible')
                                      .children(htmlElements.td).eq(0).should('have.text', fragment.code))));
      });

      it([Tag.SANITY, 'ENG-3522'], 'Checking delete modal', () => {
        cy.get('@fragmentsToBeDeleted').then(fragments => fragments[0]).then(fragment =>
            openUXFragmentsPage()
                .then(page => page.getContent().getKebabMenu(fragment.code).open().clickDelete())
                .then(page => {
                  page.getDialog().get().should('exist');
                  page.getDialog().getBody().getStateInfo()
                      .should('be.visible')
                      .should('contain', fragment.code);
                }));
      });

      it([Tag.SANITY, 'ENG-3522'], 'Deleting a fragment', () => {
        cy.get('@fragmentsToBeDeleted').then(fragments => fragments[0]).then(fragment =>
            openUXFragmentsPage()
                .then(page => page.getContent().getKebabMenu(fragment.code).open().clickDelete())
                .then(page => page.getDialog().confirm())
                .then(page => {
                  cy.validateToast(page, fragment.code);
                  page.getContent().getTableRows().should('not.contain', fragment.code);
                  cy.deleteAlias('@fragmentsToBeDeleted', fragment);
                }));
      });

      it([Tag.SANITY, 'ENG-3522'], 'Cancel a fragment delete', () => {
        cy.get('@fragmentsToBeDeleted').then(fragments => fragments[0]).then(fragment =>
            openUXFragmentsPage()
                .then(page => page.getContent().getKebabMenu(fragment.code).open().clickDelete())
                .then(page => page.getDialog().cancel())
                .then(page => {
                  page.getDialog().get().should('not.exist');
                  page.getContent().getTableRow(fragment.code).should('be.visible')
                      .children(htmlElements.td).eq(0).should('have.text', fragment.code);
                }));
      });

    });

  });

  describe('Validations', () => {

    it([Tag.ERROR, 'ENG-3522', 'ENG-4078'], 'Error is displayed when a code input is selected but not filled in AddPage', () => {
      openAddFragmentPage()
          .then(page => page.getContent().getCodeInput().then(input => {
            page.getContent().focus(input);
            page.getContent().blur(input);
            page.getContent().getInputError(input)
                .should('exist').and('be.visible')
                .and('have.text', 'Field required');
          }));
    });

    it([Tag.ERROR, 'ENG-3522'], 'When Add a fragment without all the required values, save button is disabled', () => {
      generateRandomFragment().then(fragment =>
          openAddFragmentPage()
              .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code)))
              .then(page => page.getContent().openSaveMenu())
              .then(page => page.getContent().getSaveOption().parent().should('have.class', 'disabled')));
    });

    describe('Existing fragment', () => {

      before(() => {
        cy.kcClientCredentialsLogin();
        generateRandomFragment().then(fragment =>
            cy.fragmentsController()
              .then(controller => controller.addFragment(fragment))
              .then(response => Cypress.env('fragmentToBeDeleted', response.body.payload)));
      });

      after(() => {
        cy.kcClientCredentialsLogin();
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragmentToBeDeleted =>
            cy.fragmentsController().then(controller => controller.deleteFragment(fragmentToBeDeleted.code)));
      });

      it([Tag.ERROR, 'ENG-3522'], 'Add a fragment with an existing code is forbidden', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openAddFragmentPage()
                .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code)))
                .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, loremIpsum())))
                .then(page => page.getContent().clickSave())
                .then(page => cy.validateToast(page, fragment.code, false)));
      });

      it([Tag.ERROR, 'ENG-3522'], 'Edit a fragment code is forbidden', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openEditFragmentPage(fragment.code)
                .then(page => page.getContent().getCodeInput().should('be.disabled')));
      });

      it([Tag.ERROR, 'ENG-3522'], 'Edit a fragment with no Gui Code is forbidden', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openEditFragmentPage(fragment.code)
                .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().clear(input)))
                .then(page => page.getContent().openSaveMenu())
                .then(page => page.getContent().getSaveOption().parent().should('have.class', 'disabled')));
      });

      it([Tag.ERROR, 'ENG-3522'], 'Error is displayed when a code input is selected but not filled in cloning a fragment', () => {
        cy.wrap(Cypress.env('fragmentToBeDeleted')).then(fragment =>
            openCloneFragmentPage(fragment.code)
                .then(page => page.getContent().getCodeInput().then(input => {
                  page.getContent().focus(input);
                  page.getContent().blur(input);
                  page.getContent().getInputError(input)
                      .should('exist').and('be.visible')
                      .and('have.text', 'Field required');
                })));
      });

      it([Tag.ERROR, 'ENG-3522'], 'Clone a fragment with no Gui Code is forbidden', () => {
        generateRandomFragment().then(fragment =>
            cy.wrap(Cypress.env('fragmentToBeDeleted')).then(originalFragment =>
                openCloneFragmentPage(originalFragment.code)
                    .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code)))
                    .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().clear(input)))
                    .then(page => page.getContent().openSaveMenu())
                    .then(page => page.getContent().getSaveOption().parent().should('have.class', 'disabled'))));
      });

      it([Tag.ERROR, 'ENG-3522'], 'Clone a fragment with an existing code is forbidden', () => {
        generateRandomFragment().then(fragment =>
            cy.wrap(Cypress.env('fragmentToBeDeleted')).then(originalFragment =>
                openCloneFragmentPage(originalFragment.code)
                    .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, originalFragment.code)))
                    .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragment.guiCode)))
                    .then(page => page.getContent().clickSave())
                    .then(page => cy.validateToast(page, originalFragment.code, false))));
      });

    });

  });

  const openUXFragmentsPage = () => {
    return cy.get('@currentPage').then(page => page.getMenu().getComponents().open().openUXFragments());
  };

  const openAddFragmentPage = () => {
    return openUXFragmentsPage().then(page => page.getContent().openAddFragmentPage());
  };

  const openEditFragmentPage = (fragmentCode) => {
    return openUXFragmentsPage().then(page => page.getContent().getKebabMenu(fragmentCode).open().openEdit(fragmentCode));
  };

  const openCloneFragmentPage = (fragmentCode) => {
    return openUXFragmentsPage().then(page => page.getContent().getKebabMenu(fragmentCode).open().openClone(fragmentCode));
  };

  const openFragmentDetailsPage = (fragmentCode) => {
    return openUXFragmentsPage().then(page => page.getContent().getKebabMenu(fragmentCode).open().openDetails(fragmentCode));
  };

  const generateRandomFragment = () => {
    return cy.wrap({
      code: `AAA${generateRandomId()}`,
      guiCode: loremIpsum()
    });
  };

});
