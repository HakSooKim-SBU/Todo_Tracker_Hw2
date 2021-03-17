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
        this.state = ({keyBoardPressed: false});
        }

    componentDidMount = () => {
        console.log("hello");

        document.addEventListener('keydown', event => {
            if((event.key === "z" || event.key ==="Z") && event.ctrlKey){
                this.handleUndo();
                this.setState({keyBoardPressed: !this.state.keyBoardPressed});
            }
            else if((event.key === "y" || event.key ==="Y") && event.ctrlKey){
                this.handleRedo();
                this.setState({keyBoardPressed: !this.state.keyBoardPressed});
            }
        })
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

    checkTransactionToUndo = () =>{
        console.log(!this.props.tps.hasTransactionToUndo())
        return this.props.tps.hasTransactionToUndo()
    }

    checkTransactionToRedo = () =>{
        return this.props.tps.hasTransactionToRedo()
    }


    render() {
        let isBeingEdited = this.props.checkIfBeingEditedCallback();
        let hasTransactionToUndo =  this.checkTransactionToUndo();
        let hasTransactionToRedo =  this.checkTransactionToRedo();
        console.log(hasTransactionToUndo + "??");

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
                            className={"list-item-control material-icons todo-button" + ( !hasTransactionToUndo ? ' disable_button' : '') }
                            onClick={this.handleUndo} />
                        <Redo 
                             id="redo-button" 
                            className={"list-item-control material-icons todo-button" + ( !hasTransactionToRedo ? ' disable_button' : '') }
                            onClick={this.handleRedo} />
                            
                    </span>
                </div>
                <div id="todo-lists-list">
                {
                    this.props.toDoLists.map((toDoList) => (
                        <ListLink
                            currentListId = {this.props.currentListId}
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