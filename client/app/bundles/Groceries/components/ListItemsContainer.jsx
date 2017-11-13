import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NotPurchasedListItems from './NotPurchasedListItems';
import PurchasedListItems from './PurchasedListItems';

export default class ListItemsContainer extends Component {
  static propTypes = {
    handleItemDelete: PropTypes.func.isRequired,
    handlePurchaseOfItem: PropTypes.func.isRequired,
    handleItemUnPurchase: PropTypes.func.isRequired,
    notPurchasedItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string,
        quantity: PropTypes.number,
        quantity_name: PropTypes.string,
        author: PropTypes.string,
        title: PropTypes.string,
        artist: PropTypes.string,
        album: PropTypes.string,
        assignee_id: PropTypes.number,
        due_by: PropTypes.date,
      }).isRequired,
    ).isRequired,
    purchasedItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string,
        quantity: PropTypes.number,
        quantity_name: PropTypes.string,
        author: PropTypes.string,
        title: PropTypes.string,
        artist: PropTypes.string,
        album: PropTypes.string,
        assignee_id: PropTypes.number,
        due_by: PropTypes.date,
      }).isRequired,
    ).isRequired,
    listType: PropTypes.string.isRequired,
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
        <NotPurchasedListItems
          items={this.props.notPurchasedItems}
          onItemPurchase={this.handlePurchase}
          onItemDelete={this.handleDeletion}
          listType={this.props.listType}
        />
        <br />
        <PurchasedListItems
          items={this.props.purchasedItems}
          handleItemUnPurchase={this.onItemUnPurchase}
          onItemDelete={this.handleDeletion}
        />
      </div>
    );
  }
}
