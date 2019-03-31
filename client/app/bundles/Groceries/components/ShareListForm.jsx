import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import Alert from './Alert';
import PermissionsButtons from './PermissionsButtons';

export default class ShareListForm extends Component {
  static propTypes = {
    listId: PropTypes.number,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        list_id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
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
        const userInAccepted = data.accepted.find(acceptedList => acceptedList.user.id === data.current_user_id);
        if (!userInAccepted || !userInAccepted.users_list.permissions === 'write') {
          this.props.history.push('/lists');
        }
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
        <PermissionsButtons
          status="pending"
          users={this.state.pending}
          listId={this.state.listId}
          userIsOwner={this.state.userIsOwner}
          userId={this.state.userId}
        />
        <PermissionsButtons
          status="accepted"
          users={this.state.accepted}
          listId={this.state.listId}
          userIsOwner={this.state.userIsOwner}
          userId={this.state.userId}
        />
        <h3>Refused</h3>
        <br />
        { this.state.refused.map(({ user }) => <div key={user.id} className="list-group-item">{user.email}</div>) }
      </div>
    );
  }
}
