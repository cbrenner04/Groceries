import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class ShareListForm extends Component {
  static propTypes = {
    listName: PropTypes.string.isRequired,
    listId: PropTypes.number.isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    ).isRequired,
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
    listName: '',
    users: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      listId: this.props.listId,
      users: this.props.users,
      listName: this.props.listName,
      userId: '',
      newEmail: '',
      errors: '',
    };
  }

  componentWillMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.list_id}/users_lists/new`,
        dataType: 'JSON',
      }).done((data) => {
        this.setState({
          users: data.users,
          listId: data.list.id,
          listName: data.list.name,
        });
      });
    }
  }

  handleUserInput = (event) => {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      errors: '',
    });
    $.post(
      '/users/invitation',
      { user: { email: this.state.newEmail }, list_id: this.state.listId },
    ).fail(response => this.failure(response));
  }

  handleSelectUser(userId) {
    this.setState({
      errors: '',
    });
    const usersList = {
      user_id: userId,
      list_id: this.state.listId,
    };
    $.post(
      `/lists/${this.state.listId}/users_lists`,
      { users_list: usersList },
    ).done(this.props.history.push('/lists'))
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
      return (<Alert text={this.state.errors} alert_class="danger" show />);
    }
    return (<Alert />);
  }

  render() {
    return (
      <div>
        <h1>Share {this.state.name}</h1>
        <Link to="/lists" className="pull-right">Back to lists</Link>
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
          <button type="submit" className="btn btn-success btn-block">
            Share List
          </button>
        </form>
        <br />
        <strong>OR</strong>
        <br />
        <p className="text-lead">
          Select someone you&apos;ve previously shared with:
        </p>
        {
          this.state.users.map(user => (
            <button
              key={user.id}
              className="list-group-item list-group-item-action"
              onClick={() => this.handleSelectUser(user.id)}
            >
              {user.email}
            </button>
          ))
        }
      </div>
    );
  }
}
