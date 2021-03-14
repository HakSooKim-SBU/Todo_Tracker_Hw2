// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import ToDoItem from './ToDoItem'

import AddBox from '@material-ui/icons/AddBox';
import Delete from '@material-ui/icons/Delete';
import Close from '@material-ui/icons/Close';

class Workspace extends Component {
    constructor(props) {
        super(props);
    }


    handleAddNewToDoListItem = () => {
        this.props.registerAddNewItemListTransactionCallback();
    }

    handleDeleteListButton = () => {
        this.props.confirmationClickHandleCallback();
    }

    handleCloseListbutton = () =>{
        this.props.cancelBeingEditedCallback();
    }
    
    render() {
        let isBeingEdited = this.props.checkIfBeingEditedCallback();
        return (
            <div id="workspace">
                <div id="todo-list-header-card">
                    <div id="task-col-header" className="todo-button listItem-header-col">Task</div>
                    <div id="date-col-header" className="todo-button listItem-header-col">Due Date</div>
                    <div id="status-col-header" className="todo-button listItem-header-col">Status</div>
                    <div className="list-controls-col listItem-header-col" display="flex" flexDirection="row" flexWrap="nowrap">
                        {( !isBeingEdited ? <div className = "width-60" ></div> : <div className = "width-40"></div>)} 
                        <AddBox id="add-item-button" className={"list-item-control material-icons todo-button"  + ( !isBeingEdited ? " disable_button " : "") }
                            onClick={this.handleAddNewToDoListItem} />
                        <Delete id="delete-list-button" className={"list-item-control material-icons todo-button"  + ( !isBeingEdited ? " disable_button margin-left-5 " : " margin-left-10") }
                            onClick={this.handleDeleteListButton} />
                        <Close id="close-list-button" className={"list-item-control material-icons todo-button"  + ( !isBeingEdited ? " disable_button margin-left-5 " : " margin-left-10") }
                            onClick={this.handleCloseListbutton} />
                    </div>
                </div>
                <div id="todo-list-items-div">
                    {
                        this.props.toDoListItems.map((toDoListItem) => (
                        <ToDoItem
                            key={toDoListItem.id}
                            toDoListItem={toDoListItem}     // PASS THE ITEM TO THE CHILDREN
                            registerChangeTaskNameCallback = {this.props.registerChangeTaskNameCallback}
                            registerChangeDueDateCallback = {this.props.registerChangeDueDateCallback}
                            registerChangeStatusCallback = {this.props.registerChangeStatusCallback}
                            registerDeleteListItemCallback = {this.props.registerDeleteListItemCallback}
                            registerMoveListItemUpCallback = {this.props.registerMoveListItemUpCallback}
                            registerMoveListItemDownCallback = {this.props.registerMoveListItemDownCallback}
                            lastListItemId = {this.props.toDoListItems[this.props.toDoListItems.length - 1].id}
                            firstListItemId = {this.props.toDoListItems[0].id}

                        />))
                    }
                </div>
                <br />
            </div>
        );
    }
}

export default Workspace;