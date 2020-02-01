import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Alert from './Alert';
import { SelectField, TextField, CheckboxField } from './FormFields';

function ListEditForm(props) {
  const [id, setId] = useState(0);
  const [listName, setListName] = useState('');
  const [completed, setCompleted] = useState(false);
  const [listType, setListType] = useState('GroceryList');
  const [errors, setErrors] = useState('');

  useEffect(() => {
    if (!props.match) props.history.push('/lists');
    $.ajax({
      type: 'GET',
      url: `/lists/${props.match.params.id}/edit`,
      dataType: 'JSON',
    }).done(({ list, current_user_id: currentUserId }) => {
      if (list.owner_id !== currentUserId) props.history.push('/lists');
      setId(list.id);
      setListName(list.name);
      setCompleted(list.completed);
      setListType(list.type);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const list = {
      name: listName,
      completed,
      type: listType,
    };
    $.ajax({
      url: `/lists/${id}`,
      data: { list },
      method: 'PUT',
    }).done(() => {
      props.history.push('/lists');
    }).fail((response) => {
      const responseJSON = JSON.parse(response.responseText);
      const returnedErrors = Object.keys(responseJSON).map(key => `${key} ${responseJSON[key]}`);
      setErrors(returnedErrors.join(' and '));
    });
  };

  return (
    <div>
      <h1>Edit { listName }</h1>
      <Link to="/lists" className="pull-right">
        Back to lists
      </Link>
      <br />
      <Alert errors={errors} handleDismiss={() => setErrors('')} />
      <form className="form" onSubmit={handleSubmit}>
        <TextField
          name="listName"
          label="Name"
          value={listName}
          handleChange={({ target: { value } }) => setListName(value)}
        />
        <SelectField
          name="listType"
          label="Type"
          value={listType}
          handleChange={({ target: { value } }) => setListType(value)}
          options={[
            { value: 'BookList', label: 'books' },
            { value: 'GroceryList', label: 'groceries' },
            { value: 'MusicList', label: 'music' },
            { value: 'ToDoList', label: 'to-do' },
          ]}
          blankOption={false}
        />
        <CheckboxField
          name="completed"
          label="Completed"
          value={completed}
          handleChange={({ target: { checked } }) => setCompleted(checked)}
          blankOption={false}
          classes="mb-3"
        />
        <button type="submit" className="btn btn-success btn-block">
          Update List
        </button>
      </form>
    </div>
  );
}

ListEditForm.propTypes = {
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

export default ListEditForm;
