import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class NotPurchasedItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      list_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      quantity_name: PropTypes.string,
    }).isRequired,
    handleItemDelete: PropTypes.func.isRequired,
    handleItemPurchase: PropTypes.func.isRequired,
  }

  handlePurchase = () => {
    this.props.handleItemPurchase(this.props.item);
  }

  handleEdit = () => {
    window.location =
      `/items/${this.props.item.id}/edit?list_id=${this.props.item.list_id}`;
  }

  handleDelete = () => {
    this.props.handleItemDelete(this.props.item);
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
          <div
            onClick={this.handleEdit}
            className="fa fa-pencil-square-o fa-2x text-warning action-button"
            style={{ marginRight: '1rem' }}
            role="presentation"
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
