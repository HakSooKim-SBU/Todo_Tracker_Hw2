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

    render() {
        // DISPLAY WHERE WE ARE
        // console.log("\t\t\tListLink render");
        if(this.state.hasCurrentListDoubleClicked){
            return(
                <input type="text" ref={input => input && input.focus()} onBlur={this.renameCurrentList}
                    defaultValue={this.props.toDoList.name}
             />                 
            )
        }
        else{
        return (
            <div className='todo-list-button' onClick={this.handleLoadList} onDoubleClick= {this.handleRenameList} >
                {this.props.toDoList.name}<br />
            </div>
            )
        }
    }
}


export default ListLink;