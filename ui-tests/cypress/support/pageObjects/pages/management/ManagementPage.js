import {DATA_TESTID, htmlElements} from "../../WebElement.js";

import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import AddPage from "./AddPage.js";

export default class ManagementPage extends Content {
    add = `[${DATA_TESTID}=button-step-5]`;
    tableContainer = `${htmlElements.div}.DDTable`;
    pageName = `[${DATA_TESTID}=common_PageTree_span]`;
    optionsMenu = `#WidgetListRow-dropown`;
    addChild = `[aria-labelledby=WidgetListRow-dropown] li:nth-child(1) a`;
    publishChild = `[aria-labelledby=WidgetListRow-dropown] li:nth-child(5) a`;
    deleteChild = `[aria-labelledby=WidgetListRow-dropown] li:nth-child(7) a`;
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

    getPublishChild (name) {
        return this.getOptionsMenu(name).click().parent().find(this.publishChild);
    }

    getDeleteChild (name) {
        return this.getOptionsMenu(name).click().parent().find(this.deleteChild);
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