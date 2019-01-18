import React, { Component } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import Alert from './Alert';
import ListForm from './ListForm';
import Lists from './Lists';

export default class ListsContainer extends Component {
  static propTypes = {
    accepted_lists: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired),
    not_accepted_lists: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired),
  }

  static defaultProps = {
    accepted_lists: [],
    not_accepted_lists: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      acceptedLists: props.accepted_lists,
      notAcceptedLists: props.not_accepted_lists,
      errors: '',
      success: '',
      completedLists: [],
      nonCompletedLists: [],
    };
  }

  componentWillMount() {
    $.ajax({
      type: 'GET',
      url: '/lists/',
      dataType: 'JSON',
    }).done((data) => {
      const acceptedLists = data.accepted_lists;
      const notAcceptedLists = data.not_accepted_lists;
      const completedLists =
        acceptedLists.filter(list => list.completed && !list.refreshed);
      const nonCompletedLists = acceptedLists.filter(list => !list.completed);
      this.setState({
        acceptedLists,
        notAcceptedLists,
        completedLists,
        nonCompletedLists,
      });
    });
  }

  handleFormSubmit = (list) => {
    this.setState({
      errors: '',
      success: '',
    });
    $.post('/lists', { list })
      .done(data => this.addNewList(data))
      .fail((response) => {
        const responseJSON = JSON.parse(response.responseText);
        const responseTextKeys = Object.keys(responseJSON);
        const errors = responseTextKeys.map(key => `${key} ${responseJSON[key].join(' and ')}`);
        this.setState({ errors: errors.join(' and ') });
      });
  }

  sortLists = lists =>
    lists.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  addNewList = (list) => {
    const lists = update(this.state.acceptedLists, { $push: [list] });
    const nonCompletedLists = update(this.state.nonCompletedLists, { $push: [list] });
    this.setState({
      acceptedLists: this.sortLists(lists),
      success: 'List successfully added.',
      nonCompletedLists: this.sortLists(nonCompletedLists),
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

  handleCompletion = (list) => {
    const theList = list;
    theList.completed = true;
    $.ajax({
      url: `/lists/${theList.id}`,
      type: 'PUT',
      data: 'list%5Bcompleted%5D=true',
      success: () => {
        const nonCompletedLists = this.state.nonCompletedLists.filter(nonList => nonList.id !== theList.id);
        let completedLists = update(this.state.completedLists, { $push: [theList] });
        completedLists = this.sortLists(completedLists);
        this.setState({ nonCompletedLists, completedLists });
      },
    });
  }

  removeList = (listId) => {
    const acceptedLists = this.state.acceptedLists.filter(list => list.id !== listId);
    this.setState({ acceptedLists });
  }

  handleAccept = (list) => {
    this.removeListFromUnaccepted(list.id);
    this.acceptList(list);
  }

  handleReject = (list) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `/lists/${list.id}/users_lists/${list.users_list_id}`,
        type: 'PATCH',
        data: 'users_list%5Bhas_accepted%5D=false',
        success: () => {
          this.removeListFromUnaccepted(list.id);
        },
      });
    }
  }

  acceptList = (list) => {
    $.ajax({
      url: `/lists/${list.id}/users_lists/${list.users_list_id}`,
      type: 'PATCH',
      data: 'users_list%5Bhas_accepted%5D=true',
      success: () => {
        this.addNewList(list);
      },
    });
  }

  removeListFromUnaccepted = (listId) => {
    const notAcceptedLists = this.state.notAcceptedLists.filter(list => list.id !== listId);
    this.setState({ notAcceptedLists });
  }

  handleRefresh = (list) => {
    $.ajax({
      url: `/lists/${list.id}/refresh_list`,
      type: 'POST',
      success: () => {
        const completedLists = this.state.completedLists.filter(compList => compList.id !== list.id);
        this.setState({ completedLists });
      },
    });
  }

  render() {
    return (
      <div>
        <Alert errors={this.state.errors} success={this.state.success} />
        <h1>Lists</h1>
        <ListForm onFormSubmit={this.handleFormSubmit} />
        <hr />
        <Lists
          onListDelete={this.handleDelete}
          onListCompletion={this.handleCompletion}
          unacceptedLists={this.state.notAcceptedLists}
          completedLists={this.state.completedLists}
          nonCompletedLists={this.state.nonCompletedLists}
          onListRefresh={this.handleRefresh}
          onAccept={this.handleAccept}
          onReject={this.handleReject}
        />
      </div>
    );
  }
}
