class ItemsContainer extends React.Component {
  render() {
    return (
      <div>
        <h2>Items</h2>

        <NotPurchasedItems items={ this.props.notPurchasedItems }
                           list={ this.props.list } />

        <br />

        <PurchasedItems items={ this.props.purchasedItems }
                        list={ this.props.list } />
      </div>
    )
  }
}
