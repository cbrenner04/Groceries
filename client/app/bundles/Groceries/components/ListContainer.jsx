import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import Alert from './Alert';
import ListItemForm from './ListItemForm';
import ListItemsContainer from './ListItemsContainer';

export default class ListContainer extends Component {
  static propTypes = {
    current_user_id: PropTypes.number,
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }),
    not_purchased_items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      product: PropTypes.string,
      task: PropTypes.string,
      quantity: PropTypes.number,
      author: PropTypes.string,
      title: PropTypes.string,
      artist: PropTypes.string,
      album: PropTypes.string,
      assignee_id: PropTypes.number,
      due_by: PropTypes.date,
      read: PropTypes.bool,
      number_in_series: PropTypes.number,
      category: PropTypes.string,
    }).isRequired),
    purchased_items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      product: PropTypes.string,
      task: PropTypes.string,
      quantity: PropTypes.number,
      author: PropTypes.string,
      title: PropTypes.string,
      artist: PropTypes.string,
      album: PropTypes.string,
      assignee_id: PropTypes.number,
      due_by: PropTypes.date,
      read: PropTypes.bool,
      number_in_series: PropTypes.number,
      category: PropTypes.string,
    }).isRequired),
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
    current_user_id: 0,
    list: {
      id: 0,
      type: 'GroceryList',
    },
    not_purchased_items: [],
    purchased_items: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      userId: props.current_user_id,
      list: props.list,
      notPurchasedItems: props.not_purchased_items,
      purchasedItems: props.purchased_items,
      listUsers: [],
      permission: 'write',
      categories: [],
    };
  }

  componentWillMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.id}`,
        dataType: 'JSON',
      }).done((data) => {
        this.setState({
          userId: data.current_user_id,
          list: data.list,
          notPurchasedItems: data.not_purchased_items,
          purchasedItems: data.purchased_items,
          categories: data.categories,
        });
        $.ajax({
          type: 'GET',
          url: `/lists/${this.props.match.params.id}/users_lists`,
          dataType: 'JSON',
        }).done(({ accepted, pending }) => {
          const userInAccepted = accepted.find(acceptedList => acceptedList.user.id === this.state.userId);
          const allAcceptedUsers = accepted.map(({ user }) => user);
          const allPendingUsers = pending.map(({ user }) => user);
          const listUsers = allAcceptedUsers.concat(allPendingUsers);
          if (userInAccepted) {
            this.setState({ listUsers, permission: userInAccepted.users_list.permissions });
          } else {
            this.props.history.push('/lists');
          }
        });
      });
    } else {
      this.props.history.push('/lists');
    }
  }

  performSort = (items, sortAttrs) => {
    if (sortAttrs.length === 0) return items;
    const sortAttr = sortAttrs.pop();
    const sorted = items.sort((a, b) => {
      // the sort from the server comes back with items with number_in_series: `null` at the end of the list
      // without the next two lines this would put those items at the front of the list
      if (a[sortAttr] === null) return 1;
      if (b[sortAttr] === null) return -1;
      const positiveBranch = (a[sortAttr] > b[sortAttr]) ? 1 : 0;
      return (a[sortAttr] < b[sortAttr]) ? -1 : positiveBranch;
    });
    return this.performSort(sorted, sortAttrs);
  }

  sortItems = (items) => {
    let sortAttrs = [];
    if (this.state.list.type === 'BookList') {
      sortAttrs = ['author', 'number_in_series', 'title'];
    } else if (this.state.list.type === 'GroceryList') {
      sortAttrs = ['product'];
    } else if (this.state.list.type === 'MusicList') {
      sortAttrs = ['artist', 'album', 'title'];
    } else if (this.state.list.type === 'ToDoList') {
      sortAttrs = ['due_by', 'assignee_id', 'task'];
    }
    const sortedItems = this.performSort(items, sortAttrs);
    return sortedItems;
  }

  handleAddItem = (item) => {
    const items = update(this.state.notPurchasedItems, { $push: [item] });
    const notPurchasedItems = this.sortItems(items);
    this.setState({ notPurchasedItems });
  }

  listTypeToSnakeCase = () => {
    const listType = this.state.list.type;
    return listType.replace(/([A-Z])/g, $1 => `_${$1}`.toLowerCase()).slice(1);
  }

  listItemPath = item => `/lists/${this.listId(item)}/${this.listTypeToSnakeCase()}_items`

  listId = item => item[`${this.listTypeToSnakeCase()}_id`]

  handleItemPurchase = (item) => {
    let completionType;
    if (this.state.list.type === 'ToDoList') {
      completionType = 'completed';
    } else {
      completionType = 'purchased';
    }
    $.ajax({
      url: `${this.listItemPath(item)}/${item.id}`,
      type: 'PUT',
      data: `${this.listTypeToSnakeCase()}_item%5B${completionType}%5D=true`,
      success: () => this.moveItemToPurchased(item),
    });
  }

  handleItemRead = (item) => {
    $.ajax({
      url: `${this.listItemPath(item)}/${item.id}`,
      type: 'PUT',
      data: `${this.listTypeToSnakeCase()}_item%5Bread%5D=true`,
    });
    // TODO: remove this
    window.location.reload();
  }

  handleItemUnRead = (item) => {
    $.ajax({
      url: `${this.listItemPath(item)}/${item.id}`,
      type: 'PUT',
      data: `${this.listTypeToSnakeCase()}_item%5Bread%5D=false`,
    });
    // TODO: remove this
    window.location.reload();
  }

  handleUnPurchase = (item) => {
    const newItem = {
      user_id: item.user_id,
      product: item.product,
      task: item.task,
      quantity: item.quantity,
      purchased: false,
      completed: false,
      assignee_id: item.assignee_id,
      due_by: item.due_by,
    };
    newItem[`${this.listTypeToSnakeCase()}_id`] = this.listId(item);
    const postData = {};
    postData[`${this.listTypeToSnakeCase()}_item`] = newItem;
    $.post(`${this.listItemPath(newItem)}`, postData)
      .done((data) => {
        this.handleAddItem(data);
        $.ajax({
          url: `${this.listItemPath(item)}/${item.id}`,
          type: 'PUT',
          data: `${this.listTypeToSnakeCase()}_item%5Brefreshed%5D=true`,
          success: () => this.removeItemFromPurchased(item),
        });
      }).fail((response) => {
        const responseJSON = JSON.parse(response.responseText);
        const responseTextKeys = Object.keys(responseJSON);
        const errors = responseTextKeys.map(key => `${key} ${responseJSON[key]}`);
        this.setState({ errors: errors.join(' and ') });
      });
  }

  moveItemToPurchased = (item) => {
    const notPurchasedItems =
      this.state.notPurchasedItems.filter(notItem => notItem.id !== item.id);
    let purchasedItems = update(this.state.purchasedItems, { $push: [item] });
    purchasedItems = this.sortItems(purchasedItems);
    this.setState({ notPurchasedItems, purchasedItems });
  }

  moveItemToNotPurchased = (item) => {
    const purchasedItems =
      this.state.purchasedItems.filter(notItem => notItem.id !== item.id);
    let notPurchasedItems =
      update(this.state.notPurchasedItems, { $push: [item] });
    notPurchasedItems = this.sortItems(notPurchasedItems);
    this.setState({ notPurchasedItems, purchasedItems });
  }

  handleDelete = (item) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `${this.listItemPath(item)}/${item.id}`,
        type: 'DELETE',
        success: () => this.removeItem(item.id),
      });
    } else {
      return false;
    }
    return '';
  }

  removeItem = (itemId) => {
    const notPurchasedItems = this.state.notPurchasedItems.filter(item => item.id !== itemId);
    this.setState({ notPurchasedItems });
  }

  removeItemFromPurchased = (item) => {
    const purchasedItems = this.state.purchasedItems.filter(notItem => notItem.id !== item.id);
    this.setState({ purchasedItems });
  }

  render() {
    return (
      <div>
        <h1>{ this.state.list.name }</h1>
        <Link to="/lists" className="pull-right">Back to lists</Link>
        <Alert errors={this.state.errors} />
        <br />
        {
          this.state.permission === 'write' ? <ListItemForm
            listId={this.state.list.id}
            listType={this.state.list.type}
            listUsers={this.state.listUsers}
            userId={this.state.userId}
            handleItemAddition={this.handleAddItem}
            categories={this.state.categories}
          /> : <p>You only have permission to read this list</p>
        }
        <br />
        <ListItemsContainer
          notPurchasedItems={this.state.notPurchasedItems}
          purchasedItems={this.state.purchasedItems}
          handlePurchaseOfItem={this.handleItemPurchase}
          handleReadOfItem={this.handleItemRead}
          handleUnReadOfItem={this.handleItemUnRead}
          handleItemDelete={this.handleDelete}
          handleItemUnPurchase={this.handleUnPurchase}
          listType={this.state.list.type}
          listUsers={this.state.listUsers}
          permission={this.state.permission}
        />
      </div>
    );
  }
}
