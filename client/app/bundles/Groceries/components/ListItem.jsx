import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { prettyDueBy } from '../utils/format';

export default class ListItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      product: PropTypes.string,
      task: PropTypes.string,
      quantity: PropTypes.string,
      author: PropTypes.string,
      title: PropTypes.string,
      artist: PropTypes.string,
      album: PropTypes.string,
      assignee_id: PropTypes.number,
      due_by: PropTypes.string,
      read: PropTypes.bool,
      number_in_series: PropTypes.number,
      category: PropTypes.string,
    }).isRequired,
    purchased: PropTypes.bool,
    handleItemDelete: PropTypes.func.isRequired,
    handleItemPurchase: PropTypes.func.isRequired,
    handleItemRead: PropTypes.func.isRequired,
    handleItemUnRead: PropTypes.func.isRequired,
    listType: PropTypes.string.isRequired,
    listUsers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
    })),
    unPurchaseItem: PropTypes.func.isRequired,
    permission: PropTypes.string.isRequired,
  }

  static defaultProps = {
    listUsers: [],
    purchased: false,
  }

  setButtons = () => (this.props.purchased ? this.purchasedItemButtons() : this.notPurchaseItemButtons());

  unPurchase = () => this.props.unPurchaseItem(this.props.item);

  handleDelete = () => this.props.handleItemDelete(this.props.item);

  handleRead = () => this.props.handleItemRead(this.props.item);

  handleUnRead = () => this.props.handleItemUnRead(this.props.item);

  handlePurchase = () => this.props.handleItemPurchase(this.props.item);

  prettyTitle = () => `"${this.props.item.title}"`

  listTypeToSnakeCase = () => {
    const { listType } = this.props;
    return listType.replace(/([A-Z])/g, $1 => `_${$1}`.toLowerCase()).slice(1);
  }

  listItemPath = () => {
    const listId = this.props.item[`${this.listTypeToSnakeCase()}_id`];
    return `/lists/${listId}/${this.listTypeToSnakeCase()}_items`;
  }

  itemName = () => (
    {
      BookList: `${this.props.item.title ? this.prettyTitle() : ''} ${this.props.item.author}`,
      GroceryList: `${this.props.item.quantity} ${this.props.item.product}`,
      MusicList: `${this.props.item.title ? this.prettyTitle() : ''} ${this.props.item.artist} ` +
                 `${this.props.item.artist && this.props.item.album ? '- ' : ''}` +
                 `${this.props.item.album ? this.props.item.album : ''}`,
      ToDoList: `${this.props.item.task}`,
    }[this.props.listType]
  )

  assigned = () => `Assigned To: ${this.assignee(this.props.item.assignee_id)}`;

  due = () => `Due By: ${prettyDueBy(this.props.item.due_by)}`;

  assignee = (assigneeId) => {
    const assignedUser = this.props.listUsers.filter(user => user.id === assigneeId)[0];
    return assignedUser ? assignedUser.email : '';
  }

  extraInfo = () => {
    if (this.props.listType === 'ToDoList') {
      return (
        <small className="text-muted">
          <div>{this.props.item.assignee_id ? this.assigned() : ''}</div>
          <div>{this.props.item.due_by ? this.due() : ''}</div>
        </small>
      );
    }
    return '';
  }

  readIcon = () => {
    if (this.props.listType === 'BookList') {
      if (this.props.item.read) {
        return (
          <button onClick={this.handleUnRead} className="btn btn-link p-0 mr-3">
            <i className="fa fa-bookmark fa-2x text-info" />
          </button>
        );
      }
      return (
        <button onClick={this.handleRead} className="btn btn-link p-0 mr-3">
          <i className="fa fa-bookmark-o fa-2x text-info" />
        </button>
      );
    }
    return '';
  }

  refreshIcon = () => {
    if (this.props.listType === 'GroceryList' || this.props.listType === 'ToDoList') {
      return (
        <button onClick={this.unPurchase} className="btn btn-link p-0 mr-3">
          <i className="fa fa-refresh fa-2x text-primary" />
        </button>
      );
    }
    return '';
  }

  testClass = () => (this.props.purchased ? 'purchased-item' : 'non-purchased-item');

  notPurchaseItemButtons = () => (
    <div className="btn-group float-right" role="group">
      <div>{ this.readIcon() }</div>
      <button onClick={this.handlePurchase} className="btn btn-link p-0 mr-3">
        <i className="fa fa-check-square-o fa-2x text-success" />
      </button>
      <Link to={`${this.listItemPath()}/${this.props.item.id}/edit`} className="btn btn-link p-0 mr-3">
        <i className="fa fa-pencil-square-o fa-2x text-warning" />
      </Link>
      <button onClick={this.handleDelete} className="btn btn-link p-0">
        <i className="fa fa-trash fa-2x text-danger" />
      </button>
    </div>
  );

  purchasedItemButtons = () => (
    <div className="btn-group float-right" role="group">
      { this.refreshIcon() }
      { this.readIcon() }
      <button onClick={this.handleDelete} className="btn btn-link p-0">
        <i className="fa fa-trash fa-2x text-danger" />
      </button>
    </div>
  );

  render() {
    return (
      <div
        className="list-group-item"
        key={this.props.item.id}
        style={{ display: 'block' }}
        data-test-class={this.testClass()}
      >
        <div className="pt-1">{ this.itemName() }</div>
        <div className="pt-1">{ this.extraInfo() }</div>
        { this.props.permission === 'write' ? this.setButtons() : '' }
      </div>
    );
  }
}
