import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListItems from '../components/ListItems';

export default class ListItemsContainer extends Component {
  static propTypes = {
    handleItemDelete: PropTypes.func.isRequired,
    handlePurchaseOfItem: PropTypes.func.isRequired,
    handleReadOfItem: PropTypes.func.isRequired,
    handleUnReadOfItem: PropTypes.func.isRequired,
    handleItemUnPurchase: PropTypes.func.isRequired,
    notPurchasedItems: PropTypes.arrayOf(PropTypes.shape({
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
    }).isRequired).isRequired,
    purchasedItems: PropTypes.arrayOf(PropTypes.shape({
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
    }).isRequired).isRequired,
    listType: PropTypes.string.isRequired,
    listUsers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
    })),
    permission: PropTypes.string.isRequired,
  }

  static defaultProps = {
    listUsers: [],
  }

  onItemUnPurchase = item => this.props.handleItemUnPurchase(item);

  handlePurchase = item => this.props.handlePurchaseOfItem(item);

  handleRead = item => this.props.handleReadOfItem(item);

  handleUnRead = item => this.props.handleUnReadOfItem(item);

  handleDeletion = item => this.props.handleItemDelete(item);

  title = () => {
    if (this.props.listType === 'ToDoList') {
      return 'Completed';
    }
    return 'Purchased';
  }

  render() {
    return (
      <div>
        <h2>Items</h2>
        <ListItems
          items={this.props.notPurchasedItems}
          onItemPurchase={this.handlePurchase}
          onItemRead={this.handleRead}
          onItemUnRead={this.handleUnRead}
          onItemDelete={this.handleDeletion}
          listType={this.props.listType}
          listUsers={this.props.listUsers}
          permission={this.props.permission}
        />
        <br />
        <h2>{this.title()}</h2>
        <ListItems
          items={this.props.purchasedItems}
          handleItemUnPurchase={this.onItemUnPurchase}
          onItemDelete={this.handleDeletion}
          listType={this.props.listType}
          listUsers={this.props.listUsers}
          onItemRead={this.handleRead}
          onItemUnRead={this.handleUnRead}
          purchased
          permission={this.props.permission}
        />
      </div>
    );
  }
}
