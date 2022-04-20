import {generateRandomId, generateRandomTypeCode} from '../../support/utils';
import {htmlElements} from "../../support/pageObjects/WebElement";

describe('UX Fragments', () => {

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => cy.kcUILogout());

  describe([Tag.GTS], 'Fragments pages visualization', () => {

    beforeEach(() => {
      fragment.code = `${generateRandomId()}`;
      cy.wrap(null).as('fragmentToBeDeleted');
    });

    afterEach(() => {
      cy.get('@fragmentToBeDeleted').then(fragmentToBeDeleted => {
        if (fragmentToBeDeleted !== null) {
          cy.fragmentsController().then(controller => controller.deleteFragment(fragmentToBeDeleted.code));
        }
      });
    });

    it([Tag.SMOKE, 'ENG-3522'],'Ux FragmentsPage is displayed', () => {
      openFragmentsPage()
          .then(page => {
            page.getContent().getTable()
                .should('exist').and('be.visible');
            page.getContent().getTableHeaders().should('have.length', 4)
                .then(elements => cy.validateListTexts(elements, ['Code', 'Widget type', 'Plugin', 'Actions']));

            page.getContent().getPagination()
                .should('exist').and('be.visible');
            page.getContent().getPaginationSelector()
                .should('have.value', 1);

            page.getContent().getSearchForm()
                .should('exist').and('be.visible');
            page.getContent().getAddButton()
                .should('exist').and('be.visible');
          })

    });
    it([Tag.SMOKE, 'ENG-3522'],'AddPage is displayed', () => {
      openFragmentsPage()
          .then(page =>
            page.getContent().openAddFragmentPage());
      cy.validateUrlPathname('/fragment/add');

      cy.get('@currentPage')
          .then(page => {
            page.getContent().getCodeInput().should('exist').and('be.visible');
            page.getContent().getGuiCodeInput().should('exist').and('be.visible');

            page.getContent().getGuiCodeSelector().should('exist').and('be.visible').and('have.text','Gui code');
            page.getContent().getDefaultGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Default gui code');

            page.getContent().getCancelBtn().should('exist').and('be.visible');
            page.getContent().getSaveBtn().should('exist').and('be.visible');
          })
    });
    it([Tag.SMOKE, 'ENG-3522'],'Dropdown is displayed', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page=>{
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
        })

    });
    it([Tag.SMOKE, 'ENG-3522'],'EditPage is displayed', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page =>
                page.getContent().getKebabMenu(fragment.code).open().openEdit());
        cy.validateUrlPathname(`/fragment/edit/${fragment.code}`);

        cy.get('@currentPage')
            .then(page => {
                page.getContent().getCodeInput().should('exist').and('be.visible');
                page.getContent().getGuiCodeInput().should('exist').and('be.visible');

                page.getContent().getGuiCodeSelector().should('exist').and('be.visible').and('have.text','Gui code');
                page.getContent().getDefaultGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Default gui code');

                page.getContent().getCancelBtn().should('exist').and('be.visible');
                page.getContent().getSaveBtn().should('exist').and('be.visible');
            })
    });
    it([Tag.SMOKE, 'ENG-3522'],'ClonePage is displayed', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page =>
                page.getContent().getKebabMenu(fragment.code).open().openClone());
        cy.validateUrlPathname(`/fragment/clone/${fragment.code}`);

        cy.get('@currentPage')
            .then(page => {
                page.getContent().getCodeInput().should('exist').and('be.visible');
                page.getContent().getGuiCodeInput().should('exist').and('be.visible');

                page.getContent().getGuiCodeSelector().should('exist').and('be.visible').and('have.text','Gui code');
                page.getContent().getDefaultGuiCodeSelector().should('exist').and('be.visible').and('have.text', 'Default gui code');

                page.getContent().getCancelBtn().should('exist').and('be.visible');
                page.getContent().getSaveBtn().should('exist').and('be.visible');
            })
    });
    it([Tag.SMOKE, 'ENG-3522'],'DetailsPage is displayed', () => {
        addTestFragment();
        openFragmentsPage()
            .then(page =>
                page.getContent().getKebabMenu(fragment.code).open().openDetails());
        cy.validateUrlPathname(`/fragment/view/${fragment.code}`);

        cy.get('@currentPage')
            .then(page=> {
                page.getContent().getFragmentTable().should('exist').and('be.visible');
                page.getContent().getEditBtn().should('exist').and('be.visible');
                page.getContent().getReferencedUxFragments().should('exist').and('be.visible').and('contain.text', 'Referenced UX fragments');
                page.getContent().getReferencedPageTemplates().should('exist').and('be.visible').and('contain.text', 'Referenced page templates');
                page.getContent().getReferencedWidgetTypes().should('exist').and('be.visible').and('contain.text', 'Referenced widget types');
            })
    });

  });
  describe([Tag.GTS], 'Sanity Tests', () => {

        beforeEach(() => {
            fragment.code = `${generateRandomId()}`;
            cy.wrap(null).as('fragmentToBeDeleted');
        });

        afterEach(() => {
            cy.get('@fragmentToBeDeleted').then(fragmentToBeDeleted => {
                if (fragmentToBeDeleted !== null) {
                    cy.fragmentsController().then(controller => controller.deleteFragment(fragmentToBeDeleted.code));
                }
            });
        });

        describe([Tag.GTS], 'Actions', () => {
            it([Tag.SANITY, 'ENG-3522'],'Searching a fragment', () => {
                addTestFragment();
                openFragmentsPage()
                    .then(page=>
                        page.getContent().getSearchCodeInput().then(input=> page.getContent().type(input, fragment.code)))
                    .then(page => page.getContent().clickSearchSubmitButton())
                    .then(page =>
                        page.getContent().getTableRows().should('have.length', 1)
                            .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', fragment.code)));
            });

            it([Tag.SANITY, 'ENG-3522'],'Adding a fragment', () => {
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
            it([Tag.SANITY, 'ENG-3522'],'Editing a fragment', () => {
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
            it([Tag.SANITY, 'ENG-3522'],'Cloning', () => {
                addTestFragment();
                openFragmentsPage()
                    .then(page =>
                        page.getContent().getKebabMenu(fragment.code).open().openClone());

                cy.get('@currentPage')
                    .then(page => {
                        page.getContent().getCodeInput().then(input => page.getContent().type(input, fragmentCloned.code));
                        page.getContent().getGuiCodeInput().then(input => page.getContent().type(input,fragmentCloned.guiCode));
                    })
                    .then(page => page.getContent().save())
                    .then(page => {
                        cy.validateToast(page);
                        cy.wrap(fragment).as('fragmentToBeDeleted');

                        page.getContent().getTableRow(fragmentCloned.code).should('be.visible')
                            .children(htmlElements.td).then(cells =>
                            cy.validateListTexts(cells, [fragmentCloned.code, false]));
                    });
            });

            it([Tag.SANITY, 'ENG-3522'],'Checking Delete Modal', () => {
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

            it([Tag.SANITY, 'ENG-3522'],'Deleting', () => {
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
            it([Tag.SANITY, 'ENG-3522'],'Stopping delete', () => {
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
        describe([Tag.GTS], 'Pagination', () => {
            it([Tag.SANITY, 'ENG-3522'],'Fragments list with proper pagination', () => {
                openFragmentsPage()
                    .then(page => {
                        page.getContent().getTableRows().should('exist').and('be.visible');
                        page.getContent().getPaginationRowDropdown().should('have.text', '10 ');
                        page.getContent().getTableRows().should('have.length', 10);
                        page.getContent().getPaginationSelector().should('have.value', 1);
                    });
            });
            it([Tag.SANITY, 'ENG-3522'],'Next Page', () => {
                openFragmentsPage()
                    .then(page =>
                        page.getContent().navigateToNextPage())
                    .then(page => page.getContent().getPaginationSelector().should('have.value', 2));
            });
            it([Tag.SANITY, 'ENG-3522'],'Previous Page', () => {//TODO when input page field is fixed, than generalize with a navigateRandomPage

                openFragmentsPage()
                    .then(page => page.getContent().navigateToLastPage())
                    .then(page => page.getContent().navigateToPreviousPage())
                    .then(page => page.getContent().getPaginationSelector().should('have.value', 6))
                cy.get('@currentPage')
                    .then(page => page.getContent().navigateToPreviousPage())
                    .then(page => page.getContent().getPaginationSelector().should('have.value', 5))
                cy.get('@currentPage')
                    .then(page => page.getContent().navigateToPreviousPage())
                    .then(page => page.getContent().getPaginationSelector().should('have.value', 4))
                cy.get('@currentPage')
                    .then(page => page.getContent().navigateToPreviousPage())
                    .then(page => page.getContent().getPaginationSelector().should('have.value', 3))
                cy.get('@currentPage')
                    .then(page => page.getContent().navigateToPreviousPage())
                    .then(page => page.getContent().getPaginationSelector().should('have.value', 2))
                cy.get('@currentPage')
                    .then(page => page.getContent().navigateToPreviousPage())
                    .then(page => page.getContent().getPaginationSelector().should('have.value', 1))

            });
            it([Tag.SANITY, 'ENG-3522'],'First Page', () => {//TODO when input page field is fixed, than generalize with a navigateRandomPage
                openFragmentsPage()
                    .then(page => page.getContent().navigateToLastPage())
                    .then(page => page.getContent().getPaginationSelector().should('have.value', 7))
                cy.get('@currentPage')
                    .then(page => page.getContent().navigateToFirstPage())
                    .then(page => page.getContent().getPaginationSelector().should('have.value', 1))
            });
            it([Tag.SANITY, 'ENG-3522'],'Last Page', () => {//TODO when input page field is fixed, than generalize with a navigateRandomPage
                openFragmentsPage()

                    .then(page => page.getContent().navigateToLastPage())
                    .then(page => page.getContent().getPaginationSelector().should('have.value', 7));
            });

            //TOFIX there's a bug in input page field: it's impossible to change the value.
            it([Tag.SANITY, 'ENG-3522'],'Page field', () => {
                const randomPage = Math.floor(Math.random() * 12) + 2;
                openFragmentsPage()
                    .then(page => {
                        page.getContent().getPaginationSelector().then(input => page.getContent().type(input, randomPage));
                        page.getContent().getPaginationSelector().should('have.value', randomPage);
                    })
            });
        });
    });

  describe([Tag.GTS], 'Error Validation Tests', () => {
      beforeEach(() => {
          fragment.code = `${generateRandomId()}`;
          cy.wrap(null).as('fragmentToBeDeleted');
      });

      afterEach(() => {
          cy.get('@fragmentToBeDeleted').then(fragmentToBeDeleted => {
              if (fragmentToBeDeleted !== null) {
                  cy.fragmentsController().then(controller => controller.deleteFragment(fragmentToBeDeleted.code));
              }
          });
      });
        it([Tag.ERROR, 'ENG-3522'],'Error is displayed when a code input is selected but not filled in fragment AddPage', () => {
            openFragmentsPage()
                .then(page => page.getContent().openAddFragmentPage())
                .then(page => {
                    page.getContent().getCodeInput().then(input => {
                        page.getContent().focus(input);
                        page.getContent().blur(input);
                        page.getContent().getInputError(input)
                            .should('exist').and('be.visible')
                            .and('have.text', 'Field required');
                        })
                });
        });
        it([Tag.ERROR, 'ENG-3522'],'When Add a fragment without all the required values, save button is disabled', () => {
            openFragmentsPage()
                .then(page =>
                    page.getContent().openAddFragmentPage());

            cy.get('@currentPage')
                .then(page => {
                    page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code));
                    page.getContent().clickSaveBtn();
                    page.getContent().getSaveOption().parent().should('have.class', 'disabled');
                })

        });
        it([Tag.ERROR, 'ENG-3522'],'Add a fragment with an existing code is forbidden', () => {
            addTestFragment()
            openFragmentsPage()
                .then(page =>
                    page.getContent().openAddFragmentPage());
            cy.get('@currentPage')
                .then(page =>
                    page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code)))
                .then(page => page.getContent().save())
                .then(page => cy.validateToast(page, fragment.code, false))
        });
        it([Tag.ERROR, 'ENG-3522'],'Edit a fragment code is forbidden', () => {
            addTestFragment();
            openFragmentsPage()
                .then(page =>
                    page.getContent().getKebabMenu(fragment.code).open().openEdit())
                .then(page => page.getContent().getCodeInput().should('be.disabled'))
        });
        it([Tag.ERROR, 'ENG-3522'],'Edit a fragment with no Gui Code is forbidden', () => {
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
                })
        });
        it([Tag.ERROR, 'ENG-3522'],'Error is displayed when a code input is selected but not filled in cloning a fragment', () => {
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
                    })
                });
        });
        it([Tag.ERROR, 'ENG-3522'],'Clone a fragment with no Gui Code is forbidden', () => {
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
                })
        });
        it([Tag.ERROR, 'ENG-3522'],'Clone a fragment with an existing code is forbidden', () => {
            addTestFragment();
            openFragmentsPage()
                .then(page =>
                    page.getContent().getKebabMenu(fragment.code).open().openClone());

            cy.get('@currentPage')
                .then(page => {
                    page.getContent().getCodeInput().then(input => page.getContent().type(input, fragment.code));
                    page.getContent().getGuiCodeInput().then(input => page.getContent().type(input,fragmentCloned.guiCode));
                })
                .then(page => page.getContent().save())
                .then(page => cy.validateToast(page, fragment.code, false))
        });
  });


  const openFragmentsPage = () => {
      return cy.get('@currentPage')
          .then(page => page.getMenu().getComponents().open().openUXFragments());
  };
  const fragment = {
    guiCode: 'test'
  };
    const fragmentCloned= {
        code: generateRandomId(),
        guiCode: generateRandomTypeCode()
    };
  const addTestFragment = () =>
      cy.fragmentsController()
          .then(controller => controller.addFragment(fragment))
          .then(() => cy.wrap(fragment).as('fragmentToBeDeleted'));

});
