import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PurchasedListItem from './PurchasedListItem';

export default class PurchasedListItems extends Component {
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
    listType: PropTypes.string.isRequired,
    handleItemUnPurchase: PropTypes.func.isRequired,
    onItemDelete: PropTypes.func.isRequired,
    onItemRead: PropTypes.func.isRequired,
    onItemUnRead: PropTypes.func.isRequired,
    listUsers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
      }),
    ),
  }

  static defaultProps = {
    items: [],
    listUsers: [],
  }

  handleUnPurchase = (item) => {
    this.props.handleItemUnPurchase(item);
  }

  deleteItem = (item) => {
    this.props.onItemDelete(item);
  }

  readItem = (item) => {
    this.props.onItemRead(item);
  }

  unReadItem = (item) => {
    this.props.onItemUnRead(item);
  }

  title = () => {
    if (this.props.listType === 'ToDoList') {
      return 'Completed';
    }
    return 'Purchased';
  }

  render() {
    return (
      <div>
        <h2>{this.title()}</h2>
        <ul className="list-group">
          {
            this.props.items.map(item => (
              <PurchasedListItem
                item={item}
                key={item.id}
                unPurchaseItem={this.handleUnPurchase}
                handleItemDelete={this.deleteItem}
                handleItemRead={this.readItem}
                handleItemUnRead={this.unReadItem}
                listType={this.props.listType}
                listUsers={this.props.listUsers}
              />
            ))
          }
        </ul>
      </div>
    );
  }
}
