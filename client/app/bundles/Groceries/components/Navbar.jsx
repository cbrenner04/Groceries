import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Navbar extends Component {
  static propTypes = {
    is_user_signed_in: PropTypes.bool.isRequired
  }

  logOutButton() {
    if (this.props.is_user_signed_in) {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link"
               rel="nofollow"
               data-method="delete"
               href="/users/sign_out">
              Log out
            </a>
          </li>
        </ul>
      )
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <nav className="navbar fixed-top navbar-toggleable-md navbar-light bg-faded navbar-full">
          <button className="navbar-toggler navbar-toggler-right"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbar"
                  aria-controls="navbar"
                  aria-expanded="false"
                  aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <a href="/" className="navbar-brand">Groceries</a>

          <div className="collapse navbar-collapse" id="navbar">
            { this.logOutButton() }
          </div>
        </nav>
      </div>
    )
  }
}
