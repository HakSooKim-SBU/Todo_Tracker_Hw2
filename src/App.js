// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import testData from './test/testData.json'
import jsTPS from './common/jsTPS'
import AddNewListItem_Transaction from './common/AddNewListItem_Transaction.js'
import AddMoveListItem_Transaction from './common/AddMoveListItem_Transaction.js'
import AddDeleteListItem_Transaction from './common/AddDeleteListItem_Transaction.js'
import AddChangeStatus_Transaction from './common/AddChangeStatus_Transaction.js'
import AddChangeDueDate_Transaction from './common/AddChangeDueDate_Transaction.js'
import AddChangeTaskName_Transaction from './common/AddChangeTaskName_Transaction.js'



// THESE ARE OUR REACT COMPONENTS
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Workspace from './components/Workspace'
{/*import ItemsListHeaderComponent from './components/ItemsListHeaderComponent'
import ItemsListComponent from './components/ItemsListComponent'
import ListsComponent from './components/ListsComponent'
*/}
export class App extends Component {
  constructor(props) {
    // ALWAYS DO THIS FIRST
    super(props);

    // DISPLAY WHERE WE ARE
    console.log("App constructor");

    // MAKE OUR TRANSACTION PROCESSING SYSTEM
    this.tps = new jsTPS();

    // CHECK TO SEE IF THERE IS DATA IN LOCAL STORAGE FOR THIS APP
    let recentLists = localStorage.getItem("recentLists");
    console.log("recentLists: " + recentLists);
    if (!recentLists) {
      recentLists = JSON.stringify(testData.toDoLists);
      localStorage.setItem("toDoLists", recentLists);
    }
    recentLists = JSON.parse(recentLists);

    // FIND OUT WHAT THE HIGHEST ID NUMBERS ARE FOR LISTS
    let highListId = -1;
    let highListItemId = -1;
    for (let i = 0; i < recentLists.length; i++) {
      let toDoList = recentLists[i];
      if (toDoList.id > highListId) {
        highListId = toDoList.id;
      }
      for (let j = 0; j < toDoList.items.length; j++) {
        let toDoListItem = toDoList.items[j];
        if (toDoListItem.id > highListItemId)
        highListItemId = toDoListItem.id;
      }
    };
    let tps = new jsTPS();
    // SETUP OUR APP STATE
    this.state = {
      toDoLists: recentLists,
      currentList: {items: []},
      nextListId: highListId+1,
      nextListItemId: highListItemId+1,
      useVerboseFeedback: true
    }
  }

  // WILL LOAD THE SELECTED LIST
  loadToDoList = (toDoList) => {
    // console.log("loading " + toDoList);

    // MAKE SURE toDoList IS AT THE TOP OF THE STACK BY REMOVING THEN PREPENDING
    const nextLists = this.state.toDoLists.filter(testList =>
      testList.id !== toDoList.id
    );
    nextLists.unshift(toDoList);

    this.setState({
      toDoLists: nextLists,
      currentList: toDoList
    }, this.afterToDoListsChangeComplete);
  }

  addNewList = () => {
    let newToDoListInList = [this.makeNewToDoList()];
    let newToDoListsList = [...newToDoListInList, ...this.state.toDoLists];
    let newToDoList = newToDoListInList[0];

    // AND SET THE STATE, WHICH SHOULD FORCE A render    
    this.setState({
      toDoLists: newToDoListsList,
      currentList: newToDoList,
      nextListId: this.state.nextListId+1
    }, this.afterToDoListsChangeComplete);
  }

  makeNewToDoList = () => {
    let newToDoList = {
      id: this.state.nextListId,
      name: 'Untitled',
      items: []
    };
    return newToDoList;
  }

  registerAddNewItemListTransaction = () =>{
    let transaction = new AddNewListItem_Transaction(this);
    this.tps.addTransaction(transaction);
  }

  addNewToDoListItem = () => {
    let currentListId = this.state.currentList.id;
    let newListItem = this.makeNewToDoListItem();
    let updatedToDoListsList = [...this.state.currentList.items, newListItem];
    console.log(this.state.toDoLists);
    let updatedToDoLists = this.state.toDoLists.map((toDoList) => {
      if (toDoList.id === currentListId){
        toDoList.items = updatedToDoListsList; 
        return toDoList;
      }
      else 
        return toDoList;
    });   
    this.setState({
      toDoLists: updatedToDoLists,
      nextListItemId: this.state.nextListItemId + 1
    }, this.afterToDoListsChangeComplete);
    return newListItem
  }

