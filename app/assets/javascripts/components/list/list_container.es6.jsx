class ListContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: this.props.list,
      notPurchasedItems: this.props.not_purchased_items,
      purchasedItems: this.props.purchased_items
    }
  }

  handleAddItem(listId) {
    window.location = `/items/new?list_id=${this.state.list.id}`;
  }

  render() {
    return (
      <div>
        <br /><br />
        <div onClick={ () => this.handleAddItem(this.state.list.id) }
             className="btn btn-success btn-block">Add item to list</div>
        <br />

        <ItemsContainer list={ this.state.list }
                        notPurchasedItems={ this.state.notPurchasedItems }
                        purchasedItems={ this.state.purchasedItems } />
      </div>
    )
  }
}
