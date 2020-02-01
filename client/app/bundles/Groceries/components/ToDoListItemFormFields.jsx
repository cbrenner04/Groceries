import React from 'react';
import PropTypes from 'prop-types';

import { TextField, CategoryField, DateField, CheckboxField, SelectField } from './FormFields';

const EditToDoListItemFormFields = props => (
  <div>
    <TextField
      name="task"
      label="Task"
      value={props.task}
      handleChange={props.inputHandler}
      placeholder="Clean the toilets"
    />
    <SelectField
      name="itemAssigneeId"
      label="Assignee"
      value={props.itemAssigneeId}
      handleChange={props.inputHandler}
      options={props.listUsers.map(user => ({ value: String(user.id), label: user.email }))}
      blankOption
    />
    <DateField
      name="itemDueBy"
      label="Due By"
      value={props.itemDueBy}
      handleChange={props.inputHandler}
      placeholder="mm/dd/yyyy"
    />
    <CategoryField category={props.category} categories={props.categories} handleInput={props.inputHandler} />
    {
      props.editForm && (
        <CheckboxField
          name="itemCompleted"
          label="Completed"
          value={props.itemCompleted}
          handleChange={props.inputHandler}
          classes="mb-3"
        />
      )
    }
  </div>
);

EditToDoListItemFormFields.propTypes = {
  task: PropTypes.string.isRequired,
  itemAssigneeId: PropTypes.string.isRequired,
  itemDueBy: PropTypes.string.isRequired,
  itemCompleted: PropTypes.bool,
  listUsers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
  })).isRequired,
  inputHandler: PropTypes.func.isRequired,
  editForm: PropTypes.bool,
  category: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
};

EditToDoListItemFormFields.defaultProps = {
  itemCompleted: false,
  editForm: false,
  category: '',
  categories: [],
};

export default EditToDoListItemFormFields;
