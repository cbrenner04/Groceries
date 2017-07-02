import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Alert from './Alert';

export default class EditItemForm extends Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired,
    list: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired,
    item: PropTypes.shape({
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      quantity_name: PropTypes.string.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      userId: props.user.id,
      listId: props.list.id,
      name: props.item.name,
      purchased: false,
      quantity: props.item.quantity,
      quantityName: props.item.quantity_name,
      errors: ''
    }
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
      quantity_name: this.state.quantityName
    }
    $.ajax({
      url: `/items/${this.props.item.id}`,
      data: { item },
      method: "PUT"
    }).done(() => {
      window.location = `/lists/${this.props.list.id}`;
    }).fail((response) => {
      let responseJSON = JSON.parse(response.responseText)
      let responseTextKeys = Object.keys(responseJSON);
      let errors = responseTextKeys.map((key) => {
        return (`${key} ${responseJSON[key]}`);
      });
      this.setState({ errors: errors.join(' and ') });
    });
  }

  alert() {
    if (this.state.errors.length > 0) {
      return (
        <Alert text={ this.state.errors } alert_class="danger" />
      )
    }
  }

  render() {
    return (
      <div>
        { this.alert() }
        <form onSubmit={ this.handleSubmit }>
          <input name="userId"
                 type="hidden"
                 className="hidden"
                 value={ this.state.userId } />
          <input name="listId"
                 type="hidden"
                 className="hidden"
                 value={ this.state.listId } />
          <input name="purchased"
                 type="hidden"
                 className="hidden"
                 value={ this.state.purchased } />
          <div className="form-group" id="new-item">
            <label htmlFor="itemName">Item Name</label>
            <input name="name"
                   type="text"
                   className="form-control"
                   id="itemName"
                   value={ this.state.name }
                   onChange={ this.handleUserInput } />
          </div>
          <div className="form-group" id="new-item">
            <label htmlFor="quantity">Quantity</label>
            <input name="quantity"
                   type="text"
                   className="form-control"
                   id="quantity"
                   value={ this.state.quantity }
                   onChange={ this.handleUserInput } />
          </div>
          <div className="form-group" id="new-item">
            <label htmlFor="quantityName">Quantity Name</label>
            <input name="quantityName"
                   type="text"
                   className="form-control"
                   id="quantityName"
                   value={ this.state.quantityName }
                   onChange={ this.handleUserInput } />
            <small className="help-block text-muted">
              This is meant to be used in conjunction with quantity. For example
              "1 bag" or "12 ounces".
            </small>
          </div>
          <input type="submit"
                 value="Update Item"
                 className="btn btn-success btn-block action-button" />
        </form>
      </div>
    )
  }
}


