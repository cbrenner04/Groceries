import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListTypeOptions from './ListTypeOptions';

const defaultListType = 'GroceryList';

export default class ListForm extends Component {
  static propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      list: '',
      listType: defaultListType,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    const obj = {};
    obj[name] = value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onFormSubmit({
      name: this.state.list,
      type: this.state.listType,
    });
    this.setState({ list: '', listType: defaultListType });
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="list">Name</label>
          <input
            id="list"
            name="list"
            type="text"
            className="form-control"
            value={this.state.list}
            onChange={this.handleChange}
            placeholder="My super cool list"
          />
        </div>
        <ListTypeOptions listType={this.state.listType} changeHandler={this.handleChange} />
        <button type="submit" className="btn btn-success btn-block">Create List</button>
      </form>
    );
  }
}
