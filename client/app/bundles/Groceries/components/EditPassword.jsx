import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class EditPassword extends Component {
  static propTypes = {
    reset_password_token: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConfirmation: '',
      resetPasswordToken: this.props.reset_password_token,
      errors: '',
    };
  }

  handleChange = (event) => {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const user = {
      password: this.state.password,
      password_confirmation: this.state.passwordConfirmation,
      reset_password_token: this.state.resetPasswordToken,
    };
    $.ajax({
      url: '/users/password',
      data: { user },
      method: 'PUT',
    }).done(() => {
      // noop
    }).fail((response) => {
      const responseJSON = JSON.parse(response.responseText);
      const responseTextKeys = Object.keys(responseJSON);
      const errors = responseTextKeys.map(key => `${key} ${responseJSON[key]}`);
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
        { this.alert() }
        <h2>Change your password</h2>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              name="password"
              className="form-control"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="New password"
              type="password"
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <input
              name="passwordConfirmation"
              className="form-control"
              value={this.state.passwordConfirmation}
              onChange={this.handleChange}
              placeholder="Confirm new password"
              type="password"
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Set my password"
              className="btn btn-success btn-block action-button"
            />
          </div>
        </form>
        <a href="/">Log in</a><br />
        <a href="/users">Sign up</a>
      </div>
    );
  }
}