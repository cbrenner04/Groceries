import React, { Component } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import Alert from './Alert';
import ListForm from './ListForm';
import Lists from './Lists';
import UnacceptedLists from './UnacceptedLists';

export default class ListsContainer extends Component {
  static propTypes = {
    accepted_lists: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired,
    ).isRequired,
    not_accepted_lists: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired,
    ).isRequired,
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
    $.post('/lists', { list })
      .done(data => this.addNewList(data))
      .fail((response) => {
        const responseJSON = JSON.parse(response.responseText);
        const responseTextKeys = Object.keys(responseJSON);
        const errors = responseTextKeys
                       .map(key => `${key} ${responseJSON[key].join(' and ')}`);
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
    // eslint doesn't like confirms
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
    $.ajax({
      url: `/lists/${list.id}`,
      type: 'PUT',
      data: 'list%5Bcompleted%5D=true',
      success: () => this.moveListToCompleted(list),
    });
  }

  moveListToCompleted = (list) => {
    const nonCompletedLists =
      this.state.nonCompletedLists.filter(nonList => nonList.id !== list.id);
    let completedLists = update(this.state.completedLists, { $push: [list] });
    completedLists = this.sortLists(completedLists);
    this.setState({ nonCompletedLists, completedLists });
  }

  removeList = (listId) => {
    const acceptedLists =
      this.state.acceptedLists.filter(list => list.id !== listId);
    this.setState({ acceptedLists });
  }

  handleAccept = (list) => {
    this.removeListFromUnaccepted(list.id);
    this.acceptList(list);
  }

  handleReject = (listId) => {
    // eslint doesn't like confirms
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `/lists/${listId}/users_lists/reject_list`,
        type: 'GET',
        success: () => this.removeListFromUnaccepted(listId),
      });
    }
  }

  acceptList = (list) => {
    $.ajax({
      url: `/lists/${list.id}/users_lists/accept_list`,
      type: 'GET',
      success: () => this.addNewList(list),
    });
  }

  removeListFromUnaccepted = (listId) => {
    const notAcceptedLists =
      this.state.notAcceptedLists.filter(list => list.id !== listId);
    this.setState({ notAcceptedLists });
  }

  removeListFromCompleted = (listId) => {
    const completedLists =
      this.state.completedLists.filter(list => list.id !== listId);
    this.setState({ completedLists });
  }

  handleRefresh = (list) => {
    $.ajax({
      url: `/lists/${list.id}/refresh_list`,
      type: 'POST',
      success: () => this.removeListFromCompleted(list.id),
    });
  }

  alert() {
    if (this.state.errors.length > 0) {
      return (<Alert text={this.state.errors} alert_class="danger" />);
    } else if (this.state.success.length > 0) {
      return (<Alert text={this.state.success} alert_class="success" />);
    }
    return '';
  }

  render() {
    return (
      <div>
        <h1>Lists</h1>
        { this.alert() }
        <ListForm onFormSubmit={this.handleFormSubmit} />
        <hr />
        <UnacceptedLists
          lists={this.state.notAcceptedLists}
          onAccept={this.handleAccept}
          onReject={this.handleReject}
        />
        <hr />
        <Lists
          onListDelete={this.handleDelete}
          onListCompletion={this.handleCompletion}
          completedLists={this.state.completedLists}
          nonCompletedLists={this.state.nonCompletedLists}
          onListRefresh={this.handleRefresh}
        />
      </div>
    );
  }
}
