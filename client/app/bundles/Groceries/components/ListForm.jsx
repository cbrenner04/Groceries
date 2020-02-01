import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { SelectField, TextField } from './FormFields';

function ListForm(props) {
  const defaultListType = 'GroceryList';
  const [list, setList] = useState('');
  const [listType, setListType] = useState(defaultListType);

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onFormSubmit({
      name: list,
      type: listType,
    });
    setList('');
    setListType(defaultListType);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <TextField
        name="list"
        label="Name"
        value={list}
        handleChange={({ target: { value } }) => setList(value)}
        placeholder="My super cool list"
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
      <button type="submit" className="btn btn-success btn-block">Create List</button>
    </form>
  );
}

ListForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};

export default ListForm;
