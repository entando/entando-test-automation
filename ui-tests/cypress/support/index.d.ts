declare namespace Cypress {

    interface Chainable<Subject> {
        /**
         * Checks any window.open invocation (_blank types) and converts it to same-tab window navigation
         */
        initWindowOpenChecker(): void
    }

    interface Chainable<Subject> {

        /**
         * Validate if the elements present in the list have the expected text
         * @param list - the list of html elements to be validated
         * @param values - the ordered expected texts
         */
        validateListTexts(list, values): void

        /**
         * Validate if the url pathname is as expected
         * @param pathname - the expected url
         */
        validateUrlPathname(pathname): void

        /**
         * Validate if the toast notification and its message are visible
         * @param page - the current page
         * @param text - the text message that should be visible in the toast notification
         * @param isOk - a boolean value if success or not
         */
        validateToast(page: object, text?: string, isOk?: boolean): void

    }

}