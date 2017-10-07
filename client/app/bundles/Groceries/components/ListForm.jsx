import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ListForm extends Component {
  static propTypes ={
    listType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onUserInput: PropTypes.func.isRequired,
  }

  handleChange = (event) => {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.props.onUserInput(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onFormSubmit();
  }

  listClass(listType) {
    return {
      BookList: 'fa-book',
      GroceryList: 'fa-shopping-bag',
      MusicList: 'fa-music',
      ToDoList: 'fa-list'
    }[listType];
  }

  listTypeOptions() {
      const listTypes = ['BookList', 'GroceryList', 'MusicList', 'ToDoList'];
      const options = listTypes.map((listType, index) => {
        return (
          <div className="form-check form-check-inline" key={index}>
            <label className="form-check-label">
              <h3>
                <input
                  type="radio"
                  name="listType"
                  value={listType}
                  checked={this.props.listType === listType}
                  onChange={this.handleChange}
                  className="form-check-input"
                />
                <i className={`fa ${this.listClass(listType)} text-primary`} />
              </h3>
            </label>
          </div>
        );
      });
      return options;
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input
            name="name"
            className="form-control"
            value={this.props.name}
            onChange={this.handleChange}
            placeholder="New list name"
          />
        </div>
        <div className="form-group" style={{ paddingLeft: '0.4rem' }}>
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