  makeNewToDoListItem = () =>  {
    let newToDoListItem = {
      id: this.state.nextListItemId,
      description: "No Description",
      due_date: "No Date",
      status: "incomplete"
    };
    return newToDoListItem
  }

  removeListItem =(toDoListItemIDToBeRemoved) => {
    let itemToBeRemoved = this.state.currentList.items.find((ListItem) => ListItem.id === toDoListItemIDToBeRemoved);
    let currentListId = this.state.currentList.id;
    let updatedToDoListsList = this.state.currentList.items.filter((ListItem) => ListItem.id !== toDoListItemIDToBeRemoved);
    let updatedToDoLists = this.state.toDoLists.map((toDoList) =>{
      if (toDoList.id === currentListId){
        toDoList.items = updatedToDoListsList; 
        return toDoList;
      }
      else 
        return toDoList;
    });
    this.setState({
      toDoLists: updatedToDoLists
    },this.afterToDoListsChangeComplete);
    return itemToBeRemoved
  }

  changeTaskName = (toDoListItemIDToBeChanged, newTaskName) => {
    let currentListId = this.state.currentList.id;
    let updatedToDoListslist = this.state.currentList.items.map((listItem) =>{
      if (listItem.id === toDoListItemIDToBeChanged){
        listItem.description = newTaskName;
        return listItem;
      }
      else 
        return listItem;
    });
    let updatedToDoLists = this.state.toDoLists.map((toDoList) =>{
      if (toDoList.id === currentListId){
        toDoList.items = updatedToDoListslist; 
        return toDoList;
      }
      else 
        return toDoList;
    });
    this.setState({
      toDoLists: updatedToDoLists
    }, this.afterToDoListsChangeComplete);
  }

  registerChangeTaskName = (toDoListItemIDToBeChanged, newTaskName) => {
    let toDoListItemToBeRemoved = this.state.currentList.items.find(listItem => listItem.id === toDoListItemIDToBeChanged);
    if (toDoListItemToBeRemoved.description === newTaskName){
      return
    }
    let transaction = new AddChangeTaskName_Transaction(this,toDoListItemIDToBeChanged,toDoListItemToBeRemoved.description,newTaskName);
    this.tps.addTransaction(transaction);
  }


  changeDueDate = (toDoListItemIDToBeChanged, newDueDate) => {
    if (newDueDate === ""){
      newDueDate = "No Date";
    }
    let currentListId = this.state.currentList.id;
    let updatedToDoListslist = this.state.currentList.items.map((listItem) =>{
      if (listItem.id === toDoListItemIDToBeChanged){
        listItem.due_date = newDueDate;
        return listItem;
      }
      else 
        return listItem;
    });
    let updatedToDoLists = this.state.toDoLists.map((toDoList) =>{
      if (toDoList.id === currentListId){
        toDoList.items = updatedToDoListslist; 
        return toDoList;
      }
      else 
        return toDoList;
    });
    this.setState({
      toDoLists: updatedToDoLists
    }, this.afterToDoListsChangeComplete);
  }

  
  registerChangeDueDate = (toDoListItemIDToBeChanged, newDueDate) => {
    let toDoListItemToBeRemoved = this.state.currentList.items.find(listItem => listItem.id === toDoListItemIDToBeChanged);
    if ((toDoListItemToBeRemoved.due_date === "No Date" && newDueDate ==="" ) || (toDoListItemToBeRemoved.due_date === newDueDate)){
      return
    }
    let transaction = new AddChangeDueDate_Transaction(this,toDoListItemIDToBeChanged,toDoListItemToBeRemoved.due_date,newDueDate);
    this.tps.addTransaction(transaction);
  }



  changeStatus= (toDoListItemIDToBeChanged, newStatus) => {
    let currentListId = this.state.currentList.id;
    let updatedToDoListslist = this.state.currentList.items.map((listItem) =>{
      if (listItem.id === toDoListItemIDToBeChanged){
        listItem.status = newStatus;
        return listItem;
      }
      else 
        return listItem;
    });
    let updatedToDoLists = this.state.toDoLists.map((toDoList) =>{
      if (toDoList.id === currentListId){
        toDoList.items = updatedToDoListslist; 
        return toDoList;
      }
      else 
        return toDoList;
    });
    this.setState({
      toDoLists: updatedToDoLists
    }, this.afterToDoListsChangeComplete);
  }

  registerChangeStatus = (toDoListItemIDToBeChanged, newStatus) => {
    let toDoListItemToBeRemoved = this.state.currentList.items.find(listItem => listItem.id === toDoListItemIDToBeChanged);
    if (toDoListItemToBeRemoved.status === newStatus){
      return
    }
    let transaction = new AddChangeStatus_Transaction(this,toDoListItemIDToBeChanged,toDoListItemToBeRemoved.status,newStatus);
    this.tps.addTransaction(transaction);
  }

