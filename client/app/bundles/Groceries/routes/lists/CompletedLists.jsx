import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Alert from '../../components/Alert';
import List from './components/List';
import ConfirmModal from '../../components/ConfirmModal';

function CompletedLists() {
  const [completedLists, setCompletedLists] = useState([]);
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');
  const [listToDelete, setListToDelete] = useState('');

  useEffect(() => {
    $.ajax({
      type: 'GET',
      url: '/completed_lists/',
      dataType: 'JSON',
    }).done((data) => {
      setCompletedLists(data.completed_lists);
    });
  }, []);

  const dismissAlert = () => {
    setSuccess('');
    setErrors('');
  };

  const handleRefresh = (list) => {
    dismissAlert();
    $.ajax({
      url: `/lists/${list.id}/refresh_list`,
      type: 'POST',
    })
      .done(() => {
        const refreshedList = completedLists.find(completedList => completedList.id === list.id);
        refreshedList.refreshed = true;
        setSuccess('Your list was successfully refreshed.');
      })
      .fail((response) => {
        const responseJSON = JSON.parse(response.responseText);
        const returnedErrors = Object.keys(responseJSON).map(key => `${key} ${responseJSON[key]}`);
        setErrors(returnedErrors.join(' and '));
      });
  };

  const confirmModalId = 'confirm-delete-completed-list-modal';

  const handleDelete = (list) => {
    setListToDelete(list);
    $(`#${confirmModalId}`).modal('show');
  };

  const handleDeleteConfirm = () => {
    dismissAlert();
    $(`#${confirmModalId}`).modal('hide');
    $.ajax({
      url: `/lists/${listToDelete.id}`,
      type: 'DELETE',
    })
      .done(() => {
        const lists = completedLists.filter(cl => cl.id !== listToDelete.id);
        setCompletedLists(lists);
        setSuccess('Your list was successfully deleted.');
      })
      .fail((response) => {
        const responseJSON = JSON.parse(response.responseText);
        const returnedErrors = Object.keys(responseJSON).map(key => `${key} ${responseJSON[key]}`);
        setErrors(returnedErrors.join(' and '));
      });
  };

  return (
    <div>
      <h1>Completed Lists</h1>
      <Alert errors={errors} success={success} handleDismiss={dismissAlert} />
      <div className="clearfix">
        <Link to="/lists" className="float-right">Back to lists</Link>
        <div className="float-left">Previously refreshed lists are marked with an asterisk (*).</div>
      </div>
      <div className="list-group">
        {
          completedLists.map(list => (
            <List
              userId={list.user_id}
              list={list}
              key={list.id}
              onListDeletion={handleDelete}
              completed={list.completed}
              onListRefresh={handleRefresh}
              accepted
            />
          ))
        }
      </div>
      <ConfirmModal
        name={confirmModalId}
        action="delete"
        body="Are you sure you want to delete this list?"
        handleConfirm={() => handleDeleteConfirm()}
        handleClear={() => $(`#${confirmModalId}`).modal('hide')}
      />
    </div>
  );
}

export default CompletedLists;
