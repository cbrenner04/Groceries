import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class NotPurchasedGroceryListItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      grocery_list_id: PropTypes.number.isRequired,
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
          <Link
            to={`/lists/${this.props.item.grocery_list_id}/grocery_list_items` +
                `/${this.props.item.id}/edit`}
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
