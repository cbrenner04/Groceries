import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import ItemForm from './ItemForm';
import ItemsContainer from './ItemsContainer';

export default class ListContainer extends Component {
  static propTypes = {
    current_user_id: PropTypes.number.isRequired,
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    not_purchased_items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        quantity_name: PropTypes.string,
      }).isRequired,
    ),
    purchased_items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number,
      }).isRequired,
    ),
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        list_id: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }

  static defaultProps = {
    current_user_id: 0,
    list: { id: 0 },
    not_purchased_items: [],
    purchased_items: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      userId: props.current_user_id,
      list: props.list,
      notPurchasedItems: props.not_purchased_items,
      purchasedItems: props.purchased_items,
    };
  }

  componentDidMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.id}`,
        dataType: 'JSON',
      }).done((data) => {
        this.setState({
          userId: data.current_user_id,
          list: data.list,
          notPurchasedItems: data.not_purchased_items,
          purchasedItems: data.purchased_items,
        });
      });
    }
  }

  sortItems = (items) => {
    const sortedItems = items.sort(
      (a, b) => {
        const positiveBranch = (a.name > b.name) ? 1 : 0;
        return (a.name < b.name) ? -1 : positiveBranch;
      },
    );
    const filteredItems = sortedItems.filter(
      (item, position, itemArray) =>
        !position || item.name !== itemArray[position - 1].name,
    );
    return filteredItems;
  }

  handleAddItem = (item) => {
    const items = update(this.state.notPurchasedItems, { $push: [item] });
    const notPurchasedItems = this.sortItems(items);
    this.setState({ notPurchasedItems });
  }

  handleItemPurchase = (item) => {
    $.ajax({
      url: `/lists/${item.list_id}/items/${item.id}`,
      type: 'PUT',
      data: 'item%5Bpurchased%5D=true',
      success: () => this.moveItemToPurchased(item),
    });
  }

  handleUnPurchase = (item) => {
    const newItem = {
      user_id: item.user_id,
      name: item.name,
      list_id: item.list_id,
      quantity: item.quantity,
      purchased: false,
      quantity_name: item.quantity_name,
    };
    $.post(`/lists/${newItem.list_id}/items`, { item: newItem }).done((data) => {
      this.handleAddItem(data);
      $.ajax({
        url: `/lists/${item.list_id}/items/${item.id}`,
        type: 'PUT',
        data: 'item%5Brefreshed%5D=true',
        success: () => this.removeItemFromPurchased(item),
      });
    }).fail((response) => {
      const responseJSON = JSON.parse(response.responseText);
      const responseTextKeys = Object.keys(responseJSON);
      const errors = responseTextKeys.map(key => `${key} ${responseJSON[key]}`);
      this.setState({ errors: errors.join(' and ') });
    });
  }

  moveItemToPurchased = (item) => {
    const notPurchasedItems =
      this.state.notPurchasedItems.filter(notItem => notItem.id !== item.id);
    let purchasedItems = update(this.state.purchasedItems, { $push: [item] });
    purchasedItems = this.sortItems(purchasedItems);
    this.setState({ notPurchasedItems, purchasedItems });
  }

  moveItemToNotPurchased = (item) => {
    const purchasedItems =
      this.state.purchasedItems.filter(notItem => notItem.id !== item.id);
    let notPurchasedItems = update(this.state.notPurchasedItems, { $push: [item] });
    notPurchasedItems = this.sortItems(notPurchasedItems);
    this.setState({ notPurchasedItems, purchasedItems });
  }

  handleDelete = (item) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `/lists/${item.list_id}/items/${item.id}`,
        type: 'DELETE',
        success: () => this.removeItem(item.id),
      });
    } else {
      return false;
    }
    return '';
  }

  removeItem = (itemId) => {
    const notPurchasedItems =
      this.state.notPurchasedItems.filter(item => item.id !== itemId);
    this.setState({ notPurchasedItems });
  }

  removeItemFromPurchased = (item) => {
    const purchasedItems =
      this.state.purchasedItems.filter(notItem => notItem.id !== item.id);
    this.setState({ purchasedItems });
  }

  render() {
    return (
      <div>
        <h1>{ this.state.list.name }</h1>
        <Link to="/lists" className="pull-right">Back to lists</Link>
        <br />
        <ItemForm
          listId={this.state.list.id}
          userId={this.state.userId}
          handleItemAddition={this.handleAddItem}
        />
        <br />
        <ItemsContainer
          notPurchasedItems={this.state.notPurchasedItems}
          purchasedItems={this.state.purchasedItems}
          handlePurchaseOfItem={this.handleItemPurchase}
          handleItemDelete={this.handleDelete}
          handleItemUnPurchase={this.handleUnPurchase}
        />
      </div>
    );
  }
}
