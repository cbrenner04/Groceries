class ListContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: this.props.list,
      notPurchasedItems: this.props.not_purchased_items,
      purchasedItems: this.props.purchased_items
    }
  }

  render() {
    return (
      <div>
        <br /><br />
        <a href={ '/users_lists/new?list_id=' + this.state.list.id }
           className="btn btn-primary btn-block">Share list</a>
        <br />

        <a href={ '/items/new?list_id=' + this.state.list.id }
           className="btn btn-success btn-block">Add item to list</a>
        <br />

        <ItemsContainer list={ this.state.list }
                        notPurchasedItems={ this.state.notPurchasedItems }
                        purchasedItems={ this.state.purchasedItems } />
      </div>
    )
  }
}
