'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddDeleteListItem_Transaction extends jsTPS_Transaction {
    constructor(initApp, initIndex, itemListToBeRemoved ) {
        super();
        this.app = initApp;
        this.initIndex = initIndex;
        this.itemListToBeRemoved = itemListToBeRemoved;
       
    }
    
    doTransaction() {
        this.removedListItem = this.app.removeListItem(this.itemListToBeRemoved.id)
    }

    undoTransaction() {
        this.app.addItemAtIndex(this.removedListItem, this.initIndex)
        }
}