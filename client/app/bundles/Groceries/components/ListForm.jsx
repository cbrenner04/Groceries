import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListTypeOptions from './ListTypeOptions';

export default class ListForm extends Component {
  static propTypes = {
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
    const { name } = event.target;
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

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="listName">Name</label>
          <input
            name="listName"
            type="text"
            className="form-control"
            value={this.state.listName}
            onChange={this.handleChange}
            placeholder="My super cool list"
          />
        </div>
        <ListTypeOptions listType={this.state.listType} changeHandler={this.handleChange} />
        <button type="submit" className="btn btn-success btn-block">
          Create List
        </button>
      </form>
    );
  }
}
