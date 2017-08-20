import React, { Component } from 'react';

import Alert from './Alert';

export default class NewRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordConfirmation: '',
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
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.passwordConfirmation,
    };
    $.post('/users', { user }).done(() => {
      // TODO: update to use react router
      window.location = '/';
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
        <h2>Sign up</h2>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              name="email"
              className="form-control"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              className="form-control"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="Password"
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
              placeholder="Password Confirmation"
              type="password"
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Submit Registration"
              className="btn btn-success btn-block action-button"
            />
          </div>
        </form>
        <a href="/">Log in</a>
      </div>
    );
  }
}
