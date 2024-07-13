import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as toDoAction from '../actions/toDoActions';

class Todo extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            name: ''
        }
    }

    handleChange(e) {
        this.setState({
            name: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        let todo = {
            name: this.state.name
        }
        this.setState({
            name: ''
        });
        this.props.createToDo(todo);
    }

    // View ToDo List
    listView(data, index) {
        return (
            <div className="row">
                <div className="col-md-10">
                    <li key={index} className="list-group-item clearfix">
                        {data.name}
                    </li>
                </div>
                <div className="col-md-2">
                    <button onClick={(e) => this.deleteToDo(e, index)} className="btn btn-danger">
                        Remove
                    </button>
                </div>
            </div>
        )
    };

    deleteToDo(e, index) {
        e.preventDefault();
        this.props.deleteToDo(index);
    }

    // Render the Form
    render() {
        let name;
        return (
            <div>
                <h1>Simple To-Do Application</h1>
                <hr />
                <div>
                    <h3>Add Task </h3>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" onChange={this.handleChange} className="form-control" value={this.state.name} /><br />
                        <input type="submit" className="btn btn-success" value="ADD" />
                    </form>
                    <hr />
                    {<ul className="list-group">
                        {this.props.todo.map((todo, i) => this.listView(todo, i))}
                    </ul>}
                </div>
            </div>
        )
    }
}

// Manage Props
const mapStateToProps = (state, ownProps) => {
    return {
        todo: state.todo
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        createToDo: todo => dispatch(toDoAction.createToDo(todo)),
        deleteToDo: index => dispatch(toDoAction.deleteToDo(index))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Todo);