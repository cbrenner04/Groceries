import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ListForm extends Component {
  static propTypes ={
    onFormSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      listName: '',
      listType: 'GroceryList',
    };
  }

  handleChange = (event) => {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onFormSubmit({
      name: this.state.listName,
      type: this.state.listType,
    });
    this.setState({ name: '', listType: 'GroceryList' });
  }

  listClass = listType => (
    {
      BookList: 'fa-book',
      GroceryList: 'fa-shopping-bag',
      MusicList: 'fa-music',
      ToDoList: 'fa-list',
    }[listType]
  )

  listTypeOptions = () => {
    const listTypes = [
      { name: 'BookList', id: 1 },
      { name: 'GroceryList', id: 2 },
      { name: 'MusicList', id: 3 },
      { name: 'ToDoList', id: 4 },
    ];
    const options = listTypes.map(listType => (
      <div
        className="form-check form-check-inline col-3"
        style={{ marginLeft: 0 }}
        key={listType.id}
      >
        <label
          className="form-check-label"
          htmlFor={`listType-${listType.name}`}
        >
          <h3>
            <input
              id={`listType-${listType.name}`}
              type="radio"
              name="listType"
              value={listType.name}
              checked={this.state.listType === listType.name}
              onChange={this.handleChange}
              className="form-check-input"
            />
            <i className={`fa ${this.listClass(listType.name)} text-primary`} />
          </h3>
        </label>
      </div>
    ));
    return options;
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input
            name="listName"
            type="text"
            className="form-control"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="New list name"
          />
        </div>
        <div className="form-group">
          {this.listTypeOptions()}
        </div>
        <input
          type="submit"
          value="Create List"
          className="btn btn-success btn-block action-button"
        />
      </form>
    );
  }
}
