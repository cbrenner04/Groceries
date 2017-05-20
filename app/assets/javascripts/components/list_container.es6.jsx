class ListContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: props.list,
      notPurchasedItems: props.not_purchased_items,
      purchasedItems: props.purchased_items
    }
  }

  handleAddItem() {
    window.location = `/items/new?list_id=${this.state.list.id}`;
  }

  handleItemPurchase(item, listId) {
    $.ajax({
      url: `/items/${item.id}`,
      type: 'PUT',
      data: `item%5Bpurchased%5D=true&list_id=${listId}`,
      success: (data) => this.moveItemToPurchased(item)
    });
  }

  moveItemToPurchased(item) {
    const notPurchasedItems = this.state.notPurchasedItems.filter((notItem) => {
      return notItem.id !== item.id;
    });
    const purchasedItems = React.addons.update(
      this.state.purchasedItems, { $push: [item] }
    );
    this.setState({notPurchasedItems, purchasedItems});
  }

  handleDelete(itemId, listId) {
    if (confirm('Are you sure?')) {
      $.ajax({
        url: `/items/${itemId}`,
        data: `list_id=${listId}`,
        type: 'DELETE',
        success: () => this.removeItem(itemId)
      })
    } else {
      return false;
    }
  }

  removeItem(itemId) {
    const notPurchasedItems = this.state.notPurchasedItems.filter((item) => {
      return item.id !== itemId;
    })
    this.setState({notPurchasedItems});
  }

  render() {
    return (
      <div>
        <br /><br />
        <div onClick={ () => this.handleAddItem() }
             className="btn btn-success btn-block">Add item to list</div>
        <br />

        <ItemsContainer list={ this.state.list }
                        notPurchasedItems={ this.state.notPurchasedItems }
                        purchasedItems={ this.state.purchasedItems }
                        handlePurchaseOfItem={
                          (item, listId) => this.handleItemPurchase(item, listId)
                        }
                        handleItemDelete={
                          (itemId, listId) => this.handleDelete(itemId, listId)
                        }/>
      </div>
    )
  }
}
