import HomePage from '../../support/pageObjects/HomePage';
import { htmlElements } from '../../support/pageObjects/WebElement';

describe('Languages', () => {

    let currentPage;

    const languages = {
        aa: { code: 'aa', name: 'Afar' },
        ab: { code: 'ab', name: 'Abkhazian' },
        af: { code: 'af', name: 'Afrikaans' },
        am: { code: 'am', name: 'Amharic' },
        ar: { code: 'ar', name: 'Arabic' },
        as: { code: 'as', name: 'Assamese' },
        ay: { code: 'ay', name: 'Aymara' },
        az: { code: 'az', name: 'Azerbaijani' },
        ba: { code: 'ba', name: 'Bashkir' },
        be: { code: 'be', name: 'Byelorussian' },
        bg: { code: 'bg', name: 'Bulgarian' },
        bh: { code: 'bh', name: 'Bihari' },
        bi: { code: 'bi', name: 'Bislama' },
        bn: { code: 'bn', name: 'Bengali; Bangla' },
        bo: { code: 'bo', name: 'Tibetan' },
        br: { code: 'br', name: 'Breton' },
        ca: { code: 'ca', name: 'Catalan' },
        co: { code: 'co', name: 'Corsican' },
        cs: { code: 'cs', name: 'Czech' },
        cy: { code: 'cy', name: 'Welsh' },
        da: { code: 'da', name: 'Danish' },
        de: { code: 'de', name: 'German' },
        dz: { code: 'dz', name: 'Bhutani' },
        el: { code: 'el', name: 'Greek' },
        en: { code: 'en', name: 'English' },
        eo: { code: 'eo', name: 'Esperanto' },
        es: { code: 'es', name: 'Spanish' },
        et: { code: 'et', name: 'Estonian' },
        eu: { code: 'eu', name: 'Basque' },
        fa: { code: 'fa', name: 'Persian' },
        fi: { code: 'fi', name: 'Finnish' },
        fj: { code: 'fj', name: 'Fiji' },
        fo: { code: 'fo', name: 'Faroese' },
        fr: { code: 'fr', name: 'French' },
        fy: { code: 'fy', name: 'Frisian' },
        ga: { code: 'ga', name: 'Irish' },
        gd: { code: 'gd', name: 'Scots Gaelic' },
        gl: { code: 'gl', name: 'Galician' },
        gn: { code: 'gn', name: 'Guarani' },
        gu: { code: 'gu', name: 'Gujarati' },
        ha: { code: 'ha', name: 'Hausa' },
        he: { code: 'he', name: 'Hebrew (formerly iw)' },
        hi: { code: 'hi', name: 'Hindi' },
        hr: { code: 'hr', name: 'Croatian' },
        hu: { code: 'hu', name: 'Hungarian' },
        hy: { code: 'hy', name: 'Armenian' },
        ia: { code: 'ia', name: 'Interlingua' },
        id: { code: 'id', name: 'Indonesian (formerly in)' },
        ie: { code: 'ie', name: 'Interlingue' },
        ik: { code: 'ik', name: 'Inupiak' },
        is: { code: 'is', name: 'Icelandic' },
        it: { code: 'it', name: 'Italian' },
        iu: { code: 'iu', name: 'Inuktitut' },
        ja: { code: 'ja', name: 'Japanese' },
        jw: { code: 'jw', name: 'Javanese' },
        ka: { code: 'ka', name: 'Georgian' },
        kk: { code: 'kk', name: 'Kazakh' },
        kl: { code: 'kl', name: 'Greenlandic' },
        km: { code: 'km', name: 'Cambodian' },
        kn: { code: 'kn', name: 'Kannada' },
        ko: { code: 'ko', name: 'Korean' },
        ks: { code: 'ks', name: 'Kashmiri' },
        ku: { code: 'ku', name: 'Kurdish' },
        ky: { code: 'ky', name: 'Kirghiz' },
        la: { code: 'la', name: 'Latin' },
        ln: { code: 'ln', name: 'Lingala' },
        lo: { code: 'lo', name: 'Laothian' },
        lt: { code: 'lt', name: 'Lithuanian' },
        lv: { code: 'lv', name: 'Latvian, Lettish' },
        mg: { code: 'mg', name: 'Malagasy' },
        mi: { code: 'mi', name: 'Maori' },
        mk: { code: 'mk', name: 'Macedonian' },
        ml: { code: 'ml', name: 'Malayalam' },
        mn: { code: 'mn', name: 'Mongolian' },
        mo: { code: 'mo', name: 'Moldavian' },
        mr: { code: 'mr', name: 'Marathi' },
        ms: { code: 'ms', name: 'Malay' },
        mt: { code: 'mt', name: 'Maltese' },
        my: { code: 'my', name: 'Burmese' },
        na: { code: 'na', name: 'Nauru' },
        ne: { code: 'ne', name: 'Nepali' },
        nl: { code: 'nl', name: 'Dutch' },
        no: { code: 'no', name: 'Norwegian' },
        oc: { code: 'oc', name: 'Occitan' },
        om: { code: 'om', name: '(Afan) Oromo' },
        or: { code: 'or', name: 'Oriya' },
        pa: { code: 'pa', name: 'Punjabi' },
        pl: { code: 'pl', name: 'Polish' },
        ps: { code: 'ps', name: 'Pashto, Pushto' },
        pt: { code: 'pt', name: 'Portuguese' },
        qu: { code: 'qu', name: 'Quechua' },
        rm: { code: 'rm', name: 'Rhaeto-Romance' },
        rn: { code: 'rn', name: 'Kirundi' },
        ro: { code: 'ro', name: 'Romanian' },
        ru: { code: 'ru', name: 'Russian' },
        rw: { code: 'rw', name: 'Kinyarwanda' },
        sa: { code: 'sa', name: 'Sanskrit' },
        sd: { code: 'sd', name: 'Sindhi' },
        sg: { code: 'sg', name: 'Sangho' },
        sh: { code: 'sh', name: 'Serbo-Croatian' },
        si: { code: 'si', name: 'Sinhalese' },
        sk: { code: 'sk', name: 'Slovak' },
        sl: { code: 'sl', name: 'Slovenian' },
        sm: { code: 'sm', name: 'Samoan' },
        sn: { code: 'sn', name: 'Shona' },
        so: { code: 'so', name: 'Somali' },
        sq: { code: 'sq', name: 'Albanian' },
        sr: { code: 'sr', name: 'Serbian' },
        ss: { code: 'ss', name: 'Siswati' },
        st: { code: 'st', name: 'Sesotho' },
        su: { code: 'su', name: 'Sundanese' },
        sv: { code: 'sv', name: 'Swedish' },
        sw: { code: 'sw', name: 'Swahili' },
        ta: { code: 'ta', name: 'Tamil' },
        te: { code: 'te', name: 'Telugu' },
        tg: { code: 'tg', name: 'Tajik' },
        th: { code: 'th', name: 'Thai' },
        ti: { code: 'ti', name: 'Tigrinya' },
        tk: { code: 'tk', name: 'Turkmen' },
        tl: { code: 'tl', name: 'Tagalog' },
        tn: { code: 'tn', name: 'Setswana' },
        to: { code: 'to', name: 'Tonga' },
        tr: { code: 'tr', name: 'Turkish' },
        ts: { code: 'ts', name: 'Tsonga' },
        tt: { code: 'tt', name: 'Tatar' },
        tw: { code: 'tw', name: 'Twi' },
        ug: { code: 'ug', name: 'Uighur' },
        uk: { code: 'uk', name: 'Ukrainian' },
        ur: { code: 'ur', name: 'Urdu' },
        uz: { code: 'uz', name: 'Uzbek' },
        vi: { code: 'vi', name: 'Vietnamese' },
        vo: { code: 'vo', name: 'Volapuk' },
        wo: { code: 'wo', name: 'Wolof' },
        xh: { code: 'xh', name: 'Xhosa' },
        yi: { code: 'yi', name: 'Yiddish (formerly ji)' },
        yo: { code: 'yo', name: 'Yoruba' },
        za: { code: 'za', name: 'Zhuang' },
        zh: { code: 'zh', name: 'Chinese - Traditional' },
        zhs: { code: 'zhs', name: 'Chinese - Simplified' },
        zu: { code: 'zu', name: 'Zulu' }
    }

    beforeEach(() => {
        cy.wrap(null).as('languageToDelete');
        cy.kcLogin('admin').as('tokens');
    });

    afterEach(() => {
        cy.get('@languageToDelete').then((languageToDelete) => {
            if (languageToDelete) {
                cy.languagesController()
                    .then(controller => controller.putLanguage(languageToDelete.code, languageToDelete.name, false, false));
            }
        });
        cy.kcLogout();
    });

    it([Tag.SMOKE, 'ENG-3237'], 'Languages section', () => {
        currentPage = openLanguagesPage();
        currentPage.getContent().getLanguageTable().should('exist').and('be.visible');
        currentPage.getContent().getLanguageRowByIndex(0).children(htmlElements.td).should('have.length', 3);
        currentPage.getContent().getDeleteLanguageByIndex(0).should('exist').and('be.visible');
        currentPage.getContent().getLanguageDropdown().should('exist').and('be.visible');
        currentPage.getContent().getAddLanguageSubmit().should('exist').and('be.visible');
    });

    it([Tag.SANITY, 'ENG-3237'], 'English and Italian should be active by default, and English should be the default language', () => {
        currentPage = openLanguagesPage();
        currentPage.getContent().getLanguageTableRows().should('have.length', 2);
        getLanguageTableRowByCode(languages.it.code).should('exist');
        getLanguageTableRowByCode(languages.en.code).should('exist').and('contain', '*');
    });

    it([Tag.FEATURE, 'ENG-3237'], 'Verify the available languages in the language selector', () => {
        let expectedLanguagesInDropdown = Object.keys(languages).length-1;
        currentPage = openLanguagesPage();
        currentPage.getContent().getLanguageDropdown().as('languageDropdown');
        currentPage.getContent().getLanguageDropdown().children(htmlElements.option).should('have.length', expectedLanguagesInDropdown);
        cy.get('@languageDropdown').then(res => {
            for(const language in languages) {
                if(language!=languages.en.code && language!=languages.it.code) {
                    cy.wrap(res).children(`${htmlElements.option}[value=${language}]`).should('exist')
                } else cy.wrap(res).children(`${htmlElements.option}[value=${language}]`).should('not.exist');
            }
        })
    });

    describe('Add and remove functionalities', () => {

        const testLanguage = languages.cs;

        it([Tag.SANITY, 'ENG-3237'], 'Add language updates lists and shows successful toast', () => {
            currentPage = openLanguagesPage();
            currentPage.getContent().addLanguage(testLanguage.code);
            getLanguageTableRowByCode(testLanguage.code).should('exist');
            cy.wrap(testLanguage).as('languageToDelete');
            currentPage.getContent().getLanguageFromDropdownByCode(testLanguage.code).should('not.exist');
            cy.validateToast(currentPage);
        });

        it([Tag.SANITY, 'ENG-3237'], 'When trying to remove a not-default language, a confirmation modal is displayed', () => {
            cy.languagesController()
                .then(controller => controller.putLanguage(testLanguage.code, testLanguage.name, true, false))
                .then(res => cy.wrap(res.body.payload).as('languageToDelete'));
            currentPage = openLanguagesPage();
            getLanguageTableRowByCode(testLanguage.code)
                .then(row => {
                    currentPage.getContent().clickDeleteLanguageByIndex(row.index());
                    currentPage.getDialog().getBody().getState().should('exist');
                });
        });

        it([Tag.SANITY, 'ENG-3237'], 'Remove not-default language updates lists and shows successful toast', () => {
            cy.languagesController()
                .then(controller => controller.putLanguage(testLanguage.code, testLanguage.name, true, false))
                .then(res => cy.wrap(res.body.payload).as('languageToDelete'));
            currentPage = openLanguagesPage();
            getLanguageTableRowByCode(testLanguage.code)
                .then(row => {
                    currentPage.getContent().clickDeleteLanguageByIndex(row.index());
                    currentPage.getDialog().confirm();
                });
            currentPage.getDialog().get().should('not.exist');
            cy.validateToast(currentPage);
            currentPage.getContent().getLanguageFromDropdownByCode(testLanguage.code).should('exist');
            getLanguageTableRowByCode(testLanguage.code).should('not.exist');
            cy.wrap(null).as('languageToDelete');
        });

        it([Tag.SANITY, 'ENG-3237'], 'When trying to remove a default language, it is not removed and an error toast is displayed', () => {
            currentPage = openLanguagesPage();
            getLanguageTableRowByCode(languages.en.code)
                .then(row => {
                    currentPage.getContent().clickDeleteLanguageByIndex(row.index());
                    currentPage.getDialog().confirm();
                });
            currentPage.getDialog().get().should('not.exist');
            cy.validateToast(currentPage, null, false);
            currentPage.getContent().getLanguageFromDropdownByCode(languages.en.code).should('not.exist');
            getLanguageTableRowByCode(languages.en.code).should('exist');
        });

        it([Tag.SANITY, 'ENG-3237'], 'When canceling the removal of a language, it is not removed and the modal is closed', () => {
            cy.languagesController()
                .then(controller => controller.putLanguage(testLanguage.code, testLanguage.name, true, false))
                .then(res => cy.wrap(res.body.payload).as('languageToDelete'));
            currentPage = openLanguagesPage();
            getLanguageTableRowByCode(testLanguage.code)
                .then(row => {
                    currentPage.getContent().clickDeleteLanguageByIndex(row.index());
                    currentPage.getDialog().cancel();
                });
            currentPage.getDialog().get().should('not.exist');
            currentPage.getContent().getLanguageFromDropdownByCode(testLanguage.code).should('not.exist');
            getLanguageTableRowByCode(testLanguage.code).should('exist');
        });

        it([Tag.ERROR, 'ENG-3237'], 'When trying to add a language without selecting one, an error toast should be displayed', () => {
            currentPage = openLanguagesPage();
            currentPage.getContent().getSelectedLanguageFromDropdown().should('have.text', 'Choose one option')
            currentPage.getContent().getAddLanguageSubmit().click();
            cy.validateToast(currentPage, null, false);
        });

    });

    const openLanguagesPage = () => {
        cy.visit('/');
        currentPage = new HomePage();
        currentPage = currentPage.getMenu().getAdministration().open();
        currentPage = currentPage.openLanguages_Labels();
        currentPage.getContent().getLanguagesTabLink().click();
        cy.wait(1000); //wait for page to load
        return currentPage;
    };

    const getLanguageTableRowByCode = (code) => {
        return currentPage.getContent()
            .getLanguageTable()
            .contains(htmlElements.tr, code);
    }

});
