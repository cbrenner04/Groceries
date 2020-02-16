import React from 'react';
import PropTypes from 'prop-types';

import ReadIcon from './ReadIcon';

const PurchasedItemButtons = props => (
  <div className="btn-group float-right" role="group">
    {
      (props.listType === 'GroceryList' || props.listType === 'ToDoList') &&
        <button onClick={() => props.handleItemUnPurchase(props.item)} className="btn btn-link p-0 mr-3">
          <i className="fa fa-refresh fa-2x text-primary" />
        </button>
    }
    {
      props.listType === 'BookList' &&
        <ReadIcon
          itemRead={props.item.read}
          handleRead={() => props.handleReadOfItem(props.item)}
          handleUnread={() => props.handleUnReadOfItem(props.item)}
        />
    }
    <button onClick={() => props.handleItemDelete(props.item)} className="btn btn-link p-0">
      <i className="fa fa-trash fa-2x text-danger" />
    </button>
  </div>
);

PurchasedItemButtons.propTypes = {
  listType: PropTypes.string.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    read: PropTypes.bool,
  }).isRequired,
  handleItemUnPurchase: PropTypes.func.isRequired,
  handleItemDelete: PropTypes.func.isRequired,
  handleReadOfItem: PropTypes.func.isRequired,
  handleUnReadOfItem: PropTypes.func.isRequired,
};

export default PurchasedItemButtons;
