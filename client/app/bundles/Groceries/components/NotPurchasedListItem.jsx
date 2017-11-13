import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class NotPurchasedListItem extends Component {
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
    }).isRequired,
    handleItemDelete: PropTypes.func.isRequired,
    handleItemPurchase: PropTypes.func.isRequired,
    listType: PropTypes.string.isRequired,
  }

  handlePurchase = () => {
    this.props.handleItemPurchase(this.props.item);
  }

  handleDelete = () => {
    this.props.handleItemDelete(this.props.item);
  }

  listTypetoSnakeCase = () => {
    const listType = this.props.listType;
    return listType.replace(/([A-Z])/g, $1 => `_${$1}`.toLowerCase()).slice(1);
  }

  listItemPath = () => {
    const listId = this.props.item[`${this.listTypetoSnakeCase()}_id`];
    return `/lists/${listId}/${this.listTypetoSnakeCase()}_items`;
  }

  render() {
    return (
      <div className="list-group-item" style={{ display: 'block' }}>
        <p className="mb-0 float-left">
          { `${this.props.item.quantity} ` +
            `${this.props.item.quantity_name} ${this.props.item.name}` }
        </p>
        <div className="btn-group float-right" role="group">
          <div
            onClick={this.handlePurchase}
            className="fa fa-check-square-o fa-2x text-success action-button"
            style={{ marginRight: '1rem' }}
            role="presentation"
          />
          <Link
            to={`${this.listItemPath()}/${this.props.item.id}/edit`}
            className="fa fa-pencil-square-o fa-2x text-warning router-link"
            style={{ marginRight: '1rem' }}
          />
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
