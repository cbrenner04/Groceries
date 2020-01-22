import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Alert from './Alert';
import PasswordForm from './PasswordForm';

export default class EditPassword extends Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConfirmation: '',
      resetPasswordToken: queryString.parse(this.props.location.search).reset_password_token,
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

  handleAlertDismiss = () => {
    this.setState({ errors: '' });
  }

  render() {
    return (
      <div>
        <Alert errors={this.state.errors} handleDismiss={this.handleAlertDismiss} />
        <h2>Change your password</h2>
        <PasswordForm
          submissionHandler={this.handleSubmit}
          password={this.state.password}
          passwordConfirmation={this.state.passwordConfirmation}
          changeHandler={this.handleChange}
        />
        <Link to="/users/sign_in">Log in</Link>
      </div>
    );
  }
}
