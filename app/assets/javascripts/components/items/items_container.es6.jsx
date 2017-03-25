const ItemsContainer = ({ list, purchasedItems, notPurchasedItems }) =>
  <div>
    <h2>Items</h2>

    <NotPurchasedItems items={ notPurchasedItems } list={ list } />

    <br />

    <PurchasedItems items={ purchasedItems } list={ list } />
  </div>
