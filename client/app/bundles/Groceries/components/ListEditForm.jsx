import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Alert from './Alert';
import ListTypeOptions from './ListTypeOptions';

export default class ListEditForm extends Component {
  static propTypes = {
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

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      listName: '',
      completed: false,
      listType: 'GroceryList',
      errors: '',
    };
  }

  componentWillMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.id}/edit`,
        dataType: 'JSON',
      }).done(({ list, current_user_id: currentUserId }) => {
        if (list.owner_id === currentUserId) {
          this.setState({
            id: list.id,
            listName: list.name,
            completed: list.completed,
            listType: list.type,
          });
        } else {
          this.props.history.push('/lists');
        }
      });
    } else {
      this.props.history.push('/lists');
    }
  }

  handleChange = (event) => {
    const { target } = event;
    const obj = {};
    obj[target.name] = target.type === 'checkbox' ? target.checked : target.value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const list = {
      name: this.state.listName,
      completed: this.state.completed,
      type: this.state.listType,
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

  render() {
    return (
      <div>
        <h1>Edit { this.state.listName }</h1>
        <Link to="/lists" className="pull-right">
          Back to lists
        </Link>
        <br />
        <Alert errors={this.state.errors} />
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="listName">Name</label>
            <input
              name="listName"
              type="text"
              className="form-control"
              id="listName"
              value={this.state.listName}
              onChange={this.handleChange}
            />
          </div>
          <ListTypeOptions listType={this.state.listType} changeHandler={this.handleChange} />
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              id="completed"
              name="completed"
              type="checkbox"
              checked={this.state.completed}
              onChange={this.handleChange}
            />
            <label className="form-check-label" htmlFor="completed">Completed</label>
          </div>
          <button type="submit" className="btn btn-success btn-block">
            Update List
          </button>
        </form>
      </div>
    );
  }
}
