import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UnacceptedList from './UnacceptedList';

export default class UnacceptedLists extends Component {
  static propTypes = {
    lists: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    ).isRequired,
    onAccept: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
  }

  onAcceptOfList = (list) => {
    this.props.onAccept(list);
  }

  onRejectOfList = (listId) => {
    this.props.onReject(listId);
  }

  render() {
    return (
      <div>
        <p>
          These lists have been shared with you but you have not accepted the
          invitation.
        </p>
        {
          this.props.lists.map(list => (
            <UnacceptedList
              list={list}
              key={list.id}
              onListAcceptance={this.onAcceptOfList}
              onListRejection={this.onRejectOfList}
            />
          ))
        }
      </div>
    );
  }
}
