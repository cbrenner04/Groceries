import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { defaultDueBy } from '../utils/format';

import Alert from './Alert';
import BookListItemFormFields from './BookListItemFormFields';
import GroceryListItemFormFields from './GroceryListItemFormFields';
import MusicListItemFormFields from './MusicListItemFormFields';
import ToDoListItemFormFields from './ToDoListItemFormFields';

const initialState = {
  product: '',
  task: '',
  itemQuantity: '',
  itemAuthor: '',
  itemTitle: '',
  itemArtist: '',
  itemAlbum: '',
  itemAssigneeId: '',
  itemDueBy: defaultDueBy(),
  errors: '',
  success: '',
  numberInSeries: 0,
  category: '',
};

export default class ListItemForm extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    listId: PropTypes.number.isRequired,
    listType: PropTypes.string.isRequired,
    listUsers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
    })),
    handleItemAddition: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string),
  }

  static defaultProps = {
    listUsers: [],
    categories: [],
  }

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleAlertDismiss = () => {
    this.setState({
      errors: '',
      success: '',
    });
  }

  handleUserInput = (event) => {
    const { name, value } = event.target;
    let targetValue = value;
    if (name === 'numberInSeries') targetValue = Number(value);
    const obj = {};
    obj[name] = targetValue;
    this.setState(obj);
  }

  listTypeToSnakeCase = () => {
    const { listType } = this.props;
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
      product: this.state.product,
      task: this.state.task,
      quantity: this.state.itemQuantity,
      author: this.state.itemAuthor,
      title: this.state.itemTitle,
      artist: this.state.itemArtist,
      album: this.state.itemAlbum,
      assignee_id: this.state.itemAssigneeId,
      due_by: this.state.itemDueBy,
      number_in_series: this.state.numberInSeries || null,
      category: this.state.category.trim().toLowerCase(),
    };
    listItem[`${this.listTypeToSnakeCase()}_id`] = this.props.listId;
    const postData = {};
    postData[`${this.listTypeToSnakeCase()}_item`] = listItem;
    $.post(
      `/lists/${this.props.listId}/${this.listTypeToSnakeCase()}_items`,
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
          numberInSeries={this.state.numberInSeries}
          category={this.state.category}
          categories={this.props.categories}
        />
      );
    } else if (this.props.listType === 'GroceryList') {
      return (
        <GroceryListItemFormFields
          itemQuantity={this.state.itemQuantity}
          product={this.state.product}
          inputHandler={this.handleUserInput}
          category={this.state.category}
          categories={this.props.categories}
        />
      );
    } else if (this.props.listType === 'MusicList') {
      return (
        <MusicListItemFormFields
          itemTitle={this.state.itemTitle}
          itemArtist={this.state.itemArtist}
          itemAlbum={this.state.itemAlbum}
          inputHandler={this.handleUserInput}
          category={this.state.category}
          categories={this.props.categories}
        />
      );
    } else if (this.props.listType === 'ToDoList') {
      return (
        <ToDoListItemFormFields
          task={this.state.task}
          itemAssigneeId={this.state.itemAssigneeId}
          listUsers={this.props.listUsers}
          itemDueBy={this.state.itemDueBy}
          inputHandler={this.handleUserInput}
          category={this.state.category}
          categories={this.props.categories}
        />
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        <Alert errors={this.state.errors} success={this.state.success} handleDismiss={this.handleAlertDismiss} />
        <form onSubmit={this.handleSubmit} autoComplete="off">
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
