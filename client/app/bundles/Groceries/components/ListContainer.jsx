import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import Alert from './Alert';
import ListItemForm from './ListItemForm';
import ListItemsContainer from './ListItemsContainer';

const mapIncludedCategories = (items) => {
  const cats = [''];
  items.forEach((item) => {
    if (!item.category) return;
    const cat = item.category.toLowerCase();
    if (!cats.includes(cat)) cats.push(cat);
  });
  return cats;
};

const categorizeNotPurchasedItems = (items, categories) => {
  const obj = {};
  categories.forEach((cat) => {
    obj[cat] = [];
  });
  items.forEach((item) => {
    if (!item.category) {
      obj[''].push(item);
      return;
    }
    const cat = item.category.toLowerCase();
    if (!obj[cat]) obj[cat] = [];
    obj[cat].push(item);
  });
  return obj;
};

function ListContainer(props) {
  const [userId, setUserId] = useState(0);
  const [list, setList] = useState({
    id: 0,
    type: 'GroceryList',
  });
  const [notPurchasedItems, setNotPurchasedItems] = useState({});
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [permission, setPermission] = useState('write');
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [includedCategories, setIncludedCategories] = useState(['']);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    if (props.match) {
      $.ajax({
        type: 'GET',
        url: `/lists/${props.match.params.id}`,
        dataType: 'JSON',
      }).done((data) => {
        setUserId(data.current_user_id);
        $.ajax({
          type: 'GET',
          url: `/lists/${props.match.params.id}/users_lists`,
          dataType: 'JSON',
        }).done(({ accepted, pending }) => {
          const userInAccepted = accepted.find(acceptedList => acceptedList.user.id === data.current_user_id);
          const allAcceptedUsers = accepted.map(({ user }) => user);
          const allPendingUsers = pending.map(({ user }) => user);
          const responseListUsers = allAcceptedUsers.concat(allPendingUsers);
          if (userInAccepted) {
            const responseIncludedCategories = mapIncludedCategories(data.not_purchased_items);
            const responseNotPurchasedItems = categorizeNotPurchasedItems(data.not_purchased_items, includedCategories);
            setUserId(data.current_user_id);
            setList(data.list);
            setPurchasedItems(data.purchased_items);
            setCategories(data.categories);
            setListUsers(responseListUsers);
            setIncludedCategories(responseIncludedCategories);
            setNotPurchasedItems(responseNotPurchasedItems);
            setPermission(userInAccepted.users_list.permissions);
          } else {
            props.history.push('/lists');
          }
        });
      });
    } else {
      props.history.push('/lists');
    }
  }, []);

  // TODO: refactor? there has got to be a better way
  const handleAddItem = (item) => {
    const category = item.category || '';
    const updatedNotPurchasedItems = notPurchasedItems;
    setNotPurchasedItems({});
    if (!updatedNotPurchasedItems[category]) updatedNotPurchasedItems[category] = [];
    updatedNotPurchasedItems[category] = update(updatedNotPurchasedItems[category], { $push: [item] });
    setNotPurchasedItems(updatedNotPurchasedItems);
    if (!categories.includes(category)) {
      const cats = update(categories, { $push: [category] });
      setCategories(cats);
    }
    if (!includedCategories.includes(category)) {
      const iCats = update(includedCategories, { $push: [category] });
      setIncludedCategories(iCats);
    }
  };

  const listTypeToSnakeCase = () => list.type.replace(/([A-Z])/g, $1 => `_${$1}`.toLowerCase()).slice(1);
  const listId = item => item[`${listTypeToSnakeCase()}_id`];
  const listItemPath = item => `/lists/${listId(item)}/${listTypeToSnakeCase()}_items`;

  // TODO: refactor?
  const moveItemToPurchased = (item) => {
    let { category } = item;
    if (!category) category = '';
    const updatedNotPurchasedItems = notPurchasedItems[category].filter(notItem => notItem.id !== item.id);
    notPurchasedItems[category] = updatedNotPurchasedItems;
    const updatedPurchasedItems = update(purchasedItems, { $push: [item] });
    setPurchasedItems(updatedPurchasedItems);
    if (!notPurchasedItems[category].length) {
      setIncludedCategories(includedCategories.filter(cat => cat !== category));
      setFilter('');
    }
  };

  const handleItemPurchase = (item) => {
    let completionType;
    if (list.type === 'ToDoList') {
      completionType = 'completed';
    } else {
      completionType = 'purchased';
    }
    $.ajax({
      url: `${listItemPath(item)}/${item.id}`,
      type: 'PUT',
      data: `${listTypeToSnakeCase()}_item%5B${completionType}%5D=true`,
      success: () => moveItemToPurchased(item),
    });
  };

  const handleItemRead = (item) => {
    $.ajax({
      url: `${listItemPath(item)}/${item.id}`,
      type: 'PUT',
      data: `${listTypeToSnakeCase()}_item%5Bread%5D=true`,
    });
    // TODO: remove this
    window.location.reload();
  };

  const handleItemUnRead = (item) => {
    $.ajax({
      url: `${listItemPath(item)}/${item.id}`,
      type: 'PUT',
      data: `${listTypeToSnakeCase()}_item%5Bread%5D=false`,
    });
    // TODO: remove this
    window.location.reload();
  };

  const handleUnPurchase = (item) => {
    const newItem = {
      user_id: item.user_id,
      product: item.product,
      task: item.task,
      quantity: item.quantity,
      purchased: false,
      completed: false,
      assignee_id: item.assignee_id,
      due_by: item.due_by,
      category: item.category || '',
    };
    newItem[`${listTypeToSnakeCase()}_id`] = listId(item);
    const postData = {};
    postData[`${listTypeToSnakeCase()}_item`] = newItem;
    $.post(`${listItemPath(newItem)}`, postData)
      .done((data) => {
        handleAddItem(data);
        $.ajax({
          url: `${listItemPath(item)}/${item.id}`,
          type: 'PUT',
          data: `${listTypeToSnakeCase()}_item%5Brefreshed%5D=true`,
        })
          .done(() => {
            const updatedPurchasedItems = purchasedItems.filter(notItem => notItem.id !== item.id);
            setPurchasedItems(updatedPurchasedItems);
          })
          .fail((response) => {
            const responseJSON = JSON.parse(response.responseText);
            const responseTextKeys = Object.keys(responseJSON);
            const responseErrors = responseTextKeys.map(key => `${key} ${responseJSON[key]}`);
            setErrors(responseErrors.join(' and '));
          });
      }).fail((response) => {
        const responseJSON = JSON.parse(response.responseText);
        const responseTextKeys = Object.keys(responseJSON);
        const responseErrors = responseTextKeys.map(key => `${key} ${responseJSON[key]}`);
        setErrors(responseErrors.join(' and '));
      });
  };

  // TODO: refactor?
  const removeItem = (item) => {
    if (item.purchased) {
      const updatedPurchasedItems = purchasedItems.filter(li => li.id !== item.id);
      setPurchasedItems(updatedPurchasedItems);
    } else {
      const category = Object.keys(notPurchasedItems).find(cat =>
        notPurchasedItems[cat].find(li => li.id === item.id));
      const updatedItems = notPurchasedItems[category].filter(li => li.id !== item.id);
      notPurchasedItems[category] = updatedItems;
    }
  };

  const handleDelete = (item) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      $.ajax({
        url: `${listItemPath(item)}/${item.id}`,
        type: 'DELETE',
        success: () => removeItem(item),
      });
    } else {
      return false;
    }
    return '';
  };

  return (
    <div>
      <h1>{ list.name }</h1>
      <Link to="/lists" className="pull-right">Back to lists</Link>
      <Alert errors={errors} handleDismiss={() => setErrors('')} />
      <br />
      {
        permission === 'write' ? <ListItemForm
          listId={list.id}
          listType={list.type}
          listUsers={listUsers}
          userId={userId}
          handleItemAddition={handleAddItem}
          categories={categories}
        /> : <p>You only have permission to read this list</p>
      }
      <br />
      <ListItemsContainer
        notPurchasedItems={notPurchasedItems}
        purchasedItems={purchasedItems}
        handlePurchaseOfItem={handleItemPurchase}
        handleReadOfItem={handleItemRead}
        handleUnReadOfItem={handleItemUnRead}
        handleItemDelete={handleDelete}
        handleItemUnPurchase={handleUnPurchase}
        listType={list.type}
        listUsers={listUsers}
        permission={permission}
        handleCategoryFilter={({ target: { name } }) => setFilter(name)}
        handleClearFilter={() => setFilter('')}
        filter={filter}
        categories={includedCategories}
      />
    </div>
  );
}

ListContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      list_id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default ListContainer;
