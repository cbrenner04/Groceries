const NotPurchasedItems = ({ items, list }) =>
  <div className="list-group">
    {
      items.map((item, index) => {
        return(
          <NotPurchasedItem item={ item }
                            index={ index }
                            list={ list }
                            key={ item.id } />
        )
      })
    }
  </div>
