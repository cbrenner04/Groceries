import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class ListEditForm extends Component {
  static propTypes = {
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: props.list.name,
      completed: props.list.completed,
      errors: '',
    };
  }

  handleChange = (event) => {
    const target = event.target;
    const obj = {};
    obj[target.name] = target.type === 'checkbox' ? target.checked : target.value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const list = {
      name: this.state.name,
      completed: this.state.completed,
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
        <h1>Edit { this.state.name }</h1>
        <a href="/lists" className="pull-right">Back to lists</a>
        <br />
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
          <div className="form-group">
            <label className="form-check-label" htmlFor="completed">
              <input
                className="form-check-input"
                name="completed"
                type="checkbox"
                checked={this.state.completed}
                onChange={this.handleChange}
              /> Completed
            </label>
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
