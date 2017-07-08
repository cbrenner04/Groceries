import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class ListEditForm extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: props.list.name,
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
    const list = {
      name: this.state.name,
    };
    $.ajax({
      url: `/lists/${this.props.list.id}`,
      data: { list },
      method: 'PUT',
    }).done(() => {
      window.location = '/lists';
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
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              className="form-control"
              id="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <input
            type="submit"
            value="Update List"
            className="btn btn-success btn-block action-button"
          />
        </form>
      </div>
    );
  }
}
