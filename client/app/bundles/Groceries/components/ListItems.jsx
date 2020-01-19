import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

export default class ListItems extends Component {
  static propTypes = {
    category: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      product: PropTypes.string,
      task: PropTypes.string,
      quantity: PropTypes.string,
      author: PropTypes.string,
      title: PropTypes.string,
      artist: PropTypes.string,
      album: PropTypes.string,
      assignee_id: PropTypes.number,
      due_by: PropTypes.date,
      read: PropTypes.bool,
      number_in_series: PropTypes.number,
      category: PropTypes.string,
    }).isRequired),
    purchased: PropTypes.bool,
    onItemPurchase: PropTypes.func,
    onItemRead: PropTypes.func.isRequired,
    onItemUnRead: PropTypes.func.isRequired,
    onItemDelete: PropTypes.func.isRequired,
    handleItemUnPurchase: PropTypes.func,
    listType: PropTypes.string.isRequired,
    listUsers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
    })),
    permission: PropTypes.string.isRequired,
  }

  static defaultProps = {
    items: [],
    listUsers: [],
    purchased: false,
    handleItemUnPurchase: null,
    onItemPurchase: null,
    category: '',
  }

  purchaseItem = item => this.props.onItemPurchase(item);

  readItem = item => this.props.onItemRead(item);

  unReadItem = item => this.props.onItemUnRead(item);

  deleteItem = item => this.props.onItemDelete(item);

  handleUnPurchase = item => this.props.handleItemUnPurchase(item);

  render() {
    return (
      <div className="list-group">
        {this.props.category !== 'none' &&
          <h5 data-test-class="category-header">{this.props.category}</h5>}
        {
          this.props.items.map(item => (
            <ListItem
              item={item}
              key={item.id}
              unPurchaseItem={this.handleUnPurchase}
              handleItemPurchase={this.purchaseItem}
              handleItemRead={this.readItem}
              handleItemUnRead={this.unReadItem}
              handleItemDelete={this.deleteItem}
              listType={this.props.listType}
              listUsers={this.props.listUsers}
              purchased={this.props.purchased}
              permission={this.props.permission}
            />
          ))
        }
      </div>
    );
  }
}
