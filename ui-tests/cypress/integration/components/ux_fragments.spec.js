import {generateRandomId, generateRandomTypeCode} from '../../support/utils';
import {htmlElements}                             from '../../support/pageObjects/WebElement';

describe('UX Fragments', () => {

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
    cy.wrap(null).as('fragmentToBeDeleted');
    fragment.code = `A${generateRandomId()}`;
  });

  afterEach(() => {
    cy.kcUILogout();
    cy.get('@fragmentToBeDeleted').then(fragmentToBeDeleted => {
      if (fragmentToBeDeleted !== null) {
        cy.fragmentsController().then(controller => controller.deleteFragment(fragmentToBeDeleted.code));
      }
    });
  });

  describe('Fragments pages visualization', () => {

    it([Tag.SMOKE, 'ENG-3522'], 'Ux FragmentsPage is displayed', () => {
      openFragmentsPage()
          .then(page => {
            page.getContent().getTable()
                .should('exist').and('be.visible');
            page.getContent().getTableHeaders().should('have.length', 4)
                .then(elements => cy.validateListTexts(elements, ['Code', 'Widget type', 'Plugin', 'Actions']));

            page.getContent().getPagination().get()
                .should('exist').and('be.visible');
            page.getContent().getPagination().getInput()
                .should('have.value', 1);

            page.getContent().getSearchForm()
                .should('exist').and('be.visible');
            page.getContent().getAddButton()
                .should('exist').and('be.visible');
          });
    });
    it([Tag.SMOKE, 'ENG-3522'], 'AddPage is displayed', () => {
      openFragmentsPage()
          .then(page =>
              page.getContent().openAddFragmentPage());
      cy.validateUrlPathname('/fragment/add');

      cy.get('@currentPage')
        .then(page => {
          page.getContent().getCodeInput().should('exist').and('be.visible');
          page.getContent().getGuiCodeInput().should('exist').and('be.visible');

          page.getContent().getGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Gui code');
          page.getContent().getDefaultGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Default gui code');

          page.getContent().getCancelBtn().should('exist').and('be.visible');
          page.getContent().getSaveBtn().should('exist').and('be.visible');
        });
    });
    it([Tag.SMOKE, 'ENG-3522'], 'Dropdown is displayed', () => {
      addTestFragment();
      openFragmentsPage()
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
          });
    });
    it([Tag.SMOKE, 'ENG-3522'], 'EditPage is displayed', () => {
      addTestFragment();
      openFragmentsPage()
          .then(page =>
              page.getContent().getKebabMenu(fragment.code).open().openEdit());
      cy.validateUrlPathname(`/fragment/edit/${fragment.code}`);

      cy.get('@currentPage')
        .then(page => {
          page.getContent().getCodeInput().should('exist').and('be.visible');
          page.getContent().getGuiCodeInput().should('exist').and('be.visible');

          page.getContent().getGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Gui code');
          page.getContent().getDefaultGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Default gui code');

          page.getContent().getCancelBtn().should('exist').and('be.visible');
          page.getContent().getSaveBtn().should('exist').and('be.visible');
        });
    });
    it([Tag.SMOKE, 'ENG-3522'], 'ClonePage is displayed', () => {
      addTestFragment();
      openFragmentsPage()
          .then(page =>
              page.getContent().getKebabMenu(fragment.code).open().openClone());
      cy.validateUrlPathname(`/fragment/clone/${fragment.code}`);

      cy.get('@currentPage')
        .then(page => {
          page.getContent().getCodeInput().should('exist').and('be.visible');
          page.getContent().getGuiCodeInput().should('exist').and('be.visible');

          page.getContent().getGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Gui code');
          page.getContent().getDefaultGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Default gui code');

          page.getContent().getCancelBtn().should('exist').and('be.visible');
          page.getContent().getSaveBtn().should('exist').and('be.visible');
        });
    });
    it([Tag.SMOKE, 'ENG-3522'], 'DetailsPage is displayed', () => {
      addTestFragment();
      openFragmentsPage()
          .then(page =>
              page.getContent().getKebabMenu(fragment.code).open().openDetails());
      cy.validateUrlPathname(`/fragment/view/${fragment.code}`);

      cy.get('@currentPage')
        .then(page => {
          page.getContent().getFragmentTable().should('exist').and('be.visible');
          page.getContent().getEditBtn().should('exist').and('be.visible');
          page.getContent().getReferencedUxFragments().should('exist').and('be.visible').and('contain.text', 'Referenced UX fragments');
          page.getContent().getReferencedPageTemplates().should('exist').and('be.visible').and('contain.text', 'Referenced page templates');
          page.getContent().getReferencedWidgetTypes().should('exist').and('be.visible').and('contain.text', 'Referenced widget types');
        });
    });
  });
  describe('Sanity Tests', () => {
    describe('Actions', () => {
      it([Tag.SANITY, 'ENG-3522'], 'Searching a fragment', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page =>
                page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, fragment.code)))
            .then(page => page.getContent().clickSearchSubmitButton())
            .then(page =>
                page.getContent().getTableRows().should('have.length', 1)
                    .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', fragment.code)));
      });

      it([Tag.SANITY, 'ENG-3522'], 'Adding a fragment', () => {
        openFragmentsPage()
            .then(page =>
                page.getContent().openAddFragmentPage());

        cy.get('@currentPage')
          .then(page => {
            page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code));
            page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragment.guiCode));
          })
          .then(page => page.getContent().save())
          .then(page => {
            cy.validateToast(page);
            cy.wrap(fragment).as('fragmentToBeDeleted');

            page.getContent().getTableRows(fragment.code).should('be.visible')
                .children(htmlElements.td).then(cells =>
                cy.validateListTexts(cells, [fragment.code]));
          });
      });
      it([Tag.SANITY, 'ENG-3522'], 'Editing a fragment', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page =>
                page.getContent().getKebabMenu(fragment.code).open().openEdit())
            .then(page => page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragment.guiCode)))
            .then(page => page.getContent().save())
            .then(page => {
              cy.validateToast(page);
              page.getContent().getTableRow(fragment.code).should('be.visible')
                  .children(htmlElements.td).then(cells =>
                  cy.validateListTexts(cells, [fragment.code, false]));
            });
      });
      it([Tag.SANITY, 'ENG-3522'], 'Cloning', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page => {
              page.getContent().getKebabMenu(fragment.code).open().openClone();
              cy.wrap(fragment).as('fragmentToBeDeleted');
            });

        cy.get('@currentPage')
          .then(page => {
            page.getContent().getCodeInput().then(input => page.getContent().type(input, fragmentCloned.code));
            page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragmentCloned.guiCode));
          })
          .then(page => {
            page.getContent().save();
            cy.wrap(fragmentCloned).as('fragmentClonedToBeDeleted');
          });
        cy.get('@currentPage')
          .then(page => {
            cy.validateToast(page);
            page.getContent().getTableRow(fragmentCloned.code).should('be.visible')
                .children(htmlElements.td).then(cells =>
                cy.validateListTexts(cells, [fragmentCloned.code, false]));
          });
        cy.get('@fragmentClonedToBeDeleted').then(fragmentToBeDeleted => {
          cy.fragmentsController().then(controller => controller.deleteFragment(fragmentToBeDeleted.code));
        });
      });

      it([Tag.SANITY, 'ENG-3522'], 'Checking Delete Modal', () => {
        addTestFragment().then(fragment =>
            openFragmentsPage()
                .then(page => {
                  page.getContent().getKebabMenu(fragment.code).open().clickDelete();
                  page.getDialog().get().should('exist');
                  page.getDialog().getBody().getStateInfo()
                      .should('be.visible')
                      .should('contain', fragment.code);
                })
        );
      });

      it([Tag.SANITY, 'ENG-3522'], 'Deleting', () => {
        addTestFragment().then(fragment =>
            openFragmentsPage()
                .then(page => page.getContent().getKebabMenu(fragment.code).open().clickDelete())
                .then(page => page.getDialog().confirm())
                .then(page => {
                  cy.validateToast(page);
                  page.getContent().getTableRows().should('not.contain', fragment.code);
                  cy.wrap(null).as('fragmentToBeDeleted');
                })
        );
      });
      it([Tag.SANITY, 'ENG-3522'], 'Stopping delete', () => {
        addTestFragment().then(fragment =>
            openFragmentsPage()
                .then(page => page.getContent().getKebabMenu(fragment.code).open().clickDelete())
                .then(page => page.getDialog().cancel())
                .then(page => {
                  page.getDialog().get().should('not.exist');
                  page.getContent().getTableRow(fragment.code).should('be.visible')
                      .children(htmlElements.td).then(cells =>
                      cy.validateListTexts(cells, [fragment.code, false]));
                })
        );
      });

    });
    describe('Pagination', () => {
      it([Tag.SANITY, 'ENG-3522'], 'Fragments list with proper pagination', () => {
        openFragmentsPage()
            .then(page => {
              page.getContent().getTableRows().should('exist').and('be.visible');
              page.getContent().getPagination().getDropdownButton().should('have.text', '10 ');
              page.getContent().getTableRows().should('have.length', 10);
              page.getContent().getPagination().getInput().should('have.value', 1);
            });
      });
      it([Tag.SANITY, 'ENG-3522'], 'Next Page', () => {
        openFragmentsPage()
            .then(page =>
                page.getContent().navigateToNextPage())
            .then(page => page.getContent().getPagination().getInput().should('have.value', 2));
      });
      it([Tag.SANITY, 'ENG-3522'], 'Previous Page', () => {//TODO when input page field is fixed, than generalize with a navigateRandomPage

        openFragmentsPage()
            .then(page => page.getContent().navigateToLastPage())
            .then(page => page.getContent().navigateToPreviousPage())
            .then(page => page.getContent().getPagination().getInput().should('have.value', 6));
        cy.get('@currentPage')
          .then(page => page.getContent().navigateToPreviousPage())
          .then(page => page.getContent().getPagination().getInput().should('have.value', 5));
        cy.get('@currentPage')
          .then(page => page.getContent().navigateToPreviousPage())
          .then(page => page.getContent().getPagination().getInput().should('have.value', 4));
        cy.get('@currentPage')
          .then(page => page.getContent().navigateToPreviousPage())
          .then(page => page.getContent().getPagination().getInput().should('have.value', 3));
        cy.get('@currentPage')
          .then(page => page.getContent().navigateToPreviousPage())
          .then(page => page.getContent().getPagination().getInput().should('have.value', 2));
        cy.get('@currentPage')
          .then(page => page.getContent().navigateToPreviousPage())
          .then(page => page.getContent().getPagination().getInput().should('have.value', 1));
      });
      it([Tag.SANITY, 'ENG-3522'], 'First Page', () => {//TODO when input page field is fixed, than generalize with a navigateRandomPage
        openFragmentsPage()
            .then(page => page.getContent().navigateToLastPage())
            .then(page => page.getContent().getPagination().getInput().should('have.value', 7));
        cy.get('@currentPage')
          .then(page => page.getContent().navigateToFirstPage())
          .then(page => page.getContent().getPagination().getInput().should('have.value', 1));
      });
      it([Tag.SANITY, 'ENG-3522'], 'Last Page', () => {//TODO when input page field is fixed, than generalize with a navigateRandomPage
        openFragmentsPage()

            .then(page => page.getContent().navigateToLastPage())
            .then(page => page.getContent().getPagination().getInput().should('have.value', 7));
      });

      //TOFIX there's a bug in input page field: it's impossible to change the value.
      it([Tag.SANITY, 'ENG-3522'], 'Page field', () => {
        const randomPage = Math.floor(Math.random() * 12) + 2;
        openFragmentsPage()
            .then(page => {
              page.getContent().getPagination().getInput().then(input => page.getContent().type(input, randomPage));
              page.getContent().getPagination().getInput().should('have.value', randomPage);
            });
      });
    });
  });
  describe('Feature Tests I', () => {
    describe ('Fragments Browsing', () => {

      it([Tag.FEATURE, 'ENG-3522'], 'Search a fragment from his fragment code', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page =>
                page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, fragment.code.substring(3, 7))))
            .then(page => page.getContent().clickSearchSubmitButton())
            .then(page =>
                page.getContent().getTableRows().should('have.length', 1)
                    .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', fragment.code.substring(3, 7))));
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '1-1');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '1');
          });
      });

      it([Tag.FEATURE, 'ENG-3522'], 'Bug: Widget type does not filter', () => {
        openFragmentsPage()
            .then(page => {
              page.getContent().getWidgetFilter().select('Content');
              page.getContent().clickSearchSubmitButton();
            })
            .then(page =>
                page.getContent().getTableRows().should('have.length', 1)
                    .each(row => cy.get(row).children(htmlElements.td).eq(2).should('have.text', 'Content')));
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '1-1');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '1');
          });
      });

      //TODO remove x when bug is fixed
      xit([Tag.FEATURE, 'ENG-3522'], 'Search for a fragment through the widget filter', () => {
        openFragmentsPage()
            .then(page => {
              cy.fixture('data/widgetTypes.json').then(widgetTypes => {
                const randomValue = getRandomOption(widgetTypes);
                page.getContent().getWidgetFilter().select(randomValue);
                page.getContent().clickSearchSubmitButton();
                cy.get('@currentPage')
                  .then(page =>
                      page.getContent().getTableRows()
                          .each(row => cy.get(row).children(htmlElements.td).eq(2).should('have.text', randomValue)));
              });
            });

      });
      it([Tag.FEATURE, 'ENG-3522'], 'Search for a fragment through the plugin filter', () => {
        openFragmentsPage()
            .then(page => {
              cy.fixture('data/plugins.json').then(plugins => {
                const randomValue = getRandomOption(plugins);
                page.getContent().getPluginFilter().select(randomValue);
                page.getContent().clickSearchSubmitButton();
                cy.get('@currentPage')
                  .then(page =>
                      page.getContent().getTableRows()
                          .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', randomValue)));
              });
            });
      });

      it([Tag.FEATURE, 'ENG-3522'], 'Search with fragment code and widget filter', () => {
        openFragmentsPage()
            .then(page =>
                page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, 'l')))
            .then(page => {
              page.getContent().getWidgetFilter().select('Content');
              page.getContent().clickSearchSubmitButton();
            })
            .then(page => {
              page.getContent().getTableRows().should('have.length', 2)
                  .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', 'l'))
                  .each(row => cy.get(row).children(htmlElements.td).eq(2).should('contain', 'Content'));
            });
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '1-2');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '2');
          });
      });
      it([Tag.FEATURE, 'ENG-3522'], 'Search with fragment code and plugin filter', () => {
        openFragmentsPage()
            .then(page =>
                page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, 'l')))
            .then(page => {
              page.getContent().getPluginFilter().select('jacms');
              page.getContent().clickSearchSubmitButton();
            })
            .then(page => {
              page.getContent().getTableRows().should('have.length', 10)
                  .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', 'l'))
                  .each(row => cy.get(row).children(htmlElements.td).eq(4).should('contain', 'jacms'));
            });
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '1-10');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '15');
          });
      });
      it([Tag.FEATURE, 'ENG-3522'], 'Search with widget and plugin filter', () => {
        openFragmentsPage()
            .then(page => {
              page.getContent().getWidgetFilter().select('Content');
              page.getContent().getPluginFilter().select('jacms');
              page.getContent().clickSearchSubmitButton();
            })
            .then(page =>
                page.getContent().getTableRows().should('have.length', 3)
                    .each(row => cy.get(row).children(htmlElements.td).eq(2).should('contain', 'Content'))
                    .each(row => cy.get(row).children(htmlElements.td).eq(4).should('contain', 'jacms')));
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '1-3');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '3');
          });
      });
      it([Tag.FEATURE, 'ENG-3522'], 'Search with fragment code and filters', () => {
        openFragmentsPage()
            .then(page =>
                page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, 'row')))
            .then(page => {
              page.getContent().getWidgetFilter().select('Content List');
              page.getContent().getPluginFilter().select('jacms');
              page.getContent().clickSearchSubmitButton();
            })
            .then(page =>
                page.getContent().getTableRows().should('have.length', 1)
                    .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', 'row'))
                    .each(row => cy.get(row).children(htmlElements.td).eq(2).should('contain', 'Content List'))
                    .each(row => cy.get(row).children(htmlElements.td).eq(4).should('contain', 'jacms')));
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '1-1');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '1');
          });
      });
      it([Tag.FEATURE, 'ENG-3522'], 'No Results from a non-existing fragment', () => {
        openFragmentsPage()
            .then(page =>
                page.getContent().getSearchCodeInput().then(input => page.getContent().type(input, fragment.code.substring(3, 7))))
            .then(page => page.getContent().clickSearchSubmitButton())
            .then(page =>
                page.getContent().getTableRows().should('have.length', 0));
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '0-0');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '0');
          });
      });

      //BUG: after search doesn't show current number of fragments
      it([Tag.FEATURE, 'ENG-3522'], 'No Results two filter', () => {
        openFragmentsPage()
            .then(page => {
              page.getContent().getWidgetFilter().select('Sitemap');
              page.getContent().getPluginFilter().select('jpseo');
              page.getContent().clickSearchSubmitButton();
            })
            .then(page =>
                page.getContent().getTableRows().should('have.length', 0));
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getPagination().getItemsCurrent().invoke('text').should('be.equal', '0-0');
            page.getContent().getPagination().getItemsTotal().invoke('text').should('be.equal', '0');
          });
      });

    });
    describe('Breadcrumb checks', () => {
      it([Tag.FEATURE, 'ENG-3522'], 'Breadcrumb in add Page', () => {
        openFragmentsPage()
            .then(page => {
              page.getContent().getPagination().getItemsTotal().then(totalFragments => {
                page.getContent().openAddFragmentPage()
                    .then(page => page.getContent().openBreadCrumb())
                    .then(page => {
                      cy.validateUrlPathname('/fragment');
                      page.getContent().getPagination().getItemsTotal().should(newTotalFragments => {
                        expect(newTotalFragments.text()).eq(totalFragments.text());
                      });
                    });
              });
            });
      });
      it([Tag.FEATURE, 'ENG-3522'], 'Breadcrumb in Edit Page', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page => {
              page.getContent().getPagination().getItemsTotal().then(totalFragments => {
                page.getContent().getKebabMenu(fragment.code).open().openEdit()
                    .then(page => {
                      page.getContent().openBreadCrumb()
                          .then(page => {
                            cy.validateUrlPathname('/fragment');
                            page.getContent().getPagination().getItemsTotal().should(newTotalFragments => {
                              expect(newTotalFragments.text()).eq(totalFragments.text());
                            });
                          });
                    });
              });
            });
      });
      it([Tag.FEATURE, 'ENG-3522'], 'BreadCrumb in ClonePage', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page => {
              page.getContent().getPagination().getItemsTotal().then(totalFragments => {
                page.getContent().getKebabMenu(fragment.code).open().openClone()
                    .then(page => {
                      page.getContent().openBreadCrumb()
                          .then(page => {
                            cy.validateUrlPathname('/fragment');
                            page.getContent().getPagination().getItemsTotal().should(newTotalFragments => {
                              expect(newTotalFragments.text()).eq(totalFragments.text());
                            });
                          });
                    });
              });
            });
      });
    });
  });
  describe('Feature Test II', () => {
    describe('Pages Validations', () => {
      it([Tag.FEATURE, 'ENG-3522'], 'Edit page form', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page =>
                page.getContent().getKebabMenu(fragment.code).open().openEdit())
            .then(page => {
              page.getContent().getCodeInput().should('be.disabled').and('have.value', fragment.code);
              page.getContent().getGuiCodeInput().should('have.text', fragment.guiCode);
            });
      });
      //BUG: haven't text!
      it([Tag.FEATURE, 'ENG-3522'], 'Clone form have a text area with Html code filled', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page =>
                page.getContent().getKebabMenu(fragment.code).open().openClone())
            .then(page => {
              page.getContent().getGuiCodeInput().should('have.text', fragment.guiCode);
            });
      });
      it([Tag.FEATURE, 'ENG-3522'], 'Navigate from detailsPage to EditPage', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page =>
                page.getContent().getKebabMenu(fragment.code).open().openDetails())
            .then(page => page.getContent().openEditBtn())
            .then(page => {
              page.getContent().getCodeInput().should('be.disabled').and('have.value', fragment.code);
              page.getContent().getGuiCodeInput().should('have.text', fragment.guiCode);

              page.getContent().getGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Gui code');
              page.getContent().getDefaultGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Default gui code');

              page.getContent().getCancelBtn().should('exist').and('be.visible');
              page.getContent().getSaveBtn().should('exist').and('be.visible');
            });
      });
    });
    describe('Save and Continue option', () => {
      it([Tag.FEATURE, 'ENG-3522'], 'Add a fragment with Save and Continue option', () => {
        openFragmentsPage()
            .then(page =>
                page.getContent().openAddFragmentPage());

        cy.get('@currentPage')
          .then(page => {
            page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code));
            page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragment.guiCode));
            page.getContent().saveAndContinue();
            cy.validateToast(page);
            cy.wrap(fragment).as('fragmentToBeDeleted');
            page.getMenu().getComponents().open().openUXFragments();
          });
        cy.get('@currentPage')
          .then(page =>
              page.getContent().getTableRows(fragment.code).should('be.visible')
                  .children(htmlElements.td).then(cells =>
                  cy.validateListTexts(cells, [fragment.code]))
          );
      });
      it([Tag.FEATURE, 'ENG-3522'], 'Edit a fragment with Save and Continue option', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page =>
                page.getContent().getKebabMenu(fragment.code).open().openEdit())
            .then(page => page.getContent().getGuiCodeInput()
                              .then(input => page.getContent().type(input, fragment.guiCode)))
            .then(page => {
              page.getContent().saveAndContinue();
              cy.validateToast(page);
              page.getMenu().getComponents().open().openUXFragments();
            });
        cy.get('@currentPage')
          .then(page => {
            cy.validateToast(page);
            page.getContent().getTableRow(fragment.code).should('be.visible')
                .children(htmlElements.td).then(cells =>
                cy.validateListTexts(cells, [fragment.code]));
          });
      });
      it([Tag.FEATURE, 'ENG-3522'], 'Clone a fragment with Save and Continue option', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page => {
              page.getContent().getKebabMenu(fragment.code).open().openClone();
              cy.wrap(fragment).as('fragmentToBeDeleted');
            });
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getCodeInput().then(input => page.getContent().type(input, fragmentCloned.code));
            page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragmentCloned.guiCode));
          })
          .then(page => {
            page.getContent().saveAndContinue();
            cy.validateToast(page);
            cy.wrap(fragmentCloned).as('fragmentClonedToBeDeleted');
            page.getMenu().getComponents().open().openUXFragments();
          });
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getTableRow(fragmentCloned.code).should('be.visible')
                .children(htmlElements.td).then(cells =>
                cy.validateListTexts(cells, [fragmentCloned.code]));
          });
        cy.get('@fragmentClonedToBeDeleted').then(fragmentToBeDeleted => {
          cy.fragmentsController().then(controller => controller.deleteFragment(fragmentToBeDeleted.code));
        });
      });
    });
  });
  describe('Error Validation Tests', () => {

    it([Tag.ERROR, 'ENG-3522'], 'Error is displayed when a code input is selected but not filled in AddPage', () => {
      openFragmentsPage()
          .then(page => page.getContent().openAddFragmentPage())
          .then(page => {
            page.getContent().getCodeInput().then(input => {
              page.getContent().focus(input);
              page.getContent().blur(input);
              page.getContent().getInputError(input)
                  .should('exist').and('be.visible')
                  .and('have.text', 'Field required');
            });
          });
    });
    it([Tag.ERROR, 'ENG-3522'], 'When Add a fragment without all the required values, save button is disabled', () => {
      openFragmentsPage()
          .then(page =>
              page.getContent().openAddFragmentPage());

      cy.get('@currentPage')
        .then(page => {
          page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code));
          page.getContent().clickSaveBtn();
          page.getContent().getSaveOption().parent().should('have.class', 'disabled');
        });
    });
    it([Tag.ERROR, 'ENG-3522'], 'Add a fragment with an existing code is forbidden', () => {
      addTestFragment();
      openFragmentsPage()
          .then(page =>
              page.getContent().openAddFragmentPage());
      cy.get('@currentPage')
        .then(page =>
            page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code)))
        .then(page => page.getContent().save())
        .then(page => cy.validateToast(page, fragment.code, false));
    });
    it([Tag.ERROR, 'ENG-3522'], 'Edit a fragment code is forbidden', () => {
      addTestFragment();
      openFragmentsPage()
          .then(page =>
              page.getContent().getKebabMenu(fragment.code).open().openEdit())
          .then(page => page.getContent().getCodeInput().should('be.disabled'));
    });
    it([Tag.ERROR, 'ENG-3522'], 'Edit a fragment with no Gui Code is forbidden', () => {
      addTestFragment();
      openFragmentsPage()
          .then(page =>
              page.getContent().getKebabMenu(fragment.code).open().openEdit())
          .then(page =>
              page.getContent().getGuiCodeInput()
                  .then(input => {
                    page.getContent().clear(input);
                  }))
          .then(page => {
            page.getContent().clickSaveBtn();
            page.getContent().getSaveOption().parent().should('have.class', 'disabled');
          });
    });
    it([Tag.ERROR, 'ENG-3522'], 'Error is displayed when a code input is selected but not filled in cloning a fragment', () => {
      addTestFragment();
      openFragmentsPage()
          .then(page =>
              page.getContent().getKebabMenu(fragment.code).open().openClone());

      cy.get('@currentPage')
        .then(page => {
          page.getContent().getCodeInput().then(input => {
            page.getContent().focus(input);
            page.getContent().blur(input);
            page.getContent().getInputError(input)
                .should('exist').and('be.visible')
                .and('have.text', 'Field required');
          });
        });
    });
    it([Tag.ERROR, 'ENG-3522'], 'Clone a fragment with no Gui Code is forbidden', () => {
      addTestFragment();
      openFragmentsPage()
          .then(page =>
              page.getContent().getKebabMenu(fragment.code).open().openClone());

      cy.get('@currentPage')
        .then(page => {
          page.getContent().getCodeInput().then(input => page.getContent().type(input, fragmentCloned.code));
        })
        .then(page => {
          page.getContent().clickSaveBtn();
          page.getContent().getSaveOption().parent().should('have.class', 'disabled');
        });
    });
    it([Tag.ERROR, 'ENG-3522'], 'Clone a fragment with an existing code is forbidden', () => {
      addTestFragment();
      openFragmentsPage()
          .then(page =>
              page.getContent().getKebabMenu(fragment.code).open().openClone());

      cy.get('@currentPage')
        .then(page => {
          page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code));
          page.getContent().getGuiCodeInput().then(input => page.getContent().type(input, fragmentCloned.guiCode));
        })
        .then(page => page.getContent().save())
        .then(page => cy.validateToast(page, fragment.code, false));
    });
  });

  function getRandomOption(value) {
    const keys = Object.values(value);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  const openFragmentsPage = () => {
    return cy.get('@currentPage')
             .then(page => page.getMenu().getComponents().open().openUXFragments());
  };
  const fragment          = {
    guiCode: 'test'
  };
  const fragmentCloned    = {
    code: generateRandomId(),
    guiCode: generateRandomTypeCode()
  };
  const addTestFragment   = () =>
      cy.fragmentsController()
        .then(controller => controller.addFragment(fragment))
        .then(() => cy.wrap(fragment).as('fragmentToBeDeleted'));
});
