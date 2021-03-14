// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'

class ListLink extends Component {
    constructor(props) {
        super(props);
        this.state = {hasCurrentListDoubleClicked: false,
                        }
        
    
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " constructor");
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " did mount");
    }

    handleLoadList = () => {
        this.props.loadToDoListCallback(this.props.toDoList);
    }


    handleRenameList = () => {
        this.setState(state => ({  hasCurrentListDoubleClicked: !state.hasCurrentListDoubleClicked    }));  
    }

    renameCurrentList = (event) =>{
        let newCurrentListName = event.target.value;
        this.props.changeListNameCallback(this.props.toDoList.id,newCurrentListName);
        this.handleRenameList();
    }

    isCurrentList = () => {
        return this.props.currentListId === this.props.toDoList.id
    }
    render() {
        // DISPLAY WHERE WE ARE
        // console.log("\t\t\tListLink render");
        let ifCurrentList = this.isCurrentList();
        if(this.state.hasCurrentListDoubleClicked){
            return(
                <input className = "list-edit-input-col" type="text" ref={input => input && input.focus()} onBlur={this.renameCurrentList}
                    defaultValue={this.props.toDoList.name}
             />                 
            )
        }
        else{
        return (
            <div id = {ifCurrentList ? "currentList" : ""} className='todo-list-button' onClick={this.handleLoadList} onDoubleClick= {this.handleRenameList} >
                {this.props.toDoList.name}<br />
            </div>
            )
        }
    }
}


export default ListLink;