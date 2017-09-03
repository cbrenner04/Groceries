import React, { Component } from 'react';
import PropTypes from 'prop-types';

import List from './List';
import CompletedList from './CompletedList';

export default class Lists extends Component {
  static propTypes = {
    completedLists: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    ).isRequired,
    nonCompletedLists: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    ).isRequired,
    onListCompletion: PropTypes.func.isRequired,
    onListDelete: PropTypes.func.isRequired,
    onListRefresh: PropTypes.func.isRequired,
  }

  onDeleteOfList = (listId) => {
    this.props.onListDelete(listId);
  }

  onCompletionOfList = (list) => {
    this.props.onListCompletion(list);
  }

  onRefreshOfList = (list) => {
    this.props.onListRefresh(list);
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
          this.props.nonCompletedLists.map(list => (
            <List
              list={list}
              key={list.id}
              onListDeletion={this.onDeleteOfList}
              onListCompletion={this.onCompletionOfList}
              completed={list.completed}
            />
          ))
        }
        <br />
        <h2>Completed Lists</h2>
        {
          this.props.completedLists.map(list => (
            <CompletedList
              list={list}
              key={list.id}
              onListDeletion={this.onDeleteOfList}
              completed={list.completed}
              onListRefresh={this.onRefreshOfList}
            />
          ))
        }
      </div>
    );
  }
}
