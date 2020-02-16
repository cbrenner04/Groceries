import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import Alert from './Alert';
import { EmailField } from './FormFields';
import PermissionButtons from './PermissionButtons';

function ShareListForm(props) {
  const [listId, setListId] = useState(0);
  const [invitableUsers, setInvitableUsers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [errors, setErrors] = useState('');
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [refused, setRefused] = useState([]);
  const [userId, setUserId] = useState(0);
  const [userIsOwner, setUserIsOwner] = useState(false);
  const [name, setName] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${props.match.params.list_id}/users_lists`,
        dataType: 'JSON',
      }).done((data) => {
        setName(data.list.name);
        setInvitableUsers(data.invitable_users);
        setListId(data.list.id);
        setUserIsOwner(data.user_is_owner);
        setPending(data.pending);
        setAccepted(data.accepted);
        setRefused(data.refused);
        setUserId(data.current_user_id);
        const userInAccepted = data.accepted.find(acceptedList => acceptedList.user.id === data.current_user_id);
        if (!(userInAccepted && userInAccepted.users_list.permissions === 'write')) {
          props.history.push('/lists');
        }
      });
    }
  }, []);

  const handleAlertDismiss = () => {
    setSuccess('');
    setErrors('');
  };

  const failure = (response) => {
    const responseJSON = JSON.parse(response.responseText);
    const responseTextKeys = Object.keys(responseJSON);
    const responseErrors = responseTextKeys.map(key => `${key} ${responseJSON[key].join(' and ')}`);
    setErrors(responseErrors.join(' and '));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAlertDismiss();
    $.post('/users/invitation', {
      user: {
        email: newEmail,
      },
      list_id: listId,
    }).done(() => {
      setSuccess(`"${name}" has been successfully shared with ${newEmail}.`);
    }).fail(response => failure(response));
  };

  const handleSelectUser = (user) => {
    handleAlertDismiss();
    const usersList = {
      user_id: user.id,
      list_id: listId,
    };
    $.post(`/lists/${listId}/users_lists`, { users_list: usersList })
      .done((data) => {
        const newUsers = invitableUsers.filter(tmpUser => tmpUser.id !== user.id);
        const newPending = update(pending, {
          $push: [
            {
              user: {
                id: data.user_id,
                email: user.email,
              },
              users_list: {
                id: data.id,
                permissions: data.permissions,
              },
            },
          ],
        });
        setSuccess(`"${name}" has been successfully shared with ${user.email}.`);
        setInvitableUsers(newUsers);
        setPending(newPending);
      })
      .fail(response => failure(response));
  };

  const togglePermission = (id, currentPermission, status) => {
    const permissions = currentPermission === 'write' ? 'read' : 'write';
    $.ajax({
      type: 'PATCH',
      url: `/lists/${listId}/users_lists/${id}`,
      dataType: 'JSON',
      data: `users_list%5Bpermissions%5D=${permissions}`,
    })
      .done(() => {
        const users = status === 'pending' ? pending : accepted;
        const updatedUsers = users.map((usersList) => {
          const newList = usersList;
          const tmpUsersList = newList.users_list;
          if (tmpUsersList.id === id) tmpUsersList.permissions = permissions;
          return newList;
        });
        const stateFunc = status === 'pending' ? setPending : setAccepted;
        stateFunc(updatedUsers);
      })
      .fail(response => failure(response));
  };

  return (
    <div>
      <h1>Share {name}</h1>
      <Link to="/lists" className="pull-right">Back to lists</Link>
      <br />
      <Alert errors={errors} success={success} handleDismiss={handleAlertDismiss} />
      <form onSubmit={handleSubmit}>
        <EmailField
          name="new-email"
          label="Enter an email to invite someone to share this list:"
          value={newEmail}
          handleChange={({ target: { value } }) => setNewEmail(value)}
        />
        <button type="submit" className="btn btn-success btn-block">Share List</button>
      </form>
      <br />
      <p className="text-lead">Or select someone you&apos;ve previously shared with:</p>
      {
        invitableUsers.map(user => (
          <button
            key={user.id}
            id={`invite-user-${user.id}`}
            className="list-group-item list-group-item-action btn btn-link"
            onClick={() => handleSelectUser(user)}
          >
            {user.email}
          </button>
        ))
      }
      <br />
      <h2>Already shared</h2>
      <p className="text-lead">Click to toggle permissions between read and write</p>
      <br />
      <PermissionButtons
        togglePermission={togglePermission}
        userIsOwner={userIsOwner}
        userId={userId}
        status="pending"
        users={pending}
      />
      <PermissionButtons
        togglePermission={togglePermission}
        userIsOwner={userIsOwner}
        userId={userId}
        status="accepted"
        users={accepted}
      />
      <h3>Refused</h3>
      <br />
      { refused.map(({ user }) =>
        <div key={user.id} id={`refused-user-${user.id}`} className="list-group-item">{user.email}</div>) }
    </div>
  );
}

ShareListForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      list_id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default ShareListForm;
