class NotPurchasedItems extends React.Component {
  render() {
    return (
      <div className="list-group">
        {
          this.props.items.map((item, index) => {
            return(
              <NotPurchasedItem item={ item }
                                index={ index }
                                list={ this.props.list }
                                key={ item.id }/>
            )
          })
        }
      </div>
    )
  }
}
