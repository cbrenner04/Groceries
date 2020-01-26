import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import Alert from './Alert';
import ListItemForm from './ListItemForm';
import ListItemsContainer from './ListItemsContainer';

const mapIncludedCategories = (items) => {
  const cats = [''];
  items.forEach((item) => {
    if (!item.category) return;
    const cat = item.category.toLowerCase();
    if (!cats.includes(cat)) cats.push(cat);
  });
  return cats;
};

const categorizeNotPurchasedItems = (items, categories) => {
  const obj = {};
  categories.forEach((cat) => {
    obj[cat] = [];
  });
  items.forEach((item) => {
    if (!item.category) {
      obj[''].push(item);
      return;
    }
    const cat = item.category.toLowerCase();
    if (!obj[cat]) obj[cat] = [];
    obj[cat].push(item);
  });
  return obj;
};

export default class ListContainer extends Component {
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
      list: {
        id: 0,
        type: 'GroceryList',
      },
      notPurchasedItems: {},
      purchasedItems: [],
      listUsers: [],
      permission: 'write',
      categories: [],
      filter: '',
      includedCategories: [''],
    };
  }

  componentDidMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.id}`,
        dataType: 'JSON',
      }).done(({
        current_user_id: userId,
        not_purchased_items: notPurchased,
        purchased_items: purchasedItems,
        list, categories,
      }) => {
        $.ajax({
          type: 'GET',
          url: `/lists/${this.props.match.params.id}/users_lists`,
          dataType: 'JSON',
        }).done(({ accepted, pending }) => {
          const userInAccepted = accepted.find(acceptedList => acceptedList.user.id === userId);
          const allAcceptedUsers = accepted.map(({ user }) => user);
          const allPendingUsers = pending.map(({ user }) => user);
          const listUsers = allAcceptedUsers.concat(allPendingUsers);
          if (userInAccepted) {
            const includedCategories = mapIncludedCategories(notPurchased);
            const notPurchasedItems = categorizeNotPurchasedItems(notPurchased, includedCategories);
            this.setState({
              userId,
              list,
              purchasedItems,
              categories,
              listUsers,
              includedCategories,
              notPurchasedItems,
              permission: userInAccepted.users_list.permissions,
            });
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
    let { category } = item;
    if (!category) category = '';
    const { notPurchasedItems } = this.state;
    if (!notPurchasedItems[category]) notPurchasedItems[category] = [];
    const items = update(notPurchasedItems[category], { $push: [item] });
    notPurchasedItems[category] = this.sortItems(items);
    const categories = !this.state.categories.includes(category)
      ? update(this.state.categories, { $push: [category] })
      : this.state.categories;
    const includedCategories = !this.state.includedCategories.includes(category)
      ? update(this.state.includedCategories, { $push: [category] })
      : this.state.includedCategories;
    this.setState({ notPurchasedItems, categories, includedCategories });
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
      category: item.category || '',
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
    let { category } = item;
    if (!category) category = '';
    const updateNotPurchasedItems =
      this.state.notPurchasedItems[category].filter(notItem => notItem.id !== item.id);
    const { notPurchasedItems } = this.state;
    notPurchasedItems[category] = updateNotPurchasedItems;
    let purchasedItems = update(this.state.purchasedItems, { $push: [item] });
    purchasedItems = this.sortItems(purchasedItems);
    let { includedCategories, filter } = this.state;
    if (!this.state.notPurchasedItems[category].length) {
      includedCategories = includedCategories.filter(cat => cat !== category);
      filter = '';
    }
    this.setState({
      notPurchasedItems,
      purchasedItems,
      includedCategories,
      filter,
    });
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
    const category = Object.keys(this.state.notPurchasedItems).find(cat =>
      this.state.notPurchasedItems[cat].find(item => item.id === itemId));
    const updatedItems = this.state.notPurchasedItems[category].filter(item => item.id !== itemId);
    const { notPurchasedItems } = this.state;
    notPurchasedItems[category] = updatedItems;
    this.setState({ notPurchasedItems });
  }

  removeItemFromPurchased = (item) => {
    const purchasedItems = this.state.purchasedItems.filter(notItem => notItem.id !== item.id);
    this.setState({ purchasedItems });
  }

  handleAlertDismiss = () => {
    this.setState({ errors: '' });
  }

  handleFilterByCategory = (event) => {
    const filter = event.target.name;
    this.setState({
      filter,
    });
  }

  handleClearingFilter = () => {
    this.setState({
      filter: '',
    });
  }

  render() {
    return (
      <div>
        <h1>{ this.state.list.name }</h1>
        <Link to="/lists" className="pull-right">Back to lists</Link>
        <Alert errors={this.state.errors} handleDismiss={this.handleAlertDismiss} />
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
          handleCategoryFilter={this.handleFilterByCategory}
          handleClearFilter={this.handleClearingFilter}
          filter={this.state.filter}
          categories={this.state.includedCategories}
        />
      </div>
    );
  }
}
