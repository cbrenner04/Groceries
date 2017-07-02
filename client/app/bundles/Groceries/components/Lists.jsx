import React, {Component} from 'react';

import List from './List';

export default class Lists extends Component {
  onDeleteOfList(listId) {
    this.props.onListDelete(listId);
  }

  render() {
    return (
      <div>
        { this.props.lists.map((list) => {
          return (
            <List list={ list }
                  key={ list.id }
                  onListDeletion={ (listId) => this.onDeleteOfList(listId) }/>
          )
        }) }
      </div>
    )
  }
}
