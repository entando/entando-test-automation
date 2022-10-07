import {generateRandomId, generateRandomString} from '../../../support/utils.js';

import {htmlElements} from '../../../support/pageObjects/WebElement';

describe('Labels', () => {

  beforeEach(() => {
    cy.wrap(null).as('labelToBeDeleted');
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => {
    cy.get('@labelToBeDeleted').then(label => {
      if (label) {
        cy.labelsController().then(controller => controller.removeLabel(label.key));
      }
    });
    cy.kcTokenLogout();
  });

  describe('Labels pages visualisation', () => {

    it([Tag.SMOKE, 'ENG-3238', 'ENG-3918'], 'Labels section', () => {
      cy.fixture('data/languages.json').then(languages => {
        const defaultLanguage = languages.en;

        openLabelsPage()
            .then(page => {
              page.getContent().getLabelSearchFormArea()
                  .should('exist').and('be.visible');
              page.getContent().getAddLabelButton()
                  .should('exist').and('be.visible');

              page.getContent().getLabelsTableLanguageTabs()
                  .children(htmlElements.li).should('have.length', 2);
              cy.log(languages.en.code);
              page.getContent().getLabelsTableDisplayedLanguageTab()
                  .should('exist').and('be.visible')
                  .and('contain', defaultLanguage.code).and('contain', '*');

              page.getContent().getLabelsTableDisplayedTable()
                  .should('exist').and('be.visible');
              page.getContent().getLabelsTableDisplayedTableHeaders()
                  .children(htmlElements.th).should('have.length', 3)
                  .then(elements => cy.validateListTexts(elements, ['Code', defaultLanguage.name, 'Actions']));

              page.getContent().getLabelsTablePaginationForm()
                  .should('exist').and('be.visible');
              page.getContent().getLabelsTablePaginationFormPageSelector()
                  .should('have.value', 1);
            });
      });
    });

    it([Tag.SMOKE, 'ENG-3238'], 'Add form', () => {
      openLabelsPage()
          .then(page => page.getContent().openAddLabel())
          .then(page => {
            cy.validateUrlPathname('/labels-languages/add');
            page.getContent().getForm().should('exist').and('be.visible');
            page.getContent().getCodeInput().should('exist').and('be.visible');
            page.getContent().getLanguageTextArea('en').should('exist').and('be.visible');
            page.getContent().getLanguageTextArea('it').should('exist').and('be.visible');
          });
    });

    it([Tag.SMOKE, 'ENG-3238'], 'Action context menu', () => {
      addRandomLabel().then(label => {
        openLabelsPage()
            .then(page => {
              const kebabMenu = page.getContent().getKebabMenu(label.key).open();
              kebabMenu.getDropdown().should('exist').and('be.visible');
              kebabMenu.getEdit().should('exist').and('be.visible');
              kebabMenu.getDelete().should('exist').and('be.visible');
            });
      });
    });

    it([Tag.SMOKE, 'ENG-3238'], 'Edit form', () => {
      addRandomLabel().then(label => {
        openLabelsPage()
            .then(page => page.getContent().getKebabMenu(label.key).open().openEdit())
            .then(page => {
              cy.validateUrlPathname(`/labels-languages/edit/${label.key}`);
              page.getContent().getForm().should('exist').and('be.visible');
              page.getContent().getCodeInput().should('exist').and('be.visible');
              page.getContent().getLanguageTextArea('en').should('exist').and('be.visible');
              page.getContent().getLanguageTextArea('it').should('exist').and('be.visible');
            });
      });
    });

  });

  describe('Labels list navigation', () => {

    beforeEach(() => openLabelsPage());

    it([Tag.SANITY, 'ENG-3238'], 'Verify labels list', () => {
      cy.get('@currentPage')
        .then(page => {
          page.getContent().getLabelsTableDisplayedTable().should('exist').and('be.visible');
          page.getContent().getLabelsTablePaginationFormPageSizeDropdown().should('have.text', '10 ');
          page.getContent().getTableRows().should('have.length', 10);
          page.getContent().getLabelsTablePaginationFormPageSelector().should('have.value', 1);
        });
    });

    it([Tag.SANITY, 'ENG-3238'], 'Next page button', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().navigateToNextPage())
        .then(page => page.getContent().getLabelsTablePaginationFormPageSelector().should('have.value', 2));
    });

    it([Tag.SANITY, 'ENG-3238'], 'Navigate using page field', () => {
      const randomPage = Math.floor(Math.random() * 12) + 2;

      cy.get('@currentPage')
        .then(page => page.getContent().navigateToPage(randomPage))
        .then(page => page.getContent().getLabelsTablePaginationFormCurrentPageRange()
                          .should('have.text', `${randomPage * 10 - 9}-${randomPage * 10}`)
        );
    });

    it([Tag.SANITY, 'ENG-3238'], 'Previous page button', () => {
      const randomPage = Math.floor(Math.random() * 13) + 2;

      cy.get('@currentPage')
        .then(page => page.getContent().navigateToPage(randomPage))
        .then(page => page.getContent().navigateToPreviousPage())
        .then(page => page.getContent().getLabelsTablePaginationFormPageSelector().should('have.value', randomPage - 1));
    });

    it([Tag.SANITY, 'ENG-3238'], 'First page button', () => {
      const randomPage = Math.floor(Math.random() * 13) + 2;

      cy.get('@currentPage')
        .then(page => page.getContent().navigateToPage(randomPage))
        .then(page => page.getContent().navigateToFirstPage())
        .then(page => page.getContent().getLabelsTablePaginationFormPageSelector().should('have.value', 1));
    });

    it([Tag.SANITY, 'ENG-3238'], 'Last page button', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().navigateToLastPage())
        .then(page => page.getContent().getLabelsTablePaginationFormPageSelector().should('have.value', 15));
    });

  });

  //TODO make this tests less data dependent
  describe('Search for labels', () => {

    beforeEach(() => openLabelsPage());

    it([Tag.SANITY, 'ENG-3238'], 'Verify the results of a search using the search button', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().getLabelSearchInput().then(input => page.getContent().type(input, 'ALL')))
        .then(page => page.getContent().clickSearchSubmitButton())
        .then(page =>
            page.getContent().getTableRows().should('have.length', 3)
                .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', 'ALL')));
    });

    it([Tag.SANITY, 'ENG-3238', 'ENG-4243'], 'Second page of filtered data has been loaded and visualized properly', () => {
      generateDataFromJsonWithRandomCharacter()
          .then(dataReturned => {
            cy.get('@currentPage')
              .then(page => page.getContent().getLabelSearchInput().then(input => page.getContent().type(input, dataReturned[0])))
              .then(page => page.getContent().clickSearchSubmitButton());
            cy.get('@currentPage')
              .then(page => page.getContent().getLabelsTablePaginationFormLabelsTotal()
                                .then(LabelsTotal => page.getContent().navigateToNextPage().then(page => {
                                  page.getContent().getLabelsTablePaginationFormPageSelector().should('have.value', 2);
                                  page.getContent().getLabelsTablePaginationFormLabelsTotal().should('have.text', LabelsTotal[0].innerText);
                                  page.getContent().getTableRows().each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', dataReturned[0]));
                                })))
              .then(() => {
                let dataViewedInPageTwo = getDataTable();
                cy.then(() => dataReturned[1].slice(10, 20)).should('deep.equal', dataViewedInPageTwo);
              });
          });
    });

    it([Tag.FEATURE, 'ENG-3238'], 'Verify the results of a search using the return key', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().getLabelSearchInput().then(input => page.getContent().type(input, 'ALL')))
        .then(page => page.getContent().performLabelSearchInput())
        .then(page =>
            page.getContent().getTableRows().should('have.length', 3)
                .each(row => cy.get(row).children(htmlElements.td).eq(0).should('contain', 'ALL')));
    });

    it([Tag.FEATURE, 'ENG-3238'], 'Search with no results', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().getLabelSearchInput().then(input => page.getContent().type(input, 'ABC')))
        .then(page => page.getContent().clickSearchSubmitButton())
        .then(page => page.getContent().getTableRows().should('have.length', 0));
    });

  });

  describe('Update labels list functionalities', () => {

    //TODO make this test less data dependent
    it([Tag.SANITY, 'ENG-3238'], 'List should be updated when a new label is added', () => {
      generateRandomLabel().then(label => {
        openLabelsPage()
            .then(page => page.getContent().openAddLabel())
            .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, label.key)))
            .then(page => page.getContent().getLanguageTextArea('en').then(textArea => page.getContent().type(textArea, label.name.en)))
            .then(page => page.getContent().getLanguageTextArea('it').then(textArea => page.getContent().type(textArea, label.name.it)))
            .then(page => page.getContent().save())
            .then(page => {
              cy.wrap(label).as('labelToBeDeleted');
              cy.validateUrlPathname('/labels-languages');
              page.getContent().getLabelsTableDisplayedTable().should('exist').and('be.visible');
              page.getContent().getTableRowByCode(label.key).should('exist');
              page.getContent().getLabelsTablePaginationFormLabelsTotal().should('have.text', 145);
            });
      });
    });

    it([Tag.SANITY, 'ENG-3238'], 'Label should be updated in the list when it is edited', () => {
      const editedName = generateRandomId();
      addRandomLabel().then(label => {
        openLabelsPage()
            .then(page => page.getContent().getKebabMenu(label.key).open().openEdit())
            .then(page => page.getContent().getLanguageTextArea('en').then(textArea => page.getContent().type(textArea, editedName)))
            .then(page => page.getContent().save())
            .then(page => {
              cy.validateUrlPathname('/labels-languages');
              page.getContent().getTableRowByCode(label.key)
                  .children(htmlElements.td).eq(1)
                  .should('not.have.text', label.titles.en)
                  .and('have.text', editedName);
            });
      });
    });

    it([Tag.SANITY, 'ENG-3238'], 'Modal should be displayed when trying to delete a label', () => {
      addRandomLabel().then(label =>
          openLabelsPage()
              .then(page => page.getContent().getKebabMenu(label.key).open().clickDelete())
              .then(page => page.getDialog().getBody().getStateInfo().should('exist').and('contain', label.key)));
    });

    it([Tag.SANITY, 'ENG-3238', 'ENG-3375'], 'When deletion is confirmed, modal should close and list should be updated', () => {
      addRandomLabel().then(label =>
          openLabelsPage()
              .then(page => page.getContent().getKebabMenu(label.key).open().clickDelete())
              .then(page => page.getDialog().confirm())
              .then(page => {
                cy.wrap(null).as('labelToBeDeleted');
                page.getDialog().get().should('not.exist');
                page.getContent()
                    .getTableRows().children(htmlElements.td).contains(label.key)
                    .should('not.exist');
              }));
    });

    it([Tag.SANITY, 'ENG-3238', 'ENG-3375'], 'When deletion is canceled, modal should close and the label should still be present', () => {
      addRandomLabel().then(label =>
          openLabelsPage()
              .then(page => page.getContent().getKebabMenu(label.key).open().clickDelete())
              .then(page => page.getDialog().cancel())
              .then(page => {
                page.getDialog().get().should('not.exist');
                page.getContent().getTableRowByCode(label.key).should('exist');
              }));
    });

    it([Tag.FEATURE, 'ENG-3238'], 'Save button disabled when add form not filled', () => {
      openLabelsPage()
          .then(page => page.getContent().openAddLabel())
          .then(page => {
            page.getContent().getForm().should('exist').and('be.visible');
            page.getContent().getSaveButton().should('be.disabled');
          });
    });

    it([Tag.FEATURE, 'ENG-3238'], 'Values should be filled in the edit form and the code should be not editable', () => {
      addRandomLabel().then(label =>
          openLabelsPage()
              .then(page => page.getContent().getKebabMenu(label.key).open().openEdit())
              .then(page => {
                page.getContent().getForm().should('exist').and('be.visible');
                page.getContent().getCodeInput().should('exist').and('be.disabled')
                    .and('have.value', label.key);
                page.getContent().getLanguageTextArea('en').should('exist')
                    .and('have.text', label.titles.en);
                page.getContent().getLanguageTextArea('it').should('exist')
                    .and('have.text', label.titles.it);
              }));
    });

    it([Tag.FEATURE, 'ENG-3238'], 'No label added when navigating out of the add form using breadcrumb', () => {
      openLabelsPage()
          .then(page => page.getContent().openAddLabel())
          .then(page => page.getContent().navigateToLanguagesAndLabelsFromBreadcrumb())
          .then(page => {
            cy.validateUrlPathname('/labels-languages');
            page.getContent().getLabelsTablePaginationFormLabelsTotal()
                .should('have.text', 144);
          });
    });

    it([Tag.FEATURE, 'ENG-3238'], 'Label unchanged when navigating out of the edit form using breadcrumb', () => {
      const editedName = generateRandomId();

      addRandomLabel().then(label =>
          openLabelsPage()
              .then(page => page.getContent().getKebabMenu(label.key).open().openEdit())
              .then(page => page.getContent().getLanguageTextArea('en').then(textArea => page.getContent().type(textArea, editedName)))
              .then(page => page.getContent().navigateToLanguagesAndLabelsFromBreadcrumb())
              .then(page => {
                cy.validateUrlPathname('/labels-languages');
                page.getContent().getTableRowByCode(label.key)
                    .children(htmlElements.td).eq(1)
                    .should('not.have.text', editedName)
                    .and('have.text', label.titles.en);
              }));
    });

  });

  describe('Error validation', () => {

    it([Tag.ERROR, 'ENG-3238', 'ENG-4073'], 'Error should be present when selecting but not filling a field in the add label page', () => {
      openLabelsPage()
          .then(page => page.getContent().openAddLabel())
          .then(page => {
            page.getContent().getCodeInput().then(input => {
              page.getContent().focus(input);
              page.getContent().blur(input);
              page.getContent().getInputError(input)
                  .should('exist').and('be.visible')
                  .and('have.text', 'Field required');
            });
            page.getContent().getLanguageTextArea('en').then(textArea => {
              page.getContent().focus(textArea);
              page.getContent().blur(textArea);
              page.getContent().getInputError(textArea)
                  .should('exist').and('be.visible')
                  .and('have.text', 'Field required');
            });
            page.getContent().getLanguageTextArea('it').then(textArea => {
              page.getContent().focus(textArea);
              page.getContent().blur(textArea);
              page.getContent().getInputError(textArea)
                  .should('exist').and('be.visible')
                  .and('have.text', 'Field required');
            });
          });
    });

    it([Tag.ERROR, 'ENG-3238'], 'A toast notification should be displayed when trying to add a label with an existing code', () => {
      addRandomLabel().then(label =>
          openLabelsPage()
              .then(page => page.getContent().openAddLabel())
              .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, label.key)))
              .then(page => page.getContent().getLanguageTextArea('en').then(textArea => page.getContent().type(textArea, generateRandomId())))
              .then(page => page.getContent().getLanguageTextArea('it').then(textArea => page.getContent().type(textArea, generateRandomId())))
              .then(page => page.getContent().clickSaveButton())
              .then(page => cy.validateToast(page, label.key, false)));
    });

    it([Tag.ERROR, 'ENG-3238'], 'Error should be present, and save button disabled, when clearing a field in the edit label page', () => {
      addRandomLabel().then(label =>
          openLabelsPage()
              .then(page => page.getContent().getKebabMenu(label.key).open().openEdit())
              .then(page => {
                page.getContent().getLanguageTextArea('en').then(textArea => {
                  page.getContent().clear(textArea);
                  page.getContent().blur(textArea);
                  page.getContent().getInputError(textArea)
                      .should('exist').and('be.visible')
                      .and('have.text', 'Field required');
                });
                page.getContent().getSaveButton().should('be.disabled');
              }));
    });

  });
  const getKeysFromLabelsJSON = () => {
    cy.fixture('data/labels.json').then(labels => Object.values(labels).map(label => label.key)).as('keysFromJSON');
    return cy.get('@keysFromJSON');
  };

  const generateDataFromJsonWithRandomCharacter = () => {
    getKeysFromLabelsJSON().then(labels => {
      let filteredLabels;
      let randomChar;
      do {
        let char       = generateRandomString(1);
        randomChar     = char;
        filteredLabels = labels.filter(label => label.includes(char));
      } while (filteredLabels.length < 11);
      cy.then(() => [randomChar, filteredLabels]).as('dataReturned');
    });
    return cy.get('@dataReturned');
  };

  const getDataTable = () => {
    let members = [];
    cy.get('@currentPage')
      .then(page => page.getContent().getTableRows().each(row => cy.get(row).children(htmlElements.td).eq(0).then(el => members.push(el.text()))));
    return members;
  };

  const generateRandomLabel = () => {
    return cy.wrap({
      // used AAA to make sure it appears in the first page
      key: `AAA${generateRandomId()}`,
      name: {
        en: generateRandomId(),
        it: generateRandomId()
      }
    });
  };

  const addRandomLabel = () => {
    return generateRandomLabel().then(label => addLabel(label));
  };
  //FIXME the API require the name property but returns the titles property
  const addLabel       = (label) => {
    return cy.labelsController()
             .then(controller => controller.addLabel(label.key, label.name))
             .then(res => cy.wrap(res.body.payload).as('labelToBeDeleted'));
  };

  const openLabelsPage = () => {
    return cy.get('@currentPage')
             .then(page => page.getMenu().getAdministration().open().openLanguagesAndLabels())
             .then(page => page.getContent().openSystemLabels());
  };

});
