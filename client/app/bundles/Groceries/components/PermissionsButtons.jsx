import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PermissionsButtons extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.string,
      }),
      users_list: PropTypes.shape({
        id: PropTypes.number,
        permissions: PropTypes.string,
      }),
    })),
    listId: PropTypes.number.isRequired,
    userIsOwner: PropTypes.bool.isRequired,
    userId: PropTypes.number.isRequired,
  }

  static defaultProps = {
    users: [],
  }

  sharedUsers = () => this.props.users.map(({ user, users_list: { id, permissions } }) => {
    if (user.id === this.props.userId) return '';
    if (this.props.userIsOwner) {
      return (
        <button
          key={id}
          id={`${this.props.status}-user-${user.id}`}
          className={'list-group-item list-group-item-action d-flex justify-content-between align-items-center'
            + 'btn btn-link'}
          onClick={() => this.togglePermission(id, permissions, this.props.status)}
        >
          <span>{user.email}</span>
          <span
            id={`perm-${permissions}`}
            className={`badge badge-${permissions === 'write' ? 'success' : 'primary'}`}
          >
            {permissions}
          </span>
        </button>
      );
    }
    return (<div key={id} className="list-group-item">{user.email}</div>);
  });

  togglePermission = (id, currentPermission, sharedState) => {
    const permissions = currentPermission === 'write' ? 'read' : 'write';
    $.ajax({
      type: 'PATCH',
      url: `/lists/${this.props.listId}/users_lists/${id}`,
      dataType: 'JSON',
      data: `users_list%5Bpermissions%5D=${permissions}`,
    })
      .done(() => {
        const updatedUsers = this.props.users.map((usersList) => {
          const newList = usersList;
          const tmpUsersList = newList.users_list;
          if (tmpUsersList.id === id) tmpUsersList.permissions = permissions;
          return newList;
        });
        const tmpObj = {};
        tmpObj[sharedState] = updatedUsers;
        this.setState(tmpObj);
      })
      .fail(response => this.failure(response));
  }

  render() {
    return (
      <div>
        <h3 className="text-capitalize">{ this.props.status }</h3>
        <br />
        { this.sharedUsers() }
        <br />
      </div>
    );
  }
}
