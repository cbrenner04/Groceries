import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Alert extends Component{
  static propTypes = {
    alert_class: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }

  render() {
    return (
      <div className={`alert alert-${ this.props.alert_class } ` +
                      `alert-dismissible fade show`} role="alert">
        <button type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        { this.props.text }
      </div>
    )
  }
}
