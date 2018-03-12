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
    const target = event.target;
    const name = target.name;
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

  alert() {
    if (this.state.errors.length > 0) {
      return (<Alert text={this.state.errors} alert_class="danger" show />);
    }
    return (<Alert />);
  }

  render() {
    return (
      <div>
        { this.alert() }
        <h2>Log in</h2>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              name="email"
              type="email"
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
            <label htmlFor="remember-me">
              <input
                id="remember-me"
                name="rememberMe"
                checked={this.state.rememberMe}
                onChange={this.handleChange}
                type="checkbox"
              />
              {' '} Remember me
            </label>
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Log in"
              className="btn btn-success btn-block action-button"
            />
          </div>
        </form>
        <Link to="/users">Sign up</Link><br />
        <Link to="/users/password/new">Forgot your password?</Link>
      </div>
    );
  }
}
