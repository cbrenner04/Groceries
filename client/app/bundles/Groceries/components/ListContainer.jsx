import React, { Component } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import ItemForm from './ItemForm';
import ItemsContainer from './ItemsContainer';

export default class ListContainer extends Component {
  static propTypes = {
    current_user_id: PropTypes.number.isRequired,
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    not_purchased_items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        quantity_name: PropTypes.string,
      }).isRequired,
    ),
    purchased_items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number,
      }).isRequired,
    ),
  }

  static defaultProps = {
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
    };
  }

  handleAddItem = (item) => {
    const items = update(
      this.state.notPurchasedItems, { $push: [item] },
    );
    this.setState({
      notPurchasedItems: items.sort((a, b) => {
        const positiveBranch = (a.name > b.name) ? 1 : 0;
        return (a.name < b.name) ? -1 : positiveBranch;
      }),
    });
  }

  handleItemPurchase = (item, listId) => {
    $.ajax({
      url: `/items/${item.id}`,
      type: 'PUT',
      data: `item%5Bpurchased%5D=true&list_id=${listId}`,
      success: () => this.moveItemToPurchased(item),
    });
  }

  moveItemToPurchased = (item) => {
    const notPurchasedItems =
      this.state.notPurchasedItems.filter(notItem => notItem.id !== item.id);
    const purchasedItems = update(
      this.state.purchasedItems, { $push: [item] },
    );
    this.setState({ notPurchasedItems, purchasedItems });
  }

  handleDelete = (itemId, listId) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `/items/${itemId}`,
        data: `list_id=${listId}`,
        type: 'DELETE',
        success: () => this.removeItem(itemId),
      });
    } else {
      return false;
    }
    return '';
  }

  removeItem = (itemId) => {
    const notPurchasedItems =
      this.state.notPurchasedItems.filter(item => item.id !== itemId);
    this.setState({ notPurchasedItems });
  }

  render() {
    return (
      <div>
        <h1>{ this.state.list.name }</h1>
        <a href="/lists" className="pull-right">Back to lists</a>
        <br />
        <ItemForm
          listId={this.props.list.id}
          userId={this.state.userId}
          handleItemAddition={this.handleAddItem}
        />
        <br />
        <ItemsContainer
          list={this.state.list}
          notPurchasedItems={this.state.notPurchasedItems}
          purchasedItems={this.state.purchasedItems}
          handlePurchaseOfItem={this.handleItemPurchase}
          handleItemDelete={this.handleDelete}
        />
      </div>
    );
  }
}
