'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddChangeStatus_Transaction extends jsTPS_Transaction {
    constructor(initApp, toDoListItemToBeChanged, oldText, newText ) {
        super();
        this.app = initApp;
        this.toDoListItemToBeChanged = toDoListItemToBeChanged;
        this.oldText = oldText;
        this.newText = newText;
    }
    
    doTransaction() {
        this.app.changeStatus(this.toDoListItemToBeChanged,this.newText);
    }

    undoTransaction() {
        this.app.changeStatus(this.toDoListItemToBeChanged,this.oldText);
        }
}