import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NotPurchasedListItem from './NotPurchasedListItem';

export default class NotPurchasedListItems extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
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
    ),
    onItemPurchase: PropTypes.func.isRequired,
    onItemDelete: PropTypes.func.isRequired,
    listType: PropTypes.string.isRequired,
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
            <NotPurchasedListItem
              item={item}
              index={index}
              key={item.id}
              handleItemPurchase={this.purchaseItem}
              handleItemDelete={this.deleteItem}
              listType={this.props.listType}
            />
          ))
        }
      </div>
    );
  }
}
