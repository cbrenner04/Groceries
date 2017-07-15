import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class NewRegistration extends Component {
  static propTypes = {
    minimum_password_length: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      minimumPasswordLength: props.minimum_password_length,
      firstName: '',
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
      first_name: this.state.firstName,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.passwordConfirmation,
    };
    $.post('/users', { user }).done(() => {
      {/* redirect to '/' */}
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
              name="firstName"
              className="form-control"
              value={this.state.firstName}
              onChange={this.handleChange}
              placeholder="First name"
              autoFocus={true}
            />
          </div>
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
            />
          </div>
          <div className="form-group">
            <input
              name="passwordConfirmation"
              className="form-control"
              value={this.state.passwordConfirmation}
              onChange={this.handleChange}
              placeholder="Password Confirmation"
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
        { /*


        <%= form_for(resource, as: resource_name, url: registration_path(resource_name)) do |f| %>
          <%= devise_error_messages! %>

          <div class="field">
            <%= f.label :first_name %><br />
            <%= f.text_field :first_name, autofocus: true %>
          </div>

          <div class="field">
            <%= f.label :email %><br />
            <%= f.email_field :email, autofocus: true %>
          </div>

          <div class="field">
            <%= f.label :password %>
            <% if @minimum_password_length %>
            <em>(<%= @minimum_password_length %> characters minimum)</em>
            <% end %><br />
            <%= f.password_field :password, autocomplete: "off" %>
          </div>

          <div class="field">
            <%= f.label :password_confirmation %><br />
            <%= f.password_field :password_confirmation, autocomplete: "off" %>
          </div>

          <div class="actions">
            <%= f.submit "Sign up" %>
          </div>
        <% end %>
        */}
      </div>
    );
  }
}
