import React, { Component } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import Alert from './Alert';
import ListForm from './ListForm';
import Lists from './Lists';

export default class ListsContainer extends Component {
  static propTypes = {
    lists: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    ).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      lists: props.lists,
      name: '',
      errors: '',
      success: '',
    };
  }

  handleUserInput = (obj) => {
    this.setState(obj);
  }

  handleFormSubmit = () => {
    const list = { name: this.state.name };
    $.post('/lists', { list })
      .done(data => this.addNewList(data))
      .fail((response) => {
        const responseJSON = JSON.parse(response.responseText);
        const responseTextKeys = Object.keys(responseJSON);
        const errors = responseTextKeys.map(key => `${key} ${responseJSON[key]}`);
        this.setState({ errors: errors.join(' and ') });
      });
  }

  addNewList = (list) => {
    const lists = update(this.state.lists, { $push: [list] });
    this.setState({
      lists: lists.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      name: '',
      success: 'List successfully added.',
    });
  }

  handleDelete = (listId) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `/lists/${listId}`,
        type: 'DELETE',
        success: () => this.removeList(listId),
      });
    } else {
      return false;
    }
    return '';
  }

  removeList = (listId) => {
    const lists = this.state.lists.filter(list => list.id !== listId);
    this.setState({ lists });
  }

  alert() {
    if (this.state.errors.length > 0) {
      return (
        <Alert text={this.state.errors} alert_class="danger" />
      );
    } else if (this.state.success.length > 0) {
      return (
        <Alert text={this.state.success} alert_class="success" />
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        { this.alert() }
        <ListForm
          name={this.state.name}
          onUserInput={this.handleUserInput}
          onFormSubmit={this.handleFormSubmit}
        />
        <hr />
        <Lists
          lists={this.state.lists}
          onListDelete={this.handleDelete}
        />
      </div>
    );
  }
}
