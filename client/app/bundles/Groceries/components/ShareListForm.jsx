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
        first_name: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      listId: this.props.list.id,
      users: this.props.users,
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
    const usersList = {
      user_id: this.state.userId,
      list_id: this.state.listId,
    };
    $.post(
      `/users_lists?list_id=${this.props.list.id}`,
      { users_list: usersList },
    ).done(() => {
      window.location = '/lists';
    }).fail((response) => {
      const responseJSON = JSON.parse(response.responseText);
      const responseTextKeys = Object.keys(responseJSON);
      const errors = responseTextKeys
                     .map(key => `${key} ${responseJSON[key].join(' and ')}`);
      this.setState({ errors: errors.join(' and ') });
    });
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
            <label htmlFor="usersListUserId">
              Select who you would like to share this list with:
            </label>
            <select
              className="form-control"
              name="userId"
              id="usersListUserId"
              value={this.state.value}
              onChange={this.handleUserInput}
            >
              <option value="">Please select</option>
              {
                this.props.users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name}
                  </option>
                ))
              }
            </select>
          </div>
          <input
            type="submit"
            value="Share List"
            className="btn btn-success btn-block action-button"
          />
        </form>
      </div>
    );
  }
}
