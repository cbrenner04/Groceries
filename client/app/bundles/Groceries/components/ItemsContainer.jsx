import React, {Component} from 'react';
import PropTypes from 'prop-types';

import NotPurchasedItems from './NotPurchasedItems';
import {PurchasedItems} from './PurchasedItems';

export default class ItemsContainer extends Component {
  static propTypes = {
    list: PropTypes.object.isRequired,
    handleItemDelete: PropTypes.func.isRequired,
    handlePurchaseOfItem: PropTypes.func.isRequired,
    notPurchasedItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        quantity_name: PropTypes.string
      }).isRequired
    ).isRequired,
    purchasedItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number
      }).isRequired
    ).isRequired,
  }

  handlePurchase = (item, listId) => {
    this.props.handlePurchaseOfItem(item, listId);
  }

  handleDeletion = (itemId, listId) => {
    this.props.handleItemDelete(itemId, listId);
  }

  render() {
    return (
      <div>
        <h2>Items</h2>
        <NotPurchasedItems items={ this.props.notPurchasedItems }
                           list={ this.props.list }
                           onItemPurchase={ this.handlePurchase }
                           onItemDelete={ this.handleDeletion } />
        <br />
        <PurchasedItems items={ this.props.purchasedItems }
                        list={ this.props.list } />
      </div>
    )
  }
}
