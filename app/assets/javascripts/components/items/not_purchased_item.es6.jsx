class NotPurchasedItem extends React.Component {
  render() {
    return (
      <div className="list-group-item" style={{ display: "block" }}>
        <p className="mb-0 float-left">
          { `${this.props.item.quantity} ${this.props.item.quantity_name} ` +
            `${this.props.item.name}` }
        </p>
        <div className="btn-group float-right" role="group">
        {/* item_path(item, item: { purchased: true }, list_id: params[:id]), method: :put */}
          <a href={ `/items/${this.props.item.id}` }
             className="fa fa-check-square-o fa-2x text-success"
             style={{ marginRight: '1rem' }}></a>
          <a href={ `/items/${this.props.item.id}/edit?list_id=${this.props.list.id}` }
             className="fa fa-pencil-square-o fa-2x text-warning"
             style={{ marginRight: '1rem' }}></a>
        {/* method: :delete */}
          <a href={ `/items/${this.props.item.id}?list_id=${this.props.list.id}` }
             className="fa fa-trash fa-2x text-danger"
             data-confirm="Are you sure?"></a>
        </div>
      </div>
    )
  }
}
