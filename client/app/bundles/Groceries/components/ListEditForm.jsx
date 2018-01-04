import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class ListEditForm extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    listType: PropTypes.string.isRequired,
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
    listType: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      completed: props.completed,
      listType: props.listType,
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
          listType: list.type,
        });
      });
    }
  }

  handleChange = (event) => {
    const target = event.target;
    const obj = {};
    obj[target.name] =
      target.type === 'checkbox' ? target.checked : target.value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const list = {
      name: this.state.name,
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

  alert() {
    if (this.state.errors.length > 0) {
      return (<Alert text={this.state.errors} alert_class="danger" />);
    }
    return '';
  }

  listClass = listType => (
    {
      BookList: 'fa-book',
      GroceryList: 'fa-shopping-bag',
      MusicList: 'fa-music',
      ToDoList: 'fa-list',
    }[listType]
  );

  listTypeOptions = () => {
    const listTypes = [
      { name: 'BookList', id: 1 },
      { name: 'GroceryList', id: 2 },
      { name: 'MusicList', id: 3 },
      { name: 'ToDoList', id: 4 },
    ];
    const options = listTypes.map(listType => (
      <div
        className="form-check form-check-inline col-3"
        style={{ marginLeft: 0 }}
        key={listType.id}
      >
        <label
          className="form-check-label"
          htmlFor={`listType-${listType.name}`}
        >
          <h3>
            <input
              id={`listType-${listType.name}`}
              type="radio"
              name="listType"
              value={listType.name}
              checked={this.state.listType === listType.name}
              onChange={this.handleChange}
              className="form-check-input"
            />
            <i className={`fa ${this.listClass(listType.name)} text-primary`} />
          </h3>
        </label>
      </div>
    ));
    return options;
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
              data-test-id="edit-list-name"
            />
          </div>
          <div className="form-group">
            {this.listTypeOptions()}
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
