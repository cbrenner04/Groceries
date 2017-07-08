import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class EditItemForm extends Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    list: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      quantity_name: PropTypes.string.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      userId: props.user.id,
      listId: props.list.id,
      name: props.item.name,
      purchased: false,
      quantity: props.item.quantity,
      quantityName: props.item.quantity_name,
      errors: '',
    };
  }

  handleUserInput = (event) => {
    const name = event.target.name;
    const obj = {};
    obj[name] = event.target.value;
    this.setState(obj);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const item = {
      user_id: this.state.userId,
      name: this.state.name,
      list_id: this.state.listId,
      quantity: this.state.quantity,
      purchased: this.state.purchased,
      quantity_name: this.state.quantityName,
    };
    // TODO: update to use axios. this will require auth token stuff
    $.ajax({
      url: `/items/${this.props.item.id}`,
      data: { item },
      method: 'PUT',
    }).done(() => {
      // TODO: update to use react router
      window.location = `/lists/${this.props.list.id}`;
    }).fail((response) => {
      const responseJSON = JSON.parse(response.responseText);
      const responseTextKeys = Object.keys(responseJSON);
      const errors = responseTextKeys.map(key => `${key} ${responseJSON[key]}`);
      this.setState({ errors: errors.join(' and ') });
    });
  }

  alert() {
    if (this.state.errors.length > 0) {
      return (
        <Alert text={this.state.errors} alert_class="danger" />
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        { this.alert() }
        <form onSubmit={this.handleSubmit}>
          <input
            name="userId"
            type="hidden"
            className="hidden"
            value={this.state.userId}
          />
          <input
            name="listId"
            type="hidden"
            className="hidden"
            value={this.state.listId}
          />
          <input
            name="purchased"
            type="hidden"
            className="hidden"
            value={this.state.purchased}
          />
          <div className="form-group" id="new-item">
            <label htmlFor="itemName">Item Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              id="itemName"
              value={this.state.name}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group" id="new-item">
            <label htmlFor="quantity">Quantity</label>
            <input
              name="quantity"
              type="text"
              className="form-control"
              id="quantity"
              value={this.state.quantity}
              onChange={this.handleUserInput}
            />
          </div>
          <div className="form-group" id="new-item">
            <label htmlFor="quantityName">Quantity Name</label>
            <input
              name="quantityName"
              type="text"
              className="form-control"
              id="quantityName"
              value={this.state.quantityName}
              onChange={this.handleUserInput}
            />
            <small className="help-block text-muted">
              This is meant to be used in conjunction with quantity. For example
              &quot;1 bag&quot; or &quot;12 ounces&quot;.
            </small>
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
