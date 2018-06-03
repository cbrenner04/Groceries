import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class ListItem extends Component {
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
    purchased: PropTypes.bool,
    handleItemDelete: PropTypes.func.isRequired,
    handleItemPurchase: PropTypes.func.isRequired,
    handleItemRead: PropTypes.func.isRequired,
    handleItemUnRead: PropTypes.func.isRequired,
    listType: PropTypes.string.isRequired,
    listUsers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
      }),
    ),
    unPurchaseItem: PropTypes.func.isRequired,
  }

  static defaultProps = {
    listUsers: [],
    purchased: false,
  }

  unPurchase = () => this.props.unPurchaseItem(this.props.item);

  handleDelete = () => this.props.handleItemDelete(this.props.item);

  handleRead = () => this.props.handleItemRead(this.props.item);

  handleUnRead = () => this.props.handleItemUnRead(this.props.item);

  handlePurchase = () => this.props.handleItemPurchase(this.props.item);

  prettyTitle = () => `"${this.props.item.title}"`

  listTypetoSnakeCase = () => {
    const listType = this.props.listType;
    return listType.replace(/([A-Z])/g, $1 => `_${$1}`.toLowerCase()).slice(1);
  }

  listItemPath = () => {
    const listId = this.props.item[`${this.listTypetoSnakeCase()}_id`];
    return `/lists/${listId}/${this.listTypetoSnakeCase()}_items`;
  }

  itemName = () => (
    {
      BookList: `${this.props.item.title ? this.prettyTitle() : ''} ${this.props.item.author}`,
      GroceryList: `${this.props.item.quantity} ${this.props.item.quantity_name} ${this.props.item.name}`,
      MusicList: `${this.props.item.title ? this.prettyTitle() : ''} ${this.props.item.artist} ` +
                 `${this.props.item.artist && this.props.item.album ? '- ' : ''}` +
                 `${this.props.item.album ? this.props.item.album : ''}`,
      ToDoList: `${this.props.item.name}`,
    }[this.props.listType]
  )

  assigned = () => `Assigned To: ${this.assignee(this.props.item.assignee_id)}`;

  due = () => `Due By: ${moment(this.props.item.due_by).format('LL')}`;

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
        { this.props.purchased ? this.purchasedItemButtons() : this.notPurchaseItemButtons() }
      </div>
    );
  }
}