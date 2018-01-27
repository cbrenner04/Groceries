import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      isUserSignedIn: false,
    };
  }

  componentWillMount() {
    $.ajax({ type: 'GET', url: '/', dataType: 'JSON' })
      .done(data => this.setState({ isUserSignedIn: data.is_user_signed_in }));
  }

  conditionalBrand() {
    if (this.state.isUserSignedIn) {
      return (<Link to="/" className="navbar-brand">Groceries</Link>);
    }
    return (
      <Link to="/users/sign_in" className="navbar-brand">Groceries</Link>
    );
  }

  conditionalLinks() {
    if (this.state.isUserSignedIn) {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              to="/users/invitation/new"
              className="nav-link"
              id="invite-link"
            >
              Invite
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/users/sign_out"
              className="nav-link"
              rel="nofollow"
              data-method="delete"
              id="log-out-link"
            >
              Log out
            </Link>
          </li>
        </ul>
      );
    }
    return '';
  }

  render() {
    return (
      <div>
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
          { this.conditionalBrand() }
          <div className="collapse navbar-collapse" id="navbar">
            { this.conditionalLinks() }
          </div>
        </nav>
      </div>
    );
  }
}
