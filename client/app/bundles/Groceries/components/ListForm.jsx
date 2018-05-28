import React, { Component } from 'react';
import PropTypes from 'prop-types';

import listIconClass from '../utils/list_icon';

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
    this.setState({ listName: '', listType: 'GroceryList' });
  }

  listTypeOptions = () => {
    const listTypes = [
      { name: 'BookList', id: 1 },
      { name: 'GroceryList', id: 2 },
      { name: 'MusicList', id: 3 },
      { name: 'ToDoList', id: 4 },
    ];
    const options = listTypes.map(listType => (
      <div className="form-check form-check-inline col" key={listType.id}>
        <input
          id={`listType-${listType.name}`}
          type="radio"
          name="listType"
          value={listType.name}
          checked={this.state.listType === listType.name}
          onChange={this.handleChange}
          className="form-check-input"
        />
        <label className="form-check-label ml-2" htmlFor={`listType-${listType.name}`}>
          <h3 className="mb-0">
            <i className={`fa ${listIconClass(listType.name)} text-primary`} />
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
            value={this.state.listName}
            onChange={this.handleChange}
            placeholder="New list name"
          />
        </div>
        <div className="form-row mb-3">
          {this.listTypeOptions()}
        </div>
        <input type="submit" value="Create List" className="btn btn-success btn-block action-button" />
      </form>
    );
  }
}
