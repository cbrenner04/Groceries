import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import List from './List';

export default class CompletedLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedLists: [],
    };
  }

  componentWillMount() {
    $.ajax({
      type: 'GET',
      url: '/completed_lists/',
      dataType: 'JSON',
    }).done((data) => {
      this.setState({
        completedLists: data.completed_lists,
      });
    });
  }

  handleDelete = (listId) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `/lists/${listId}`,
        type: 'DELETE',
        success: () => this.removeList(listId),
      });
    }
  }

  handleRefresh = (list) => {
    $.ajax({
      url: `/lists/${list.id}/refresh_list`,
      type: 'POST',
    });
  }

  render() {
    return (
      <div>
        <h1>Completed Lists</h1>
        <Link to="/lists" className="pull-right">Back to lists</Link>
        <br />
        <div>Previously refreshed lists are marked with an asterisk (*).</div>
        <div className="list-group">
          {
            this.state.completedLists.map(list => (
              <List
                userId={list.user_id}
                list={list}
                key={list.id}
                onListDeletion={this.handleDelete}
                completed={list.completed}
                onListRefresh={this.handleRefresh}
                accepted
              />
            ))
          }
        </div>
      </div>
    );
  }
}
