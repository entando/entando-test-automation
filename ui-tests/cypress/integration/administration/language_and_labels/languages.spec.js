import {htmlElements} from '../../../support/pageObjects/WebElement';

describe('Languages', () => {

  beforeEach(() => {
    cy.wrap(null).as('languageToDelete');
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.get('@languageToDelete').then(language => {
      if (language) cy.languagesController().then(controller => controller.putLanguage(language.code, language.name, false, false));
    });
    cy.kcUILogout();
  });

  describe('Languages page structure', () => {

    it([Tag.SMOKE, 'ENG-3237'], 'Languages section', () => {
      openLanguagesPage()
          .then(page => {
            page.getContent().getLanguagesDropdown()
                .should('exist')
                .and('be.visible');

            page.getContent().getAddLanguageButton()
                .should('exist')
                .and('be.visible');

            page.getContent().getLanguageTable()
                .should('exist')
                .and('be.visible');
            page.getContent().getLanguageTableHeaders()
                .children(htmlElements.th).should('have.length', 3)
                .then(elements => cy.validateListTexts(elements, ['Code', 'Name', 'Actions']));
            page.getContent().getLanguageTableRows()
                .each((row, idx) => page.getContent().getDeleteLanguageByIndex(idx).should('exist').and('be.visible'));
          });
    });

    it([Tag.SANITY, 'ENG-3237'], 'English and Italian should be active by default, and English should be the default language', () => {
      cy.fixture('data/languages.json').then(languages => {
        openLanguagesPage()
            .then(page => {
              page.getContent().getLanguageTableRows().should('have.length', 2);
              page.getContent().getLanguageRowByLanguageCode(languages.en.code)
                  .should('exist').and('contain', '*');
              page.getContent().getLanguageRowByLanguageCode(languages.it.code).should('exist');
            });
      });
    });

    it([Tag.FEATURE, 'ENG-3237'], 'Verify the available languages in the language selector', () => {
      openLanguagesPage()
          .then(page =>
              cy.fixture('data/languages.json').then(languages =>
                  page.getContent().getLanguagesDropdown().then(dropdown => {
                    cy.get(dropdown).children(htmlElements.option)
                      .should('have.length', Object.keys(languages).length - 1);
                    Object.entries(languages).map(([key, value]) => {
                      if (key === languages.en.code || key === languages.it.code) {
                        cy.get(dropdown).children(`${htmlElements.option}[value=${key}]`).should('not.exist');
                      } else {
                        cy.get(dropdown).children(`${htmlElements.option}[value=${key}]`).should('exist')
                          .and('have.text', `${value.code}\u00a0\u2013\u00a0${value.name}`);
                      }
                    });
                  })));
    });

  });

  describe('Add and remove functionalities', () => {

    it([Tag.SANITY, 'ENG-3237'], 'Add language updates lists and shows successful toast', () => {
      cy.fixture('data/languages.json').then(languages => {
        const language = getRandomLanguage(languages);

        openLanguagesPage()
            .then(page => page.getContent().addLanguage(language.code))
            .then(page => {
              cy.validateToast(page);
              cy.wrap(language).as('languageToDelete');
              page.getContent().getLanguageRowByLanguageCode(language.code).should('exist');
              page.getContent().getLanguageFromDropdownByCode(language.code).should('not.exist');
            });
      });
    });

    it([Tag.SANITY, 'ENG-3237'], 'When trying to remove a not-default language, a confirmation modal is displayed', () => {
      cy.fixture('data/languages.json').then(languages => {
        const language = getRandomLanguage(languages);

        addLanguage(language);
        openLanguagesPage()
            .then(page => page.getContent().clickDeleteLanguageByLanguageCode(language.code))
            .then(page => page.getDialog().getBody().getState().should('exist'));
      });
    });

    it([Tag.SANITY, 'ENG-3237'], 'Remove not-default language updates lists and shows successful toast', () => {
      cy.fixture('data/languages.json').then(languages => {
        const language = getRandomLanguage(languages);

        addLanguage(language);
        openLanguagesPage()
            .then(page => page.getContent().clickDeleteLanguageByLanguageCode(language.code))
            .then(page => page.getDialog().confirm())
            .then(page => {
              cy.validateToast(page);
              cy.wrap(null).as('languageToDelete');
              page.getDialog().get().should('not.exist');
              page.getContent().getLanguageFromDropdownByCode(language.code).should('exist');
              page.getContent().getLanguageTableRows()
                  .each(row => cy.get(row).children(htmlElements.td).eq(0).should('not.contain', language.code));
            });
      });
    });

    it([Tag.SANITY, 'ENG-3237'], 'When trying to remove a default language, it is not removed and an error toast is displayed', () => {
      cy.fixture('data/languages.json').then(languages => {
        openLanguagesPage()
            .then(page => page.getContent().clickDeleteLanguageByLanguageCode(languages.en.code))
            .then(page => page.getDialog().confirm())
            .then(page => {
              cy.validateToast(page, 'default language', false);
              page.getDialog().get().should('not.exist');
              page.getContent().getLanguageRowByLanguageCode(languages.en.code).should('exist');
              page.getContent().getLanguageFromDropdownByCode(languages.en.code).should('not.exist');
            });
      });
    });

    it([Tag.SANITY, 'ENG-3237'], 'When canceling the removal of a language, it is not removed and the modal is closed', () => {
      cy.fixture('data/languages.json').then(languages => {
        const language = getRandomLanguage(languages);

        addLanguage(language);
        openLanguagesPage()
            .then(page => page.getContent().clickDeleteLanguageByLanguageCode(language.code))
            .then(page => page.getDialog().cancel())
            .then(page => {
              page.getDialog().get().should('not.exist');
              page.getContent().getLanguageRowByLanguageCode(language.code).should('exist');
              page.getContent().getLanguageFromDropdownByCode(language.code).should('not.exist');
            });
      });
    });

    it([Tag.ERROR, 'ENG-3237'], 'When trying to add a language without selecting one, an error toast should be displayed', () => {
      openLanguagesPage()
          .then(page => {
            page.getContent().getSelectedLanguageFromDropdown().should('have.text', 'Choose one option');
            page.getContent().clickAddLanguageButton();
          })
          .then(page => cy.validateToast(page, null, false));
    });

    const getRandomLanguage = (languages) => {
      delete languages.en;
      delete languages.it;
      const obj_keys = Object.keys(languages);
      const ran_key  = obj_keys[Math.floor(Math.random() * obj_keys.length)];
      return languages[ran_key];
    };

  });

  const addLanguage = (language) => {
    cy.languagesController()
      .then(controller => controller.putLanguage(language.code, language.name, true, false))
      .then(res => cy.wrap(res.body.payload).as('languageToDelete'));
  };

  const openLanguagesPage = () => {
    return cy.get('@currentPage')
             .then(page => page.getMenu().getAdministration().open().openLanguagesAndLabels());
  };

});
