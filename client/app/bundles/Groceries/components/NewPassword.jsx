import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Alert from './Alert';

export default class NewPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
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
    this.setState({
      errors: '',
    });
    const user = {
      email: this.state.email,
    };
    $.post('/users/password', { user }).done(() => {
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
      return (<Alert text={this.state.errors} alert_class="danger" show />);
    }
    return (<Alert />);
  }

  render() {
    return (
      <div>
        { this.alert() }
        <h2>Forgot your password?</h2>
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
              type="submit"
              value="Send me reset password instructions"
              className="btn btn-success btn-block action-button"
            />
          </div>
        </form>
        <Link to="/users/sign_in">Log in</Link><br />
        <Link to="/users">Sign up</Link>
      </div>
    );
  }
}
