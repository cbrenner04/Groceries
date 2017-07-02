import React, {Component} from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import ItemForm from './ItemForm';
import ItemsContainer from './ItemsContainer';

export default class ListContainer extends Component {
  static propTypes = {
    current_user_id: PropTypes.number.isRequired,
    list: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired,
    notPurchasedItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        quantity_name: PropTypes.string
      }).isRequired
    ),
    purchasedItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number
      }).isRequired
    ),
  }

  constructor(props) {
    super(props)
    this.state = {
      userId: props.current_user_id,
      list: props.list,
      notPurchasedItems: props.not_purchased_items,
      purchasedItems: props.purchased_items
    }
  }

  handleAddItem = (item) => {
    const items = update(
      this.state.notPurchasedItems, { $push: [item] }
    )
    this.setState({
      notPurchasedItems: items.sort((a, b) => {
        return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
      })
    })
  }

  handleItemPurchase = (item, listId) => {
    $.ajax({
      url: `/items/${item.id}`,
      type: 'PUT',
      data: `item%5Bpurchased%5D=true&list_id=${listId}`,
      success: () => this.moveItemToPurchased(item)
    });
  }

  moveItemToPurchased = (item) => {
    const notPurchasedItems = this.state.notPurchasedItems.filter((notItem) => {
      return notItem.id !== item.id;
    });
    const purchasedItems = update(
      this.state.purchasedItems, { $push: [item] }
    );
    this.setState({notPurchasedItems, purchasedItems});
  }

  handleDelete = (itemId, listId) => {
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

  removeItem = (itemId) => {
    const notPurchasedItems = this.state.notPurchasedItems.filter((item) => {
      return item.id !== itemId;
    })
    this.setState({notPurchasedItems});
  }

  render() {
    return (
      <div>
        <br /><br />
        <ItemForm listId={ this.props.list.id }
                  userId={ this.state.userId }
                  handleItemAddition={ this.handleAddItem } />
        <br />
        <ItemsContainer list={ this.state.list }
                        notPurchasedItems={ this.state.notPurchasedItems }
                        purchasedItems={ this.state.purchasedItems }
                        handlePurchaseOfItem={ this.handleItemPurchase }
                        handleItemDelete={ this.handleDelete }/>
      </div>
    )
  }
}
