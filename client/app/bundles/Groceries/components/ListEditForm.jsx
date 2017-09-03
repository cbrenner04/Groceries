import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class ListEditForm extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        list_id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }

  static defaultProps = {
    id: 0,
    name: '',
    completed: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      completed: props.completed,
      errors: '',
    };
  }

  componentWillMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.id}/edit`,
        dataType: 'JSON',
      }).done((list) => {
        this.setState({
          id: list.id,
          name: list.name,
          completed: list.completed,
        });
      });
    }
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
      url: `/lists/${this.state.id}`,
      data: { list },
      method: 'PUT',
    }).done(() => {
      this.props.history.push('/lists');
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
        <Link to={'/lists'} className="pull-right">
          Back to lists
        </Link>
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
