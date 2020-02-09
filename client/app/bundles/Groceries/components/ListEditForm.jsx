import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Alert from './Alert';
import { SelectField, TextField, CheckboxField } from './FormFields';

function ListEditForm(props) {
  const [id, setId] = useState(0);
  const [errors, setErrors] = useState('');
  const [name, setName] = useState('');
  const [completed, setCompleted] = useState(false);
  const [type, setType] = useState('GroceryList');

  useEffect(() => {
    if (!props.match) props.history.push('/lists');
    $.ajax({
      type: 'GET',
      url: `/lists/${props.match.params.id}/edit`,
      dataType: 'JSON',
    }).done(({ list, current_user_id: currentUserId }) => {
      if (list.owner_id !== currentUserId) props.history.push('/lists');
      setId(list.id);
      setName(list.name);
      setCompleted(list.completed);
      setType(list.type);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const list = {
      name,
      completed,
      type,
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
      <h1>Edit { name }</h1>
      <Link to="/lists" className="pull-right">
        Back to lists
      </Link>
      <br />
      <Alert errors={errors} handleDismiss={() => setErrors('')} />
      <form className="form" onSubmit={handleSubmit} autoComplete="off">
        <TextField
          name="name"
          label="Name"
          value={name}
          handleChange={({ target: { value } }) => setName(value)}
        />
        <SelectField
          name="type"
          label="Type"
          value={type}
          handleChange={({ target: { value } }) => setType(value)}
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
          handleChange={() => setCompleted(!completed)}
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
