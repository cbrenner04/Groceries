import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PurchasedItems extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number,
      }).isRequired,
    ).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
    };
  }

  render() {
    return (
      <div>
        <h2>Purchased</h2>
        <ul className="list-group">
          { this.state.items.map(item => (<li
            className="list-group-item"
            key={item.id}
          >
            {`${item.quantity} ${item.name}`}
          </li>)) }
        </ul>
      </div>
    );
  }
}
