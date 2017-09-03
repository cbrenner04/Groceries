import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NotPurchasedItem from './NotPurchasedItem';

export default class NotPurchasedItems extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        quantity_name: PropTypes.string,
      }).isRequired,
    ),
    onItemPurchase: PropTypes.func.isRequired,
    onItemDelete: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: [],
  }

  purchaseItem = (item) => {
    this.props.onItemPurchase(item);
  }

  deleteItem = (item) => {
    this.props.onItemDelete(item);
  }

  render() {
    return (
      <div className="list-group">
        {
          this.props.items.map((item, index) => (
            <NotPurchasedItem
              item={item}
              index={index}
              key={item.id}
              handleItemPurchase={this.purchaseItem}
              handleItemDelete={this.deleteItem}
            />
          ))
        }
      </div>
    );
  }
}
