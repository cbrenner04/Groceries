import React, { Component } from 'react';
import PropTypes from 'prop-types';

const defaultValues = {
  errors: '',
  success: '',
};

export default class Alert extends Component {
  static propTypes = {
    errors: PropTypes.string,
    success: PropTypes.string,
  }

  static defaultProps = defaultValues;

  constructor(props) {
    super(props);
    this.state = {
      errors: props.errors,
      success: props.success,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      errors: newProps.errors,
      success: newProps.success,
    });
  }

  dismissAlert = () => this.setState(defaultValues);

  alertClass = () => (this.state.errors === '' ? 'success' : 'danger');

  render() {
    if (this.state.errors === '' && this.state.success === '') return (<div />);
    return (
      <div className={`alert alert-${this.alertClass()} alert-dismissible fade show`} role="alert">
        <button className="close" onClick={this.dismissAlert} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        { this.state.errors || this.state.success }
      </div>
    );
  }
}
