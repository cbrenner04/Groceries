import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Alert from './Alert';

export default class EditPassword extends Component {
  static propTypes = {
    invitation_token: PropTypes.string.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    invitation_token: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConfirmation: '',
      invitationToken: this.props.invitation_token,
      errors: '',
    };
  }

  componentWillMount() {
    if (this.props.location) {
      this.setState({
        invitationToken: queryString
                         .parse(this.props.location.search)
                         .invitation_token,
      });
    }
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

  alert() {
    if (this.state.errors.length > 0) {
      return (<Alert text={this.state.errors} alert_class="danger" />);
    }
    return '';
  }

  render() {
    return (
      <div>
        { this.alert() }
        <h2>Set your password</h2>
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
      </div>
    );
  }
}
