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
      tps : tps,
      toDoLists: recentLists,
      currentList: {items: []},
      nextListId: highListId+1,
      nextListItemId: highListItemId+1,
      useVerboseFeedback: true
    }
  }

  // WILL LOAD THE SELECTED LIST
  loadToDoList = (toDoList) => {
    console.log("loading " + toDoList);

    // MAKE SURE toDoList IS AT THE TOP OF THE STACK BY REMOVING THEN PREPENDING
    const nextLists = this.state.toDoLists.filter(testList =>
      testList.id !== toDoList.id
    );
    nextLists.unshift(toDoList);

    this.setState({
      toDoLists: nextLists,
      currentList: toDoList
    });
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
    let copyOfTps = this.state.tps;
    copyOfTps.addTransaction(transaction);

    this.setState({
      tps:copyOfTps
    })
    
    
  }

  addNewToDoListItem = () => {
    let copyOfToDoLists = this.state.toDoLists;
    let indexOfListToUpdate = copyOfToDoLists.indexOf(this.state.currentList);
    let listToUpdate = copyOfToDoLists[indexOfListToUpdate];
    let newListItem = this.makeNewToDoListItem()
    listToUpdate.items.push(newListItem);

    
    copyOfToDoLists[indexOfListToUpdate] = listToUpdate;

    this.setState({
      toDoLists: copyOfToDoLists,
      nextListItemId: this.state.nextListItemId + 1
    });
    return newListItem
  }
