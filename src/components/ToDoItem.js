// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Close from '@material-ui/icons/Close';
import { ListItemAvatar } from '@material-ui/core';

class ToDoItem extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " constructor");

        this.state = {hasTaskClicked: false,
                    hasDueDateClicked: false,
                    hasStatusClicked: false
                                            };

        this.taskHandleClick = this.taskHandleClick.bind(this);
        this.dueDateHandleClick = this.dueDateHandleClick.bind(this);
        this.statusHandleClick = this.statusHandleClick.bind(this);
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " did mount");
        }


    taskHandleClick() {   
        this.setState(state => ({  hasTaskClicked: !state.hasTaskClicked    }));  
    }

    dueDateHandleClick() {    
        this.setState(state => ({  hasDueDateClicked: !state.hasDueDateClicked    }));  
    }

    statusHandleClick() {    
        this.setState(state => ({  hasStatusClicked: !state.hasStatusClicked    }));  
    }

    removeListItem = (event) =>{
        this.props.registerDeleteListItemCallback(this.props.toDoListItem.id)
    }

    changeTask = (event) => {
       let newTaskName = event.target.value;
       this.props.registerChangeTaskNameCallback(this.props.toDoListItem.id,newTaskName);
       this.taskHandleClick();
    }

    changeDueDate = (event) =>{
       let newDueDate = event.target.value;
       console.log(newDueDate);
       this.props.registerChangeDueDateCallback(this.props.toDoListItem.id,newDueDate);
       this.dueDateHandleClick()
    }

    changeStatus = (event) =>{
        let newStatus = event.target.value;
        console.log(newStatus);
        this.props.registerChangeStatusCallback(this.props.toDoListItem.id,newStatus);
        this.statusHandleClick() 
     }
 
     moveUpListItem = (event) =>{
        this.props.registerMoveListItemUpCallback(this.props.toDoListItem.id)
     }

     moveDownListItem = (event) =>{
        this.props.registerMoveListItemDownCallback(this.props.toDoListItem.id)
     }

     isLastItem = () =>{
         return this.props.toDoListItem.id === this.props.lastListItemId
     }

     isFirstItem = () =>{
        return this.props.toDoListItem.id === this.props.firstListItemId
    }

    render() {
        // DISPLAY WHERE WE ARE
        // console.log("\t\t\tToDoItem render");
        let listItem = this.props.toDoListItem;
        let statusType = "status-complete";
        if (listItem.status === "incomplete"){
            statusType = "status-incomplete";
        }
        let ifLast = this.isLastItem()
        let ifFirst = this.isFirstItem()
        console.log(ifLast + "!!")
        console.log(ifFirst + "!!")



        return (
            <div id={'todo-list-item-' + listItem.id} className='list-item-card'>
            {this.state.hasTaskClicked
            ? <input type="text" className='input-col' ref={input => input && input.focus()} onBlur={this.changeTask } defaultValue = {listItem.description}/>
            : <div onClick={this.taskHandleClick} className='listItem-col'>{listItem.description}</div>
            }  
            {this.state.hasDueDateClicked
            ? <input type="date" ref={input => input && input.focus()} className='input-col' onBlur={this.changeDueDate}
                defaultValue={listItem.due_date}/>
            : <div onClick={this.dueDateHandleClick} className='listItem-col'>{listItem.due_date}</div>
            } 
            {this.state.hasStatusClicked
            ? <select defaultValue={listItem.status} onBlur={this.changeStatus}
            // ref={select => select.focus()} className='input-col'  >

            ref={select => select && select.focus()} className='input-col'  >
            <option value = 'complete'> complete  </option>
            <option value = 'incomplete'> incomplete  </option>
            </select> 
            : <div onClick={this.statusHandleClick} className= {'listItem-col ' + statusType}>{listItem.status}</div>
            } 
                <div className=' test-4-col'></div>
                <div className=' list-controls-col'>
                    <KeyboardArrowUp className={'list-item-control todo-button ' + ( ifFirst ? " disable_button " : "")}
                        onClick = {this.moveUpListItem} />
                    <KeyboardArrowDown className={'list-item-control todo-button margin-left-30' + ( ifLast ? " disable_button " : "")}
                        onClick = {this.moveDownListItem} />
                    <Close className='list-item-control todo-button margin-left-30'  
                        onClick={this.removeListItem}/>
                    <div className='list-item-control'></div>
                    <div className='list-item-control'></div>
                </div>
            </div>
        )
    }
}

export default ToDoItem;