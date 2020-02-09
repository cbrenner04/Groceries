import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReadIcon from './ReadIcon';

function NotPurchasedItemButtons(props) {
  const handlePurchase = () => props.handlePurchaseOfItem(props.item);
  const handleDelete = () => props.handleItemDelete(props.item);
  const listTypeToSnakeCase = () => props.listType.replace(/([A-Z])/g, $1 => `_${$1}`.toLowerCase()).slice(1);
  const listItemPath = () => {
    const listId = props.item[`${listTypeToSnakeCase()}_id`];
    return `/lists/${listId}/${listTypeToSnakeCase()}_items`;
  };

  return (
    <div className="btn-group float-right" role="group">
      <ReadIcon
        listType={props.listType}
        item={props.item}
        handleReadOfItem={props.handleReadOfItem}
        handleUnReadOfItem={props.handleUnReadOfItem}
      />
      <button onClick={handlePurchase} className="btn btn-link p-0 mr-3">
        <i className="fa fa-check-square-o fa-2x text-success" />
      </button>
      <Link to={`${listItemPath()}/${props.item.id}/edit`} className="btn btn-link p-0 mr-3">
        <i className="fa fa-pencil-square-o fa-2x text-warning" />
      </Link>
      <button onClick={handleDelete} className="btn btn-link p-0">
        <i className="fa fa-trash fa-2x text-danger" />
      </button>
    </div>
  );
}

NotPurchasedItemButtons.propTypes = {
  listType: PropTypes.string.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  handlePurchaseOfItem: PropTypes.func.isRequired,
  handleItemDelete: PropTypes.func.isRequired,
  handleReadOfItem: PropTypes.func.isRequired,
  handleUnReadOfItem: PropTypes.func.isRequired,
};

export default NotPurchasedItemButtons;
