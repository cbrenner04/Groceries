import React from 'react';
import PropTypes from 'prop-types';

import { prettyDueBy } from '../utils/format';
import PurchasedItemButtons from './PurchasedItemButtons';
import NotPurchasedItemButtons from './NotPurchasedItemButtons';

function ListItem(props) {
  const prettyTitle = () => `"${props.item.title}"`;
  const due = () => `Due By: ${prettyDueBy(props.item.due_by)}`;
  const testClass = () => (props.purchased ? 'purchased-item' : 'non-purchased-item');

  const itemName = () => (
    {
      BookList: `${props.item.title ? prettyTitle() : ''} ${props.item.author}`,
      GroceryList: `${props.item.quantity} ${props.item.product}`,
      MusicList: `${props.item.title ? prettyTitle() : ''} ${props.item.artist} ` +
                 `${props.item.artist && props.item.album ? '- ' : ''}` +
                 `${props.item.album ? props.item.album : ''}`,
      ToDoList: `${props.item.task}`,
    }[props.listType]
  );

  const assignee = (assigneeId) => {
    const assignedUser = props.listUsers.filter(user => user.id === assigneeId)[0];
    return assignedUser ? assignedUser.email : '';
  };

  const assigned = () => `Assigned To: ${assignee(props.item.assignee_id)}`;

  const extraInfo = () => {
    if (props.listType === 'ToDoList') {
      return (
        <small className="text-muted">
          <div>{props.item.assignee_id ? assigned() : ''}</div>
          <div>{props.item.due_by ? due() : ''}</div>
        </small>
      );
    }
    return '';
  };

  const setButtons =
    props.purchased
      ? (<PurchasedItemButtons
        listType={props.listType}
        item={props.item}
        handleItemUnPurchase={props.handleItemUnPurchase}
        handleItemDelete={props.handleItemDelete}
        handleReadOfItem={props.handleReadOfItem}
        handleUnReadOfItem={props.handleUnReadOfItem}
      />) : (<NotPurchasedItemButtons
        listType={props.listType}
        item={props.item}
        handlePurchaseOfItem={props.handlePurchaseOfItem}
        handleItemDelete={props.handleItemDelete}
        handleReadOfItem={props.handleReadOfItem}
        handleUnReadOfItem={props.handleUnReadOfItem}
      />);

  return (
    <div
      className="list-group-item"
      key={props.item.id}
      style={{ display: 'block' }}
      data-test-class={testClass()}
    >
      <div className="pt-1">{ itemName() }</div>
      <div className="pt-1">{ extraInfo() }</div>
      { props.permission === 'write' ? setButtons : '' }
    </div>
  );
}

ListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    product: PropTypes.string,
    task: PropTypes.string,
    quantity: PropTypes.string,
    author: PropTypes.string,
    title: PropTypes.string,
    artist: PropTypes.string,
    album: PropTypes.string,
    assignee_id: PropTypes.number,
    due_by: PropTypes.string,
    read: PropTypes.bool,
    number_in_series: PropTypes.number,
    category: PropTypes.string,
  }).isRequired,
  purchased: PropTypes.bool,
  handleItemDelete: PropTypes.func.isRequired,
  handlePurchaseOfItem: PropTypes.func.isRequired,
  handleReadOfItem: PropTypes.func.isRequired,
  handleUnReadOfItem: PropTypes.func.isRequired,
  handleItemUnPurchase: PropTypes.func.isRequired,
  listType: PropTypes.string.isRequired,
  listUsers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
  })),
  permission: PropTypes.string.isRequired,
};

ListItem.defaultProps = {
  listUsers: [],
  purchased: false,
};

export default ListItem;
