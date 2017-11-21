import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import Alert from './Alert';


export default class EditListItemForm extends Component {
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
      userId: 0,
      listId: 0,
      itemId: 0,
      listType: 'GroceryList',
      itemName: '',
      itemPurchased: false,
      itemQuantityName: '',
      itemQuantity: '',
      itemCompleted: false,
      itemAuthor: '',
      itemTitle: '',
      itemRead: false,
      itemArtist: '',
      itemDueBy: moment().format('YYYY-MM-DD'),
      itemAssigneeId: 0,
      itemAlbum: '',
      listUsers: [],
      errors: '',
    };
  }

  componentWillMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.list_id}` +
             `/${this.props.match.params[0]}` +
             `/${this.props.match.params.id}/edit`,
        dataType: 'JSON',
      }).done((data) => {
        const item = data.item;
        const list = data.list;
        const dueByDate = moment(item.due_by).format('YYYY-MM-DD');
        this.setState({
          userId: item.user_id,
          listId: list.id,
          listType: list.type,
          itemId: item.id,
          itemName: item.name,
          itemPurchased: item.purchased,
          itemQuantity: item.quantity,
          itemQuantityName: item.quantity_name,
          itemCompleted: item.completed,
          itemAuthor: item.author,
          itemTitle: item.title,
          itemRead: item.read,
          itemArtist: item.artist,
          itemDueBy: dueByDate,
          itemAssigneeId: item.assignee_id,
          itemAlbum: item.album,
        });
      });
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.list_id}/users_lists`,
        dataType: 'JSON',
      }).done((data) => {
        this.setState({ listUsers: data.users });
      });
    }
  }

  handleUserInput = (event) => {
    const target = event.target;
    const obj = {};
    obj[target.name] =
      target.type === 'checkbox' ? target.checked : target.value;
    this.setState(obj);
  }

  listTypetoSnakeCase = listType =>
    listType.replace(/([A-Z])/g, $1 => `_${$1}`.toLowerCase()).slice(1);

  handleSubmit = (event) => {
    event.preventDefault();
    const listItem = {
      user_id: this.state.userId,
      name: this.state.itemName,
      quantity: this.state.itemQuantity,
      purchased: this.state.itemPurchased,
      quantity_name: this.state.itemQuantityName,
      completed: this.state.itemCompleted,
      author: this.state.itemAuthor,
      title: this.state.itemTitle,
      read: this.state.itemRead,
      artist: this.state.itemArtist,
      album: this.state.itemAlbum,
      due_by: this.state.itemDueBy,
      assignee_id: this.state.itemAssigneeId,
    };
    listItem[`${this.listTypetoSnakeCase(this.state.listType)}_id`] =
      this.state.listId;
    const putData = {};
    putData[`${this.listTypetoSnakeCase(this.state.listType)}_item`] =
      listItem;
    // TODO: update to use axios. this will require auth token stuff
    $.ajax({
      url: `/lists/${this.state.listId}/` +
           `${this.listTypetoSnakeCase(this.state.listType)}_items/` +
           `${this.state.itemId}`,
      data: putData,
      method: 'PUT',
    }).done(() => {
      this.props.history.push(`/lists/${this.state.listId}`);
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

  prettyTitle = () => `"${this.state.itemTitle}"`

  itemName = () => (
    {
      BookList: `${this.state.itemTitle ? this.prettyTitle() : ''} ` +
                 `${this.state.itemAuthor}`,
      GroceryList: this.state.itemName,
      MusicList: `${this.state.itemTitle ? this.prettyTitle() : ''} ` +
                 `${this.state.itemArtist} ` +
                 `${this.state.itemArtist && this.state.itemAlbum ? '- ' : ''}` +
                 `${this.state.itemAlbum ? this.state.itemAlbum : ''}`,
      ToDoList: this.state.itemName,
    }[this.state.listType]
  )

  formFields() {
    if (this.state.listType === 'BookList') {
      return (
        <div>
          <div className="form-group">
            <label htmlFor="itemAuthor">Author</label>
            <input
              name="itemAuthor"
              type="text"
              className="form-control"
              id="itemAuthor"
              value={this.state.itemAuthor}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemTitle">Title</label>
            <input
              name="itemTitle"
              type="text"
              className="form-control"
              id="itemTitle"
              value={this.state.itemTitle}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group">
            <label className="form-check-label" htmlFor="itemPurchased">
              <input
                className="form-check-input"
                name="itemPurchased"
                id="itemPurchased"
                type="checkbox"
                checked={this.state.itemPurchased}
                onChange={this.handleUserInput}
              /> Purchased
            </label>
            <div className="form-group">
              <label className="form-check-label" htmlFor="itemRead">
                <input
                  className="form-check-input"
                  name="itemRead"
                  id="itemRead"
                  type="checkbox"
                  checked={this.state.itemRead}
                  onChange={this.handleUserInput}
                /> Read
              </label>
            </div>
          </div>
        </div>
      );
    } else if (this.state.listType === 'GroceryList') {
      return (
        <div>
          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input
              name="itemName"
              type="text"
              className="form-control"
              id="itemName"
              value={this.state.itemName}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemQuantity">Quantity</label>
            <input
              name="itemQuantity"
              type="text"
              className="form-control"
              id="itemQuantity"
              value={this.state.itemQuantity}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemQuantityName">Quantity Name</label>
            <input
              name="itemQuantityName"
              type="text"
              className="form-control"
              id="itemQuantityName"
              value={this.state.itemQuantityName}
              onChange={this.handleUserInput}
            />
            <small className="help-block text-muted">
              This is meant to be used in conjunction with quantity. For example
              &quot;1 bag&quot; or &quot;12 ounces&quot;.
            </small>
          </div>
          <div className="form-group">
            <label className="form-check-label" htmlFor="itemPurchased">
              <input
                className="form-check-input"
                name="itemPurchased"
                id="itemPurchased"
                type="checkbox"
                checked={this.state.itemPurchased}
                onChange={this.handleUserInput}
              /> Purchased
            </label>
          </div>
        </div>
      );
    } else if (this.state.listType === 'MusicList') {
      return (
        <div>
          <div className="form-group">
            <label htmlFor="itemTitle">Title</label>
            <input
              name="itemTitle"
              type="text"
              className="form-control"
              id="itemTitle"
              value={this.state.itemTitle}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemArtist">Artist</label>
            <input
              name="itemArtist"
              type="text"
              className="form-control"
              id="itemArtist"
              value={this.state.itemArtist}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemAlbum">Album</label>
            <input
              name="itemAlbum"
              type="text"
              className="form-control"
              id="itemAlbum"
              value={this.state.itemAlbum}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group">
            <label className="form-check-label" htmlFor="itemPurchased">
              <input
                className="form-check-input"
                name="itemPurchased"
                id="itemPurchased"
                type="checkbox"
                checked={this.state.itemPurchased}
                onChange={this.handleUserInput}
              /> Purchased
            </label>
          </div>
        </div>
      );
    } else if (this.state.listType === 'ToDoList') {
      return (
        <div>
          <div className="form-group">
            <label htmlFor="itemName">Name</label>
            <input
              name="itemName"
              type="text"
              className="form-control"
              id="itemName"
              value={this.state.itemName}
              onChange={this.handleUserInput}
              placeholder="thing to do"
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemAssignee">Assignee</label>
            <select
              name="itemAssigneeId"
              className="form-control"
              id="itemAssignee"
              value={this.state.itemAssigneeId ? this.state.itemAssigneeId : ''}
              onChange={this.handleUserInput}
            >
              <option value="" disabled>Select Assignee</option>
              {
                this.state.listUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.email}</option>
                ))
              }
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="itemDueDate">Due By</label>
            <input
              name="itemDueBy"
              type="date"
              className="form-control"
              id="itemDueDate"
              value={this.state.itemDueBy}
              onChange={this.handleUserInput}
              placeholder="mm/dd/yyyy"
            />
          </div>
          <div className="form-group">
            <label className="form-check-label" htmlFor="itemCompleted">
              <input
                className="form-check-input"
                name="itemCompleted"
                id="itemCompleted"
                type="checkbox"
                checked={this.state.itemCompleted}
                onChange={this.handleUserInput}
              /> Completed
            </label>
          </div>
        </div>
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        <h1>Edit { this.itemName() }</h1>
        <Link to={`/lists/${this.state.listId}`} className="pull-right">
          Back to list
        </Link>
        <br />
        { this.alert() }
        <form onSubmit={this.handleSubmit}>
          { this.formFields() }
          <input
            type="submit"
            value="Update Item"
            className="btn btn-success btn-block action-button"
          />
        </form>
      </div>
    );
  }
}
