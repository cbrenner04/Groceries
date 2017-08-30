import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class ItemForm extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    listId: PropTypes.number.isRequired,
    handleItemAddition: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      userId: props.userId,
      listId: props.listId,
      name: '',
      purchased: false,
      quantity: '',
      quantityName: '',
      errors: '',
      success: '',
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
    $.post('/items', { item }).done((data) => {
      this.props.handleItemAddition(data);
      this.setState({
        name: '',
        purchased: false,
        quantity: '',
        quantityName: '',
        success: 'Item successfully added.',
      });
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
    } else if (this.state.success.length > 0) {
      return (
        <Alert text={this.state.success} alert_class="success" />
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        { this.alert() }
        <form onSubmit={this.handleSubmit}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-2" style={{ padding: 0 }}>
                <label className="sr-only" htmlFor="itemQuantity">
                  Quantity
                </label>
                <input
                  name="quantity"
                  type="number"
                  className="form-control no-border-right"
                  id="itemQuantity"
                  value={this.state.quantity}
                  onChange={this.handleUserInput}
                  placeholder="#"
                />
              </div>
              <div className="col-3" style={{ padding: 0 }}>
                <label className="sr-only" htmlFor="itemQuantityName">
                  Quantity Name
                </label>
                <input
                  name="quantityName"
                  type="text"
                  className="form-control no-border-sides"
                  id="itemQuantityName"
                  value={this.state.quantityName}
                  onChange={this.handleUserInput}
                  placeholder="type"
                />
              </div>
              <div className="col-7" style={{ padding: 0 }}>
                <label className="sr-only" htmlFor="itemName">Item Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control no-border-left"
                  id="itemName"
                  value={this.state.name}
                  onChange={this.handleUserInput}
                  placeholder="name"
                />
              </div>
            </div>
          </div>
          <br />
          <input
            type="submit"
            value="Add New Item"
            className="btn btn-success btn-block action-button"
          />
        </form>
      </div>
    );
  }
}
