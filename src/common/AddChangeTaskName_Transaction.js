'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "./jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddChangeTaskName_Transaction extends jsTPS_Transaction {
    constructor(initApp, toDoListItemIDToBeChanged, oldTaskName, newTaskName ) {
        super();
        this.app = initApp;
        this.toDoListItemIDToBeChanged = toDoListItemIDToBeChanged;
        this.oldTaskName = oldTaskName;
        this.newTaskName = newTaskName;
    }
    
    doTransaction() {
        this.app.changeTaskName(this.toDoListItemIDToBeChanged,this.newTaskName);
    }

    undoTransaction() {
        this.app.changeTaskName(this.toDoListItemIDToBeChanged,this.oldTaskName);
        }
}