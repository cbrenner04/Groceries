import React, {Component} from 'react';

export default class NotPurchasedItem extends Component {
  handlePurchase() {
    this.props.handleItemPurchase(this.props.item, this.props.list.id);
  }

  handleEdit() {
    window.location = `/items/${this.props.item.id}/edit?list_id=${this.props.list.id}`
  }

  handleDelete() {
    this.props.handleItemDelete(this.props.item.id, this.props.list.id)
  }

  render() {
    return(
      <div className="list-group-item" style={{ display: "block" }}>
        <p className="mb-0 float-left">
          { `${this.props.item.quantity} ${this.props.item.quantity_name} ${this.props.item.name}` }
        </p>
        <div className="btn-group float-right" role="group">
          <div onClick={ () => { this.handlePurchase() } }
               className="fa fa-check-square-o fa-2x text-success action-button"
               style={{ marginRight: '1rem' }}></div>
          <div onClick={ () => this.handleEdit() }
               className="fa fa-pencil-square-o fa-2x text-warning action-button"
               style={{ marginRight: '1rem' }}></div>
          <div onClick={ () => this.handleDelete() }
               className="fa fa-trash fa-2x text-danger action-button"
               data-confirm="Are you sure?"></div>
        </div>
      </div>
    )
  }
}
