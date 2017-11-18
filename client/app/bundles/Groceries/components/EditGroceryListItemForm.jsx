import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class EditGroceryListItemForm extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    itemId: PropTypes.number.isRequired,
    itemName: PropTypes.string.isRequired,
    itemQuantity: PropTypes.number.isRequired,
    itemQuantityName: PropTypes.string.isRequired,
    itemPurchased: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        grocery_list_id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }

  static defaultProps = {
    userId: 0,
    listId: '0',
    itemId: 0,
    itemName: '',
    itemQuantity: 0,
    itemQuantityName: '',
    itemPurchased: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      listId: props.match.params.grocery_list_id,
      itemId: props.itemId,
      itemName: props.itemName,
      itemPurchased: props.itemPurchased,
      itemQuantity: props.itemQuantity,
      itemQuantityName: props.itemQuantityName,
      errors: '',
    };
  }

  componentWillMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${this.props.match.params.grocery_list_id}` +
             `/grocery_list_items/${this.props.match.params.id}/edit`,
        dataType: 'JSON',
      }).done((item) => {
        this.setState({
          userId: item.user_id,
          listId: item.grocery_list_id,
          itemId: item.id,
          itemName: item.name,
          itemPurchased: item.purchased,
          itemQuantity: item.quantity,
          itemQuantityName: item.quantity_name,
        });
      });
    }
  }

  handleUserInput = (event) => {
    const target = event.target;
    const obj = {};
    obj[target.name] =
      target.type === 'checkbox' ? target.checked : target.value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const groceryListItem = {
      user_id: this.state.userId,
      name: this.state.itemName,
      grocery_list_id: this.state.listId,
      quantity: this.state.itemQuantity,
      purchased: this.state.itemPurchased,
      quantity_name: this.state.itemQuantityName,
    };
    // TODO: update to use axios. this will require auth token stuff
    $.ajax({
      url: `/lists/${this.state.listId}/` +
           `grocery_list_items/${this.state.itemId}`,
      data: { grocery_list_item: groceryListItem },
      method: 'PUT',
    }).done(() => {
      this.props.history.push(`/lists/${this.state.listId}`);
    }).fail((response) => {
      const responseJSON = JSON.parse(response.responseText);
      const responseTextKeys = Object.keys(responseJSON);
      const errors = responseTextKeys.map(key => `${key} ${responseJSON[key]}`);
      this.setState({ errors: errors.join(' and ') });
    });
  }

  alert() {
    if (this.state.errors.length > 0) {
      return (<Alert text={this.state.errors} alert_class="danger" />);
    }
    return '';
  }

  render() {
    return (
      <div>
        <h1>Edit { this.state.itemName }</h1>
        <Link to={`/lists/${this.state.listId}`} className="pull-right">
          Back to list
        </Link>
        <br />
        { this.alert() }
        <form onSubmit={this.handleSubmit}>
          <div className="form-group" id="new-item">
            <label htmlFor="itemName">Item Name</label>
            <input
              name="itemName"
              type="text"
              className="form-control"
              id="itemName"
              value={this.state.itemName}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group" id="new-item">
            <label htmlFor="itemQuantity">Quantity</label>
            <input
              name="itemQuantity"
              type="text"
              className="form-control"
              id="itemQuantity"
              value={this.state.itemQuantity}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group" id="new-item">
            <label htmlFor="itemQuantityName">Quantity Name</label>
            <input
              name="itemQuantityName"
              type="text"
              className="form-control"
              id="itemQuantityName"
              value={this.state.itemQuantityName}
              onChange={this.handleUserInput}
            />
            <small className="help-block text-muted">
              This is meant to be used in conjunction with quantity. For example
              &quot;1 bag&quot; or &quot;12 ounces&quot;.
            </small>
          </div>
          <div className="form-group">
            <label className="form-check-label" htmlFor="itemPurchased">
              <input
                className="form-check-input"
                name="itemPurchased"
                id="itemPurchased"
                type="checkbox"
                checked={this.state.itemPurchased}
                onChange={this.handleUserInput}
              /> Purchased
            </label>
          </div>
          <input
            type="submit"
            value="Update Item"
            className="btn btn-success btn-block action-button"
          />
        </form>
      </div>
    );
  }
}
