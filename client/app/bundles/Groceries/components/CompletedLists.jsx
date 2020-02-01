import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Alert from './Alert';
import List from './List';

function CompletedLists() {
  const [completedLists, setCompletedLists] = useState([]);
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    $.ajax({
      type: 'GET',
      url: '/completed_lists/',
      dataType: 'JSON',
    }).done((data) => {
      setCompletedLists(data.completed_lists);
    });
  }, []);

  const handleDelete = (listId) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `/lists/${listId}`,
        type: 'DELETE',
      })
        .done(() => {
          const lists = completedLists.filter(list => list.id !== listId);
          setCompletedLists(lists);
          setSuccess('Your list was successfully deleted.');
        })
        .fail((response) => {
          const responseJSON = JSON.parse(response.responseText);
          const returnedErrors = Object.keys(responseJSON).map(key => `${key} ${responseJSON[key]}`);
          setErrors(returnedErrors.join(' and '));
        });
    }
  };

  const handleRefresh = (list) => {
    $.ajax({
      url: `/lists/${list.id}/refresh_list`,
      type: 'POST',
    });
  };

  const dismissAlert = () => {
    if (success) {
      setSuccess('');
    }
    if (errors) {
      setErrors('');
    }
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
    </div>
  );
}

export default CompletedLists;
