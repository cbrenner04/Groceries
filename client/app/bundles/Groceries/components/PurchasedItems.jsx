import React from 'react';
import PropTypes from 'prop-types';

export const PurchasedItems = ({ items }) =>
  <div>
    <h2>Purchased</h2>
    <ul className="list-group">
      { items.map((item) => {
        return(
          <li className="list-group-item" key={ item.id }>
            { `${ item.quantity } ${ item.name }` }
          </li>
        )
      }) }
    </ul>
  </div>

PurchasedItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number
    }).isRequired
  ).isRequired
}
