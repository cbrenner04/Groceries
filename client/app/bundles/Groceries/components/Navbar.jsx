import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Navbar extends Component {
  static propTypes = {
    is_user_signed_in: PropTypes.bool.isRequired,
  }

  logOutButton() {
    if (this.props.is_user_signed_in) {
      return (
        <li className="nav-item">
          <a
            className="nav-link"
            rel="nofollow"
            data-method="delete"
            href="/users/sign_out"
          >
            Log out
          </a>
        </li>
      );
    }
    return '';
  }

  handleInvite = () => {
    // TODO: update to use react router
    window.location = '/users/invitation/new';
  }

  render() {
    return (
      <div className="container-fluid">
        <nav
          className={'navbar fixed-top navbar-toggleable-md navbar-light' +
                     ' bg-faded navbar-full'}
        >
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navbar"
            aria-controls="navbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <a href="/" className="navbar-brand">Groceries</a>
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav">
              <li className="nav-item">
                <div
                  className="nav-link"
                  onClick={this.handleInvite}
                  role="presentation"
                >
                  Invite
                </div>
              </li>
              { this.logOutButton() }
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
