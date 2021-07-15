import {TEST_ID_KEY, htmlElements} from "../../WebElement.js";

import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import AddPage from "./AddPage.js";

export default class ManagementPage extends Content {
    add = `[${TEST_ID_KEY}=button-step-5]`;
    tableContainer = `${htmlElements.div}.DDTable`;
    pageName = `[${TEST_ID_KEY}=common_PageTree_span]`;
    optionsMenu = `[id=WidgetListRow-dropown]`;
    addChild = `[aria-labelledby=WidgetListRow-dropown] li:nth-child(1) a`;
    expandAll = `${htmlElements.div}.PageTree__toggler--expand`;

    getAddButton() {
        return this.get().find(this.add);
    }

    getTableContainer () {
        return this.get().find(this.tableContainer);
    }

    getRowByPageName (name) {
        const rows = this.getTableContainer().find('table tr');
        return rows.contains(name);
    }

    getOptionsMenu (name) {
        return this.getRowByPageName(name).parents('tr').find(this.optionsMenu);
    }

    getExpandAll() {
        return this.get().find(this.expandAll);
    }

    clickExpandAll() {
        this.getExpandAll().click();
    }

    clickAddChild (name) {
        this.getOptionsMenu(name).click().parent().find(this.addChild).click();
        return new AppPage(AddPage);
    }

    clickAddButton() {
        this.getAddButton().click();
        return new AppPage(AddPage);
    }
}