import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class ShareListForm extends Component {
  static propTypes = {
    list: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    ).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      listId: this.props.list.id,
      users: this.props.users,
      name: this.props.list.name,
      newEmail: '',
      errors: '',
    };
  }

  handleUserInput = (event) => {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    $.post(
      '/users/invitation',
      { user: { email: this.state.newEmail }, list_id: this.state.listId },
    ).fail(response => this.failure(response));
  }

  handleSelectUser(userId) {
    event.preventDefault();
    const usersList = {
      user_id: userId,
      list_id: this.state.listId,
    };
    $.post(
      `/users_lists?list_id=${this.state.listId}`,
      { users_list: usersList },
    ).done(window.location = '/lists')
    .fail(response => this.failure(response));
  }

  failure(response) {
    const responseJSON = JSON.parse(response.responseText);
    const responseTextKeys = Object.keys(responseJSON);
    const errors = responseTextKeys
                   .map(key => `${key} ${responseJSON[key].join(' and ')}`);
    this.setState({ errors: errors.join(' and ') });
  }

  alert() {
    if (this.state.errors.length > 0) {
      return (
        <Alert text={this.state.errors} alert_class="danger" />
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        <h1>Share {this.state.name}</h1>
        <a href="/lists" className="pull-right">Back to lists</a>
        <br />
        { this.alert() }
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="usersListNewEmail">
              Enter an email to invite someone to share this list:
            </label>
            <input
              id="usersListNewEmail"
              type="email"
              name="newEmail"
              className="form-control"
              value={this.state.newEmail}
              onChange={this.handleUserInput}
            />
          </div>
          <input
            type="submit"
            value="Share List"
            className="btn btn-success btn-block action-button"
          />
        </form>
        <br />
        <strong>OR</strong>
        <br />
        <p className="text-lead">
          Select someone you&apos;ve previously shared with:
        </p>
        {
          this.props.users.map(user => (
            <div
              key={user.id}
              className="list-group-item action-button"
              onClick={() => this.handleSelectUser(user.id)}
              role="presentation"
            >
              {user.email}
            </div>
          ))
        }
      </div>
    );
  }
}
