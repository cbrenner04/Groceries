import React, { Component } from 'react';

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
    $.post(
      '/users/invitation',
      { user: { email: this.state.newEmail } },
    ).fail((response) => {
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
        <h1>Send Invitation</h1>
        <a href="/lists" className="pull-right">Back to lists</a>
        <br />
        { this.alert() }
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              id="new-email"
              type="email"
              name="newEmail"
              className="form-control"
              value={this.state.newEmail}
              onChange={this.handleUserInput}
              placeholder="Email"
            />
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