import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { formatDate } from '../utils/format';
import listIconClass from '../utils/list_icon';

function List(props) {
  const [currentUserPermissions, setCurrentUserPermissions] = useState('read');
  const { list, userId } = props;

  useEffect(() => {
    $.ajax({
      type: 'GET',
      url: `/lists/${list.id}/users_lists/${list.users_list_id}`,
      dataType: 'JSON',
    }).done(({ permissions }) => {
      setCurrentUserPermissions(permissions);
    });
  });

  const handleDelete = () => props.onListDeletion(list);
  const handleComplete = () => props.onListCompletion(list);
  const handleRefresh = () => props.onListRefresh(list);
  const handleAccept = () => props.onListAcceptance(list);
  const handleReject = () => props.onListRejection(list);

  const incompleteListButtons = () => (
    <div className="btn-group float-right" role="group">
      <button
        onClick={handleComplete}
        className="btn btn-link p-0 mr-3"
        disabled={userId !== list.owner_id}
        style={{ opacity: userId !== list.owner_id ? 0.3 : 1 }}
        data-test-id="incomplete-list-complete"
      >
        <i className="fa fa-check-square-o fa-2x text-success" />
      </button>
      <Link
        to={`lists/${list.id}/users_lists`}
        className="btn btn-link p-0 mr-3"
        disabled={currentUserPermissions !== 'write'}
        style={{
          pointerEvents: currentUserPermissions !== 'write' ? 'none' : 'auto',
          opacity: currentUserPermissions !== 'write' ? 0.3 : 1,
        }}
        data-test-id="incomplete-list-share"
      >
        <i className="fa fa-users fa-2x text-primary" />
      </Link>
      <Link
        to={`/lists/${list.id}/edit`}
        className="btn btn-link p-0 mr-3"
        disabled={userId !== list.owner_id}
        style={{
          pointerEvents: userId !== list.owner_id ? 'none' : 'auto',
          opacity: userId !== list.owner_id ? 0.3 : 1,
        }}
        data-test-id="incomplete-list-edit"
      >
        <i className="fa fa-pencil-square-o fa-2x text-warning" />
      </Link>
      <button
        onClick={handleDelete}
        className="btn btn-link p-0"
        disabled={userId !== list.owner_id}
        style={{ opacity: userId !== list.owner_id ? 0.3 : 1 }}
        data-test-id="incomplete-list-trash"
      >
        <i className="fa fa-trash fa-2x text-danger" />
      </button>
    </div>
  );

  const completedListButtons = () => (
    <div className="btn-group float-right" role="group">
      <button
        onClick={handleRefresh}
        className="btn btn-link p-0 mr-3"
        disabled={userId !== list.owner_id}
        style={{ opacity: userId !== list.owner_id ? 0.3 : 1 }}
        data-test-id="complete-list-refresh"
      >
        <i className="fa fa-refresh fa-2x text-primary" />
      </button>
      <button
        onClick={handleDelete}
        className="btn btn-link p-0"
        disabled={userId !== list.owner_id}
        style={{ opacity: userId !== list.owner_id ? 0.3 : 1 }}
        data-test-id="complete-list-trash"
      >
        <i className="fa fa-trash fa-2x text-danger" />
      </button>
    </div>
  );

  const pendingListButtons = () => (
    <div className="btn-group float-right" role="group">
      <button onClick={handleAccept} className="btn btn-link p-0 mr-3" data-test-id="pending-list-accept">
        <i className="fa fa-check-square-o fa-2x text-success" />
      </button>
      <button onClick={handleReject} className="btn btn-link p-0 mr-3" data-test-id="pending-list-trash">
        <i className="fa fa-trash fa-2x text-danger" />
      </button>
    </div>
  );

  const acceptedListButtons = () => (list.completed ? completedListButtons() : incompleteListButtons());
  const acceptedListTestClass = () => (list.completed ? 'completed-list' : 'non-completed-list');

  const listTitle = () => (
    <h5 className="mb-1">
      <i className={`fa ${listIconClass(list.type)} text-info mr-3`} />
      {list.name}{list.refreshed && '*'}
    </h5>
  );

  const acceptedListLink = () => (
    <Link to={`/lists/${list.id}`} className="router-link">
      {listTitle()}
    </Link>
  );

  return (
    <div
      className={`list-group-item ${props.accepted ? 'accepted-list' : 'pending-list'}`}
      style={{ display: 'block' }}
      data-test-class={props.accepted ? acceptedListTestClass() : 'pending-list'}
    >
      <div className="row">
        <div className="col-md-6 pt-1">
          {props.accepted ? acceptedListLink() : listTitle()}
        </div>
        <div className="col-md-4 pt-1">
          <small className="text-muted">
            {formatDate(list.created_at)}
          </small>
        </div>
        <div className="col-md-2">
          {props.accepted ? acceptedListButtons() : pendingListButtons()}
        </div>
      </div>
    </div>
  );
}

List.propTypes = {
  userId: PropTypes.number.isRequired,
  list: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    users_list_id: PropTypes.number,
    owner_id: PropTypes.number,
    refreshed: PropTypes.bool,
  }).isRequired,
  accepted: PropTypes.bool,
  onListDeletion: PropTypes.func,
  onListCompletion: PropTypes.func,
  onListRefresh: PropTypes.func,
  onListAcceptance: PropTypes.func,
  onListRejection: PropTypes.func,
};

List.defaultProps = {
  onListDeletion: null,
  onListCompletion: null,
  onListRefresh: null,
  accepted: false,
  onListAcceptance: null,
  onListRejection: null,
};

export default List;
