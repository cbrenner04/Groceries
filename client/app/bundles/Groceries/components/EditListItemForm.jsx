import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import Alert from './Alert';
import BookListItemFormFields from './BookListItemFormFields';
import GroceryListItemFormFields from './GroceryListItemFormFields';
import MusicListItemFormFields from './MusicListItemFormFields';
import ToDoListItemFormFields from './ToDoListItemFormFields';

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
      itemQuantity: '',
      itemCompleted: false,
      itemAuthor: '',
      itemTitle: '',
      itemRead: false,
      itemArtist: '',
      itemDueBy: moment().format('YYYY-MM-DD'),
      itemAssigneeId: '',
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
          itemCompleted: item.completed,
          itemAuthor: item.author,
          itemTitle: item.title,
          itemRead: item.read,
          itemArtist: item.artist,
          itemDueBy: dueByDate,
          itemAssigneeId: item.assignee_id ? String(item.assignee_id) : '',
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
    obj[target.name] = target.type === 'checkbox' ? target.checked : target.value;
    this.setState(obj);
  }

  listTypetoSnakeCase = listType =>
    listType.replace(/([A-Z])/g, $1 => `_${$1}`.toLowerCase()).slice(1);

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      errors: '',
    });
    const listItem = {
      user_id: this.state.userId,
      name: this.state.itemName,
      quantity: this.state.itemQuantity,
      purchased: this.state.itemPurchased,
      completed: this.state.itemCompleted,
      author: this.state.itemAuthor,
      title: this.state.itemTitle,
      read: this.state.itemRead,
      artist: this.state.itemArtist,
      album: this.state.itemAlbum,
      due_by: this.state.itemDueBy,
      assignee_id: this.state.itemAssigneeId,
    };
    listItem[`${this.listTypetoSnakeCase(this.state.listType)}_id`] = this.state.listId;
    const putData = {};
    putData[`${this.listTypetoSnakeCase(this.state.listType)}_item`] = listItem;
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

  prettyTitle = () => `"${this.state.itemTitle}"`

  itemName = () => (
    {
      BookList: `${this.state.itemTitle ? this.prettyTitle() : ''} ${this.state.itemAuthor}`,
      GroceryList: this.state.itemName,
      MusicList: `${this.state.itemTitle ? this.prettyTitle() : ''} ${this.state.itemArtist} ` +
                 `${this.state.itemArtist && this.state.itemAlbum ? '- ' : ''}` +
                 `${this.state.itemAlbum ? this.state.itemAlbum : ''}`,
      ToDoList: this.state.itemName,
    }[this.state.listType]
  )

  formFields() {
    if (this.state.listType === 'BookList') {
      return (
        <BookListItemFormFields
          itemAuthor={this.state.itemAuthor}
          itemTitle={this.state.itemTitle}
          itemPurchased={this.state.itemPurchased}
          itemRead={this.state.itemRead}
          inputHandler={this.handleUserInput}
          editForm
        />
      );
    } else if (this.state.listType === 'GroceryList') {
      return (
        <GroceryListItemFormFields
          itemName={this.state.itemName}
          itemQuantity={this.state.itemQuantity}
          itemPurchased={this.state.itemPurchased}
          inputHandler={this.handleUserInput}
          editForm
        />
      );
    } else if (this.state.listType === 'MusicList') {
      return (
        <MusicListItemFormFields
          itemTitle={this.state.itemTitle}
          itemArtist={this.state.itemArtist}
          itemAlbum={this.state.itemAlbum}
          itemPurchased={this.state.itemPurchased}
          inputHandler={this.handleUserInput}
          editForm
        />
      );
    } else if (this.state.listType === 'ToDoList') {
      return (
        <ToDoListItemFormFields
          itemName={this.state.itemName}
          itemAssigneeId={this.state.itemAssigneeId}
          itemDueBy={this.state.itemDueBy}
          itemCompleted={this.state.itemCompleted}
          listUsers={this.state.listUsers}
          inputHandler={this.handleUserInput}
          editForm
        />
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        <Alert errors={this.state.errors} />
        <h1>Edit { this.itemName() }</h1>
        <Link to={`/lists/${this.state.listId}`} className="pull-right">
          Back to list
        </Link>
        <br />
        <form onSubmit={this.handleSubmit}>
          { this.formFields() }
          <button type="submit" className="btn btn-success btn-block">
            Update Item
          </button>
        </form>
      </div>
    );
  }
}
