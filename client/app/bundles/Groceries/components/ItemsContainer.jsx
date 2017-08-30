import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NotPurchasedItems from './NotPurchasedItems';
import PurchasedItems from './PurchasedItems';

export default class ItemsContainer extends Component {
  static propTypes = {
    handleItemDelete: PropTypes.func.isRequired,
    handlePurchaseOfItem: PropTypes.func.isRequired,
    handleItemUnPurchase: PropTypes.func.isRequired,
    notPurchasedItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        quantity_name: PropTypes.string,
      }).isRequired,
    ).isRequired,
    purchasedItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number,
      }).isRequired,
    ).isRequired,
  }

  onItemUnPurchase = (item) => {
    this.props.handleItemUnPurchase(item);
  }

  handlePurchase = (item) => {
    this.props.handlePurchaseOfItem(item);
  }

  handleDeletion = (item) => {
    this.props.handleItemDelete(item);
  }

  render() {
    return (
      <div>
        <h2>Items</h2>
        <NotPurchasedItems
          items={this.props.notPurchasedItems}
          onItemPurchase={this.handlePurchase}
          onItemDelete={this.handleDeletion}
        />
        <br />
        <PurchasedItems
          items={this.props.purchasedItems}
          handleItemUnPurchase={this.onItemUnPurchase}
          onItemDelete={this.handleDeletion}
        />
      </div>
    );
  }
}