//
  makeNewToDoListItem = () =>  {
    let newToDoListItem = {
      id: this.state.nextListItemId,
      description: "No Description",
      due_date: "No Date",
      status: "incomplete"
    };
    return newToDoListItem;
  }

  registerChangeTaskName = (toDoListItemIDToBeChanged, newTaskName) => {
    let indexOfListItemToBeChanged = this.findIndexOfListItemWithListItemIDInCurrentList(toDoListItemIDToBeChanged);
    let toDoListItemToBeRemoved = this.state.currentList.items[indexOfListItemToBeChanged];
    let transaction = new AddChangeTaskName_Transaction(this,toDoListItemIDToBeChanged,toDoListItemToBeRemoved.description,newTaskName);
    let copyOfTps = this.state.tps;
    copyOfTps.addTransaction(transaction);
    this.setState({
      tps:copyOfTps
    })
  }

  changeTaskName = (toDoListItemIDToBeChanged, newTaskName) => {
    let copyOfToDoLists = this.state.toDoLists;
    let indexOfListToUpdate = copyOfToDoLists.indexOf(this.state.currentList);
    let listToUpdate = copyOfToDoLists[indexOfListToUpdate];
    let indexOfListItemToBeChanged = this.findIndexOfListItemWithListItemIDInCurrentList(toDoListItemIDToBeChanged);
    listToUpdate.items[indexOfListItemToBeChanged] = {
      id: listToUpdate.items[indexOfListItemToBeChanged].id,
      description: newTaskName,
      due_date: listToUpdate.items[indexOfListItemToBeChanged].due_date,
      status: listToUpdate.items[indexOfListItemToBeChanged].status
    }
    copyOfToDoLists[indexOfListToUpdate] = listToUpdate;
    this.setState({
      toDoLists: copyOfToDoLists,
    });

  }

  registerChangeDueDate = (toDoListItemIDToBeChanged, newDueDate) => {
    let indexOfListItemToBeChanged = this.findIndexOfListItemWithListItemIDInCurrentList(toDoListItemIDToBeChanged);
    let toDoListItemToBeRemoved = this.state.currentList.items[indexOfListItemToBeChanged];
    let transaction = new AddChangeDueDate_Transaction(this,toDoListItemIDToBeChanged,toDoListItemToBeRemoved.due_date,newDueDate);
    let copyOfTps = this.state.tps;
    copyOfTps.addTransaction(transaction);
    this.setState({
      tps:copyOfTps
    })
  }

  changeDueDate = (toDoListItemIDToBeChanged, newDueDate) => {
    if (newDueDate === ""){
      newDueDate = "No Date";
    }
    let copyOfToDoLists = this.state.toDoLists;
    let indexOfListToUpdate = copyOfToDoLists.indexOf(this.state.currentList);
    let listToUpdate = copyOfToDoLists[indexOfListToUpdate];
    let indexOfListItemToBeChanged = this.findIndexOfListItemWithListItemIDInCurrentList(toDoListItemIDToBeChanged);
    
    listToUpdate.items[indexOfListItemToBeChanged] = {
      id: listToUpdate.items[indexOfListItemToBeChanged].id,
      description: listToUpdate.items[indexOfListItemToBeChanged].description,
      due_date: newDueDate,
      status: listToUpdate.items[indexOfListItemToBeChanged].status
    }
    copyOfToDoLists[indexOfListToUpdate] = listToUpdate;
    this.setState({
      toDoLists: copyOfToDoLists,
    });

  }

  registerChangeStatus = (toDoListItemIDToBeChanged, newStatus) => {

    let indexOfListItemToBeChanged = this.findIndexOfListItemWithListItemIDInCurrentList(toDoListItemIDToBeChanged);
    let toDoListItemToBeRemoved = this.state.currentList.items[indexOfListItemToBeChanged];
    let transaction = new AddChangeStatus_Transaction(this,toDoListItemIDToBeChanged,toDoListItemToBeRemoved.status,newStatus);
    let copyOfTps = this.state.tps;
    copyOfTps.addTransaction(transaction);
    this.setState({
      tps:copyOfTps
    })
  }

  changeStatus= (toDoListItemIDToBeChanged, newStatus) => {
    let copyOfToDoLists = this.state.toDoLists;
    let indexOfListToUpdate = copyOfToDoLists.indexOf(this.state.currentList);
    let listToUpdate = copyOfToDoLists[indexOfListToUpdate];
    let indexOfListItemToBeChanged = this.findIndexOfListItemWithListItemIDInCurrentList(toDoListItemIDToBeChanged);
    
    listToUpdate.items[indexOfListItemToBeChanged] = {
      id: listToUpdate.items[indexOfListItemToBeChanged].id,
      description: listToUpdate.items[indexOfListItemToBeChanged].description,
      due_date: listToUpdate.items[indexOfListItemToBeChanged].due_date,
      status: newStatus
    }
    copyOfToDoLists[indexOfListToUpdate] = listToUpdate;
    this.setState({
      toDoLists: copyOfToDoLists,
    });

  }

  removeListItem =(toDoListItemIDToBeRemoved) => {
    let copyOfToDoLists = this.state.toDoLists;
    let indexOfListToUpdate = copyOfToDoLists.indexOf(this.state.currentList);
    let listToUpdate = copyOfToDoLists[indexOfListToUpdate];
    let indexOfListItemToBeChanged = this.findIndexOfListItemWithListItemIDInCurrentList(toDoListItemIDToBeRemoved);
    let itemToBeRemoved = listToUpdate.items[indexOfListItemToBeChanged];
    listToUpdate.items.splice(indexOfListItemToBeChanged,1);

    copyOfToDoLists[indexOfListToUpdate] = listToUpdate;

    this.setState({
      toDoLists: copyOfToDoLists,
    });
    return itemToBeRemoved
  }

  registerDeleteListItem = (toDoListItemIDToBeRemoved) => {
    let initIndex = this.findIndexOfListItemWithListItemIDInCurrentList(toDoListItemIDToBeRemoved);
    let toDoListItemToBeRemoved = this.state.currentList.items[initIndex];
    let transaction = new AddDeleteListItem_Transaction(this,initIndex,toDoListItemToBeRemoved);
    let copyOfTps = this.state.tps;
    copyOfTps.addTransaction(transaction);
    this.setState({
      tps:copyOfTps
    })
  }

  registerMoveListItemDown =(toDoListItemToBeMoved) => {
    let copyOfToDoLists = this.state.toDoLists;
    let indexOfListToUpdate = copyOfToDoLists.indexOf(this.state.currentList);
    let listToUpdate = copyOfToDoLists[indexOfListToUpdate];
    let foundIndex = this.findIndexOfListItemWithListItemIDInCurrentList(toDoListItemToBeMoved);
    if (foundIndex === listToUpdate.items.length - 1){
      return
    }
    //////
    let transaction = new AddMoveListItem_Transaction(this,foundIndex,foundIndex + 1);
    let copyOfTps = this.state.tps;
    copyOfTps.addTransaction(transaction);

    this.setState({
      tps:copyOfTps
    })
        
  }

  registerMoveListItemUp =(toDoListItemToBeMoved) => {
    let copyOfToDoLists = this.state.toDoLists;
    let indexOfListToUpdate = copyOfToDoLists.indexOf(this.state.currentList);
    let listToUpdate = copyOfToDoLists[indexOfListToUpdate];
    let foundIndex = this.findIndexOfListItemWithListItemIDInCurrentList(toDoListItemToBeMoved);
    if (foundIndex === 0){
      return
    }
    //////
    let transaction = new AddMoveListItem_Transaction(this,foundIndex,foundIndex - 1);
    let copyOfTps = this.state.tps;
    copyOfTps.addTransaction(transaction);

    this.setState({
      tps:copyOfTps
    })
        
  }

  moveItem(fromIndex, toIndex) {

    let copyOfToDoLists = this.state.toDoLists;
    let indexOfListToUpdate = copyOfToDoLists.indexOf(this.state.currentList);
    let listToUpdate = copyOfToDoLists[indexOfListToUpdate];
    listToUpdate.items.splice(toIndex, 0, listToUpdate.items.splice(fromIndex, 1)[0]);
    copyOfToDoLists[indexOfListToUpdate] = listToUpdate;

    this.setState({
      toDoLists: copyOfToDoLists,
    });

}
    
  
addItemAtIndex(listItemToAdd, index) {
  let copyOfToDoLists = this.state.toDoLists;
  let indexOfListToUpdate = copyOfToDoLists.indexOf(this.state.currentList);
  let listToUpdate = copyOfToDoLists[indexOfListToUpdate];
  listToUpdate.items.splice(index, 0, listItemToAdd);
  copyOfToDoLists[indexOfListToUpdate] = listToUpdate;

  this.setState({
    toDoLists: copyOfToDoLists,
  });
  }


  findIndexOfListItemWithListItemIDInCurrentList = (listItemIDtoFind) => {
    for (let i = 0; i < this.state.currentList.items.length; i++) {
      if (this.state.currentList.items[i].id === listItemIDtoFind){
        return i;
      }
    }
  }



  undo = () =>{
    if (this.state.tps.hasTransactionToUndo()) {
        this.state.tps.undoTransaction();
        // if (!this.state.tps.hasTransactionToUndo()) {
        //     this.view.disableButton("undo-button");
        // }
        // this.view.enableButton("redo-button");
    }
    this.setState({
      tps:this.state.tps
    })
} 

redo = () =>{
    if (this.state.tps.hasTransactionToRedo()) {
        this.state.tps.doTransaction();
        // if (!this.tps.hasTransactionToRedo()) {
        //     this.view.disableButton("redo-button");
        // }
        // this.view.enableButton("undo-button");
    }
    this.setState({
      tps:this.state.tps
    })
}






  // THIS IS A CALLBACK FUNCTION FOR AFTER AN EDIT TO A LIST
  afterToDoListsChangeComplete = () => {
    console.log("App updated currentToDoList: " + this.state.currentList);

    // WILL THIS WORK? @todo
    let toDoListsString = JSON.stringify(this.state.toDoLists);
    localStorage.setItem("recent_work", toDoListsString);
  }

  render() {
    let items = this.state.currentList.items;
    console.log(items);
    return (
      <div id="root">
        <Navbar />
        <LeftSidebar 
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
          redoCallback = {this.redo}
          undoCallback = {this.undo}
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