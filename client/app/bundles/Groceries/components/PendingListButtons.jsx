import React from 'react';
import PropTypes from 'prop-types';

function PendingListButtons(props) {
  const handleAccept = () => props.onListAcceptance(props.list);
  const handleReject = () => props.onListRejection(props.list);

  return (
    <div className="btn-group float-right" role="group">
      <button onClick={handleAccept} className="btn btn-link p-0 mr-3" data-test-id="pending-list-accept">
        <i className="fa fa-check-square-o fa-2x text-success" />
      </button>
      <button onClick={handleReject} className="btn btn-link p-0 mr-3" data-test-id="pending-list-trash">
        <i className="fa fa-trash fa-2x text-danger" />
      </button>
    </div>
  );
}

PendingListButtons.propTypes = {
  list: PropTypes.shape({
    id: PropTypes.number.isRequired,
    users_list_id: PropTypes.number,
    owner_id: PropTypes.number,
  }).isRequired,
  onListAcceptance: PropTypes.func.isRequired,
  onListRejection: PropTypes.func.isRequired,
};

export default PendingListButtons;
