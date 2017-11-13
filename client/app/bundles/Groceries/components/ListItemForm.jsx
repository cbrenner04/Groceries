import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';

const initialState = {
  name: '',
  quantity: '',
  quantityName: '',
  author: '',
  title: '',
  artist: '',
  album: '',
  assigneeId: '',
  dueBy: '',
  errors: '',
  success: '',
};

export default class ListItemForm extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    listId: PropTypes.number.isRequired,
    listType: PropTypes.string.isRequired,
    listUsers: PropTypes.array,
    handleItemAddition: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleUserInput = (event) => {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.setState(obj);
  }

  listTypetoSnakeCase = () => {
    const listType = this.props.listType;
    return listType.replace(/([A-Z])/g, $1 => `_${$1}`.toLowerCase()).slice(1);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const listItem = {
      user_id: this.props.userId,
      name: this.state.name,
      quantity: this.state.quantity,
      quantity_name: this.state.quantityName,
      author: this.state.author,
      title: this.state.title,
      artist: this.state.artist,
      album: this.state.album,
      assignee_id: this.state.assigneeId,
      due_by: this.state.dueBy,
    };
    listItem[`${this.listTypetoSnakeCase()}_id`] = this.props.listId;
    const postData = {};
    postData[`${this.listTypetoSnakeCase()}_item`] = listItem;
    $.post(
      `/lists/${this.props.listId}/${this.listTypetoSnakeCase()}_items`,
      postData,
    ).done((data) => {
      this.props.handleItemAddition(data);
      this.setState(initialState);
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
    } else if (this.state.success.length > 0) {
      return (<Alert text={this.state.success} alert_class="success" />);
    }
    return '';
  }

  formFields() {
    if (this.props.listType === 'BookList') {
      return (
        <div>
          <div className="row">
            <div className="col-4" style={{ padding: 0 }}>
              <label className="sr-only" htmlFor="itemAuthor">Author</label>
              <input
                name="author"
                type="text"
                className="form-control no-border-right"
                id="itemAuthor"
                value={this.state.author}
                onChange={this.handleUserInput}
                placeholder="author"
              />
            </div>
            <div className="col-8" style={{ padding: 0 }}>
              <label className="sr-only" htmlFor="itemTitle">Title</label>
              <input
                name="title"
                type="text"
                className="form-control no-border-left"
                id="itemTitle"
                value={this.state.title}
                onChange={this.handleUserInput}
                placeholder="title"
              />
            </div>
          </div>
        </div>
      )
    } else if (this.props.listType === 'GroceryList') {
      return (
        <div className="row">
          <div className="col-2" style={{ padding: 0 }}>
            <label className="sr-only" htmlFor="itemQuantity">Quantity</label>
            <input
              name="quantity"
              type="number"
              className="form-control no-border-right"
              id="itemQuantity"
              value={this.state.quantity}
              onChange={this.handleUserInput}
              placeholder="#"
            />
          </div>
          <div className="col-3" style={{ padding: 0 }}>
            <label className="sr-only" htmlFor="itemQuantityName">
              Quantity Name
            </label>
            <input
              name="quantityName"
              type="text"
              className="form-control no-border-sides"
              id="itemQuantityName"
              value={this.state.quantityName}
              onChange={this.handleUserInput}
              placeholder="type"
            />
          </div>
          <div className="col-7" style={{ padding: 0 }}>
            <label className="sr-only" htmlFor="itemName">Item Name</label>
            <input
              name="name"
              type="text"
              className="form-control no-border-left"
              id="itemName"
              value={this.state.name}
              onChange={this.handleUserInput}
              placeholder="name"
            />
          </div>
        </div>
      )
    } else if (this.props.listType === 'MusicList') {
      return (
        <div className="row">
          <div className="col-4" style={{ padding: 0 }}>
            <label className="sr-only" htmlFor="itemTitle">Title</label>
            <input
              name="title"
              type="text"
              className="form-control no-border-right"
              id="itemTitle"
              value={this.state.title}
              onChange={this.handleUserInput}
              placeholder="title"
            />
          </div>
          <div className="col-4" style={{ padding: 0 }}>
            <label className="sr-only" htmlFor="itemArtist">Artist</label>
            <input
              name="artist"
              type="text"
              className="form-control no-border-sides"
              id="itemArtist"
              value={this.state.artist}
              onChange={this.handleUserInput}
              placeholder="artist"
            />
          </div>
          <div className="col-4" style={{ padding: 0 }}>
            <label className="sr-only" htmlFor="itemAlbum">Album</label>
            <input
              name="album"
              type="text"
              className="form-control no-border-left"
              id="itemAlbum"
              value={this.state.album}
              onChange={this.handleUserInput}
              placeholder="album"
            />
          </div>
        </div>
      )
    } else if (this.props.listType === 'ToDoList') {
      return (
        <div>
          <div className="row">
            <div className="col-12" style={{ padding: ".5rem 0rem" }}>
              <label className="sr-only" htmlFor="itemName">Name</label>
              <input
                name="name"
                type="text"
                className="form-control"
                id="itemName"
                value={this.state.name}
                onChange={this.handleUserInput}
                placeholder="thing to do"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12" style={{ padding: ".5rem 0rem" }}>
              <label className="sr-only" htmlFor="itemAssignee">Assignee</label>
              <select
                name="assigneeId"
                className="form-control"
                id="itemAssignee"
                value={this.state.assigneeId}
                onChange={this.handleUserInput}
              >
                <option value="" disabled>Select Assignee</option>
                {
                  this.props.listUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.email}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-12" style={{ padding: ".5rem 0rem" }}>
              <label className="sr-only" htmlFor="itemDueDate">Due By</label>
              <input
                name="dueBy"
                type="date"
                className="form-control"
                id="itemDueDate"
                value={this.state.dueBy}
                onChange={this.handleUserInput}
                placeholder="mm/dd/yyyy"
              />
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        { this.alert() }
        <form onSubmit={this.handleSubmit}>
          <div className="container-fluid">
            { this.formFields() }
          </div>
          <br />
          <input
            type="submit"
            value="Add New Item"
            className="btn btn-success btn-block action-button"
          />
        </form>
      </div>
    );
  }
}
