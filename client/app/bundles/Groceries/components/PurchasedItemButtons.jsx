import React from 'react';
import PropTypes from 'prop-types';

import ReadIcon from './ReadIcon';

function PurchasedItemButtons(props) {
  const unPurchase = () => props.handleItemUnPurchase(props.item);
  const handleDelete = () => props.handleItemDelete(props.item);

  const refreshIcon = () => {
    if (props.listType === 'GroceryList' || props.listType === 'ToDoList') {
      return (
        <button onClick={unPurchase} className="btn btn-link p-0 mr-3">
          <i className="fa fa-refresh fa-2x text-primary" />
        </button>
      );
    }
    return '';
  };

  return (
    <div className="btn-group float-right" role="group">
      { refreshIcon() }
      <ReadIcon
        listType={props.listType}
        item={props.item}
        handleReadOfItem={props.handleReadOfItem}
        handleUnReadOfItem={props.handleUnReadOfItem}
      />
      <button onClick={handleDelete} className="btn btn-link p-0">
        <i className="fa fa-trash fa-2x text-danger" />
      </button>
    </div>
  );
}

PurchasedItemButtons.propTypes = {
  listType: PropTypes.string.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  handleItemUnPurchase: PropTypes.func.isRequired,
  handleItemDelete: PropTypes.func.isRequired,
  handleReadOfItem: PropTypes.func.isRequired,
  handleUnReadOfItem: PropTypes.func.isRequired,
};

export default PurchasedItemButtons;
