import React, {Component} from 'react';

import NotPurchasedItems from './NotPurchasedItems';
import {PurchasedItems} from './PurchasedItems';

export default class ItemsContainer extends Component {
  handlePurchase(item, listId) {
    this.props.handlePurchaseOfItem(item, listId);
  }

  handleDeletion(itemId, listId) {
    this.props.handleItemDelete(itemId, listId);
  }

  render() {
    return (
      <div>
        <h2>Items</h2>
        <NotPurchasedItems items={ this.props.notPurchasedItems }
                           list={ this.props.list }
                           onItemPurchase={ (item, listId) => {
                             this.handlePurchase(item, listId)
                           } }
                           onItemDelete={ (itemId, listId) => {
                             this.handleDeletion(itemId, listId)
                           } } />
        <br />
        <PurchasedItems items={ this.props.purchasedItems }
                        list={ this.props.list } />
      </div>
    )
  }
}
