import React, { useEffect, useState } from 'react';
import update from 'immutability-helper';

import Alert from './Alert';
import ListForm from './ListForm';
import Lists from './Lists';

export default function ListsContainer() {
  const [userId, setUserId] = useState(0);
  const [pendingLists, setPendingLists] = useState([]);
  const [completedLists, setCompletedLists] = useState([]);
  const [nonCompletedLists, setNonCompletedLists] = useState([]);
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');

  const sortLists = lists => lists.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  useEffect(() => {
    $.ajax({
      type: 'GET',
      url: '/lists/',
      dataType: 'JSON',
    }).done((data) => {
      const newAcceptedLists = sortLists(data.accepted_lists);
      const newCompletedLists = newAcceptedLists.filter(list => list.completed);
      const newNonCompletedLists = newAcceptedLists.filter(list => !list.completed);
      setUserId(data.current_user_id);
      setPendingLists(sortLists(data.pending_lists)); // this should be sorted the opposite
      setCompletedLists(newCompletedLists);
      setNonCompletedLists(newNonCompletedLists);
    });
  }, []);

  const handleFormSubmit = (list) => {
    setErrors('');
    setSuccess('');
    $.post('/lists', { list })
      .done((data) => {
        const updatedNonCompletedLists = update(nonCompletedLists, { $push: [data] });
        setNonCompletedLists(sortLists(updatedNonCompletedLists));
        setSuccess('List successfully added.');
      })
      .fail((response) => {
        const responseJSON = JSON.parse(response.responseText);
        const responseTextKeys = Object.keys(responseJSON);
        const responseErrors = responseTextKeys.map(key => `${key} ${responseJSON[key].join(' and ')}`);
        setErrors(responseErrors.join(' and '));
      });
  };

  const handleDelete = (list) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `/lists/${list.id}`,
        type: 'DELETE',
      })
        .done(() => {
          const { id, completed } = list;
          if (completed) {
            const updatedCompletedLists = completedLists.filter(ll => ll.id !== id);
            setCompletedLists(updatedCompletedLists);
          } else {
            const updatedNonCompletedLists = nonCompletedLists.filter(ll => ll.id !== id);
            setNonCompletedLists(updatedNonCompletedLists);
          }
          setSuccess('List successfully deleted.');
        })
        .fail((response) => {
          const responseJSON = JSON.parse(response.responseText);
          const returnedErrors = Object.keys(responseJSON).map(key => `${key} ${responseJSON[key]}`);
          setErrors(returnedErrors.join(' and '));
        });
    }
  };

  const handleCompletion = (list) => {
    const theList = list;
    theList.completed = true;
    $.ajax({
      url: `/lists/${theList.id}`,
      type: 'PUT',
      data: 'list%5Bcompleted%5D=true',
      success: () => {
        const updatedNonCompletedLists = nonCompletedLists.filter(nonList => nonList.id !== theList.id);
        setNonCompletedLists(updatedNonCompletedLists);
        const updatedCompletedLists = update(completedLists, { $push: [theList] });
        setCompletedLists(sortLists(updatedCompletedLists));
      },
    });
  };

  const removeListFromUnaccepted = (listId) => {
    const updatedPendingLists = pendingLists.filter(list => list.id !== listId);
    setPendingLists(updatedPendingLists);
  };

  const acceptList = (list) => {
    $.ajax({
      url: `/lists/${list.id}/users_lists/${list.users_list_id}`,
      type: 'PATCH',
      data: 'users_list%5Bhas_accepted%5D=true',
      success: () => {
        const { completed } = list;
        if (completed) {
          const updatedCompletedLists = update(completedLists, { $push: [list] });
          setCompletedLists(updatedCompletedLists);
        } else {
          const updatedNonCompletedLists = update(nonCompletedLists, { $push: [list] });
          setNonCompletedLists(updatedNonCompletedLists);
        }
        setSuccess('List successfully accepted.');
      },
    });
  };

  const handleAccept = (list) => {
    removeListFromUnaccepted(list.id);
    acceptList(list);
  };

  const handleReject = (list) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `/lists/${list.id}/users_lists/${list.users_list_id}`,
        type: 'PATCH',
        data: 'users_list%5Bhas_accepted%5D=false',
        success: () => {
          removeListFromUnaccepted(list.id);
        },
      });
    }
  };

  const handleRefresh = (list) => {
    const localList = list;
    localList.refreshed = true;
    $.ajax({
      url: `/lists/${list.id}/refresh_list`,
      type: 'POST',
    })
      .done((data) => {
        const updatedNonCompletedLists = update(nonCompletedLists, { $push: [data] });
        setNonCompletedLists(sortLists(updatedNonCompletedLists));
        setSuccess('List successfully refreshed.');
      })
      .fail((response) => {
        const responseJSON = JSON.parse(response.responseText);
        const responseTextKeys = Object.keys(responseJSON);
        const responseErrors = responseTextKeys.map(key => `${key} ${responseJSON[key].join(' and ')}`);
        setErrors(responseErrors.join(' and '));
      });
  };

  const handleAlertDismiss = () => {
    setErrors('');
    setSuccess('');
  };

  return (
    <div>
      <Alert errors={errors} success={success} handleDismiss={handleAlertDismiss} />
      <h1>Lists</h1>
      <ListForm onFormSubmit={handleFormSubmit} />
      <hr />
      <Lists
        userId={userId}
        onListDelete={handleDelete}
        onListCompletion={handleCompletion}
        pendingLists={pendingLists}
        completedLists={completedLists}
        nonCompletedLists={nonCompletedLists}
        onListRefresh={handleRefresh}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
