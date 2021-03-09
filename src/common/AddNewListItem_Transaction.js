'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddNewListItem_Transaction extends jsTPS_Transaction {
    constructor(initApp) {
        super();
        this.app = initApp
    }
    
    doTransaction() {
        this.newAddedListItem = this.app.addNewToDoListItem()
    }

    undoTransaction() {
        this.app.removeListItem(this.newAddedListItem.id)
    }
}