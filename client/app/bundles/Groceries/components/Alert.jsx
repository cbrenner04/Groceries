import React, { Component } from 'react';
import PropTypes from 'prop-types';

const defaultValues = {
  alert_class: 'info',
  text: '',
  show: false,
};

export default class Alert extends Component {
  static propTypes = {
    alert_class: PropTypes.string,
    text: PropTypes.string,
    show: PropTypes.bool,
  }

  static defaultProps = defaultValues;

  constructor(props) {
    super(props);
    this.state = {
      alert_class: props.alert_class,
      text: props.text,
      show: props.show,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      alert_class: newProps.alert_class,
      text: newProps.text,
      show: newProps.show,
    });
  }

  dismissAlert = () => this.setState(defaultValues);

  render() {
    if (this.state.text === '') return (<div />);
    return (
      <div
        className={`alert alert-${this.state.alert_class} alert-dismissible fade ${this.state.show ? 'show' : ''}`}
        role="alert"
      >
        <button className="close" onClick={this.dismissAlert} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        { this.state.text }
      </div>
    );
  }
}