  registerDeleteListItem = (toDoListItemIDToBeRemoved) => {
    let toDoListItemToBeRemoved = this.state.currentList.items.find(listItem => listItem.id === toDoListItemIDToBeRemoved);
    let initIndex = this.state.currentList.items.indexOf(toDoListItemToBeRemoved);
    let transaction = new AddDeleteListItem_Transaction(this,initIndex,toDoListItemToBeRemoved);
    this.tps.addTransaction(transaction);
  }

  addItemAtIndex(listItemToAdd, index) {
    let currentListId = this.state.currentList.id;
    let updatedToDoLists = this.state.toDoLists.map((toDoList) =>{
      if (toDoList.id === currentListId){
        toDoList.items.splice(index,0,listItemToAdd) 
        return toDoList;
      }
      else 
        return toDoList;
    });
    this.setState({
      toDoLists: updatedToDoLists
    }, this.afterToDoListsChangeComplete);

  }

  moveItem(fromIndex, toIndex) {
    let currentListId = this.state.currentList.id;
    let updatedToDoLists = this.state.toDoLists.map((toDoList) =>{
      if (toDoList.id === currentListId){
        toDoList.items.splice(toIndex, 0, toDoList.items.splice(fromIndex, 1)[0]);
        return toDoList;
      }
      else {
        return toDoList;
      }
    })
      this.setState({
          toDoLists: updatedToDoLists
        }, this.afterToDoListsChangeComplete);
      }


  registerMoveListItemDown =(toDoListItemIdToBeMoved) => {
    let toDoListItemToBeMoved = this.state.currentList.items.find(listItem => listItem.id === toDoListItemIdToBeMoved);
    let foundIndex = this.state.currentList.items.indexOf(toDoListItemToBeMoved);
    if (foundIndex === this.state.currentList.items.length - 1){
      return
    }
    let transaction = new AddMoveListItem_Transaction(this,foundIndex,foundIndex + 1);
    this.tps.addTransaction(transaction);        
  }

  registerMoveListItemUp =(toDoListItemIdToBeMoved) => {
    let toDoListItemToBeMoved = this.state.currentList.items.find(listItem => listItem.id === toDoListItemIdToBeMoved);
    let foundIndex = this.state.currentList.items.indexOf(toDoListItemToBeMoved);
    if (foundIndex === 0){
      return
    }
    let transaction = new AddMoveListItem_Transaction(this,foundIndex,foundIndex - 1);
    this.tps.addTransaction(transaction);        
  }

  changeListName(listIDToBeRenamed){
  }


  undo = () =>{
    if (this.tps.hasTransactionToUndo()) {
        this.tps.undoTransaction();
        // if (!this.state.tps.hasTransactionToUndo()) {
        //     this.view.disableButton("undo-button");
        // }
        // this.view.enableButton("redo-button");
    }
} 

redo = () =>{
    if (this.tps.hasTransactionToRedo()) {
        this.tps.doTransaction();
        // if (!this.tps.hasTransactionToRedo()) {
        //     this.view.disableButton("redo-button");
        // }
        // this.view.enableButton("undo-button");
    }
}



  // THIS IS A CALLBACK FUNCTION FOR AFTER AN EDIT TO A LIST
  afterToDoListsChangeComplete = () => {
    console.log("App updated currentToDoList: " + this.state.currentList);

    // WILL THIS WORK? @todo
    let toDoListsString = JSON.stringify(this.state.toDoLists);
    localStorage.setItem("recentLists", toDoListsString);
  }

  render() {
    let items = this.state.currentList.items;
    // console.log(items);
    return (
      <div id="root">
        <Navbar />
        <LeftSidebar 
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
          redoCallback = {this.redo}
          undoCallback = {this.undo}
          changeListNameCallback = {this.changeListName}
        />
        <Workspace 
          toDoListItems={items}
          registerAddNewItemListTransactionCallback={this.registerAddNewItemListTransaction}
          registerChangeTaskNameCallback = {this.registerChangeTaskName}
          registerChangeDueDateCallback = {this.registerChangeDueDate}
          registerChangeStatusCallback = {this.registerChangeStatus}
          registerDeleteListItemCallback = {this.registerDeleteListItem}
          registerMoveListItemUpCallback = {this.registerMoveListItemUp}
          registerMoveListItemDownCallback = {this.registerMoveListItemDown}
        />
      </div>
    );
  }
}

export default App;