import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Alert from './Alert';

export default class NewSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememberMe: false,
      errors: '',
    };
  }

  handleChange = (event) => {
    const { target } = event;
    const { name } = target;
    const obj = {};
    const value = target.type === 'checkbox' ? target.checked : target.value;
    obj[name] = value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      errors: '',
    });
    const user = {
      email: this.state.email,
      password: this.state.password,
      remember_me: this.state.rememberMe,
    };
    $.post('/users/sign_in', { user }).done(() => {
      // noop
    }).fail((response) => {
      this.setState({ errors: response.responseText });
    });
  }

  render() {
    return (
      <div>
        <Alert errors={this.state.errors} />
        <h2>Log in</h2>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              className="form-control"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="jane.smith@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              className="form-control"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="password"
              type="password"
              autoComplete="off"
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              id="remember-me"
              name="rememberMe"
              checked={this.state.rememberMe}
              onChange={this.handleChange}
              type="checkbox"
            />
            <label className="form-check-label" htmlFor="remember-me">
              Remember me
            </label>
          </div>
          <button type="submit" className="btn btn-success btn-block">
            Log in
          </button>
        </form>
        <Link to="/users/password/new">Forgot your password?</Link>
      </div>
    );
  }
}
