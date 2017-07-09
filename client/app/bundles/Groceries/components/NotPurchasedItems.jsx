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
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    onItemPurchase: PropTypes.func.isRequired,
    onItemDelete: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: [],
  }

  purchaseItem = (item, listId) => {
    this.props.onItemPurchase(item, listId);
  }

  deleteItem = (itemId, listId) => {
    this.props.onItemDelete(itemId, listId);
  }

  render() {
    return (
      <div className="list-group">
        {
          this.props.items.map((item, index) => (
            <NotPurchasedItem
              item={item}
              index={index}
              list={this.props.list}
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
