import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Alert from './Alert';
import PasswordForm from './PasswordForm';

export default class EditInvite extends Component {
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
      invitationToken: queryString.parse(this.props.location.search).invitation_token,
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
      invitation_token: this.state.invitationToken,
    };
    $.ajax({
      url: '/users/invitation',
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
        <h2>Set your password</h2>
        <PasswordForm
          submissionHandler={this.handleSubmit}
          password={this.state.password}
          passwordConfirmation={this.state.passwordConfirmation}
          changeHandler={this.handleChange}
        />
      </div>
    );
  }
}
