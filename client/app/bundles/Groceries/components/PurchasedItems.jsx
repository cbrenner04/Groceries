import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PurchasedItem from './PurchasedItem';

export default class PurchasedItems extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        quantity_name: PropTypes.string,
      }).isRequired,
    ),
    handleItemUnPurchase: PropTypes.func.isRequired,
    onItemDelete: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: [],
  }

  handleUnPurchase = (item) => {
    this.props.handleItemUnPurchase(item);
  }

  deleteItem = (item) => {
    this.props.onItemDelete(item);
  }

  render() {
    return (
      <div>
        <h2>Purchased</h2>
        <ul className="list-group">
          {
            this.props.items.map(item => (
              <PurchasedItem
                item={item}
                key={item.id}
                unPurchaseItem={this.handleUnPurchase}
                handleItemDelete={this.deleteItem}
              />
            ))
          }
        </ul>
      </div>
    );
  }
}
