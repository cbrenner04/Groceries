import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class NewPassword extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: '',
    };
  }

  handleChange = (event) => {
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
    const user = {
      email: this.state.email,
    };
    $.post('/users/password', { user }).done(() => {
      // devise returns 200 no matter what is entered. On bad emails we need to redirect to /users/sign_in
      this.props.history.push('/users/sign_in');
    });
  }

  handleAlertDismiss = () => {
    this.setState({ errors: '' });
  }

  render() {
    return (
      <div>
        <Alert errors={this.state.errors} handleDismiss={this.handleAlertDismiss} />
        <h2>Forgot your password?</h2>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="jane.smith@example.com"
            />
          </div>
          <button type="submit" className="btn btn-success btn-block">
            Send me reset password instructions
          </button>
        </form>
        <Link to="/users/sign_in">Log in</Link>
      </div>
    );
  }
}
