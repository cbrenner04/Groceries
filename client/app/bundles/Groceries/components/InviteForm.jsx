import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Alert from './Alert';

export default class InviteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.setState({
      errors: '',
    });
    $.post(
      '/users/invitation',
      { user: { email: this.state.newEmail } },
    ).fail((response) => {
      const responseJSON = JSON.parse(response.responseText);
      const responseTextKeys = Object.keys(responseJSON);
      const errors = responseTextKeys.map(key => `${key} ${responseJSON[key].join(' and ')}`);
      this.setState({ errors: errors.join(' and ') });
    });
  }

  render() {
    return (
      <div>
        <Alert errors={this.state.errors} />
        <h1>Send Invitation</h1>
        <Link to="/lists" className="pull-right">Back to lists</Link>
        <br />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="newEmail">Email</label>
            <input
              id="new-email"
              type="email"
              name="newEmail"
              className="form-control"
              value={this.state.newEmail}
              onChange={this.handleUserInput}
              placeholder="jane.smith@example.com"
            />
          </div>
          <button type="submit" className="btn btn-success btn-block">
            Invite User
          </button>
        </form>
      </div>
    );
  }
}
