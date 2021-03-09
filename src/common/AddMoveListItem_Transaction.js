'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddMoveListItem_Transaction extends jsTPS_Transaction {
    constructor(initApp, initStartIndex, initDestIndex ) {
        super();
        this.app = initApp;
        this.fromIndex = initStartIndex;
        this.toIndex = initDestIndex;
    }
    
    doTransaction() {

        this.app.moveItem(this.fromIndex,this.toIndex)
    }

    undoTransaction() {
        this.app.moveItem(this.toIndex,this.fromIndex)
        }
}