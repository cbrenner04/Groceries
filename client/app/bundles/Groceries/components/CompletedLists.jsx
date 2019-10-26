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
      const completedLists = data.completed_lists.filter(list => !list.refreshed);
      this.setState({
        completedLists,
      });
    });
  }
  render() {
    return (
      <div>
        <h1>Completed Lists</h1>
        <Link to="/lists" className="pull-right">Back to lists</Link>
        <br />
        <div className="list-group">
          {
            this.state.completedLists.map(list => (
              <List
                userId={list.user_id}
                list={list}
                key={list.id}
                onListDeletion={this.onDeleteOfList}
                completed={list.completed}
                onListRefresh={this.onRefreshOfList}
                accepted
              />
            ))
          }
        </div>
      </div>
    );
  }
}
