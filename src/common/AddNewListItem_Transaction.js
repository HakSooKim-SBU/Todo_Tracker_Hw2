'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddNewListItem_Transaction extends jsTPS_Transaction {
    constructor(initApp) {
        super();
        this.app = initApp
        this.newListItem = this.app.makeNewToDoListItem();
    }
    
    doTransaction() {
        this.newAddedListItem = this.app.addListItemAtLast(this.newListItem)
    }

    undoTransaction() {
        this.app.removeListItem(this.newListItem.id)
    }
}