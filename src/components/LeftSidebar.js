// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import ListLink from './ListLink'
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import AddBox from '@material-ui/icons/AddBox';
import { AlternateEmail } from '@material-ui/icons';

class LeftSidebar extends Component {
    constructor(props) {
        super(props);
        


    }

    // Document.event 

    componentDidMount = () => {

        // var map = {}; // You could also use an array
        // onkeydown = onkeyup = function(e){
        //     e = e ; // to deal with IE
        //     map[e.keyCode] = e.type == 'keydown';
        //         if (map[65] && map[67]){
        //         alert("hello");
        //         }
        // }

    //     const keysPressed = {};
    //     console.log("hello");

    //     document.addEventListener('keydown', e => keysPressed[e.keyCode] = true)
    //     document.addEventListener('keyup', e => keysPressed[e.keyCode] = false)
    //     document.addEventListener('keydown', (event) =>{
            
    //         console.log("hi");

    //         if ((keysPressed[65] && keysPressed[67]))
    //         alert("hello");
    //     }
        
    //     )
    }

        







    
    handleAddNewList = () => {
        this.props.addNewListCallback();
    }

    handleRedo = () =>{
        this.props.redoCallback();
    }

    handleUndo = () =>{
        this.props.undoCallback();
    }

    render() {
        let isBeingEdited = this.props.checkIfBeingEditedCallback();
        console.log(isBeingEdited);
        return (
            <div id="left-sidebar">
                <div id="left-sidebar-header" class="section-header">
                    <span class="left-sidebar-header-text todo-button">Todolists</span>
                    <span class="left-sidebar-controls " id="add-undo-redo-box">
                        <AddBox 
                            id="add-list-button"
                            className={"material-icons todo-button " + ( isBeingEdited ? " disable_button " : "") }
                            onClick={this.handleAddNewList}   />
                        <Undo 
                            id="undo-button" 
                            className={"list-item-control material-icons todo-button" + ( !this.props.tps.hasTransactionToUndo() ? ' disable_button' : '') }
                            onClick={this.handleUndo} />
                        <Redo 
                            id="redo-button" 
                            className={"list-item-control material-icons todo-button" + ( !this.props.tps.hasTransactionToRedo() ? ' disable_button' : '') }
                            onClick={this.handleRedo} />
                            
                    </span>
                </div>
                <div id="todo-lists-list">
                {
                    this.props.toDoLists.map((toDoList) => (
                        <ListLink
                            changeListNameCallback = {this.props.changeListNameCallback}
                            key={toDoList.id}
                            toDoList={toDoList}                                // PASS THE LIST TO THE CHILDREN
                            loadToDoListCallback={this.props.loadToDoListCallback} />  // PASS THE CALLBACK TO THE CHILDREN
                    ))
                }
                </div>

            </div>
        );
    }
}

export default LeftSidebar;