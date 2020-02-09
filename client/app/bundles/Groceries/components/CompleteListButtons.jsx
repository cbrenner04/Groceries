import React from 'react';
import PropTypes from 'prop-types';

function CompletedListButtons(props) {
  const handleRefresh = () => props.onListRefresh(props.list);
  const handleDelete = () => props.onListDeletion(props.list);

  return (
    <div className="btn-group float-right" role="group">
      <button
        onClick={handleRefresh}
        className="btn btn-link p-0 mr-3"
        disabled={props.userId !== props.list.owner_id}
        style={{ opacity: props.userId !== props.list.owner_id ? 0.3 : 1 }}
        data-test-id="complete-list-refresh"
      >
        <i className="fa fa-refresh fa-2x text-primary" />
      </button>
      <button
        onClick={handleDelete}
        className="btn btn-link p-0"
        disabled={props.userId !== props.list.owner_id}
        style={{ opacity: props.userId !== props.list.owner_id ? 0.3 : 1 }}
        data-test-id="complete-list-trash"
      >
        <i className="fa fa-trash fa-2x text-danger" />
      </button>
    </div>
  );
}

CompletedListButtons.propTypes = {
  userId: PropTypes.number.isRequired,
  list: PropTypes.shape({
    id: PropTypes.number.isRequired,
    users_list_id: PropTypes.number,
    owner_id: PropTypes.number,
  }).isRequired,
  onListRefresh: PropTypes.func.isRequired,
  onListDeletion: PropTypes.func.isRequired,
};

export default CompletedListButtons;
