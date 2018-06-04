import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

export default class ListItems extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      quantity: PropTypes.string,
      author: PropTypes.string,
      title: PropTypes.string,
      artist: PropTypes.string,
      album: PropTypes.string,
      assignee_id: PropTypes.number,
      due_by: PropTypes.date,
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
  }

  static defaultProps = {
    items: [],
    listUsers: [],
    purchased: false,
    handleItemUnPurchase: null,
    onItemPurchase: null,
  }

  purchaseItem = item => this.props.onItemPurchase(item);

  readItem = item => this.props.onItemRead(item);

  unReadItem = item => this.props.onItemUnRead(item);

  deleteItem = item => this.props.onItemDelete(item);

  handleUnPurchase = item => this.props.handleItemUnPurchase(item);

  render() {
    return (
      <div className="list-group">
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
            />
          ))
        }
      </div>
    );
  }
}
