import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class PurchasedListItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
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
      read: PropTypes.bool,
    }).isRequired,
    unPurchaseItem: PropTypes.func.isRequired,
    handleItemDelete: PropTypes.func.isRequired,
    handleItemRead: PropTypes.func.isRequired,
    handleItemUnRead: PropTypes.func.isRequired,
    listType: PropTypes.string.isRequired,
    listUsers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
      }),
    ),
  }

  static defaultProps = {
    listUsers: [],
  }

  unPurchase = () => {
    this.props.unPurchaseItem(this.props.item);
  }

  handleDelete = () => {
    this.props.handleItemDelete(this.props.item);
  }

  handleRead = () => {
    this.props.handleItemRead(this.props.item);
  }

  handleUnRead = () => {
    this.props.handleItemUnRead(this.props.item);
  }

  prettyTitle = () => `"${this.props.item.title}"`

  itemName = () => (
    {
      BookList: `${this.props.item.title ? this.prettyTitle() : ''} ` +
                 `${this.props.item.author}`,
      GroceryList: `${this.props.item.quantity} ` +
                   `${this.props.item.quantity_name} ${this.props.item.name}`,
      MusicList: `${this.props.item.title ? this.prettyTitle() : ''} ` +
                 `${this.props.item.artist} ` +
                 `${this.props.item.artist && this.props.item.album ? '- ' : ''}` +
                 `${this.props.item.album ? this.props.item.album : ''}`,
      ToDoList: `${this.props.item.name}`,
    }[this.props.listType]
  )

  assigned = () => `Assigned To: ${this.assignee(this.props.item.assignee_id)}`

  due = () => `Due By: ${moment(this.props.item.due_by).format('LL')}`

  assignee = (assigneeId) => {
    const users =
      this.props.listUsers.filter(user => user.id === assigneeId);
    return users[0].email;
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

  refreshIcon = () => {
    if (this.props.listType === 'GroceryList' || this.props.listType === 'ToDoList') {
      return (
        <div
          onClick={this.unPurchase}
          className="fa fa-refresh fa-2x text-primary action-button"
          style={{ marginRight: '1rem' }}
          role="presentation"
        />
      );
    }
    return '';
  }

  readIcon = () => {
    if (this.props.listType === 'BookList') {
      if (this.props.item.read) {
        return (
          <div
            onClick={this.handleUnRead}
            className="fa fa-bookmark fa-2x text-info action-button"
            style={{ marginRight: '1rem' }}
            role="presentation"
          />
        );
      }
      return (
        <div
          onClick={this.handleRead}
          className="fa fa-bookmark-o fa-2x text-info action-button"
          style={{ marginRight: '1rem' }}
          role="presentation"
        />
      );
    }
    return '';
  }

  render() {
    return (
      <div
        className="list-group-item"
        key={this.props.item.id}
        style={{ display: 'block' }}
        data-test-class="purchased-item"
      >
        <div>{ this.itemName() }</div>
        <div>{ this.extraInfo() }</div>
        <div className="btn-group float-right" role="group">
          { this.refreshIcon() }
          { this.readIcon() }
          <div
            onClick={this.handleDelete}
            className="fa fa-trash fa-2x text-danger action-button"
            data-confirm="Are you sure?"
            role="presentation"
          />
        </div>
      </div>
    );
  }
}

