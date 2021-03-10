'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddChangeDueDate_Transaction extends jsTPS_Transaction {
    constructor(initApp, toDoListItemToBeChanged, oldDueDate, newDueDate ) {
        super();
        this.app = initApp;
        this.toDoListItemToBeChanged = toDoListItemToBeChanged;
        this.oldDueDate = oldDueDate;
        this.newDueDate = newDueDate;
    }
    
    doTransaction() {
        this.app.changeDueDate(this.toDoListItemToBeChanged,this.newDueDate);
    }

    undoTransaction() {
        this.app.changeDueDate(this.toDoListItemToBeChanged,this.oldDueDate);
        }
}