const PurchasedItems = ({ items }) =>
  <div>
    <h2>Purchased</h2>

    <ul className="list-group">
      {
        items.map((item) => {
          return(
            <li className="list-group-item" key={ item.id }>
              { item.quantity } { item.name }
            </li>
          )
        })
      }
    </ul>
  </div>
