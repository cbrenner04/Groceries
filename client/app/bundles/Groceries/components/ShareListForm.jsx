import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import Alert from './Alert';

export default class ShareListForm extends Component {
  static propTypes = {
    listId: PropTypes.number,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        list_id: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }

  static defaultProps = {
    listId: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      listId: this.props.listId,
      invitableUsers: [],
      newEmail: '',
      errors: '',
      pending: [],
      accepted: [],
      refused: [],
      userId: 0,
      userIsOwner: false,
    };
  }

  componentWillMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.list_id}/users_lists`,
        dataType: 'JSON',
      }).done((data) => {
        this.setState({
          name: data.list.name,
          invitableUsers: data.invitable_users,
          listId: data.list.id,
          userIsOwner: data.user_is_owner,
          pending: data.pending,
          accepted: data.accepted,
          refused: data.refused,
          userId: data.current_user_id,
        });
      });
    }
  }

  handleUserInput = (event) => {
    const { name } = event.target;
    const obj = {};
    obj[name] = event.target.value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      errors: '',
    });
    $.post('/users/invitation', {
      user: {
        email: this.state.newEmail,
      },
      list_id: this.state.listId,
    }).fail(response => this.failure(response));
  }

  handleSelectUser(user) {
    this.setState({
      errors: '',
    });
    const usersList = {
      user_id: user.id,
      list_id: this.state.listId,
    };
    $.post(`/lists/${this.state.listId}/users_lists`, { users_list: usersList })
      .done((data) => {
        const newUsers = this.state.invitableUsers.filter(tmpUser => tmpUser.id !== user.id);
        const newPending = update(this.state.pending, {
          $push: [
            {
              user: {
                id: data.user_id,
                email: user.email,
              },
              users_list: {
                id: data.id,
                permissions: data.permissions,
              },
            },
          ],
        });
        this.setState({
          invitableUsers: newUsers,
          pending: newPending,
        });
      })
      .fail(response => this.failure(response));
  }

  failure(response) {
    const responseJSON = JSON.parse(response.responseText);
    const responseTextKeys = Object.keys(responseJSON);
    const errors = responseTextKeys.map(key => `${key} ${responseJSON[key].join(' and ')}`);
    this.setState({ errors: errors.join(' and ') });
  }

  sharedUsers = sharedState => this.state[sharedState].map(({ user, users_list: { id, permissions } }) => {
    if (user.id === this.state.userId) return '';
    if (this.state.userIsOwner) {
      return (
        <button
          key={id}
          id={`${sharedState}-user-${user.id}`}
          className={'list-group-item list-group-item-action d-flex justify-content-between align-items-center'
            + 'btn btn-link'}
          onClick={() => this.togglePermission(id, permissions, sharedState)}
        >
          <span>{user.email}</span>
          <span
            id={`perm-${permissions}`}
            className={`badge badge-${permissions === 'write' ? 'success' : 'primary'}`}
          >
            {permissions}
          </span>
        </button>
      );
    }
    return (<div key={id} className="list-group-item">{user.email}</div>);
  });

  togglePermission = (id, currentPermission, sharedState) => {
    const permissions = currentPermission === 'write' ? 'read' : 'write';
    $.ajax({
      type: 'PATCH',
      url: `/lists/${this.state.listId}/users_lists/${id}`,
      dataType: 'JSON',
      data: `users_list%5Bpermissions%5D=${permissions}`,
    })
      .done(() => {
        const updatedUsers = this.state[sharedState].map((usersList) => {
          const newList = usersList;
          const tmpUsersList = newList.users_list;
          if (tmpUsersList.id === id) tmpUsersList.permissions = permissions;
          return newList;
        });
        const tmpObj = {};
        tmpObj[sharedState] = updatedUsers;
        this.setState(tmpObj);
      })
      .fail(response => this.failure(response));
  }

  render() {
    return (
      <div>
        <h1>Share {this.state.name}</h1>
        <Link to="/lists" className="pull-right">Back to lists</Link>
        <br />
        <Alert errors={this.state.errors} />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="usersListNewEmail">Enter an email to invite someone to share this list:</label>
            <input
              id="usersListNewEmail"
              type="email"
              name="newEmail"
              className="form-control"
              value={this.state.newEmail}
              onChange={this.handleUserInput}
              placeholder="jane.smith@example.com"
            />
          </div>
          <button type="submit" className="btn btn-success btn-block">Share List</button>
        </form>
        <br />
        <p className="text-lead">Or select someone you&apos;ve previously shared with:</p>
        {
          this.state.invitableUsers.map(user => (
            <button
              key={user.id}
              id={`invite-user-${user.id}`}
              className="list-group-item list-group-item-action btn btn-link"
              onClick={() => this.handleSelectUser(user)}
            >
              {user.email}
            </button>
          ))
        }
        <br />
        <h2>Already shared</h2>
        <p className="text-lead">Click to toggle permissions between read and write</p>
        <br />
        <h3>Pending</h3>
        <br />
        { this.sharedUsers('pending') }
        <br />
        <h3>Accepted</h3>
        <br />
        { this.sharedUsers('accepted') }
        <br />
        <h3>Refused</h3>
        <br />
        { this.state.refused.map(({ user }) => <div key={user.id} className="list-group-item">{user.email}</div>) }
      </div>
    );
  }
}
