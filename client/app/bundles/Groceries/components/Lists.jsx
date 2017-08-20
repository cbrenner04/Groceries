import React, { Component } from 'react';
import PropTypes from 'prop-types';

import List from './List';

export default class Lists extends Component {
  static propTypes = {
    lists: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    ).isRequired,
    onListDelete: PropTypes.func.isRequired,
  }

  onDeleteOfList = (listId) => {
    this.props.onListDelete(listId);
  }

  render() {
    return (
      <div>
        <h1>Your Lists</h1>
        <p>
          These are lists you&apos;ve created or you&apos;ve accepted an
          invitation from someone else.
        </p>
        {
          this.props.lists.map(list => (
            <List
              list={list}
              key={list.id}
              onListDeletion={this.onDeleteOfList}
              completed={list.completed}
            />
          ))
        }
      </div>
    );
  }
}
