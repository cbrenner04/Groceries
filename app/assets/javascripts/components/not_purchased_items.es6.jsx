class NotPurchasedItems extends React.Component {
  purchaseItem(item, listId) {
    this.props.onItemPurchase(item, listId);
  }

  deleteItem(itemId, listId) {
    this.props.onItemDelete(itemId, listId);
  }

  render() {
    return(
      <div className="list-group">
        {
          this.props.items.map((item, index) => {
            return(
              <NotPurchasedItem item={ item }
                                index={ index }
                                list={ this.props.list }
                                key={ item.id }
                                handleItemPurchase={
                                  (item, listId) => this.purchaseItem(item, listId)
                                }
                                handleItemDelete={
                                  (itemId, listId) => this.deleteItem(itemId, listId)
                                } />
            )
          })
        }
      </div>
    )
  }
}
