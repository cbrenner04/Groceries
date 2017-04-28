class NotPurchasedItem extends React.Component {
  handlePurchase(item, listId) {
    this.props.handleItemPurchase(item, listId);
  }

  handleEdit(itemId, listId) {
    window.location = `/items/${this.props.item.id}/edit?list_id=${this.props.list.id}`
  }

  handleDelete(itemId, listId) {
    this.props.handleItemDelete(itemId, listId)
  }

  render() {
    return(
      <div className="list-group-item" style={{ display: "block" }}>
        <p className="mb-0 float-left">
          { `${this.props.item.quantity} ${this.props.item.quantity_name} ${this.props.item.name}` }
        </p>
        <div className="btn-group float-right" role="group">
          <div onClick={ () => {
                   this.handlePurchase(this.props.item, this.props.list.id)
                 }
               }
               className="fa fa-check-square-o fa-2x text-success"
               style={{ marginRight: '1rem' }}></div>
          <div onClick={
                 () => this.handleEdit(this.props.item.id, this.props.list.id)
               }
               className="fa fa-pencil-square-o fa-2x text-warning"
               style={{ marginRight: '1rem' }}></div>
          <div onClick={
                 () => this.handleDelete(this.props.item.id, this.props.list.id)
               }
               className="fa fa-trash fa-2x text-danger"
               data-confirm="Are you sure?"></div>
        </div>
      </div>
    )
  }
}
