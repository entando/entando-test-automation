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
    });



 /*

    it('Add a new fragment using an existing code - not allowed', () => {
      cy.fragmentsController()
        .then(controller => controller.addFragment(fragment))
        .then(() => cy.wrap(fragment).as('fragmentToBeDeleted'));

      currentPage = openFragmentsPage();

      currentPage = currentPage.getContent().openAddFragmentPage();
      cy.validateUrlPathname('/fragment/add');
      currentPage.getContent().typeCode(fragment.code);
      currentPage.getContent().typeGuiCode(fragment.guiCode);
      currentPage.getContent().save();

      cy.validateToast(currentPage, fragment.code, false);
    });

    it('Add a new fragment with an invalid code - not allowed', () => {
      currentPage = openFragmentsPage();

      currentPage = currentPage.getContent().openAddFragmentPage();
      cy.validateUrlPathname('/fragment/add');
      currentPage.getContent().typeCode(`${fragment.code}!@#$%^&*`);
      currentPage.getContent().typeGuiCode(fragment.guiCode);
      currentPage.getContent().clickSaveBtn();

      currentPage.getContent().getSaveOption().closest('li').invoke('attr', 'class').should('contain', 'disabled');
    });

    it('Add a new fragment without filling in GUI code - not allowed', () => {
      currentPage = openFragmentsPage();

      currentPage = currentPage.getContent().openAddFragmentPage();
      cy.validateUrlPathname('/fragment/add');
      currentPage.getContent().typeCode(fragment.code);
      currentPage.getContent().clickSaveBtn();

      currentPage.getContent().getSaveOption().closest('li').invoke('attr', 'class').should('contain', 'disabled');
    });

    it('Edit fragment', () => {
      cy.fragmentsController()
        .then(controller => controller.addFragment(fragment))
        .then(() => cy.wrap(fragment).as('fragmentToBeDeleted'));

      currentPage = openFragmentsPage();

      currentPage = currentPage.getContent().getKebabMenu(fragment.code).open().openEdit();
      cy.validateUrlPathname(`/fragment/edit/${fragment.code}`);
      currentPage.getContent().getCodeInput().should('be.disabled');
      currentPage.getContent().typeGuiCode('_updated');

      currentPage = currentPage.getContent().save();

      cy.validateToast(currentPage);
    });

    it('Delete fragment', () => {
      cy.fragmentsController()
        .then(controller => controller.addFragment(fragment))
        .then(() => cy.wrap(fragment).as('fragmentToBeDeleted'));

      currentPage = openFragmentsPage();

      currentPage.getContent().getKebabMenu(fragment.code).open().clickDelete();
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage);

      cy.wrap(null).as('fragmentToBeDeleted');
    });

    const fragment = {
      guiCode: 'test'
    };

  });

  describe(['ENG-2680'], 'Fragments Browsing', () => {

    it('Pagination check when there are no results', () => {
      currentPage = openFragmentsPage();
      currentPage.getContent().getSearchCodeInput().type('z');
      currentPage.getContent().getSearchSubmitButton().click();
      currentPage.getContent().getSpinner().should('exist');
      currentPage.getContent().getPagination()
                 .getItemsCurrent().invoke('text').should('be.equal', '0-0');
      currentPage.getContent().getPagination()
                 .getItemsTotal().invoke('text').should('be.equal', '0');
    });

  });*/

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
