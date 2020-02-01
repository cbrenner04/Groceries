import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { defaultDueBy, formatDueBy } from '../utils/format';

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
      product: '',
      task: '',
      itemPurchased: false,
      itemQuantity: '',
      itemCompleted: false,
      itemAuthor: '',
      itemTitle: '',
      itemRead: false,
      itemArtist: '',
      itemDueBy: defaultDueBy(),
      itemAssigneeId: '',
      itemAlbum: '',
      listUsers: [],
      errors: '',
      numberInSeries: 0,
      category: '',
      categories: [],
    };
  }

  componentDidMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.list_id}` +
             `/${this.props.match.params[0]}` +
             `/${this.props.match.params.id}/edit`,
        dataType: 'JSON',
      }).done((data) => {
        const { item, list } = data;
        const dueByDate = formatDueBy(item.due_by);
        this.setState({
          userId: item.user_id,
          listId: list.id,
          listType: list.type,
          itemId: item.id,
          product: item.product,
          task: item.task,
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
          numberInSeries: Number(item.number_in_series),
          category: item.category || '',
        });
        $.ajax({
          type: 'GET',
          url: `/lists/${this.props.match.params.list_id}/users_lists`,
          dataType: 'JSON',
        }).done(({ accepted, pending, current_user_id: currentUserId }) => {
          const acceptedUsers = accepted.map(({ user }) => user);
          const pendingUsers = pending.map(({ user }) => user);
          const listUsers = acceptedUsers.concat(pendingUsers);
          const userInAccepted = accepted.find(acceptedList => acceptedList.user.id === currentUserId);
          if (userInAccepted && userInAccepted.users_list.permissions === 'write') {
            this.setState({ listUsers });
          } else {
            this.props.history.push('/lists');
          }
          $.ajax({
            type: 'GET',
            url: `/lists/${this.props.match.params.list_id}`,
            dataType: 'JSON',
          }).done((listData) => {
            this.setState({
              categories: listData.categories,
            });
          });
        });
      });
    }
  }

  handleUserInput = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;
    let targetValue = value;
    if (type === 'number') targetValue = Number(value);
    if (type === 'checkbox') targetValue = checked;
    const obj = {};
    obj[name] = targetValue;
    this.setState(obj);
  }

  listTypeToSnakeCase = listType =>
    listType.replace(/([A-Z])/g, $1 => `_${$1}`.toLowerCase()).slice(1);

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      errors: '',
    });
    const listItem = {
      user_id: this.state.userId,
      product: this.state.product,
      task: this.state.task,
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
      number_in_series: this.state.numberInSeries,
      category: this.state.category.trim().toLowerCase(),
    };
    listItem[`${this.listTypeToSnakeCase(this.state.listType)}_id`] = this.state.listId;
    const putData = {};
    putData[`${this.listTypeToSnakeCase(this.state.listType)}_item`] = listItem;
    // TODO: update to use axios. this will require auth token stuff
    $.ajax({
      url: `/lists/${this.state.listId}/` +
           `${this.listTypeToSnakeCase(this.state.listType)}_items/` +
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
      GroceryList: this.state.product,
      MusicList: `${this.state.itemTitle ? this.prettyTitle() : ''} ${this.state.itemArtist} ` +
                 `${this.state.itemArtist && this.state.itemAlbum ? '- ' : ''}` +
                 `${this.state.itemAlbum ? this.state.itemAlbum : ''}`,
      ToDoList: this.state.task,
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
          numberInSeries={this.state.numberInSeries}
          category={this.state.category}
          categories={this.state.categories}
          editForm
        />
      );
    } else if (this.state.listType === 'GroceryList') {
      return (
        <GroceryListItemFormFields
          product={this.state.product}
          itemQuantity={this.state.itemQuantity}
          itemPurchased={this.state.itemPurchased}
          inputHandler={this.handleUserInput}
          category={this.state.category}
          categories={this.state.categories}
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
          category={this.state.category}
          categories={this.state.categories}
          editForm
        />
      );
    } else if (this.state.listType === 'ToDoList') {
      return (
        <ToDoListItemFormFields
          task={this.state.task}
          itemAssigneeId={this.state.itemAssigneeId}
          itemDueBy={this.state.itemDueBy}
          itemCompleted={this.state.itemCompleted}
          listUsers={this.state.listUsers}
          inputHandler={this.handleUserInput}
          category={this.state.category}
          categories={this.state.categories}
          editForm
        />
      );
    }
    return '';
  }

  handleAlertDismiss = () => {
    this.setState({ errors: '' });
  }

  render() {
    return (
      <div>
        <Alert errors={this.state.errors} handleDismiss={this.handleAlertDismiss} />
        <h1>Edit { this.itemName() }</h1>
        <Link to={`/lists/${this.state.listId}`} className="pull-right">
          Back to list
        </Link>
        <br />
        <form onSubmit={this.handleSubmit} autoComplete="off">
          { this.formFields() }
          <button type="submit" className="btn btn-success btn-block">
            Update Item
          </button>
        </form>
      </div>
    );
  }
}
