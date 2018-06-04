import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Alert from './Alert';
import BookListItemFormFields from './BookListItemFormFields';
import GroceryListItemFormFields from './GroceryListItemFormFields';
import MusicListItemFormFields from './MusicListItemFormFields';
import ToDoListItemFormFields from './ToDoListItemFormFields';

const initialState = {
  itemName: '',
  itemQuantity: '',
  itemAuthor: '',
  itemTitle: '',
  itemArtist: '',
  itemAlbum: '',
  itemAssigneeId: '',
  itemDueBy: moment().format('YYYY-MM-DD'),
  errors: '',
  success: '',
};

export default class ListItemForm extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    listId: PropTypes.number.isRequired,
    listType: PropTypes.string.isRequired,
    listUsers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
      }),
    ),
    handleItemAddition: PropTypes.func.isRequired,
  }

  static defaultProps = {
    listUsers: [],
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
    this.setState({
      errors: '',
      success: '',
    });
    const listItem = {
      user_id: this.props.userId,
      name: this.state.itemName,
      quantity: this.state.itemQuantity,
      author: this.state.itemAuthor,
      title: this.state.itemTitle,
      artist: this.state.itemArtist,
      album: this.state.itemAlbum,
      assignee_id: this.state.itemAssigneeId,
      due_by: this.state.itemDueBy,
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
      this.setState({
        success: 'Item successfully added.',
      });
    }).fail((response) => {
      const responseJSON = JSON.parse(response.responseText);
      const responseTextKeys = Object.keys(responseJSON);
      const errors = responseTextKeys.map(key => `${key} ${responseJSON[key]}`);
      let joinString;
      if (this.props.listType === 'BookList' || this.props.listType === 'MusicList') {
        joinString = ' or ';
      } else {
        joinString = ' and ';
      }
      this.setState({ errors: errors.join(joinString) });
    });
  }

  formFields() {
    if (this.props.listType === 'BookList') {
      return (
        <BookListItemFormFields
          itemAuthor={this.state.itemAuthor}
          itemTitle={this.state.itemTitle}
          inputHandler={this.handleUserInput}
        />
      );
    } else if (this.props.listType === 'GroceryList') {
      return (
        <GroceryListItemFormFields
          itemQuantity={this.state.itemQuantity}
          itemName={this.state.itemName}
          inputHandler={this.handleUserInput}
        />
      );
    } else if (this.props.listType === 'MusicList') {
      return (
        <MusicListItemFormFields
          itemTitle={this.state.itemTitle}
          itemArtist={this.state.itemArtist}
          itemAlbum={this.state.itemAlbum}
          inputHandler={this.handleUserInput}
        />
      );
    } else if (this.props.listType === 'ToDoList') {
      return (
        <ToDoListItemFormFields
          itemName={this.state.itemName}
          itemAssigneeId={this.state.itemAssigneeId}
          listUsers={this.props.listUsers}
          itemDueBy={this.state.itemDueBy}
          inputHandler={this.handleUserInput}
        />
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        <Alert errors={this.state.errors} success={this.state.success} />
        <form onSubmit={this.handleSubmit}>
          { this.formFields() }
          <br />
          <button type="submit" className="btn btn-success btn-block">
            Add New Item
          </button>
        </form>
      </div>
    );
  }
}
