import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    }).isRequired,
    unPurchaseItem: PropTypes.func.isRequired,
    handleItemDelete: PropTypes.func.isRequired,
  }

  unPurchase = () => {
    this.props.unPurchaseItem(this.props.item);
  }

  handleDelete = () => {
    this.props.handleItemDelete(this.props.item);
  }

  render() {
    return (
      <div
        className="list-group-item"
        key={this.props.item.id}
        style={{ display: 'block' }}
      >
        <p className="mb-0 float-left">
          {`${this.props.item.quantity} ${this.props.item.quantity_name} ` +
           `${this.props.item.name}`}
        </p>
        <div className="btn-group float-right" role="group">
          <div
            onClick={this.unPurchase}
            className="fa fa-refresh fa-2x text-primary action-button"
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

